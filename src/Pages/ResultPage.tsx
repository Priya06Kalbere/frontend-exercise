import React from 'react'
import { useNavigate } from 'react-router-dom'

interface ResultPageProps {
  playerName: string
  score: number
  time: number
  status: 'win' | 'lose'
  difficulty: 'easy' | 'medium' | 'hard'
}

const ResultPage: React.FC<ResultPageProps> = ({ playerName, score, time, status, difficulty }) => {
  const navigate = useNavigate()

  const handleRestart = () => {
    navigate('/')
  }

  // --- THEME VARIABLES ---
  const isWin = status === 'win'
  const titleText = isWin ? 'VICTORY ACHIEVED!' : 'GAME OVER!'
  const titleColor = isWin ? 'text-green-400' : 'text-red-400'
  const whiteText = { color: 'rgba(255, 255, 255, 0.9)' }

  // Format time (seconds to M:SS)
  const minutes = Math.floor(time / 60)
  const seconds = String(time % 60).padStart(2, '0')
  const formattedTime = `${minutes}m ${seconds}s`

  // Dynamic secondary message
  const secondaryMessage = isWin ? `You conquered the challenge, ${playerName}!` : `Better luck next time, ${playerName}.`

  return (
    <div className='flex h-screen flex-col items-center justify-center bg-cover p-4' style={{ backgroundColor: 'var(--bg-result)' }}>
      {/* Result Card */}
      <div className='w-full max-w-lg rounded-xl border border-pink-400/20 bg-gray-900/40 p-10 text-center text-white/90 shadow-2xl backdrop-blur-md'>
        {/* Title */}
        <h1 className={`mb-4 text-6xl font-extrabold uppercase tracking-widest ${titleColor} animate-pulse`}>{titleText}</h1>

        {/* Secondary Message */}
        <h2 className='mb-4 text-2xl font-semibold' style={whiteText}>
          {secondaryMessage}
        </h2>

        {/* Stats */}
        <div className='mb-8 text-lg font-medium'>
          <p className='mb-2' style={whiteText}>
            You played the <span className='font-bold uppercase text-pink-400'>{difficulty}</span> level
          </p>

          {isWin ? (
            <p style={whiteText}>
              You found all the pairs in <span className='font-bold text-green-300'>{score}</span> moves and{' '}
              <span className='font-bold text-green-300'>{formattedTime}</span>!
            </p>
          ) : (
            <p style={whiteText}>
              You used <span className='font-bold text-red-300'>{score}</span> moves in{' '}
              <span className='font-bold text-red-300'>{formattedTime}</span>.
              <br />
              Challenge failed.
            </p>
          )}
        </div>

        {/* Play Again Button */}
        <button
          onClick={handleRestart}
          className='focus:outline-none rounded-lg bg-pink-700 px-8 py-3 text-xl font-bold uppercase text-white shadow-lg transition-colors duration-200 hover:bg-pink-800 focus:ring-4 focus:ring-pink-400 focus:ring-opacity-50'>
          Play Again
        </button>
      </div>
    </div>
  )
}

export default ResultPage
