import Client from "../modules/ClientSchema.js";
import express from "express";
import bcrypt from 'bcrypt';
import auth from "../modules/auth.js";

const router = express.Router();

//register
router.post('/register', async (req, res) => {
    try {
        const username = req.body.username;
        const email = req.body.email
        const organization = req.body.organization;
        const password = req.body.password;

        const isclientexist = await Client.findOne({ username: username });
        const isemailexists = await Client.findOne({ email: email });

        if (isclientexist || isemailexists) {
            return res.status(400).send("User already exists");
        }

        const createClint = new Client({
            username: username,
            email: email,
            organization: organization,
            password: password
        })

        await createClint.save();

        res.status(201).send("client created successfully")

    }
    catch (err) {
        console.log(err)
    }
})

router.post('/login', async (req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;

        //find if user exists
        const user = await Client.findOne({email: email});

        if(!user){
            return res.status(400).send("User does not exist");
        }

        if(user){
            const isMatch = await bcrypt.compare(password, user.password);

            if(isMatch){
                //generate auth token if user is found
                const token = await user.generateAuthToken();
                
                res.cookie("token", token, {
                    expires: new Date(Date.now() + 8600000),
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
                res.status(200).send("User logged in successfully" );
            }else{
                res.status(400).send("Invalid credentials");
            }
        }else{
            res.status(400).send("Invalid credentials");
        }
    }catch(err){
        res.status(400).send(err);
    }
})

//logout
router.get('/logout', async (req, res) => {
    res.clearCookie('token', { path: '/' , httpOnly: true, secure: true, sameSite: "none" });
    res.status(200).send("User logged out successfully");
})

//auth
router.get('/auth', auth, async (req, res) => {

})

export const clientRouter = router;