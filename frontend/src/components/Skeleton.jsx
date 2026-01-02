import React from 'react'
import '../styles/Skeleton.css'

export default function TextSkeleton({ lines = 3, width = '100%' }) {
  return (
    <div className="skeleton-container" style={{ width }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton skeleton-line"
          style={{
            width: i === lines - 1 ? '80%' : '100%',
          }}
        />
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-header" />
      <div className="skeleton-content">
        <TextSkeleton lines={4} />
      </div>
      <div className="skeleton skeleton-button" />
    </div>
  )
}

export function AudioRecorderSkeleton() {
  return (
    <div className="skeleton-recorder">
      <div className="skeleton skeleton-recorder-display" />
      <div className="skeleton skeleton-recorder-button" />
    </div>
  )
}
