import React, { useState, useEffect } from 'react'

const Cell = ({ index, food, snakeState, resolution }) => {
    const [cellColor, setCellColor] = useState('white')
    const [outlineColor, setOutlineColor] = useState('1px solid black')

    const isIndexMatches = (coordinates) => {
        return index === coordinates.row * resolution + coordinates.col
    }

    useEffect(() => {
        setCellColor('white')
        setOutlineColor('1px solid black')
        if (isIndexMatches(food)) {
            setCellColor('red')
        }
        snakeState.forEach((snakeCell, index) => {
            if (isIndexMatches(snakeCell) && index === 0) {
                setCellColor('green')
            } else if (isIndexMatches(snakeCell)) {
                setCellColor('black')
                setOutlineColor('1px solid red')
            }
        })
    }, [food, snakeState])

    return (
        <div style={{
            height: '3vh',
            width: '3vh',
            outline: outlineColor,
            backgroundColor: cellColor
        }}></div>
    )
}

export default Cell