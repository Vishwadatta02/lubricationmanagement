const mongoose = require('mongoose');
const employeeSchema = require('../models/employees');
const Emp = mongoose.model('Employee',employeeSchema, 'employees'); 

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Emp.find().select('-password -visits');
        const siteEngineerEmployees = employees.filter(employee => employee.designation === "site engineer");
        return res.status(200).json(siteEngineerEmployees);
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ error: 'An error occurred.' });
    }
};

const employeeCreate = (req, res) => {

    Emp.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        designation: req.body.designation,
    }, (err, employee) => {
        if (err) {            
            res
                .status(400)
                .json(err);
        } else {
            
            res
                .status(201)
                .json(employee);
        }
    });
};


const employeeReadOne = (req, res) => {
    const query = {
        username: req.params.employeeName,
        password: req.params.employeePassword
    };
    Emp
        .findOne(query)
        .exec((err, employee) => {
            if (!employee) {
                return res
                    .status(404)
                    .json({ "message": "employee not found or incorrect password" });
            }
            else if (err) {
                return res
                    .status(404)
                    .json(err);
            }
            res
              .status(200)
              .json(employee);
        });
};


const employeeUpdateOne = (req, res) => {
    if (!req.params.employeeName) {
        return res
            .status(404)
            .json({
                "message": "Not found, employeeid is required"
            });
    }
    Emp
        .findOne(req.params.employeeName)
        .select('-visits -password')
        .exec((err, employee) => {
            if (!employee) {
                return res
                    .status(404)
                    .json({
                        "message": "employeeid not found"
                    });
            } else if (err) {
                return res
                    .status(400)
                    .json(err);
            }
            employee.name = req.body.name;
            employee.address = req.body.address;
            employee.email = req.body.email;
            employee.save((err, loc) => {
                if (err) {
                    res
                        .status(404)
                        .json(err);
                } else {
                    res
                        .status(200)
                        .json(loc);
                }
            });
        }
        );
};

const employeeDeleteOne = (req, res) => {
    const employeeName  = req.params.employeeName;
    if (employeeName) {
        Emp
            .findOneAndRemove(employeeName)
            .exec((err, employee) => {
                if (err) {
                    return res
                        .status(404)
                        .json(err);
                }
                res
                    .status(204)
                    .json(null);
            }
            );
    } else {
        res
            .status(404)
            .json({
                "message": "No employee"
            });
    }
};

module.exports = {
    employeeCreate,
    employeeReadOne,
    employeeUpdateOne,
    employeeDeleteOne,
    getAllEmployees
};