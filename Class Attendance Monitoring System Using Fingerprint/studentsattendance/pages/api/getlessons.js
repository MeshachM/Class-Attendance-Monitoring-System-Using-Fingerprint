import connectDB from '../../middlewares/mongodb'
import Lesson from '../../models/lesson';

const handler = async (req, res) => {
    const { id } = req.query
    if (id) {
        try {
            const lessons = await Lesson.find({});
            return res.status(200).send(lessons || []);
        } catch (e) {
            return res.status(500).send(e.message);
        }
    } else {
        return res.status(422).send("data_incomplete");
    }
}

export default connectDB(handler)