import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'

import './App.css'

import StartPage from './Pages/StartPage'
import GamePage from './Pages/GamePage'
import ResultPage from './Pages/ResultPage'

interface BoardSize {
  rows: number
  cols: number
  name: string
}

type Difficulty = 'easy' | 'medium' | 'hard'

function AppWrapper() {
  const [playerName, setPlayerName] = useState<string>('')
  const [score, setScore] = useState<number>(0)
  const [time, setTime] = useState<number>(0)
  const [status, setStatus] = useState<'win' | 'lose'>('win')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [boardSize, setBoardSize] = useState<BoardSize | null>(null)
  const [isGameOver, setIsGameOver] = useState<boolean>(false)

  const navigate = useNavigate()

  // Called by StartPage when the game starts
  const handleStartGame = (name: string, size: BoardSize, diff: Difficulty) => {
    setPlayerName(name)
    setBoardSize(size)
    setDifficulty(diff)
    setIsGameOver(false)
    navigate('/game')
  }

  // Called by GamePage when the game ends
  const handleEndGame = (finalScore: number, finalTime: number, gameStatus: 'win' | 'lose') => {
    setScore(finalScore)
    setTime(finalTime)
    setStatus(gameStatus)
    setIsGameOver(true)
    navigate('/end')
  }

  return (
    <Routes>
      <Route path='/' element={<StartPage onStartGame={handleStartGame} />} />

      <Route
        path='/game'
        element={
          playerName && boardSize ? (
            <GamePage playerName={playerName} boardSize={boardSize} difficulty={difficulty} onEndGame={handleEndGame} />
          ) : (
            <Navigate to='/' replace />
          )
        }
      />

      <Route
        path='/end'
        element={
          isGameOver && boardSize ? (
            <ResultPage playerName={playerName} score={score} time={time} status={status} difficulty={difficulty} />
          ) : (
            <Navigate to='/' replace />
          )
        }
      />

      {/* Catch-all route */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </div>
  )
}

export default App
