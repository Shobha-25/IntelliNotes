import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react"
import axios from 'axios'
import { serverUrl } from '../App'
import ThemeToggle from '../components/ThemeToggle'
import { useDispatch } from 'react-redux'
import { updateCredits } from '../redux/userSlice'

function Pricing() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [selectedPrice, setSelectedPrice] = useState(null)
  const [paying, setPaying] = useState(false)
  const [payingAmount, setPayingAmount] = useState(null)

  const handlePaying = async (plan) => {
    try {
      setPayingAmount(plan.amount)
      setPaying(true)
      const result = await axios.post(
        serverUrl + "/api/payment/order",
        {
          planId: plan.id,
          amount: plan.amount,
          credits: plan.credits,
        },
        { withCredentials: true }
      )

      if (!window.Razorpay) {
        throw new Error("Razorpay checkout script is not loaded")
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: result.data.currency,
        name: "IntelliNotes",
        description: `${plan.credits} credits`,
        order_id: result.data.id,
        handler: async (response) => {
          const verifyResult = await axios.post(
            serverUrl + "/api/payment/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            { withCredentials: true }
          )

          if (typeof verifyResult.data?.user?.credits === "number") {
            dispatch(updateCredits(verifyResult.data.user.credits))
          }

          navigate("/")
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
        theme: {
          color: "#0f766e",
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.log(error)
      setPaying(false)
    }
  }

  return (
    <div className='theme-page relative min-h-screen overflow-hidden px-6 py-10'>
      <div className='theme-ambient pointer-events-none fixed inset-0' />
      <div className='theme-grid pointer-events-none fixed inset-0' />

      <div className='relative z-10 mx-auto max-w-7xl'>
        <div className='mb-6 flex items-center justify-between gap-4'>
          <button
            onClick={() => navigate("/")}
            className='theme-chip flex items-center gap-2 px-4 py-2 text-sm font-semibold'
          >
            Back
          </button>
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="theme-card mx-auto mb-10 max-w-3xl rounded-2xl px-8 py-8 text-center"
        >
          <h1 className="theme-brand text-3xl font-black">Buy Credits</h1>
          <p className="theme-muted mt-2">
            Choose a plan that fits your study needs
          </p>
        </motion.div>

        <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3'>
          <PricingCard
            title="Starter"
            price="Rs. 100"
            amount={100}
            credits={100}
            planId="starter"
            description="Perfect for quick revisions"
            features={[
              "Generate AI notes",
              "Exam-focused answers",
              "Diagram and charts support",
              "Fast generation",
            ]}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            onBuy={handlePaying}
            paying={paying}
            payingAmount={payingAmount}
          />

          <PricingCard
            popular
            title="Popular"
            price="Rs. 200"
            amount={200}
            credits={250}
            planId="popular"
            description="Best value for students"
            features={[
              "All Starter features",
              "More credits per rupee",
              "Revision mode access",
              "Priority AI response",
            ]}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            onBuy={handlePaying}
            paying={paying}
            payingAmount={payingAmount}
          />

          <PricingCard
            title="Pro Learner"
            price="Rs. 500"
            amount={500}
            credits={700}
            planId="pro"
            description="For serious exam preparation"
            features={[
              "Maximum credit value",
              "Unlimited revisions",
              "Charts and diagrams",
              "Ideal for full syllabus",
            ]}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            onBuy={handlePaying}
            paying={paying}
            payingAmount={payingAmount}
          />
        </div>
      </div>
    </div>
  )
}

function PricingCard({
  title,
  price,
  amount,
  credits,
  planId,
  description,
  features,
  popular,
  selectedPrice,
  setSelectedPrice,
  onBuy,
  paying,
  payingAmount,
}) {
  const isSelected = selectedPrice === amount
  const isPayingThisCard = paying && payingAmount === amount

  return (
    <motion.div
      onClick={() => setSelectedPrice(amount)}
      whileHover={{ y: -6, scale: 1.01 }}
      className={`theme-card-soft relative cursor-pointer overflow-hidden rounded-2xl p-6 transition ${
        isSelected
          ? "border-sky-300 ring-2 ring-sky-300/35"
          : popular
            ? "border-violet-300"
            : "border-white/70"
      }`}
    >
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-white/55 via-white/20 to-white/5' />

      <div className='relative z-10'>
        {popular && !isSelected && (
          <span className='absolute right-0 top-0 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white'>
            Popular
          </span>
        )}

        {isSelected && (
          <span className='absolute right-0 top-0 rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white'>
            Selected
          </span>
        )}

        <h2 className='theme-text text-xl font-black'>{title}</h2>
        <p className='theme-muted mt-1 text-sm'>{description}</p>

        <div className='mt-5'>
          <p className="theme-brand text-4xl font-black">{price}</p>
          <p className="mt-1 text-sm font-semibold text-teal-700">{credits} Credits</p>
        </div>

        <button
          disabled={isPayingThisCard}
          onClick={(e) => {
            e.stopPropagation()
            onBuy({ id: planId, amount, credits })
          }}
          className={`mt-6 w-full rounded-xl py-3 font-semibold transition ${
            isPayingThisCard
              ? "cursor-not-allowed bg-slate-200 text-slate-500"
              : isSelected
                ? "theme-primary-button"
                : "bg-sky-700 text-white hover:bg-sky-800"
          }`}
        >
          {isPayingThisCard ? "Redirecting..." : "Buy Now"}
        </button>

        <ul className='theme-muted mt-5 space-y-2 text-sm'>
          {features.map((feature, index) => (
            <li key={index} className="flex gap-2">
              <span className="font-bold text-teal-700">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export default Pricing
