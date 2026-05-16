import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { motion } from "motion/react"
import heroImage from "../assets/img1.png"
import Footer from '../components/Footer'
import { FiBarChart2, FiBookOpen, FiDownload, FiFileText } from "react-icons/fi";

const features = [
  {
    icon: FiBookOpen,
    title: "Exam Notes",
    des: "High-yield exam-oriented notes with revision points.",
  },
  {
    icon: FiFileText,
    title: "Project Notes",
    des: "Well-structured content for assignments and projects.",
  },
  {
    icon: FiBarChart2,
    title: "Diagrams",
    des: "Auto-generated visual diagrams for clarity.",
  },
  {
    icon: FiDownload,
    title: "PDF Download",
    des: "Download clean, printable PDFs instantly.",
  },
];

function Home() {
  const navigate = useNavigate()
  const [heroSrc, setHeroSrc] = useState("/img2.png")

  return (
    <div className="theme-page relative min-h-screen overflow-hidden">
      <div className='theme-ambient fixed inset-0' />
      <div className='theme-grid fixed inset-0' />

      <div className='relative z-10'>
        <Navbar />

        <section className='mx-auto grid min-h-[calc(100vh-120px)] max-w-7xl grid-cols-1 items-stretch gap-10 px-6 pb-12 pt-16 lg:grid-cols-[minmax(420px,0.86fr)_minmax(460px,1.05fr)] lg:gap-12 lg:pt-20'>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className='relative flex h-full min-h-[620px] items-center overflow-hidden px-2 py-8 sm:px-4 lg:px-0'
          >
            <div className='relative z-10 max-w-2xl'>
              <p className='theme-text text-xs font-bold uppercase tracking-[0.28em]'>AI Study Dashboard</p>
              <h1 className='theme-text mt-6 text-5xl font-black leading-tight tracking-normal lg:text-7xl'>
                Create Smart <br /> AI Notes in Seconds
              </h1>
              <p className='theme-muted mt-6 max-w-xl text-base leading-relaxed sm:text-lg'>
                Generate exam-focused notes, project documentation, flow diagrams and revision-ready content using AI.
              </p>

              <motion.button
                onClick={() => navigate("/notes")}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className='theme-primary-button mt-9 flex w-full items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold shadow-[0_16px_35px_rgba(15,23,42,0.18)] transition sm:w-auto'
              >
                Get Started
              </motion.button>

              <p className='theme-muted mt-5 text-sm'>
                Notes | Diagrams | Charts | Printable PDFs
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className='relative flex h-full min-h-[620px]'
          >
            <motion.div
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className='relative flex h-full w-full items-center overflow-hidden'
            >
              <img
                src={heroSrc}
                onError={() => setHeroSrc(heroImage)}
                alt="Students using AI study tools"
                className='relative z-10 mx-auto max-h-[calc(100%-2rem)] w-full max-w-[820px] object-contain drop-shadow-[0_24px_45px_rgba(15,23,42,0.16)]'
              />
            </motion.div>
          </motion.div>
        </section>

        <section className='mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-4'>
          {features.map((feature) => (
            <Feature key={`bottom-${feature.title}`} {...feature} compact />
          ))}
        </section>

        <Footer />
      </div>
    </div>
  )
}

function Feature({ icon: Icon, title, des, compact }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className={`theme-card-soft theme-text relative overflow-hidden rounded-2xl ${compact ? "min-h-44 p-5" : "min-h-48 p-6"}`}
    >
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-white/55 via-white/20 to-white/5' />
      <div className='relative z-10'>
        <div className='mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-teal-200/70 bg-teal-300/55 text-teal-800 shadow-[0_10px_28px_rgba(20,184,166,0.18)]'>
          <Icon size={24} />
        </div>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="theme-muted text-sm leading-relaxed">{des}</p>
      </div>
    </motion.div>
  )
}

export default Home
