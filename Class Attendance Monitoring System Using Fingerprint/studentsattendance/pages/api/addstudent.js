import connectDB from '../../middlewares/mongodb';
import User from '../../models/user';

const handler = (req, res) => {
    // Get data from the circuit
    const { id, name, type, lecture } = req.query;
    var data = new User({
        name,
        type,
        lecture,
        _id: id,
    });
    // Save the data to database
    data.save()
        .then(data => {
            return res.status(200).send(data);
        })
        .catch(error => {
            return res.status(500).send(error.message);
        });
};
export default connectDB(handler);