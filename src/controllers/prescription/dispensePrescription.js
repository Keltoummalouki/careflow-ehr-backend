import Prescription from '../../models/Prescription.js'
import { prescriptionIdSchema, dispensePrescriptionSchema } from '../../validators/prescription/prescription.js'

export async function dispensePrescription(req, res) {
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
    const { error: bodyError, value: bodyValue } = dispensePrescriptionSchema.validate(req.body)
    if (bodyError) {
      return res.status(400).json({
        message: 'Validation error',
        details: bodyError.details.map(d => d.message)
      })
    }

    const { prescriptionId } = paramsValue
    const { dispensedBy } = bodyValue

    // Récupérer la prescription
    const prescription = await Prescription.findById(prescriptionId)
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' })
    }

    // Vérifier que la prescription a été envoyée à une pharmacie
    if (!prescription.pharmacyId) {
      return res.status(400).json({ message: 'Prescription must be assigned to a pharmacy first' })
    }

    // Vérifier que le statut permet la dispensation
    if (!['signed', 'sent'].includes(prescription.status)) {
      return res.status(400).json({ 
        message: `Cannot dispense prescription with status: ${prescription.status}` 
      })
    }

    // Vérifier que c'est bien le pharmacien de la pharmacie assignée
    // (dans un cas réel, on vérifierait l'affiliation du pharmacien)

    // Marquer comme dispensée
    prescription.status = 'dispensed'
    prescription.dispensedAt = new Date()
    prescription.dispensedBy = dispensedBy

    await prescription.save()

    // Populer les références
    await prescription.populate([
      { path: 'patientId', select: 'firstName lastName' },
      { path: 'practitionerId', select: 'firstName lastName' },
      { path: 'pharmacyId', select: 'name address phone' }
    ])

    return res.status(200).json({
      message: 'Prescription dispensed successfully',
      prescription
    })

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}