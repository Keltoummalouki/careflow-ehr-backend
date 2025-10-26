import Prescription from '../../models/Prescription.js'
import Pharmacy from '../../models/Pharmacy.js'
import { prescriptionIdSchema, updatePrescriptionSchema } from '../../validators/prescription/prescription.js'

export async function updatePrescription(req, res) {
  try {
    // Validation des paramètres
    const { error: paramsError, value: paramsValue } = prescriptionIdSchema.validate(req.params)
    if (paramsError) {
      return res.status(400).json({
        message: 'Validation error',
        details: paramsError.details.map(d => d.message)
      })
    }

    // Validation du body
    const { error: bodyError, value: bodyValue } = updatePrescriptionSchema.validate(req.body)
    if (bodyError) {
      return res.status(400).json({
        message: 'Validation error',
        details: bodyError.details.map(d => d.message)
      })
    }

    const { prescriptionId } = paramsValue
    const updates = bodyValue

    // Récupérer la prescription
    const prescription = await Prescription.findById(prescriptionId)
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' })
    }

    // Vérifier les autorisations (seul le praticien qui a créé peut modifier)
    const practitionerId = req.user.sub
    if (prescription.practitionerId.toString() !== practitionerId) {
      return res.status(403).json({ message: 'You are not authorized to update this prescription' })
    }

    // Ne pas permettre la modification si la prescription est dispensée
    if (prescription.status === 'dispensed') {
      return res.status(400).json({ message: 'Cannot modify a dispensed prescription' })
    }

    // Si une pharmacie est spécifiée, vérifier qu'elle existe et est active
    if (updates.pharmacyId) {
      const pharmacy = await Pharmacy.findById(updates.pharmacyId)
      if (!pharmacy) {
        return res.status(404).json({ message: 'Pharmacy not found' })
      }
      if (!pharmacy.isActive) {
        return res.status(400).json({ message: 'This pharmacy is not active' })
      }
    }

    // Mettre à jour
    Object.assign(prescription, updates)
    await prescription.save()

    // Populer les références
    await prescription.populate([
      { path: 'patientId', select: 'firstName lastName dob gender' },
      { path: 'practitionerId', select: 'firstName lastName' },
      { path: 'pharmacyId', select: 'name address phone' }
    ])

    return res.status(200).json({
      message: 'Prescription updated successfully',
      prescription
    })

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}