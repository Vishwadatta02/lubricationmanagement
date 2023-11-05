const mongoose = require('mongoose');
const Emp = mongoose.model('Employee');

const getAllVisitsForEmployee = async (req, res) => {
    const employeeName = req.params.employeeName;

    try {
        const employee = await Emp.findOne({ name: employeeName });

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found.' });
        }

        const visitList = employee.visits.map(result => result);
        console.log(visitList);

        return res.status(200).json({ visitList });
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ error: 'An error occurred.' });
    }
};

const doAddVisit = (req, res, employee) => {
    if (!employee) {
        res
            .status(404)
            .json({ "message": "Employee not found" });
    } else {
        const locationName = req.body.locationName;
        const coords = req.body.coords;
        const date = req.body.date;
        const status = req.body.status;
        const visit = {locationName,coords,date,status}
        employee.visits.push(visit);
        employee.save((err, employee) => {
            if (err) {
                res
                    .status(400)
                    .json(err);
            } else { 
                res
                    .status(201)
                    .json({ "message": "Visit Added" });
            }
        });
    }
};

const visitsCreate = (req, res) => {
    const EmployeeName = req.params.employeeName;
    if (EmployeeName) {
        Emp
            .findOne({ name: EmployeeName })
            .exec((err, employee) => {
                if (err) {
                    res
                        .status(400)
                        .json(err);
                } else {
                    doAddVisit(req, res, employee);
                }
            });
    } else {
        res
            .status(404)
            .json({ "message": "Employee not found" });
    }
};

//specific visit document..
const visitsReadOne = (req, res) => {
    Loc
        .findOne({ name: req.params.employeeName })
        .select('name visits') //query for specific selection
        .exec((err, employee) => {
            if (!location) {
                return res
                    .status(404)
                    .json({
                        "message": "employee not found"
                    });
            } else if (err) {
                return res
                    .status(400)
                    .json(err);
            }
            if (employee.visits && employee.visits.length > 0) {
                const visit = employee.visits.id(req.params.visitid); //get details from URL
                if (!visit) {
                    return res
                        .status(400)
                        .json({
                            "message": "visit not found"
                        });
                } else {
                    response = {
                        employee: {
                            name: employee.name,
                            id: req.params.employeeid
                        },
                        visit

                    };
                    return res
                        .status(200)
                        .json(response);
                }
            } else {
                return res
                    .status(404)
                    .json({
                        "message": "No visits found"
                    });
            }
        }
        );
};
const visitsUpdateOne = (req, res) => {
    if (!req.params.employeeid || !req.params.visitid) {
        return res
            .status(404)
            .json({
                "message": "Not found, employeeid and visitid are both required"
            });
    }
    Emp
        .findById(req.params.employeeid)
        .select('visits')
        .exec((err, employee) => {
            if (!employee) {
                return res
                    .status(404)
                    .json({
                        "message": "Employee not found"
                    });
            } else if (err) {
                return res
                    .status(400)
                    .json(err);
            }
            if (employee.visits && employee.visits.length > 0) {
                const thisVisit = employee.visits.id(req.params.visitid);
                if (!thisVisit) {
                    res
                        .status(404)
                        .json({
                            "message": "Visit not found"
                        });
                } else {
                    thisVisit.locationName = req.body.locationName;
                    thisVisit.coords = req.body.coords;
                    thisVisit.date = req.body.date;
                    thisVisit.status = req.body.status;
                    employee.save((err, employee) => {
                        if (err) {
                            res
                                .status(404)
                                .json(err);
                        } else {
                            res
                                .status(200)
                                .json(thisVisit);
                        }
                    });
                }
            } else {
                res
                    .status(404)
                    .json({
                        "message": "No visit to update"
                    });
            }
        }
        );
};

const visitsDeleteOne = (req, res) => {
    const { employeeid, visitid } = req.params;
    if (!employeeid || !visitid) {
        return res
            .status(404)
            .json({ 'message': 'Not found, employeeid and visitid are both required' });
    }

    Emp
        .findById(employeeid)
        .select('visits')
        .exec((err, employee) => {
            if (!employee) {
                return res
                    .status(404)
                    .json({ 'message': 'Employee not found' });
            } else if (err) {
                return res
                    .status(400)
                    .json(err);
            }

            if (employee.visits && employee.visits.length > 0) {
                if (!employee.visits.id(visitid)) {
                    return res
                        .status(404)
                        .json({ 'message': 'Visit not found' });
                } else {
                    employee.visits.id(visitid).remove();
                    location.save(err => {
                        if (err) {
                            return res
                                .status(404)
                                .json(err);
                        } else {
                            res
                                .status(204)
                                .json(null);
                        }
                    });
                }
            } else {
                res
                    .status(404)
                    .json({ 'message': 'No Visit to delete' });
            }
        });
};

module.exports = {
    visitsReadOne,
    visitsUpdateOne,
    visitsCreate,
    visitsDeleteOne,
    getAllVisitsForEmployee
};