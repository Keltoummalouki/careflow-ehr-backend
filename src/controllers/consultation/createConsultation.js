import Consultation from "../../models/Consultation.js";
import Appointment from "../../models/Appointment.js";
import Patient from "../../models/Patient.js";
import User from "../../models/User.js";
import { createConsultationSchema } from "../../validators/consultation/consultationValidators.js";

export async function createConsultation(req, res) {
  try {
    const { error, value } = createConsultationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }

    const {
      appointmentId,
      patientId,
      vitalSigns,
      chiefComplaint,
      diagnosis,
      procedures,
      notes,
      status,
    } = value;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Chercher le patient de manière flexible (Patient._id OU userId)
    let patient = await Patient.findById(patientId);
    
    if (!patient) {
      patient = await Patient.findOne({ userId: patientId });
    }
    
    if (!patient) {
      return res.status(404).json({ 
        message: "Patient profile not found. Please create a patient profile first.",
      });
    }

    // Vérifier que le rendez-vous appartient bien au patient (accepter User ID OU Patient._id)
    const appointmentPatientId = appointment.patientId.toString();
    const patientDocId = patient._id.toString();
    const patientUserId = patient.userId.toString();

    if (appointmentPatientId !== patientDocId && appointmentPatientId !== patientUserId) {
      return res.status(400).json({ 
        message: "Appointment does not belong to this patient",
        debug: {
          appointmentPatientId,
          patientDocId,
          patientUserId
        }
      });
    }

    // Vérifier qu'une consultation n'existe pas déjà pour ce rendez-vous
    const existingConsultation = await Consultation.findOne({ appointmentId });
    if (existingConsultation) {
      return res.status(409).json({
        message: "A consultation already exists for this appointment",
      });
    }

    const consultation = await Consultation.create({
      appointmentId,
      patientId: patient._id,
      practitionerId: appointment.practitionerId, 
      vitalSigns,
      chiefComplaint,
      diagnosis,
      procedures,
      notes,
      status,
    });

    // Populer les références
    await consultation.populate([
      { path: "patientId", select: "dob gender userId" },
      { path: "practitionerId", select: "firstName lastName" },
    ]);

    // Populer les infos User du patient
    await consultation.populate({
      path: "patientId",
      populate: { path: "userId", select: "firstName lastName email" }
    });

    return res.status(201).json({
      message: "Consultation created successfully",
      consultation,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}
