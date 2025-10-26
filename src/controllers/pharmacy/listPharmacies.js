import Pharmacy from '../../models/Pharmacy.js'
import { listPharmaciesSchema } from '../../validators/pharmacyValidators.js'

export async function listPharmacies(req, res) {
  try {
    // Validation
    const { error, value } = listPharmaciesSchema.validate(req.query)
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      })
    }

    const { page, limit, city, isActive } = value

    // Construire la requête
    const query = {}
    if (city) {
      query.city = { $regex: city, $options: 'i' }
    }
    if (isActive !== undefined) {
      query.isActive = isActive
    }

    // Pagination
    const skip = (page - 1) * limit

    // Récupérer les pharmacies
    const [pharmacies, total] = await Promise.all([
      Pharmacy.find(query)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit),
      Pharmacy.countDocuments(query)
    ])

    return res.status(200).json({
      pharmacies,
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