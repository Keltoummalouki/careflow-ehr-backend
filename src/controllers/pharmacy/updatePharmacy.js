import Pharmacy from '../../models/Pharmacy.js'
import { pharmacyIdSchema, updatePharmacySchema } from '../../validators/pharmacyValidators.js'

export async function updatePharmacy(req, res) {
  try {
    // Validation des paramètres
    const { error: paramsError, value: paramsValue } = pharmacyIdSchema.validate(req.params)
    if (paramsError) {
      return res.status(400).json({
        message: 'Validation error',
        details: paramsError.details.map(d => d.message)
      })
    }

    // Validation du body
    const { error: bodyError, value: bodyValue } = updatePharmacySchema.validate(req.body)
    if (bodyError) {
      return res.status(400).json({
        message: 'Validation error',
        details: bodyError.details.map(d => d.message)
      })
    }

    const { pharmacyId } = paramsValue
    const updates = bodyValue

    // Récupérer la pharmacie
    const pharmacy = await Pharmacy.findById(pharmacyId)
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' })
    }

    // Si l'email est modifié, vérifier qu'il n'existe pas déjà
    if (updates.email && updates.email !== pharmacy.email) {
      const existingPharmacy = await Pharmacy.findOne({ email: updates.email })
      if (existingPharmacy) {
        return res.status(409).json({ message: 'A pharmacy with this email already exists' })
      }
    }

    // Mettre à jour
    Object.assign(pharmacy, updates)
    await pharmacy.save()

    return res.status(200).json({
      message: 'Pharmacy updated successfully',
      pharmacy
    })

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}