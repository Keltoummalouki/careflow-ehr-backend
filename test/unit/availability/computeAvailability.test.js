import '../../setup.js'
import { expect } from 'chai'
import { computeAvailability } from '../../../src/controllers/availability/computeAvailability.js'

describe('computeAvailability', () => {
    it('should return all slots when no busy periods', () => {
        const dayStart = new Date('2025-10-22T08:00:00Z')
        const dayEnd = new Date('2025-10-22T12:00:00Z')
        const busy = []

        const slots = computeAvailability(busy, dayStart, dayEnd, 60)

        expect(slots).to.have.lengthOf(4)
        expect(slots[0].start).to.deep.equal(new Date('2025-10-22T08:00:00Z'))
        expect(slots[0].end).to.deep.equal(new Date('2025-10-22T09:00:00Z'))
    })

    it('should exclude busy slots', () => {
        const dayStart = new Date('2025-10-22T08:00:00Z')
        const dayEnd = new Date('2025-10-22T12:00:00Z')
        const busy = [{
            start: new Date('2025-10-22T09:00:00Z'),
            end: new Date('2025-10-22T10:00:00Z')
        }]

        const slots = computeAvailability(busy, dayStart, dayEnd, 60)

        expect(slots).to.have.lengthOf(3)
        expect(slots.find(s => s.start.getTime() === new Date('2025-10-22T09:00:00Z').getTime())).to.be.undefined
    })

    it('should handle 30-minute slots', () => {
        const dayStart = new Date('2025-10-22T08:00:00Z')
        const dayEnd = new Date('2025-10-22T10:00:00Z')
        const busy = []

        const slots = computeAvailability(busy, dayStart, dayEnd, 30)

        expect(slots).to.have.lengthOf(4)
    })
})