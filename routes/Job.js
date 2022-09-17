import express from 'express';
import Job from "../modules/JobSchema.js";

const router = express.Router()

//add employee
router.post('/addwork', async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const propic = req.body.propic;
        const phone = req.body.phone;
        const work = req.body.work;

        if (!name || !email || !phone || !work) {
            return res.status(400).send("Please enter all fields");
        }

        const empexist = await Job.findOne({ email: email });

        if (empexist) {
            return res.status(400).send("Job already exists");
        }

        const addJob = new Job({
            name: name,
            email: email,
            propic: propic,
            phone: phone,
            work: work
        });

        await addJob.save();

        res.status(201).send("employee added successfully");

    } catch (err) {
        console.log(err);
    }
})

//get all employees
router.get('/getwork', async (req, res) => {

    try {
        if (req.query.new) {
            const reqquery = await Job.find().sort({ _id: -1 }).limit(5)
            res.status(200).send(reqquery)
        }
        const employees = await Job.find();
        res.status(200).send(employees);
    }
    catch (err) {
        console.log(err);
    }
}
)

//get employee by id
router.get('/getonejob/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const employee = await Job.findById(id);
        res.status(200).send(employee);
    }
    catch (err) {
        console.log(err);
    }
}
)

//update employee
router.put('/updatejob/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const employee = await Job.findByIdAndUpdate(id);
        employee.empname = req.body.empname;
        employee.empemail = req.body.empemail;
        employee.profilepic = req.body.profilepic;
        employee.empphone = req.body.empphone;
        employee.empwork = req.body.empwork;

        await employee.save();
        res.status(200).send("employee updated successfully");
    }
    catch (err) {
        console.log(err);
    }
}
)

//delete employee
router.delete('/deleteemployee/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const employee = await Job.findByIdAndRemove(id);
        await employee.remove();
        res.status(200).send("employee deleted successfully");
    }
    catch (err) {
        console.log(err);
    }
}
)




export const jobRouter = router;