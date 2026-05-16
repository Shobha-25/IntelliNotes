import React, { useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import TopicForm from '../components/TopicForm'
import FinalResult from '../components/FinalResult'
import Sidebar from '../components/Sidebar'
import ThemeToggle from '../components/ThemeToggle'

function Notes() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const credits = userData?.credits || 0
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  return (
    <div className='theme-page relative min-h-screen overflow-hidden px-6 py-8'>
      <div className='theme-ambient pointer-events-none fixed inset-0' />
      <div className='theme-grid pointer-events-none fixed inset-0' />

      <div className='relative z-10 mx-auto max-w-7xl'>
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='theme-card no-print mb-10 flex flex-col items-start justify-between gap-4 rounded-2xl px-8 py-6 md:flex-row md:items-center'
        >
          <div onClick={() => navigate("/")} className='cursor-pointer'>
            <h1 className='theme-brand text-2xl font-black'>
              IntelliNotes
            </h1>
            <p className='theme-muted mt-1 text-sm'>AI-powered exam-oriented notes & revision</p>
          </div>

          <div className='flex flex-wrap items-center gap-4'>
            <ThemeToggle />
            <button
              className='theme-chip flex items-center gap-2 px-4 py-2 text-sm'
              onClick={() => navigate("/pricing")}
            >
              <span className='theme-accent text-xs font-semibold uppercase tracking-[0.18em]'>Credits</span>
              <span>{credits}</span>
              <motion.span
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.97 }}
                className='ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-300 text-xs font-bold text-slate-950'
              >
                +
              </motion.span>
            </button>

            <button
              onClick={() => navigate("/history")}
              className='theme-chip px-4 py-3 text-sm font-semibold'
            >
              Your Notes
            </button>
          </div>
        </motion.header>

        <motion.div className='no-print mx-auto mb-12 max-w-3xl'>
          <TopicForm
            loading={loading}
            setResult={setResult}
            setLoading={setLoading}
            setError={setError}
            error={error}
          />
        </motion.div>

        {loading && (
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className='theme-accent no-print mb-6 text-center font-medium'
          >
            Generating exam-focused notes...
          </motion.div>
        )}

        {!result && (
          <motion.div
            whileHover={{ scale: 1.01 }}
            className='theme-card-soft no-print flex h-64 flex-col items-center justify-center rounded-2xl border-dashed'
          >
            <span className='theme-accent mb-3 text-xs font-semibold uppercase tracking-[0.2em]'>Preview</span>
            <p className='theme-muted text-sm'>Generated notes will appear here</p>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='grid grid-cols-1 gap-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-start'
          >
            <div className='no-print lg:sticky lg:top-6'>
              <Sidebar result={result} />
            </div>

            <div className='print-notes-area rounded-2xl border border-white/70 bg-white/90 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.14)] backdrop-blur-2xl'>
              <FinalResult result={result} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Notes
