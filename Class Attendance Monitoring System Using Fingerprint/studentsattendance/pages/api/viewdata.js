import connectDB from '../../middlewares/mongodb'
import Data from '../../models/data'
import moment from 'moment'

const handler = async (req, res) => {
  // Get date from browser
  const { date } = req.query
  var starttime
  var endtime
  if (date) {
    starttime = moment(date).startOf('day').toDate()
    endtime = moment(date).endOf('day').toDate()
  } else {
    starttime = moment(new Date()).startOf('day').toDate()
    endtime = moment(new Date()).endOf('day').toDate()
  }
  var query = {
    time: {
      $gte: starttime,
      $lte: endtime
    },
    action: "birt_detected",
  }

  const countActions = await Data.countDocuments({ ...query, action: "alarm_switched_on" });
  // Fetch data from database
  Data.find(query).sort({ time: -1 }).exec()
    .then(data => {
      // Return data fetched
      return res.status(200).send({ data, countActions })
    })
    .catch(error => {
      return res.status(500).send(error.message)
    })
}
export default connectDB(handler)
