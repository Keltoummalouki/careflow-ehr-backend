import mongoose from 'mongoose'

const VitalSignsSchema = new mongoose.Schema({
  bloodPressure: { systolic: Number, diastolic: Number },
  heartRate: Number,
  temperature: Number,
  weight: Number,
  height: Number,
  respiratoryRate: Number,
  oxygenSaturation: Number
}, { _id: false })

const ConsultationSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  practitionerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vitalSigns: VitalSignsSchema,
  chiefComplaint: String,
  diagnosis: [{ code: String, description: String }],
  procedures: [{ code: String, description: String }],
  notes: String,
  status: { type: String, enum: ['draft', 'completed', 'cancelled'], default: 'draft' }
}, { timestamps: true })

ConsultationSchema.index({ patientId: 1, createdAt: -1 })

export default mongoose.model('Consultation', ConsultationSchema)