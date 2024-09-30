'use client'
import React, { useState, useEffect } from 'react'
import { Inter, Orbitron } from 'next/font/google'
import Link from 'next/link'
import styles from './signin.module.css'
import { signIn, signInWithGoogle } from '../lib/auth'  // Import Google sign-in function
import { useRouter } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })
const orbitron = Orbitron({ subsets: ['latin'] })

export default function SignInPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    const { result, error } = await signIn(email, password)
    if (error) {
      setError(error.message)
    } else {
      router.push('/home') // Redirect to home page after successful sign in
    }
  }

  const handleGoogleSignIn = async () => {
    const { result, error } = await signInWithGoogle();  // Google sign-in logic
    if (error) {
      setError(error.message);
    } else {
      router.push('/home');  // Redirect to home page after successful Google sign-in
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
          Sign In
        </h1>
        <form className={styles.form} onSubmit={handleSubmit}>
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
          <button type="submit" className={`${styles.button} ${inter.className}`}>
            Sign In
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.divider}>
          <span className={`${styles.dividerText} ${inter.className}`}>or</span>
        </div>
        <button 
          onClick={handleGoogleSignIn} 
          className={`${styles.googleButton} ${inter.className}`}
        >
          <svg className={styles.googleIcon} viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>
        <p className={`${styles.text} ${inter.className}`}>
          Don't have an account? <Link href="/signup" className={styles.link}>Sign Up</Link>
        </p>
      </div>
    </div>
  )
}
