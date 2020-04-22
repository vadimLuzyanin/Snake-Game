import React, { useState, Fragment } from 'react'

const Score = ({ tickInterval, snakeLength, gameStart, handleGameStart, resolution, handleResolutionSet }) => {
    const [inputState, setInputState] = useState('')

    return (
        <div style={{
            fontSize: '25px',
            marginTop: '15px',
            display: 'flex',
            minWidth: '50vw',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <span>Score: {Math.floor(Math.pow(snakeLength, 2) * 1000 / tickInterval)}</span>
            <div style={{
                display: 'flex',
                height: '100%',
                justifyContent: 'space-around',
                alignItems: 'center',
                minWidth: '25vw'
            }}>
                {!gameStart && (
                    <Fragment >
                        <input
                            value={inputState}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setInputState(e.target.value)}
                            placeholder='min=5, max=30'
                            style={{
                                fontSize: '20px',
                                height: '100%'
                            }} >
                        </input>
                        <button
                            onClick={() => handleResolutionSet(inputState)}
                            style={{
                                fontSize: '25px',
                                height: '100%'
                            }}
                        >
                            Set resoluton
                        </button>
                    </Fragment>
                )}
            </div>
            {!gameStart && (
                <button
                    onClick={handleGameStart}
                    style={{
                        fontSize: '25px',
                        height: '100%'
                    }}
                >
                    Start
                </button>
            )}

        </div>
    )
}

export default Score
