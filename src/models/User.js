import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true , trim: true},
        lastName: { type: String, required: true , trim: true},
        email: { type: String, required: true , unique: true, lowercase: true, trim: true},
        password: { type: String, required: true},
        roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
        isActive: { type: Boolean, default: true},
        passwordResetToken: { type: String, default: null, },
        passwordResetExpire: { type: Date, default: null, },
    },
    { timestamps : true}
)

const User = mongoose.model('User' , userSchema)

export default User;