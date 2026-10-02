import React, { useState, useEffect } from 'react';
import Node from './Node';
import './PathfindingVisualiser.css';

// Defining coordinates for the starting node and the finish node
const START_NODE_ROW = 9;
const START_NODE_COL = 10;
const FINISH_NODE_ROW = 14;
const FINISH_NODE_COL = 39;

export default function PathfindingVisualiser() {
    const [grid, setGrid] = useState([]);

    // useEffect runs once, at the start of the app
    useEffect(() => {
        const initialGrid = [];
        for (let row = 0; row < 20; row++) {
            const currentRow = [];
            for (let col = 0; col < 50; col++) {
                currentRow.push({row, col, 
                    isStart: row === START_NODE_ROW && col == START_NODE_COL,
                    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
                });
            }
            initialGrid.push(currentRow);
        }
        setGrid(initialGrid);
    }, []);

    return (
        <div className="grid">
            {grid.map((row, rowIndex) => {
                return (
                    <div key={rowIndex} className="row">
                        {row.map((node,nodeIndex) => {
                            return <Node key={nodeIndex} row={node.row} col={node.col}
                            isStart={node.isStart} isFinish={node.isFinish}
                            />
                        })}
                    </div>
                );
            })}
        </div>
    )

}