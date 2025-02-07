import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Interview Alchemist'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/svg+xml'

export default async function Image() {
  return new ImageResponse(
    (
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
        {/* Background */}
        <rect width="1200" height="630" fill="black" />
        {/* Centered icon group */}
        <g transform="translate(600,315)">
          {/* White circular background similar to logo.svg, scaled up */}
          <circle cx="0" cy="0" r="150" fill="white" />
          {/* Scaled icon paths from icon.svg (original viewBox 0 0 24 24, centered at 12,12) */}
          <g
            transform="scale(10) translate(-12, -12)"
            fill="none"
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M15.5 13a3.5 3.5 0 0 0-3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8" />
            <path d="M17.5 16a3.5 3.5 0 0 0 0-7H17" />
            <path d="M19 9.3V6.5a3.5 3.5 0 0 0-7 0M6.5 16a3.5 3.5 0 0 1 0-7H7" />
            <path d="M5 9.3V6.5a3.5 3.5 0 0 1 7 0v10" />
          </g>
        </g>
      </svg>
    ),
    {
      ...size,
    }
  )
}
