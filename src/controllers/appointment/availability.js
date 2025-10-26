import mongoose from 'mongoose'
import { validateAvailabilityQuery } from '../../validators/appointments/availabilityQuery.js'
import { listBusySlots } from '../availability/listBusySlots.js'
import { computeAvailability } from '../availability/computeAvailability.js'

export async function availability(req, res) {                 
  try {
    const { error, value } = validateAvailabilityQuery(req.query) // validate query
    if (error) return res.status(400).json({ message: 'Invalid query', details: error.details.map(d=>d.message) })

    const day = new Date(`${value.date}T00:00:00.000Z`)       // start of day UTC
    const dayStart = new Date(day)                             // copy
    const dayEnd = new Date(day.getTime() + 24*60*60*1000)     // +1 day

    const busy = await listBusySlots(value.practitionerId, dayStart, dayEnd) // get busy slots
    const slots = computeAvailability(busy, dayStart, dayEnd, value.slotMinutes) // compute free
    return res.status(200).json({ slots })
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}