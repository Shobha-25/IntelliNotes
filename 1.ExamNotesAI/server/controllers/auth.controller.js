import UserModel from "../models/user.model.js"
import { getToken } from "../utils/token.js"
import { applyCreditGrant } from "../utils/credits.js"

const isProduction = process.env.NODE_ENV === "production";


export const googleAuth = async (req,res) => {
    try {

        const {Name: name , Email: email} = req.body
        let user = await UserModel.findOne({email: email})
        if(!user){
            user = await UserModel.create({
                name,email
            })
        } else {
            user = await applyCreditGrant(user)
        }
        let token = await getToken(user._id)
        console.log("TOKEN IS:", token)
        res.cookie("token" , token , {
            httpOnly:true,
            secure:isProduction,
            sameSite:isProduction ? "none" : "lax",
            maxAge:7 * 24 * 60 * 60 * 1000

        })
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`googleSignup Error  ${error}`})
    }
    
}

export const logOut = async (req,res) => {
    try {
        res.clearCookie("token", {
            httpOnly:true,
            secure:isProduction,
            sameSite:isProduction ? "none" : "lax",
        })
        return res.status(200).json({message:"User logged out successfully"})
    } catch (error) {
        return res.status(500).json({message:"Error occurred while logging out ${error}"})
    }
}


/*export const logOut = async (req,res) => {
    try{
       res.clearCookie("token", {
  httpOnly: true,
  sameSite: "lax",
  secure: false
})
        return res.status(200).json({message:"User logged out successfully"})

    } catch (error) {
        return res.status(500).json({message:"Error occurred while logging out ${error}"})
    }
}
*/
