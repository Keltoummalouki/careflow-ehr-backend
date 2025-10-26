import Appointment from "../../models/Appointment.js";

export async function hasConflict(practitionerId, start, end, ignoreId = null) {
    // check overlap for same doctor : start < existing-end && end > existing-start
    const query = {
        practitionerId,
        start: {$lt: end},
        end: {$gt: start },
        status: { $ne: 'cancelled' }
    }    

    if(ignoreId) query._id = { $ne: ignoreId }
    const count = await Appointment.countDocuments(query) // how many overlap
    return count > 0 // true if conflict
}