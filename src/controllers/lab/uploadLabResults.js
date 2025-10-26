import LabOrder from '../../models/LabOrder.js'
import { labOrderIdSchema, uploadLabResultsSchema } from '../../validators/labOrderValidators.js'

export async function uploadLabResults(req, res) {
  try {
    // Validation des paramètres
    const { error: paramsError, value: paramsValue } = labOrderIdSchema.validate(req.params)
    if (paramsError) {
      return res.status(400).json({
        message: 'Validation error',
        details: paramsError.details.map(d => d.message)
      })
    }

    // Validation du body
    const { error: bodyError, value: bodyValue } = uploadLabResultsSchema.validate(req.body)
    if (bodyError) {
      return res.status(400).json({
        message: 'Validation error',
        details: bodyError.details.map(d => d.message)
      })
    }

    const { labOrderId } = paramsValue
    const { results, validatedBy } = bodyValue

    // Récupérer l'ordre de laboratoire
    const labOrder = await LabOrder.findById(labOrderId)
    if (!labOrder) {
      return res.status(404).json({ message: 'Lab order not found' })
    }

    // Vérifier les autorisations
    const userRole = req.user.role
    if (!['admin', 'lab_tech'].includes(userRole)) {
      return res.status(403).json({ message: 'You are not authorized to upload lab results' })
    }

    // Vérifier que l'ordre est en statut processing
    if (labOrder.status !== 'processing') {
      return res.status(400).json({ 
        message: `Cannot upload results for lab order with status: ${labOrder.status}. Must be in 'processing' status.` 
      })
    }

    // Vérifier que tous les tests commandés ont des résultats
    const orderedTestCodes = labOrder.tests.map(t => t.code)
    const resultTestCodes = results.map(r => r.testCode)
    
    const missingTests = orderedTestCodes.filter(code => !resultTestCodes.includes(code))
    if (missingTests.length > 0) {
      return res.status(400).json({
        message: 'Missing results for some ordered tests',
        missingTests
      })
    }

    // Ajouter les résultats
    labOrder.results = results
    labOrder.validatedBy = validatedBy || req.user.sub
    labOrder.status = 'completed'
    labOrder.completedAt = new Date()

    await labOrder.save()

    // Populer les références
    await labOrder.populate([
      { path: 'patientId', select: 'firstName lastName dob gender' },
      { path: 'practitionerId', select: 'firstName lastName' },
      { path: 'validatedBy', select: 'firstName lastName' }
    ])

    return res.status(200).json({
      message: 'Lab results uploaded successfully',
      labOrder
    })

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}