import mongoose from "mongoose";

const BlacklistedTokenSchema = new mongoose.Schema(
    {
        token: { type: String, required: true, unique: true, index: true },
        expiresAt: { type: Date, required: true }
    }, { timestamps: true }
);

BlacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Check if model already exists before compiling
export default mongoose.models.BlacklistedToken || mongoose.model('BlacklistedToken', BlacklistedTokenSchema);
