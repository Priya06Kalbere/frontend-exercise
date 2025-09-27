import React, { useEffect, useState } from 'react'
import growyLogo from '../../public/assets/growy_logo.svg'
import Tile from '../Component/Tile'
import { useNavigate } from 'react-router-dom'

interface GamePageProps {
  playerName: string
  onEndGame: (finalScore: number, time: number, status: 'win' | 'lose') => void
  boardSize: { rows: number; cols: number }
  difficulty: 'easy' | 'medium' | 'hard'
}

interface TileType {
  id: number
  imageUrl: string
}

// Images
const tileImages: string[] = Array.from(
  { length: 17 },
  (_, i) =>
    // Accessing assets in the public folder starts from the root '/'
    `/assets/plant${String(i + 1).padStart(2, '0')}.jpg`
)

// Shuffle tiles
const createShuffledTiles = (rows: number, cols: number): TileType[] => {
  const totalTiles = rows * cols
  const totalPairs = totalTiles / 2
  const selectedImages = tileImages.slice(0, totalPairs)

  return [...selectedImages, ...selectedImages].sort(() => Math.random() - 0.5).map((url, index) => ({ id: index, imageUrl: url }))
}

// Grid Tailwind classes
const gridClassMap: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6'
}

const GamePage: React.FC<GamePageProps> = ({ playerName, onEndGame, boardSize, difficulty }) => {
  const navigate = useNavigate()
  const [tiles, setTiles] = useState<TileType[]>([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [matchedIndices, setMatchedIndices] = useState<number[]>([])
  const [moves, setMoves] = useState<number>(0)
  const [timer, setTimer] = useState<number>(0)
  const [isGameActive, setIsGameActive] = useState<boolean>(true)

  // Dynamic Move Limit Calculation
  const totalTiles = boardSize.rows * boardSize.cols
  const totalPairs = totalTiles / 2

  const baseMoves: Record<'easy' | 'medium' | 'hard', number> = {
    easy: 5,
    medium: 4,
    hard: 3
  }

  const moveLimit = Math.floor(baseMoves[difficulty] * totalPairs)

  // Initialize board
  useEffect(() => {
    setTiles(createShuffledTiles(boardSize.rows, boardSize.cols))
    setMoves(0)
    setTimer(0)
    setMatchedIndices([])
    setIsGameActive(true)
  }, [boardSize])

  // Timer
  useEffect(() => {
    if (!isGameActive) return

    const interval = setInterval(() => setTimer((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [isGameActive])

  // Check win
  useEffect(() => {
    if (tiles.length > 0 && matchedIndices.length === tiles.length) {
      setIsGameActive(false)
      onEndGame(moves, timer, 'win')
      navigate('/end')
    }
    // Added tiles to deps to satisfy ESLint
  }, [matchedIndices, moves, timer, onEndGame, navigate, tiles.length])

  // Check lose
  useEffect(() => {
    if (moves >= moveLimit && isGameActive) {
      setIsGameActive(false)
      onEndGame(moves, timer, 'lose')
      navigate('/end')
    }
  }, [moves, moveLimit, isGameActive, timer, onEndGame, navigate])

  // Handle Tile Click
  const handleTileClick = (index: number) => {
    // Prevent clicking if tile is already flipped/matched or two tiles are already flipped
    if (flippedIndices.includes(index) || matchedIndices.includes(index) || flippedIndices.length === 2) return

    setMoves((m) => m + 1)

    const newFlipped = [...flippedIndices, index]
    setFlippedIndices(newFlipped)

    if (newFlipped.length === 2) {
      const [firstIndex, secondIndex] = newFlipped
      // Check for match
      if (tiles[firstIndex].imageUrl === tiles[secondIndex].imageUrl) {
        setMatchedIndices((prev) => [...prev, firstIndex, secondIndex])
        setFlippedIndices([])
      } else {
        // No match, flip back after a delay
        setTimeout(() => setFlippedIndices([]), 500)
      }
    }
  }

  // Determine grid layout class
  const gridClass = `grid ${gridClassMap[boardSize.cols] || 'grid-cols-4'} gap-4 p-4`

  // Format difficulty name for display
  const formattedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
  // Determine move count color (red when close to limit)
  const movesColor = moves >= moveLimit * 0.8 ? 'text-red-400' : 'text-pink-400'

  return (
    <div className='flex min-h-screen flex-col items-center font-sans text-gray-100' style={{ backgroundColor: 'var(--bg-game)' }}>
      {/* Header */}
      <div className='w-full py-6 text-center'>
        <h2 className='mb-2 text-3xl font-bold'>
          Player: <span className='text-pink-400'>{playerName}</span>
        </h2>

        <p className='text-xl'>
          Difficulty: <span className='font-semibold text-pink-400'>{formattedDifficulty}</span>
        </p>

        <div className='mt-3 flex justify-center space-x-6 text-2xl font-semibold'>
          {/* Moves Status */}
          <p>
            Moves: <span className={`font-extrabold ${movesColor}`}>{moves}</span>
            <span className='text-gray-300'> (Limit: {moveLimit})</span>
          </p>

          {/* Timer Status */}
          <p>
            Time: <span className='font-extrabold text-pink-400'>{timer}s</span>
          </p>
        </div>
      </div>

      {/* Game Board */}
      <div className='flex w-full flex-1 items-center justify-center p-4'>
        <div className={`w-full max-w-4xl ${gridClass}`}>
          {tiles.map((tile, index) => (
            <Tile
              key={index} // Use index as key here, as tile.id is not unique (it's part of the pair) - wait, tile.id IS unique as it's the array index in the original creation. Sticking to index as key for stability/simplicity.
              imageUrl={tile.imageUrl}
              backImageUrl={growyLogo}
              isFlipped={flippedIndices.includes(index) || matchedIndices.includes(index)} // A matched tile should also stay flipped
              isMatched={matchedIndices.includes(index)}
              onClick={() => handleTileClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default GamePage
