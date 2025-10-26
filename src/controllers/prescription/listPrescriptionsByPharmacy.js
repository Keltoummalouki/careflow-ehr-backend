import Prescription from '../../models/Prescription.js'
import Pharmacy from '../../models/Pharmacy.js'
import { pharmacyPrescriptionsSchema } from '../../validators/prescription/prescription.js'

export async function listPrescriptionsByPharmacy(req, res) {
  try {
    // Validation
    const { error, value } = pharmacyPrescriptionsSchema.validate({
      ...req.params,
      ...req.query
    })
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      })
    }

    const { pharmacyId, page, limit, status } = value

    // Vérifier que la pharmacie existe
    const pharmacy = await Pharmacy.findById(pharmacyId)
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' })
    }

    // Construire la requête
    const query = { pharmacyId, status }

    // Pagination
    const skip = (page - 1) * limit

    // Récupérer les prescriptions
    const [prescriptions, total] = await Promise.all([
      Prescription.find(query)
        .populate('patientId', 'firstName lastName dob')
        .populate('practitionerId', 'firstName lastName')
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