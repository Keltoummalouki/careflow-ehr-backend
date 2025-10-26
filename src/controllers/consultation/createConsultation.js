import Consultation from "../../models/Consultation.js";
import Appointment from "../../models/Appointment.js";
import Patient from "../../models/Patient.js";
import { createConsultationSchema } from "../../validators/consultationValidators.js";

export async function createConsultation(req, res) {
  try {
    // Validation des données
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

    // Vérifier que le rendez-vous existe
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Vérifier que le patient existe
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Vérifier que le rendez-vous appartient bien au patient
    if (appointment.patientId.toString() !== patientId) {
      return res
        .status(400)
        .json({ message: "Appointment does not belong to this patient" });
    }

    // Vérifier que le praticien est autorisé
    const practitionerId = req.user.sub;
    if (appointment.practitionerId.toString() !== practitionerId) {
      return res
        .status(403)
        .json({
          message:
            "You are not authorized to create a consultation for this appointment",
        });
    }

    // Vérifier qu'une consultation n'existe pas déjà pour ce rendez-vous
    const existingConsultation = await Consultation.findOne({ appointmentId });
    if (existingConsultation) {
      return res
        .status(409)
        .json({
          message: "A consultation already exists for this appointment",
        });
    }

    // Créer la consultation
    const consultation = await Consultation.create({
      appointmentId,
      patientId,
      practitionerId,
      vitalSigns,
      chiefComplaint,
      diagnosis,
      procedures,
      notes,
      status,
    });

    // Populer les références
    await consultation.populate([
      { path: "patientId", select: "firstName lastName dob gender" },
      { path: "practitionerId", select: "firstName lastName" },
    ]);

    return res.status(201).json({
      message: "Consultation created successfully",
      consultation,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
}
