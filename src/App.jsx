import React, { useState, useEffect, useRef } from 'react'
import Cell from './Cell'
import Score from './Score'

const App = () => {

  const [resolution, setResolution] = useState(30)

  const [food, setFood] = useState({ row: Math.floor(Math.random() * resolution), col: Math.floor(Math.random() * resolution) })

  const [snakeState, setSnakeState] = useState([
    { row: Math.floor((resolution - 1) / 2), col: Math.floor((resolution - 1) / 2) },
  ])

  const [gameStart, setGameStart] = useState(false)

  const handleGameStart = () => {
    setGameStart((prev) => !prev)
    mainRef.current.focus()
  }

  const mainRef = useRef()

  useEffect(() => {
    window.addEventListener('click', () => mainRef.current.focus())
  },[])

  const [direction, setDirection] = useState('ltr')
  const [prevDirection, setPrevDirection] = useState('')

  const [isLose, setIsLose] = useState(false)

  const [time, setTime] = useState(0)

  const [tickInterval, setTickInterval] = useState(1000)

  useEffect(() => {
    clearInterval(window.gameTimer)

    window.gameTimer = setInterval(() => {
      setTime((prev) => prev + 1)
    }, tickInterval)

    return () => clearInterval(window.gameTimer)
  }, [tickInterval])

  useEffect(() => {
    gameTick()
  }, [time])

  const spawnRandomFood = () => {
    let row = Math.floor(Math.random() * resolution)
    let col = Math.floor(Math.random() * resolution)

    setFood({ row: row, col: col })
  }

  useEffect(() => {
    if (snakeState.some(({ row, col }) => (food.row === row && food.col === col))) {
      spawnRandomFood()
    }
  }, [snakeState, food])

  const gameTick = () => {

    if (!gameStart) {
      return
    }

    setSnakeState((prev) => {

      let newSnakeState = [...prev]

      let calculateNewSnakeHead = () => {
        switch (direction) {

          case 'btt':  //bottom to top
            return { row: prev[0].row - 1, col: prev[0].col }

          case 'ttb': //top to bottom
            return { row: prev[0].row + 1, col: prev[0].col }

          case 'rtl': //right to left
            return { row: prev[0].row, col: prev[0].col - 1 }

          case 'ltr': //left to right
          default:
            return { row: prev[0].row, col: prev[0].col + 1 }
        }
      }

      newSnakeState.unshift(calculateNewSnakeHead())

      if (!(newSnakeState[0].row === food.row && newSnakeState[0].col === food.col)) {
        newSnakeState.pop()
      } else {
        setTickInterval((prev) => prev * 0.95)
        spawnRandomFood()
      }

      return newSnakeState
    })

    setPrevDirection(direction)
  }

  const grid = Array(resolution * resolution).fill(null).map((item, index) => item = <Cell key={index} index={index} food={food} snakeState={snakeState} resolution={resolution} />)

  useEffect(() => {
    const snakeHead = snakeState[0]

    snakeState.forEach((item, index) => {
      if (index === 0) return
      if (item.row === snakeHead.row && item.col === snakeHead.col) {
        setIsLose(true)
      }
    })

    if (snakeHead.row > resolution - 1 || snakeHead.col > resolution - 1 || snakeHead.row < 0 || snakeHead.col < 0) {
      setIsLose(true)
    }
  }, [snakeState, resolution])

  useEffect(() => {
    if (isLose) {
      setSnakeState([
        { row: Math.floor((resolution - 1) / 2), col: Math.floor((resolution - 1) / 2) },
      ])
      spawnRandomFood()
      setDirection('ltr')
      setIsLose(false)
      setTickInterval(1000)
      setGameStart(false)
    }
  }, [isLose, resolution])

  const handleResolutionSet = (value) => {
    if (typeof +value === 'number' && +value <= 30 && +value >= 5) {
      setResolution(+value)
      setSnakeState([
        { row: Math.floor((resolution - 1) / 2), col: Math.floor((resolution - 1) / 2) },
      ])
      spawnRandomFood()
      setDirection('ltr')
      setIsLose(false)
      setTickInterval(1000)
      setGameStart(false)

    }
  }

  const handleKeyDown = (e) => {
    const key = e.key

    switch (key) {
      case 'ArrowUp':
        if (prevDirection === 'ltr' || prevDirection === 'rtl') {
          setDirection('btt')
        }
        break;

      case 'ArrowDown':
        if (prevDirection === 'ltr' || prevDirection === 'rtl') {
          setDirection('ttb')
        }
        break;

      case 'ArrowLeft':
        if (prevDirection === 'ttb' || prevDirection === 'btt') {
          setDirection('rtl')
        }
        break;

      case 'ArrowRight':
      default:
        if (prevDirection === 'ttb' || prevDirection === 'btt') {
          setDirection('ltr')
        }
        break;
    }
  }

  return (
    <div style={{display: 'flex',
     flexDirection: 'column',
      alignItems: 'center',
       justifyContent: 'center',
        height: '99vh'}}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          width: (resolution * 3) + 'vh',
          padding: '10px'
        }}
        tabIndex='0'
        ref={mainRef}
        onKeyDown={handleKeyDown}
      >
        {grid}

      </div>
      <Score
        tickInterval={tickInterval}
        snakeLength={snakeState.length}
        gameStart={gameStart}
        handleGameStart={handleGameStart}
        resolution={resolution}
        handleResolutionSet={handleResolutionSet} />
    </div>
  )
}

export default App
