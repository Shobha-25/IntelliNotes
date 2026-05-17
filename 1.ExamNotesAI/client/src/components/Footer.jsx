import React from 'react'
import { motion } from "motion/react"
import logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../config/api'
import { setUserData } from '../redux/userSlice'

function Footer() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSignOut = async () => {
    try {
      await axios.post(serverUrl + "/api/auth/logout", {}, { withCredentials: true })
      dispatch(setUserData(null))
      navigate("/auth")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className='theme-card z-10 mx-6 mb-6 mt-24 rounded-2xl px-8 py-8'
    >
      <div className='grid grid-cols-1 items-start gap-8 md:grid-cols-3'>
        <motion.div
          whileHover={{ rotateX: 4, rotateY: -4 }}
          className="flex transform-gpu flex-col gap-4"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="flex cursor-pointer items-center gap-3" style={{ transform: "translateZ(20px)" }}>
            <img src={logo} alt="logo" className='h-9 w-9 object-contain' />
            <span
              className="theme-brand text-lg font-black"
            >
              IntelliNotes
            </span>
          </div>
          <p className="theme-muted max-w-sm text-sm">
            IntelliNotes helps students generate exam-focused notes, revision material, diagrams, and printable PDFs using AI.
          </p>
        </motion.div>

        <div className='text-center'>
          <h1 className='theme-text mb-4 text-sm font-semibold'>Quick Links</h1>
          <ul className='space-y-2 text-sm'>
            <li onClick={() => navigate("/notes")} className='theme-muted cursor-pointer transition-colors hover:opacity-80'>Notes</li>
            <li onClick={() => navigate("/history")} className='theme-muted cursor-pointer transition-colors hover:opacity-80'>History</li>
            <li onClick={() => navigate("/pricing")} className='theme-muted cursor-pointer transition-colors hover:opacity-80'>Add Credits</li>
          </ul>
        </div>

        <div className='text-center'>
          <h1 className='theme-text mb-4 text-sm font-semibold'>Support & Account</h1>
          <ul className='space-y-2 text-sm'>
            <li onClick={() => navigate("/auth")} className='theme-muted cursor-pointer transition-colors hover:opacity-80'>Sign In</li>
            <li onClick={handleSignOut} className='cursor-pointer text-red-600 transition-colors hover:text-red-700'>Sign Out</li>
            <li className='theme-muted transition-colors hover:opacity-80'>support@intellinotes.com</li>
          </ul>
        </div>
      </div>

      <div className="my-6 h-px bg-current opacity-10" />
      <p className='theme-soft text-center text-xs'>
        © {new Date().getFullYear()} IntelliNotes. All rights reserved.
      </p>
    </motion.div>
  )
}

export default Footer
