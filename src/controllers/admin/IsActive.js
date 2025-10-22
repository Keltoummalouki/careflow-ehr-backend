import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import User from "../../models/User.js";
import Dto from "./Dto.js"


export async function suspendUser(req, res) {
    try {
        const { userId } = req.params
        if(!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({
                message: 'Invalid userId'
            })
        }

        // stop self suspend
        if( req.auth?.userId === userId) {
            return res.status(400).json({ message: 'Not allowed' })
        }

        const user = await User.findById(userId).populate('roleId')
        if (!user) return res.status(404).json({ message: 'user not found'})

        user.isActive = false
        await user.save()
        return res.status(200).json({ user: Dto(user)})

    } catch (err) {
        return res.status(500).json({message: 'Server error', error: err.message})
    }
}

export async function activateUser(req, res) {
    try {
        const { userId } = req.params
        if(!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({
                message: 'Invalid userId'
            })
        }

        const user = await User.findById(userId).populate('roleId')
        if (!user) return res.status(404).json({ message: 'user not found'})

        user.isActive = true
        await user.save()
        return res.status(200).json({ user: Dto(user)})

    } catch (err) {
        return res.status(500).json({message: 'Server error', error: err.message})
    }
}