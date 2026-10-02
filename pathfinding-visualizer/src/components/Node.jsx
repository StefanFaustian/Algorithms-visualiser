import React from 'react';
import './Node.css';

export default function Node({row, col, isStart, isFinish}) {
    const extractClassName = isStart ? 'node-start' : isFinish ? 'node-finish' : '';


    // Every div receives an ID for quick localization in animation
    return (
        <div className={`node ${extractClassName}`} id={`node-${row}-${col}`}></div>
    )
}