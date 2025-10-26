import mongoose from 'mongoose'

const MedicalDocumentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' },
  category: { type: String, enum: ['imaging', 'report', 'prescription', 'lab_result', 'other'], required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  storageKey: { type: String, required: true },
  tags: [String],
  description: String
}, { timestamps: true })

MedicalDocumentSchema.index({ patientId: 1, category: 1 })

export default mongoose.model('MedicalDocument', MedicalDocumentSchema)