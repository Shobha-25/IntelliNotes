import express from "express"
import dotenv from "dotenv"
import connectDb from "./utils/connectDb.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.route.js"
import notesRouter from "./routes/generate.route.js"
import pdfRouter from "./routes/pdf.route.js"
import paymentRouter from "./routes/payment.route.js"
dotenv.config()




const app = express()

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://intellinotes-lsjw.onrender.com",
  process.env.CLIENT_URL,
].filter(Boolean)

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;

  try {
    const { hostname } = new URL(origin);
    return hostname.endsWith(".onrender.com");
  } catch {
    return false;
  }
};

app.use(cors({
  origin: (origin, callback) => {
    callback(null, isAllowedOrigin(origin) ? origin : false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
    next()
})

const PORT = process.env.PORT || 5000

app.get("/",(req,res)=>{
  res.json({message:"ExamNotes AI Backend Running 🚀"})
})
app.use("/api/auth" , authRouter)
app.use("/api/user", userRouter)
app.use("/api/notes", notesRouter)
app.use("/api/pdf", pdfRouter)
app.use("/api/payment", paymentRouter)


app.listen (PORT,()=>{
    console.log(`✅ server is running on port ${PORT}`)
    connectDb()
    
})
