import connectDB from '../../middlewares/mongodb'
import Controls from '../../models/controls'
import Data from '../../models/data'

const handler = async (req, res) => {
    const { alarm } = req.query;
    if (alarm) {
        if (parseInt(alarm) === 1) {
            var data = new Data({
                action: "alarm_switched_on",
            });
            await data.save();
        }
        Controls.findByIdAndUpdate("controls", { alarm }).exec()
            .then(data => {
                // Return data fetched
                return res.status(200).send("saved")
            })
            .catch(error => {
                return res.status(500).send(error.message)
            })
    } else {
        return res.status(422).send("incomplete_message");
    }
}
export default connectDB(handler)