import React from 'react'
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from "axios"
import { serverUrl } from "../config/api";
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { FiBarChart2, FiBookOpen, FiDownload, FiFileText, FiGift } from "react-icons/fi";
import authBg from "../assets/img1.png";
import ThemeToggle from '../components/ThemeToggle';

const features = [
  {
    icon: FiGift,
    title: "200 Free Credits",
    des: "Start with 200 credits to generate notes without paying.",
  },
  {
    icon: FiBookOpen,
    title: "Exam Notes",
    des: "High-yield, revision-ready exam-oriented notes.",
  },
  {
    icon: FiFileText,
    title: "Project Notes",
    des: "Well-structured documentation for assignments and projects.",
  },
  {
    icon: FiBarChart2,
    title: "Charts & Graphs",
    des: "Auto-generated diagrams, charts and flow graphs.",
  },
  {
    icon: FiDownload,
    title: "Free PDF Download",
    des: "Download clean, printable PDFs instantly.",
  },
];

function Auth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider)
      const User = response.user
      const Name = User.displayName
      const Email = User.email
      const result = await axios.post(serverUrl + "/api/auth/google", { Name, Email }, { withCredentials: true })

      dispatch(setUserData(result.data))
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='theme-page relative min-h-screen overflow-hidden px-4 py-5 sm:px-6 sm:py-8'>
      <div
        className='auth-bg-image absolute inset-0 bg-cover bg-center'
        style={{
          backgroundImage: `url(${authBg})`,
        }}
      />
      <div className='auth-bg-wash pointer-events-none absolute inset-0' />
      <div className='auth-bg-sheen pointer-events-none absolute inset-0' />

      <div className='relative z-10 mx-auto max-w-[1680px]'>
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='theme-card mb-10 flex flex-wrap items-start justify-between gap-4 rounded-2xl px-6 py-5 sm:px-8 md:items-center'
        >
          <div>
            <h1 className='theme-brand text-2xl font-extrabold'>
              IntelliNotes
            </h1>
            <p className='theme-muted mt-1 text-sm'>AI-powered exam oriented notes & revision</p>
          </div>
          <ThemeToggle />
        </motion.header>

        <main className='grid min-h-[calc(100vh-170px)] grid-cols-1 items-center gap-8 pb-8 pt-10 lg:grid-cols-[minmax(420px,0.95fr)_minmax(420px,0.9fr)] lg:gap-10 xl:pt-20'>
          <motion.section
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className='theme-card-soft relative overflow-hidden rounded-2xl p-8 sm:p-10 lg:ml-10 lg:p-12 xl:ml-16'
          >
            <div className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent' />
            <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-white/45 via-white/15 to-white/5' />

            <div className='relative z-10 max-w-2xl'>
              <p className='theme-text text-xs font-bold uppercase tracking-[0.28em]'>Focused Glass Workspace</p>
              <h2 className='theme-text mt-6 text-5xl font-black leading-tight tracking-normal drop-shadow-[0_2px_0_rgba(255,255,255,0.35)] lg:text-7xl'>
                Unlock Smart <br /> AI Notes
              </h2>
              <p className='theme-text mt-6 max-w-xl text-base leading-relaxed sm:text-lg'>
                You get <span className="font-bold">200 free credits</span> to create exam notes,
                project notes, charts, graphs and clean PDFs instantly using AI.
              </p>

              <motion.button
                onClick={handleGoogleAuth}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className='auth-google-button mt-9 flex w-full items-center justify-center gap-3 rounded-xl px-8 py-4 text-lg font-semibold shadow-[0_16px_35px_rgba(15,23,42,0.18)] transition sm:w-auto'
              >
                <FcGoogle size={23} />
                Continue with Google
              </motion.button>

              <p className='theme-muted mt-5 text-sm'>
                Start with 200 free credits | Upgrade anytime | Instant access
              </p>
            </div>
          </motion.section>

          <section className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:pr-6 xl:pr-10'>
            {features.map((feature) => (
              <Feature key={feature.title} {...feature} />
            ))}
          </section>
        </main>
      </div>
    </div>
  )
}

function Feature({ icon: Icon, title, des }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className='theme-card-soft theme-text relative min-h-40 overflow-hidden rounded-2xl p-6'
    >
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-white/45 via-white/20 to-white/5' />
      <div className='relative z-10'>
        <div className='mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-teal-200/70 bg-teal-300/55 text-teal-800 shadow-[0_10px_28px_rgba(20,184,166,0.2)]'>
          <Icon size={24} />
        </div>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="theme-muted text-sm leading-relaxed">{des}</p>
      </div>
    </motion.div>
  )
}

export default Auth
