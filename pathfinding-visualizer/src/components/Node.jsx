import React from 'react';
import './Node.css';

export default function Node({row, col}) {
    // Every div receives an ID for quick localization in animation
    return <div className="node" id={`node-${row}-${col}`}></div>
}