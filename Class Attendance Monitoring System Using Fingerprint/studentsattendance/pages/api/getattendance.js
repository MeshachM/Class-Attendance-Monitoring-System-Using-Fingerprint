import connectDB from '../../middlewares/mongodb'
import Attendance from '../../models/attendance';
import User from '../../models/user';

const handler = async (req, res) => {
    const { id } = req.query
    if (id) {
        try {
            const users = await User.find({ type: 'student' });
            const attendances = await Attendance.find({ lesson: id });

            const groupedAttendances = attendances.reduce((group, att) => {
                const currentGroup = group;
                currentGroup[att.student] = att;
                return currentGroup;
            }, {});

            const groupedUsers = users.map(usr => {
                return {
                    ...usr._doc,
                    attendance: groupedAttendances[usr._id] || {},
                }
            });

            return res.status(200).send(groupedUsers || []);
        } catch (e) {
            return res.status(500).send(e.message);
        }
    } else {
        return res.status(422).send("data_incomplete");
    }
}

export default connectDB(handler)