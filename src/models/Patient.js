import mongoose from 'mongoose'

// contact sub document
const ContactSchema = new mongoose.Schema({         
  phone: { type: String, trim: true },             
  email: { type: String, trim: true, lowercase: true }, 
  address: { type: String, trim: true },            
  city: { type: String, trim: true },               
  country: { type: String, trim: true }             
}, { _id: false }) // no _id for sub doc

const PatientSchema = new mongoose.Schema(   
  {
    dob: { type: Date, required: true }, // birth date
    gender: { type: String, enum: ['male','female'], required: true },
    allergies: [{ type: String, trim: true }],         
    medicalHistory: [{ type: String, trim: true }],
    contact: { type: ContactSchema, default: {} }, 
    insurance: { type: InsuranceSchema, default: {} }, 
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }          
)

PatientSchema.index({ 'contact.phone': 1, 'contact.email': 1})

const Patient = mongoose.model('Patient', PatientSchema)

export default Patient