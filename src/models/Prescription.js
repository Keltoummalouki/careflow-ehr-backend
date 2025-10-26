import mongoose from 'mongoose'

const PrescriptionSchema = new mongoose.Schema({
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  practitionerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' },
  medication: { type: String, required: true },
  dosage: { type: String, required: true },
  route: { type: String, enum: ['oral', 'IV', 'IM', 'topical', 'other'], required: true },
  frequency: { type: String, required: true },
  duration: String,
  renewals: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'signed', 'sent', 'dispensed', 'cancelled'], default: 'draft' },
  dispensedAt: Date,
  dispensedBy: String
}, { timestamps: true })

PrescriptionSchema.index({ patientId: 1, status: 1 })
PrescriptionSchema.index({ pharmacyId: 1, status: 1 })

export default mongoose.model('Prescription', PrescriptionSchema)