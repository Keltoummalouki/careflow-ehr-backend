import Patient from '../../models/Patient.js'

export async function listPatients(req,res){
    try {
        const {q, page = 1, limit = 20} = req.query
        const filter = { isActive: true }
        if(q) {
            filter.$or = [
                {firstName: new RegExp(q, 'i')},
                {lastName: new RegExp(q, 'i')},
                {'contact.email': new RegExp(q,'i')},
                {'contact.phone': new RegExp(q, 'i')}
            ]
        }
        const skip = (Number(page) - 1 ) * Number(limit)  // skip calc
        const patients = await Patient.find(filter).sort({lastName: 1, firstName: 1}).skip(skip).limit(Number(limit))
        const total = await Patient.countDocuments(filter)
        return res.status(200).json({total, page: Number(page), limit: Number(limit), patients})
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}