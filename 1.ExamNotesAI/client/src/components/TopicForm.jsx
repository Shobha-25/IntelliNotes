import { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { generateNotes } from '../services/api';
import { useDispatch } from 'react-redux';
import { updateCredits } from '../redux/userSlice';

const fieldClass = `theme-input w-full rounded-xl px-4 py-3
  shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition
  focus:ring-2 focus:ring-sky-300/25`;

function TopicForm({ setResult, setLoading, loading, setError, error }) {
  const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [examType, setExamType] = useState("");
  const [revisionMode, setRevisionMode] = useState(false);
  const [includeDiagram, setIncludeDiagram] = useState(false);
  const [includeChart, setIncludeChart] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const dispatch = useDispatch()

  const handleSubmit = async () => {
    if (!topic.trim()) {
      setError("Please enter the topic")
      return;
    }

    setError("")
    setLoading(true)
    setResult(null)

    try {
      const result = await generateNotes({
        topic,
        classLevel,
        examType,
        revisionMode,
        includeDiagram,
        includeChart
      })

      setResult(result.data)
      setClassLevel("")
      setTopic("")
      setExamType("")
      setIncludeChart(false)
      setRevisionMode(false)
      setIncludeDiagram(false)

      if (typeof result.creditsLeft === "number") {
        dispatch(updateCredits(result.creditsLeft));
      }
    } catch (error) {
      console.log(error)
      setError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch notes from server"
      );
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      setProgressText("")
      return;
    }

    let value = 0;

    const interval = setInterval(() => {
      value += Math.random() * 8

      if (value >= 95) {
        value = 95;
        setProgressText("Almost done...");
        clearInterval(interval);
      } else if (value > 70) {
        setProgressText("Finalizing notes...");
      } else if (value > 40) {
        setProgressText("Processing content...");
      } else {
        setProgressText("Generating notes...");
      }

      setProgress(Math.floor(value))
    }, 700)

    return () => clearInterval(interval);
  }, [loading])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='theme-card-soft theme-text relative overflow-hidden rounded-2xl p-8'
    >
      <div className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent' />
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-white/55 via-white/20 to-white/5' />

      <div className='relative z-10 space-y-6'>
        <div>
          <p className='theme-accent text-xs font-bold uppercase tracking-[0.22em]'>Focused Generator</p>
          <h2 className='theme-text mt-2 text-2xl font-black'>Create exam-ready notes</h2>
        </div>

        <input
          type="text"
          className={fieldClass}
          placeholder='Enter topic (e.g. Web Development)'
          onChange={(e) => setTopic(e.target.value)}
          value={topic}
        />

        <input
          type="text"
          className={fieldClass}
          placeholder='Class / Level (e.g. Class 10)'
          onChange={(e) => setClassLevel(e.target.value)}
          value={classLevel}
        />

        <input
          type="text"
          className={fieldClass}
          placeholder='Exam Type (e.g. CBSE, JEE, NEET)'
          onChange={(e) => setExamType(e.target.value)}
          value={examType}
        />

        <div className='grid gap-4 md:grid-cols-3'>
          <Toggle
            label="Exam Revision"
            checked={revisionMode}
            onChange={() => setRevisionMode(!revisionMode)}
          />
          <Toggle
            label="Diagram"
            checked={includeDiagram}
            onChange={() => setIncludeDiagram(!includeDiagram)}
          />
          <Toggle
            label="Charts"
            checked={includeChart}
            onChange={() => setIncludeChart(!includeChart)}
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <motion.button
          onClick={() => handleSubmit()}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.96 } : {}}
          disabled={loading}
          className={`flex w-full items-center justify-center gap-3 rounded-xl py-3 font-semibold transition
            ${loading
              ? "cursor-not-allowed border border-slate-200 bg-slate-200/80 text-slate-500"
              : "theme-primary-button border border-white/20 shadow-[0_16px_35px_rgba(15,23,42,0.18)]"
            }`}
        >
          {loading ? "Generating Notes..." : "Generate Notes"}
        </motion.button>

        {loading && (
          <div className='mt-4 space-y-2'>
            <div className='h-2 w-full overflow-hidden rounded-full bg-slate-200'>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.6 }}
                className='h-full bg-gradient-to-r from-teal-300 via-sky-400 to-violet-400 shadow-[0_0_24px_rgba(56,189,248,0.45)]'
              />
            </div>

            <div className='theme-muted flex justify-between text-xs'>
              <span>{progressText}</span>
              <span>{progress}%</span>
            </div>
            <p className='theme-soft text-center text-xs'>
              This may take up to 2-5 minutes. Please do not close or refresh the page.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <button
      type='button'
      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition ${
        checked
          ? "border-teal-300/70 bg-teal-300/20 theme-text"
          : "theme-chip"
      }`}
      onClick={onChange}
    >
      <span className='text-sm font-medium'>{label}</span>
      <motion.span
        animate={{
          backgroundColor: checked ? "rgba(45,212,191,0.9)" : "rgba(148,163,184,0.28)"
        }}
        transition={{ duration: 0.25 }}
        className='relative h-6 w-11 shrink-0 rounded-full border border-white/70'
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className='absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_5px_15px_rgba(15,23,42,0.22)]'
          style={{
            left: checked ? "1.25rem" : "0.125rem",
          }}
        />
      </motion.span>
    </button>
  )
}

export default TopicForm
