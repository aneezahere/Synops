'use client'
import React, { useState, useEffect } from 'react'
import { Inter, Orbitron } from 'next/font/google'
import Link from 'next/link'
import styles from './signup.module.css'
import { signUp } from '../lib/auth'
import { useRouter } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })
const orbitron = Orbitron({ subsets: ['latin'] })

export default function SignUpPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY })
      }
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const calculateRotation = () => {
    if (typeof window !== 'undefined') {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const rotateX = (mousePosition.y - centerY) / 50
      const rotateY = (mousePosition.x - centerX) / 50
      return `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }
    const { result, error } = await signUp(email, password)
    if (error) {
      setError(error.message)
    } else {
      // You might want to save the full name to a user profile here
      router.push('/home') // Redirect to home page after successful sign up
    }
  }

  return (
    <div className={styles.container}>
      <div
        className={`${styles.transparentBox} ${isHovered ? styles.hovered : ''}`}
        style={{ transform: calculateRotation() }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h1 className={`${styles.title} ${orbitron.className}`}>
          Sign Up
        </h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            className={`${styles.input} ${inter.className}`}
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className={`${styles.input} ${inter.className}`}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className={`${styles.input} ${inter.className}`}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className={`${styles.input} ${inter.className}`}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" className={`${styles.button} ${inter.className}`}>
            Sign Up
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        <p className={`${styles.text} ${inter.className}`}>
          Already have an account? <Link href="/signin" className={styles.link}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}