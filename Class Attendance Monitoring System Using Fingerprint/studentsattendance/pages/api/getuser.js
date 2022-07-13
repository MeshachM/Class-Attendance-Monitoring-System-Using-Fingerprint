import connectDB from '../../middlewares/mongodb'
import User from '../../models/user';

const handler = async (req, res) => {
    const { id } = req.query
    if (id) {
        try {
            const user = await User.findById(id);
            return res.status(200).send(user || {});
        } catch (e) {
            return res.status(500).send(e.message);
        }
    } else {
        return res.status(422).send("data_incomplete");
    }
}

export default connectDB(handler)