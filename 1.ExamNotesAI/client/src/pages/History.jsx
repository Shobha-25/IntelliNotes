import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../config/api'
import { AnimatePresence, motion } from "motion/react"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { GiHamburgerMenu } from "react-icons/gi"
import FinalResult from '../components/FinalResult'
import ThemeToggle from '../components/ThemeToggle'

function History() {
  const [topics, setTopics] = useState([])
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const credits = userData?.credits || 0
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const myNotes = async () => {
      try {
        const res = await axios.get(serverUrl + "/api/notes/getnotes", { withCredentials: true })
        const notes = Array.isArray(res.data) ? res.data : res.data?.notes
        setTopics(Array.isArray(notes) ? notes : [])
      } catch (error) {
        console.log(error)
        setError("Unable to load your notes. Please try again.")
      }
    }

    myNotes()
  }, [])

  const openNotes = async (noteId) => {
    setLoading(true)
    setActiveNoteId(noteId)
    setSelectedNote(null)
    setError("")

    try {
      const res = await axios.get(serverUrl + `/api/notes/${noteId}`, { withCredentials: true })
      setSelectedNote(res.data?.note?.content || res.data?.content || null)
    } catch (error) {
      console.log(error)
      setError("Unable to open this note. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true)
    }
  }, [])

  return (
    <div className='theme-page relative min-h-screen overflow-hidden px-6 py-8'>
      <div className='theme-ambient pointer-events-none fixed inset-0' />
      <div className='theme-grid pointer-events-none fixed inset-0' />

      <div className='relative z-10 mx-auto max-w-7xl'>
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='theme-card mb-10 flex flex-wrap items-start justify-between gap-4 rounded-2xl px-8 py-6 md:items-center'
        >
          <div onClick={() => navigate("/")} className='cursor-pointer'>
            <h1 className='theme-brand text-2xl font-black'>IntelliNotes</h1>
            <p className='theme-muted mt-1 text-sm'>AI-powered exam-oriented notes & revision</p>
          </div>

          <div className='flex items-center gap-4'>
            <ThemeToggle />
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className='theme-brand text-2xl lg:hidden'>
                <GiHamburgerMenu />
              </button>
            )}

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
          </div>
        </motion.header>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className='theme-card-strong fixed left-0 top-0 z-50 h-full w-72 overflow-y-auto p-5 lg:static lg:z-auto lg:col-span-1 lg:h-[75vh] lg:w-auto lg:rounded-3xl'
              >
                <button onClick={() => setIsSidebarOpen(false)} className='theme-brand mb-4 lg:hidden'>
                  Back
                </button>

                <div className='mb-4 space-y-1'>
                  <button
                    onClick={() => navigate("/notes")}
                    className='theme-chip w-full rounded-lg px-3 py-2 text-start text-sm font-semibold'
                  >
                    + New Notes
                  </button>

                  <hr className="mb-4 border-slate-950/10" />

                  <h2 className='theme-brand mb-4 text-lg font-black'>Your Notes</h2>

                  {topics.length === 0 && (
                    <p className="theme-muted text-sm">
                      {error || "No notes created yet"}
                    </p>
                  )}

                  <ul className='space-y-3'>
                    {topics.map((t, i) => (
                      <li
                        key={i}
                        onClick={() => openNotes(t._id)}
                        className={`cursor-pointer rounded-xl border p-3 transition-all ${
                          activeNoteId === t._id
                            ? "border-sky-300 bg-sky-100/80 shadow-[0_0_0_1px_rgba(14,165,233,0.22)]"
                            : "border-white/70 bg-white/55 hover:bg-white"
                        }`}
                      >
                        <p className='theme-text text-sm font-semibold'>{t.topic}</p>

                        <div className='mt-2 flex flex-wrap gap-2 text-xs'>
                          {t.classLevel && (
                            <span className='rounded-full bg-sky-100 px-2 py-0.5 text-sky-800'>ClassLevel: {t.classLevel}</span>
                          )}
                          {t.examType && (
                            <span className='rounded-full bg-violet-100 px-2 py-0.5 text-violet-800'>{t.examType}</span>
                          )}
                        </div>

                        <div className='theme-muted mt-2 flex gap-3 text-xs'>
                          {t.revisionMode && <span>Revision</span>}
                          {t.includeDiagram && <span>Diagram</span>}
                          {t.includeChart && <span>Chart</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='theme-card-strong min-h-[75vh] rounded-2xl p-6 lg:col-span-3'
          >
            {loading && <p className="theme-muted text-center">Loading notes...</p>}

            {!loading && error && topics.length > 0 && (
              <p className="text-center text-sm text-red-600">{error}</p>
            )}

            {!loading && !selectedNote && (
              <div className="theme-muted flex h-full items-center justify-center">
                Select a topic from the sidebar
              </div>
            )}

            {!loading && selectedNote && <FinalResult result={selectedNote} />}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default History
