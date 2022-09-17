import Client from "./ClientSchema.js";
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    try{
        const token = req.cookies.token;

        if(!token){
            return res.status(401).send("No token found");
        }else{
            const decode = jwt.verify(token, process.env.SECRET_KEY)
            const root = await Client.findOne({_id: decode._id, "tokens.token" : token })

            if(!root){
                return res.status(401).send("Invalid token");
            }
            else{
                return res.status(200).send("Token verified");
            }
        }
        next();
    }
    catch(err){
        res.status(401).send(err);
        console.log(err);
    }
}

export default auth;