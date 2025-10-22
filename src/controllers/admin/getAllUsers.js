import User from "../../models/User.js";
import Dto from './Dto.js'


export async function getAllUsers(req, res) {
    try {

        const users = await User.find({}).populate().sort({ createdAt: -1 })

        return res.status(200).json({
            users: users.map(u => Dto(u)) // send clean data
        })

    } catch (err) {
        return res.status(500).json({message: 'Server error', error: err.message})
    }
}
