const mongoose = require('mongoose');
const Emp = mongoose.model('Employee');
function calculateDistance(coord1, coord2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
    const dLon = (coord2.lon - coord1.lon) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coord1.lat * (Math.PI / 180)) * Math.cos(coord2.lat * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}


// Controller function to check if queried coordinates are within 1km of the visit's location coordinates
async function checkCoordinates(req, res) {
    try {
        const { employeeId, visitId, lat, lon } = req.params;

        const employee = await Emp.findById(employeeId).populate('visits');

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found.' });
        }

        const visit = employee.visits.id(visitId);

        if (!visit) {
            return res.status(404).json({ error: 'Visit not found.' });
        }

        const queriedCoordinates = { lat: parseFloat(lat), lon: parseFloat(lon) };

        const distance = calculateDistance(queriedCoordinates, {
            lat: visit.cords.coordinates[1], // latitude
            lon: visit.cords.coordinates[0], // longitude
        });

        if (distance <= 1) {
            return res.status(200).json({ result: true });
        } else {
            return res.status(200).json({ result: false });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ error: 'An error occurred.' });
    }
}

module.exports = {
    checkCoordinates,
};