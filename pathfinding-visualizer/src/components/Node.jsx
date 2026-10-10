import React from 'react';
import './Node.css';

export default function Node({row, col, 
    isStart, isFinish, isWall, weight,
    onMouseDown, onMouseEnter, onMouseUp}) {
    const extractClassName = isStart ? 'node-start' : isFinish ? 'node-finish' : isWall ? 'node-wall' : '';


    // Every div receives an ID for quick localization in animation
    return (
        <div className={`node ${extractClassName}`} id={`node-${row}-${col}`}
        onMouseDown={(e) => onMouseDown(row, col, e)}
        onMouseEnter={(e) => onMouseEnter(row, col, e)}
        onMouseUp={() => onMouseUp()}
        onDragStart={(e) => e.preventDefault()}
        >
            {!isWall && !isStart && !isFinish ? weight : null}
        </div>
    );
}