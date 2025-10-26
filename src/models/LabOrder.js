import mongoose from 'mongoose'

const TestSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  category: String
}, { _id: false })

const ResultSchema = new mongoose.Schema({
  testCode: String,
  testName: String,
  value: String,
  unit: String,
  referenceRange: String,
  isAbnormal: { type: Boolean, default: false },
  notes: String
}, { _id: false })

const LabOrderSchema = new mongoose.Schema({
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  practitionerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tests: [TestSchema],
  results: [ResultSchema],
  reportUrl: String,
  status: { type: String, enum: ['ordered', 'sample_collected', 'processing', 'completed', 'cancelled'], default: 'ordered' },
  orderedAt: { type: Date, default: Date.now },
  completedAt: Date,
  validatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

LabOrderSchema.index({ patientId: 1, status: 1 })

export default mongoose.model('LabOrder', LabOrderSchema)