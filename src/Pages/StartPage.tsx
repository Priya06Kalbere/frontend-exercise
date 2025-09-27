import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BoardSize, Difficulty } from '../types'
import backgroundImage from '../../public/assets/LoginBackground.png'

interface StartPageProps {
  onStartGame: (playerName: string, boardSize: BoardSize, difficulty: Difficulty) => void
}

const boardSizes: BoardSize[] = [
  { rows: 2, cols: 2, name: '2x2' },
  { rows: 3, cols: 4, name: '3x4' },
  { rows: 4, cols: 4, name: '4x4' },
  { rows: 4, cols: 5, name: '4x5' }
]

const allDifficulties: Difficulty[] = ['easy', 'medium', 'hard']

const difficultyDesc: Record<Difficulty, string> = {
  easy: 'Beginner-friendly',
  medium: 'Balanced challenge',
  hard: 'High difficulty'
}

// Function to calculate move limit based on board size and difficulty
const getMoveLimit = (difficulty: Difficulty, boardSize: BoardSize) => {
  const totalPairs = (boardSize.rows * boardSize.cols) / 2

  let base: number
  if (boardSize.rows * boardSize.cols <= 8) {
    base = { easy: 5, medium: 4, hard: 3 }[difficulty]
  } else if (boardSize.rows * boardSize.cols <= 16) {
    base = { easy: 6, medium: 5, hard: 4 }[difficulty]
  } else {
    base = { easy: 7, medium: 6, hard: 5 }[difficulty]
  }

  return Math.floor(base * totalPairs)
}

const StartPage: React.FC<StartPageProps> = ({ onStartGame }) => {
  const [inputName, setInputName] = useState('')
  const [selectedSize, setSelectedSize] = useState<BoardSize>(boardSizes[1])
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [nameError, setNameError] = useState(false)
  const navigate = useNavigate()

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputName(value)
    if (nameError && value.trim().length > 0) {
      setNameError(false)
    }
  }

  const handleStart = () => {
    if (!inputName.trim()) {
      setNameError(true)
      return
    }
    setNameError(false)
    onStartGame(inputName.trim(), selectedSize, difficulty)
    navigate('/game')
  }

  return (
    <div className='flex h-screen items-center justify-center bg-cover' style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div
        className='w-full max-w-md rounded-xl border border-pink-400/50 px-8 py-10 shadow-2xl'
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(2px)' }}>
        <h1 className='mb-4 text-center text-5xl font-extrabold tracking-wider text-pink-900'>Memory Game</h1>

        {/* Player Name */}
        <label className='mb-2 block text-base font-bold text-white'>Player Name</label>
        <input
          value={inputName}
          onChange={handleNameChange}
          placeholder='Enter your name'
          className={`focus:outline-none mb-4 w-full rounded-lg border bg-white/80 p-2 text-gray-800 transition-colors focus:border-pink-400 focus:ring-2 focus:ring-pink-400 ${
            nameError ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {nameError && (
          <p role='alert' className='mb-2 text-xs font-medium text-red-800'>
            Name is required
          </p>
        )}

        {/* Board Size */}
        <label className='mb-2 block text-base font-bold text-white'>Board Size</label>
        <select
          value={selectedSize.name}
          onChange={(e) => {
            const size = boardSizes.find((s) => s.name === e.target.value)
            if (size) setSelectedSize(size)
          }}
          className='focus:outline-none mb-6 w-full appearance-none rounded-lg border border-gray-300 bg-white/80 p-2 text-gray-800 transition-colors focus:border-pink-400 focus:ring-2 focus:ring-pink-400'>
          {boardSizes.map((size) => (
            <option key={size.name} value={size.name}>
              {size.name}
            </option>
          ))}
        </select>

        {/* Difficulty */}
        <label className='mb-2 block text-sm font-semibold text-white'>Difficulty</label>
        <div className='relative mb-8 flex gap-3'>
          {allDifficulties.map((d) => {
            const moveLimit = getMoveLimit(d, selectedSize)
            const desc = difficultyDesc[d]
            return (
              <div key={d} className='group relative flex-1'>
                <button
                  type='button'
                  onClick={() => setDifficulty(d as Difficulty)}
                  className={`w-full rounded-lg px-3 py-2 text-sm font-semibold uppercase transition-all duration-200 ${
                    difficulty === d
                      ? 'bg-pink-700 text-white shadow-md'
                      : 'border border-gray-600 bg-gray-800 text-gray-200 hover:border-pink-500 hover:bg-gray-700 hover:text-pink-400'
                  }`}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
                <div className='pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                  <div className='whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white shadow-lg'>
                    {desc} - Moves: {moveLimit}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Start Button */}
        <button
          className='w-full rounded-lg bg-pink-700 py-2 text-lg font-bold uppercase text-white shadow-lg transition-colors duration-200 hover:bg-pink-800'
          data-testid='start-button'
          onClick={handleStart}>
          Start Game
        </button>
      </div>
    </div>
  )
}

export default StartPage
