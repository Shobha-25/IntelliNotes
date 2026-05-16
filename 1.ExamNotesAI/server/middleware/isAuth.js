import jwt from "jsonwebtoken"

const isAuth = async (req,res,next) => {
    try {
        let token = req.cookies.token
        if(!token) {
            return res.status(401).json({message:"Please sign in to continue"})
        }
        let verifyToken = jwt.verify(token , process.env.JWT_SECRET)
        if(!verifyToken){
            return res.status(401).json({message:"Please sign in again"})
        }
        req.userId = verifyToken.userId
        next()

    } catch (error) {
        return res.status(401).json({message:"Please sign in again"})

    }

}
export default isAuth
