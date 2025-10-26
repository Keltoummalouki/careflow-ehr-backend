import mongoose from 'mongoose'

const PharmacySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, lowercase: true },
  hours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

export default mongoose.model('Pharmacy', PharmacySchema)