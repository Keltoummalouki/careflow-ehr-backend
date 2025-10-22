import Appointment from "../../models/Appointment";

export async function hasConflict(patientId, start, end, ignoreId = null) {
    // check overlap for same doctor : start < existing-end && end > existing-start
    const query = {
        practitionerId,
        start: {$lt: end},
        end: {$gt: start }
    }    

    if(ignoreId) query._id = { $ne: ignoreId }
    const count = await Appointment.countDocuments(q) // how many overlap
    return count > 0 // true if conflict
}