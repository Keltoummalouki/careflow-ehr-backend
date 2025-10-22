export function computeAvailability(busy, dayStart, dayEnd, slotMinutes = 30) {
    // build free slots by scanning time from dayStart to dayEnd
    const slots = []
    let t = new Date(dayStart)
    const step = slotMinutes * 60 * 1000

    while (t< dayEnd) {
        const s = new Date(t)
        const e = new Date(t.getTime() + step)

        // stop it slot exceeds day end
        if( e > dayEnd) break

        const overlap = busy.some(b => 
            s < new Date(b.end) && e > new Date(b.start)
        )

        if (!overlap) slots.push({ start: s, end: e }) // slot is free
        t = e // move forward
    }
    return slots
}