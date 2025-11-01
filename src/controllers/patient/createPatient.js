import Patient from "../../models/Patient.js";
import User from "../../models/User.js";
import { patientCreateSchema } from "../../validators/patient/patientCreate.js";

export async function createPatient(req, res) {
  try {
    const { error, value } = patientCreateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map(d => d.message)
      });
    }

    const { userId, dob, gender, contact, allergies, medicalHistory, insurance } = value;

    // Vérifier que le User existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    // Vérifier si un patient existe déjà avec ce userId
    const existingPatient = await Patient.findOne({ userId });
    if (existingPatient) {
      return res.status(409).json({ 
        message: "Patient profile already exists for this user" 
      });
    }

    const patient = await Patient.create({
      userId,
      dob,
      gender,
      contact,
      allergies,
      medicalHistory,
      insurance
    });

    // Populer le userId pour obtenir firstName et lastName depuis User
    await patient.populate('userId', 'firstName lastName email');

    return res.status(201).json({
      message: "Patient created successfully",
      patient
    });
  } catch (err) {
    return res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
}