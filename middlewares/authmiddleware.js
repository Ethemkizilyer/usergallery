import jwt from "jsonwebtoken"
import User from "../models/userModel.js"


const checkUser=async (req,res,next)=>{
    const token = req.cookies.jsonwebtoken 

    if(token){
        jwt.verify(token,process.env.JWT_SECRET, async (err,decodedToken)=>{
            if(err){
                console.log(err.message)
                res.locals.user=null  // o anki giriş yaan kullanıcı için null diyoruz
                next() 
            } else {
                const user =await User.findById(decodedToken.userId)
                res.locals.user = user
                next() 
            }
               
            
        })
    } else {
        res.locals.user=null
        next() 
    }
}

const authenticateToken=async (req,res,next)=>{
    try {
        // const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1]
        const token = req.cookies.jsonwebtoken

        if(token) {
            jwt.verify(token,process.env.JWT_SECRET,(err)=>{
                if(err){
                    console.log(err.message)
                    res.redirect("/login")
                } else {
                   next() 
                }
            })
        } else{
            res.redirect("/login")
        }
    } catch (error) {
       res.status(401).json({
        succeded:false,
        error:"Not authorized"
       }) 
    }
    
}

export {authenticateToken,checkUser}