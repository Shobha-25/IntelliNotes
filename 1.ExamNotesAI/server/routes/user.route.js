import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getCurrentUser } from "../controllers/user.controller.js"

const userRouter = express.Router()

userRouter.get("/currentuser", isAuth, getCurrentUser)

export default userRouter



/*import express from "express"
import { googleAuth,logOut } from "../controllers/auth.controller.js"
import { getCurrentUser } from "../../client/src/services/api.js"


const userRouter = express.Router()


userRouter.get("/currentuser",isAuth,getCurrentUser)

export default userRouter*/