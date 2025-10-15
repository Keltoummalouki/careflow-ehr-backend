import mongoose from "mongoose";

const BlacklistedTokenSchema = new mongoose.Schema(
    {
        token: { type: String, required: true, unique: true, index: true },
        expiresAt: { type: Date, required: true }
    }, { timestamps: true }
);

BlacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('BlacklistedToken', BlacklistedTokenSchema);
