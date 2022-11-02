import Client from "../modules/ClientSchema.js";
import express from "express";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

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
                console.log(token)
                res.cookie("token", token, {
                    expires: new Date(Date.now() + 8600000),
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
                res.status(200).send("User logged in successfully" );
            }
            
            else{
                res.status(400).send("Invalid credentials");
            }
        }
        else{
            res.status(400).send("Invalid credentials");
        }
    }
    catch(err){
        res.status(400).send(err);
    }
})

//forgot-password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
        try{
        const olduser = await Client.findOne({ email })

        if(!olduser){
            return res.json({status: "user does not exit"})
        }

        const secret = process.env.SECRET_KEY + olduser.password

        const token = jwt.sign({email: olduser.email, _id: olduser._id}, secret, {
            expiresIn: "10m"
        })

        const link = `http://localhost:4000/api/reset-password/${olduser._id}/${token}`
        
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASS
            }
          });
          
          var mailOptions = {
            from: 'youremail@gmail.com',
            to: olduser.email,
            subject: 'password reset',
            text: link
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

    }catch(err){
        console.log(err)
    }
})

//reset-password
router.get('/reset-password/:id/:token', async (req, res) => {
    const { id, token } = req.params

    const olduser = await Client.findOne({_id: id})

    if(!olduser){
        return res.json({status: "User not extist"})
    }

    const secret = process.env.SECRET_KEY + olduser.password

    try{
        const verfiy = jwt.verify(token, secret)
        
        if (!verfiy){
            res.send("Not verfiy")
        }
        else{

            const result = Math.random().toString(36).substring(2,7);

           const encrypt = await bcrypt.hash(result, 10)
        
            if(verfiy){
                await Client.updateOne({ _id: id },{
                    $set:{
                        password: encrypt
                    }
                })

                res.json({ "NEWPASSWORD": result})
            }
        }

    }catch(err){
        console.log(err)
    }

})

//logout
router.get('/logout', async (req, res) => {
    res.clearCookie('token', { path: '/' , httpOnly: true, secure: true, sameSite: "none" });
    res.status(200).send("User logged out successfully");
})

//auth
router.post('/auth', async (req, res) => {

    const {toemail, subject, text} = req.body;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS
        }
      });
      
      var mailOptions = {
        from: 'youremail@gmail.com',
        to: toemail,
        subject: subject,
        text: text,
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res.send("successfully sended")

})

export const clientRouter = router;