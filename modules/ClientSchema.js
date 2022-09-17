import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const ClientSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    organization: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isFreelancer: {
        type: Boolean,
        default: false,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
})


//password hashing
ClientSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

//generate auth token 
ClientSchema.methods.generateAuthToken = async function () {
    try{
        const generatedToken = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: generatedToken });
        await this.save();
        return generatedToken;
    }catch(err){
        console.log(err);
    }
}

const Client = mongoose.model("Client", ClientSchema);

export default Client;