import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import StartPage from './StartPage'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

describe('StartPage Component', () => {
  const mockOnStartGame = jest.fn()

  beforeEach(() => {
    mockOnStartGame.mockClear()
    mockNavigate.mockClear()
  })

  // Test 1: Simple smoke test with snapshot
  test('renders StartPage correctly (snapshot)', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <StartPage onStartGame={mockOnStartGame} />
      </MemoryRouter>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  // Test 2: Validation check and error display
  test('shows error when starting without name (validation check)', async () => {
    render(
      <MemoryRouter>
        <StartPage onStartGame={mockOnStartGame} />
      </MemoryRouter>
    )
    const startGameButton = screen.getByTestId('start-button')
    fireEvent.click(startGameButton)
    await waitFor(() => {
      const errorMessage = screen.getByRole('alert')
      expect(errorMessage).toBeInTheDocument()
      expect(errorMessage).toHaveTextContent('Name is required')
    })
    expect(mockOnStartGame).not.toHaveBeenCalled()
  })

  // Test 3: Error removal upon typing
  test('clears error message and red border when name input is changed after error is shown', async () => {
    render(
      <MemoryRouter>
        <StartPage onStartGame={mockOnStartGame} />
      </MemoryRouter>
    )
    const nameInput = screen.getByPlaceholderText(/enter your name/i)
    fireEvent.click(screen.getByTestId('start-button'))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(nameInput).toHaveClass('border-red-500')
    })
    fireEvent.change(nameInput, { target: { value: 'A' } })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(nameInput).not.toHaveClass('border-red-500')
  })

  // Test 4: Successful game start with custom settings
  test('calls onStartGame with correct custom values and navigates', async () => {
    render(
      <MemoryRouter>
        <StartPage onStartGame={mockOnStartGame} />
      </MemoryRouter>
    )
    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), {
      target: { value: 'Alice' }
    })

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '4x4' }
    })

    fireEvent.click(screen.getByRole('button', { name: /Hard/i }))
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }))
    await waitFor(() => {
      expect(mockOnStartGame).toHaveBeenCalledWith('Alice', expect.objectContaining({ rows: 4, cols: 4, name: '4x4' }), 'hard')
    })
    expect(mockNavigate).toHaveBeenCalledWith('/game')
  })

  // Test 5: Difficulty button state update
  test('updates difficulty buttons correctly upon clicking', () => {
    render(
      <MemoryRouter>
        <StartPage onStartGame={mockOnStartGame} />
      </MemoryRouter>
    )

    const easyBtn = screen.getByRole('button', { name: /Easy/i })
    const mediumBtn = screen.getByRole('button', { name: /Medium/i })
    expect(easyBtn).toHaveClass('bg-blue-500')
    expect(mediumBtn).not.toHaveClass('bg-blue-500')
    fireEvent.click(mediumBtn)
    expect(mediumBtn).toHaveClass('bg-blue-500')
    expect(easyBtn).not.toHaveClass('bg-blue-500')
  })
})
