#include <LiquidCrystal.h>
#include <Adafruit_Fingerprint.h>
#include <EEPROM.h>
#include <SoftwareSerial.h>

LiquidCrystal lcd(A0, A1,A2,A3, A4, A5);
SoftwareSerial fprint(8,7);
SoftwareSerial esp(9, 10);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&fprint);

volatile bool button_pressed = false;
const int button = 2;
uint8_t id_address = 0;

void truncate(String* str, int columns) {
  *str = str->substring(0, columns);
}
void print_lcd(String str0, String str1) {
  static const int COLUMNS = 16;
  if (str0.length() > COLUMNS) truncate(&str0, COLUMNS);
  if (str1.length() > COLUMNS) truncate(&str1, COLUMNS);
  int pre_spaces0 = (COLUMNS - str0.length()) / 2;
  int pre_spaces1 = (COLUMNS - str1.length()) / 2;
  lcd.clear();
  lcd.setCursor(pre_spaces0, 0); lcd.print(str0);
  lcd.setCursor(pre_spaces1, 1); lcd.print(str1);
}
void print_lcd(String str, int row) {
  static const int COLUMNS = 16;
  if (str.length() > COLUMNS) truncate(&str, COLUMNS);
  int pre_spaces = (COLUMNS - str.length()) / 2;
  lcd.setCursor(0, row); lcd.print("                ");
  lcd.setCursor(pre_spaces, row); lcd.print(str);
}
void default_lcd_text(int del) {
  print_lcd("fingerprint","attendance");
  delay(del);
}
void initialize_system() {
  fprint.listen();
  default_lcd_text(1000);
  print_lcd("initializing","fprint sensor");
  unsigned long fprint_t = millis();
  bool fprint_ok = false;
  while(millis() - fprint_t < 3000) {
    if (finger.verifyPassword()) {
      fprint_ok = true;
      delay(1000);
      break;
    }
  }
  if(fprint_ok) {
    print_lcd("fprint sensor","is okay");
    Serial.println("fprint is ok");
  }
  else {
    print_lcd("couldnt find","fprint sensor");
    Serial.println("couldnt find fprint sensor");
  }
  delay(1400);
}
void button_event() {
   button_pressed = true;
}
bool getFingerprintEnroll(bool* already_registered) {
  print_lcd("place finger","on sensor");
  bool ret = false;
  int p = -1;
  // Serial.print("Waiting for valid finger to enroll as #"); Serial.println(id);
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
    case FINGERPRINT_OK:
      // Serial.println("Image taken");
      print_lcd("image taken","");
      // print_lcd("please wait","","","");
      delay(1300);
      break;
    case FINGERPRINT_NOFINGER:
      // Serial.println(".");
      delay(1300);
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      // Serial.println("Communication error");
      print_lcd("communication","error");
      delay(1300);
      break;
    case FINGERPRINT_IMAGEFAIL:
      // Serial.println("Imaging error");
      print_lcd("imaging error","");
      delay(1300);
      break;
    default:
      // Serial.println("Unknown error");
      print_lcd("unknown error","");
      delay(1300);
      break;
    }
  }
  // OK success!
  p = finger.image2Tz(1);
  switch (p) {
    case FINGERPRINT_OK:
      // Serial.println("Image converted");
      // print_lcd("image converted","","","");
      // delay(1300);
      break;
    case FINGERPRINT_IMAGEMESS:
      // Serial.println("Image too messy");
      print_lcd("image too","messy");
      delay(1300);
      return ret;
    case FINGERPRINT_PACKETRECIEVEERR:
      // Serial.println("Communication error");
      print_lcd("communication","error");
      delay(1300);
      return ret;
    case FINGERPRINT_FEATUREFAIL:
      // Serial.println("Could not find fingerprint features");
      print_lcd("couldnt find","fingerprint");
      delay(1300);
      return ret;
    case FINGERPRINT_INVALIDIMAGE:
      print_lcd("couldnt find","fingerprint");
      delay(1300);
      return ret;
    default:
      // Serial.println("Unknown error");
      print_lcd("unknown error","");
      delay(1300);
      return ret;
  }
  p = finger.fingerSearch();  //check if already registered
  if (p == FINGERPRINT_OK) {
    // Serial.println("Found a print match!");
    print_lcd("you are already","registered");
    delay(2000);
    *already_registered = true;
    return false;
  } 
  else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    // Serial.println("Communication error");
    // return p;
  } 
  else if (p == FINGERPRINT_NOTFOUND) {
    // Serial.println("Did not find a match");
    // return p;
  } 
  else {
    // Serial.println("Unknown error");
    // return p;
  }
  // Serial.println("Remove finger");
  print_lcd("remove your","finger");
  // delay(2000);
  p = 0;
  while (p != FINGERPRINT_NOFINGER) {
    p = finger.getImage();
  }
  // Serial.print("ID "); Serial.println(id);
  p = -1;
  // Serial.println("Place same finger again");
  print_lcd("place  same","finger again");
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
    case FINGERPRINT_OK:
      // Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.print(".");
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      // Serial.println("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      // Serial.println("Imaging error");
      break;
    default:
      // Serial.println("Unknown error");
      break;
    }
  }

  // OK success!

  p = finger.image2Tz(2);
  switch (p) {
    case FINGERPRINT_OK:
      // Serial.println("Image converted");
      // print_lcd("image converted","","","");
      // delay(1400);
      break;
    case FINGERPRINT_IMAGEMESS:
      // Serial.println("Image too messy");
      print_lcd("image too","messy");
      delay(1400);
      return ret;
    case FINGERPRINT_PACKETRECIEVEERR:
      // Serial.println("Communication error");
      print_lcd("communication","error");
      delay(1400);
      return ret;
    case FINGERPRINT_FEATUREFAIL:
      // Serial.println("Could not find fingerprint features");
      print_lcd("couldnt find","fingerprint");
      delay(1400);
      return ret;
    case FINGERPRINT_INVALIDIMAGE:
      print_lcd("couldnt find","fingerprint");
      delay(1400);
      return ret;
    default:
      // Serial.println("Unknown error");
      print_lcd("error","");
      delay(1400);
      return ret;
  }

  // OK converted!
  // Serial.print("Creating model for #");  Serial.println(id);

  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
    // Serial.println("Prints matched!");
    print_lcd("prints matched!","");
    delay(1000);
  } 
  // else if (p == FINGERPRINT_PACKETRECIEVEERR) {
  //   Serial.println("Communication error");
  //   return p;
  // } 
  // else if (p == FINGERPRINT_ENROLLMISMATCH) {
  //   Serial.println("Fingerprints did not match");
  //   return p;
  // } 
  else {
    // Serial.println("Unknown error");
    print_lcd("error","");
    delay(1400);
    return ret;
  }

  // Serial.print("ID "); Serial.println(id);
  // p = finger.storeModel(id);
  // if (p == FINGERPRINT_OK) {
  //   Serial.println("Stored!");
  //   print_lcd("success","","","");
  //   delay(1400);
  // }
  // else if (p == FINGERPRINT_PACKETRECIEVEERR) {
  //   Serial.println("Communication error");
  //   return p;
  // } 
  // else if (p == FINGERPRINT_BADLOCATION) {
  //   Serial.println("Could not store in that location");
  //   return p;
  // } 
  // else if (p == FINGERPRINT_FLASHERR) {
  //   Serial.println("Error writing to flash");
  //   return p;
  // } 
  // else {
  //   Serial.println("Unknown error");
  //   print_lcd("error","","","");
  //   delay(1400);
  //   return ret;
  // }
  ret = true;
  return ret;
}
bool get_fingerprint(bool* already_registered) {
  return getFingerprintEnroll(already_registered);
}
bool store_id(uint8_t id_candidate) {
  uint8_t p = finger.storeModel(id_candidate);
  if (p == FINGERPRINT_OK) {
    // Serial.println("Stored!");
    print_lcd("success","");
    delay(1400);
    return true;
  }
  // Serial.println("Unknown error");
  print_lcd("error","");
  delay(1400);
  return false;
}
void register_student() {
  /* 
  to register a student
  1. ask for a fingerprint and confirm second time up to point of storing in fprint sensor
  2. read last stored index from eeprom
  3. increment by 1 and store in fprint sensor
  4. if success store in eeprom
  5. if not report and return
  */
  print_lcd("registration","section");
  delay(1300);
  bool already_registered = false;
  if(!get_fingerprint(&already_registered)) {//no valid image or already registered
    if(already_registered) return;
    print_lcd("couldnt get","valid image");
    delay(2000);
    return;
  }
  uint8_t id_candidate = EEPROM.read(id_address) + 1;
  if(store_id(id_candidate)) {
    EEPROM.write(id_address, id_candidate);
    print_lcd("stored id:", String(id_candidate));
    delay(5000);
  }
  else {
    print_lcd("storing id","failed");
    delay(2000);
  }
}
uint8_t getFingerprintID(bool* fingerprint_valid) {
  *fingerprint_valid = false;
  uint8_t p = finger.getImage();
  switch (p) {
    case FINGERPRINT_OK:
      break;
    default:
      return p;
  }
  p = finger.image2Tz();
  switch (p) {
    case FINGERPRINT_OK:
      break;
    case FINGERPRINT_FEATUREFAIL:
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      return p;
    default:
      return p;
  }
  p = finger.fingerSearch();
  if (p == FINGERPRINT_OK) {
    // Serial.println("Found a print match!");
  }
  else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    // Serial.println("Communication error");
    return p;
  } 
  else if (p == FINGERPRINT_NOTFOUND) {
    // Serial.println("Did not find a match");
    return p;
  } 
  else {
    // Serial.println("Unknown error");
    return p;
  }
  *fingerprint_valid = true;
  return finger.fingerID;
}
uint8_t check_for_finger() { 
  fprint.listen();
  bool fingerprint_valid = false;
  uint8_t response = getFingerprintID(&fingerprint_valid);
  if(fingerprint_valid) return response;
  return 0;
}
void enroll(uint8_t id) {
  print_lcd("enrolling","");
  esp.listen();
  unsigned long t = millis();
  int timeout = 12000;
  esp.println("https://studentsattendancemanagement.herokuapp.com/togglelesson?id=" + String(id));
  Serial.println("https://studentsattendancemanagement.herokuapp.com/togglelesson?id=" + String(id));
  lcd.setCursor(0,1);
  while(millis() - t < timeout & !esp.available()) {
    lcd.print(".");
    delay(timeout/16);
  }
  if(esp.available()) {
    String response = esp.readStringUntil('\r');
    Serial.println(response);
    if(response.indexOf("hotspot") != -1) {
      print_lcd("not connected","to hotspot");
      delay(2000);
    }
    else if(response.indexOf("student_attendance_created") != -1) {
      print_lcd("enrolled","successfully");
      delay(2000);
    }
    else if(response.indexOf("student_attendance_blocked") != -1) {
      print_lcd("you cannot","enroll");
      delay(2000);
    }
    else if(response.indexOf("lesson_ended") != -1) {
      print_lcd("lesson","ended");
      delay(2000);
    }
    else if(response.indexOf("lesson_created") != -1) {
      print_lcd("lesson","started");
      delay(2000);
    }
    else {
      print_lcd("unknown","response");
      delay(2000);
    }
  }
  else {
    print_lcd("WiFi module","not responding");
    delay(2000);
  }
  fprint.listen();
}
bool deleteFingerprint(uint8_t id) {
  uint8_t p = -1;
  p = finger.deleteModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.println("Deleted!");
    return true;
  } 
  return false;
}
bool clear_fprints_on_sensor() {
  for(int i = 0; i < 127; i++) {
    if(!deleteFingerprint(i)) return false;
  }
  return true;
}
void clear_fingerprints() {
  print_lcd("clearing:","fingerprints");
  delay(1500);
  if(clear_fprints_on_sensor()) {
    EEPROM.write(id_address, 0);
    print_lcd("data cleared","successfully");
    delay(1200);
  }
}
void setup() {
  Serial.begin(9600);
  lcd.begin(16,2);
  finger.begin(57600);
  esp.begin(9600);
  initialize_system();
  pinMode(button, INPUT);
  attachInterrupt(digitalPinToInterrupt(button), button_event, FALLING);
  default_lcd_text(0);
}
void loop() {
  if(button_pressed) {
    delay(500);
    print_lcd("press again","to delete mem");
    button_pressed = false;
    delay(2000);
    if(button_pressed) clear_fingerprints();
    else register_student();
    button_pressed = false;
    default_lcd_text(0);
  }
  uint8_t finger_id = check_for_finger();
  if(finger_id != 0) {
    print_lcd("hello!","");
    delay(1200);
    enroll(finger_id);
    default_lcd_text(0);
  }
}
