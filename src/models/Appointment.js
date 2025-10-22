import mongoose from 'mongoose'                           

const AppointmentSchema = new mongoose.Schema(               
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }, // patient ref
    practitionerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // doctor/nurse ref
    start: { type: Date, required: true },                   
    end: { type: Date, required: true },                      
    reason: { type: String, trim: true },                     
    notes: { type: String, trim: true },                     
    status: { type: String, enum: ['scheduled','completed','cancelled'], default: 'scheduled' } 
  },
  { timestamps: true }   
)

AppointmentSchema.index({ practitionerId: 1, start: 1, end: 1 }) 
AppointmentSchema.index({ patientId: 1, start: 1 })              

export default mongoose.model('Appointment', AppointmentSchema) 