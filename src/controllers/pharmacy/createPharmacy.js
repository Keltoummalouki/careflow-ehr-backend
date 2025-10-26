import Pharmacy from '../../models/Pharmacy.js'
import { createPharmacySchema } from '../../validators/pharmacyValidators.js'

export async function createPharmacy(req, res) {
  try {
    // Validation des données
    const { error, value } = createPharmacySchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      })
    }

    const { name, address, city, phone, email, hours, isActive } = value

    // Vérifier si une pharmacie avec le même email existe déjà
    if (email) {
      const existingPharmacy = await Pharmacy.findOne({ email })
      if (existingPharmacy) {
        return res.status(409).json({ message: 'A pharmacy with this email already exists' })
      }
    }

    // Créer la pharmacie
    const pharmacy = await Pharmacy.create({
      name,
      address,
      city,
      phone,
      email,
      hours,
      isActive
    })

    return res.status(201).json({
      message: 'Pharmacy created successfully',
      pharmacy
    })

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}