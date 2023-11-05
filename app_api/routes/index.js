const express = require('express');
const router = express.Router();
const ctrlEmployees = require('../controllers/employees');
const ctrlVisits = require('../controllers/visits');
const coordinatesController = require('../controllers/coordinatesController');

router
    .route('/employees')
    .get(ctrlEmployees.getAllEmployees)
    .post(ctrlEmployees.employeeCreate);
router
    .route('/employees/:employeeName/:employeePassword')
    .get(ctrlEmployees.employeeReadOne)
    .put(ctrlEmployees.employeeUpdateOne)
    .delete(ctrlEmployees.employeeDeleteOne);
// visits
router
    .route('/employees/:employeeName/visits')
    .get(ctrlVisits.getAllVisitsForEmployee)
    .post(ctrlVisits.visitsCreate);
router
    .route('/employees/:employeeName/visits/:visitId')
    .get(ctrlVisits.visitsReadOne)
    .put(ctrlVisits.visitsUpdateOne)
    .delete(ctrlVisits.visitsDeleteOne);

router.
    route('/checkCoordinates/:employeeName/:visitId/:lat/:lon')
    .get(coordinatesController.checkCoordinates)
module.exports = router;