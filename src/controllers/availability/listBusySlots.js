import Appointment from "../../models/Appointment.js";

export async function listBusySlots(practitionerId, dayStart, dayEnd) {
    // get All appointments for doctor on a day
    return Appointment.find({
        practitionerId,
        start: { $lt: dayEnd },
        end: { $gt: dayStart },            
        status: { $ne: 'cancelled' }
    }).select('start end').lean() // return plain JavaScript objects
}