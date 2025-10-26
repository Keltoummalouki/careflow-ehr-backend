import Pharmacy from '../../models/Pharmacy.js'
import { pharmacyIdSchema } from '../../validators/pharmacyValidators.js'

export async function getPharmacyById(req, res) {
  try {
    // Validation
    const { error, value } = pharmacyIdSchema.validate(req.params)
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      })
    }

    const { pharmacyId } = value

    // Récupérer la pharmacie
    const pharmacy = await Pharmacy.findById(pharmacyId)

    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' })
    }

    return res.status(200).json({
      pharmacy
    })

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}