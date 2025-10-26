import Prescription from '../../models/Prescription.js'
import Patient from '../../models/Patient.js'
import { patientPrescriptionsSchema } from '../../validators/prescriptionValidators.js'

export async function listPrescriptionsByPatient(req, res) {
  try {
    // Validation
    const { error, value } = patientPrescriptionsSchema.validate({
      ...req.params,
      ...req.query
    })
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      })
    }

    const { patientId, page, limit, status } = value

    // Vérifier que le patient existe
    const patient = await Patient.findById(patientId)
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    // Vérifier les autorisations
    const userRole = req.user.role
    const userId = req.user.sub

    // Si patient, vérifier qu'il demande ses propres prescriptions
    if (userRole === 'patient' && patientId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to view these prescriptions' })
    }

    // Construire la requête
    const query = { patientId }
    if (status) {
      query.status = status
    }

    // Pagination
    const skip = (page - 1) * limit

    // Récupérer les prescriptions
    const [prescriptions, total] = await Promise.all([
      Prescription.find(query)
        .populate('practitionerId', 'firstName lastName')
        .populate('pharmacyId', 'name address phone')
        .populate('consultationId', 'chiefComplaint')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Prescription.countDocuments(query)
    ])

    return res.status(200).json({
      prescriptions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}