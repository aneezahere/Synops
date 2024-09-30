'use client'

import React, { useState, useEffect } from 'react'
import { Inter, Orbitron } from 'next/font/google'
import Link from 'next/link' // Import Link for navigation
import styles from './page.module.css'

const inter = Inter({ subsets: ['latin'] })
const orbitron = Orbitron({ subsets: ['latin'] })

export default function SynopsLandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

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
    return '' // Default if window is undefined
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
          SYNOPS
        </h1>
        <p className={`${styles.description} ${inter.className}`}>
          Transform Long Texts into Key Insights Instantly!
        </p>
        <p className={`${styles.subtitle} ${inter.className}`}>
          A smart machine learning powered summarizer
        </p>

        {/* Link to Sign In Page */}
        <Link href="/signin">
          <button className={`${styles.button} ${inter.className}`}>
            Get Started 🚀
          </button>
        </Link>
      </div>
    </div>
  )
}
