import React, { useState, useEffect, useRef } from 'react';
import Node from './Node';
import './PathfindingVisualiser.css';
import { dijkstra, getNodesInShortestPathOrder } from './dijkstra';

// Defining coordinates for the starting node and the finish node
const START_NODE_ROW = 0;
const START_NODE_COL = 0;
const FINISH_NODE_ROW = 19;
const FINISH_NODE_COL = 49;

export default function PathfindingVisualiser() {
    const [grid, setGrid] = useState([]);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [pressedNodeType, setPressedNodeType] = useState('wall');
    const timeoutIds = useRef([]);

    const clearAllTimeouts = () => {
        timeoutIds.current.forEach(timeoutId => clearTimeout(timeoutId));
        timeoutIds.current = [];
    }


    // useEffect runs once, at the start of the app
    useEffect(() => {
        const initialGrid = [];
        for (let row = 0; row < 20; row++) {
            const currentRow = [];
            for (let col = 0; col < 50; col++) {
                currentRow.push({row, col, 
                    isStart: row === START_NODE_ROW && col == START_NODE_COL,
                    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
                    isWall: false, // initially, no cell is a wall
                    distance: Infinity,
                    isVisited: false,
                    previousNode: null,
                });
            }
            initialGrid.push(currentRow);
        }
        setGrid(initialGrid);
    }, []);

    const handleMouseDown = (row, col, e) => {
        if (isRunning) return;
        if (e.button !== 0) return;
        const node = grid[row][col];
        if (node.isStart) setPressedNodeType('start');
        else if (node.isFinish) setPressedNodeType('finish');
        else {
            const makeWall = !e.shiftKey;
            const newGrid = getNewGridWithWallToggled(grid, row, col, makeWall);
            setGrid(newGrid);
        }
        setMouseIsPressed(true);
    };
    
    const handleMouseEnter = (row, col, e) => {
        if (!mouseIsPressed || isRunning) return;
        const targetNode = grid[row][col];
        if (pressedNodeType === 'start') { 
            if (targetNode.isWall || targetNode.isFinish) return;
            const newGrid = getNewGridWithNodeMoved(grid, row, col, 'start'); 
            setGrid(newGrid); 
        } else if (pressedNodeType === 'finish') { 
            if (targetNode.isWall || targetNode.isStart) return;
            const newGrid = getNewGridWithNodeMoved(grid, row, col, 'finish'); 
            setGrid(newGrid); 
        } else {
            if (targetNode.isStart || targetNode.isFinish) return;
            const makeWall = !e.shiftKey;
            const newGrid = getNewGridWithWallToggled(grid, row, col, makeWall);
            setGrid(newGrid);
        }
    };

    const handleMouseUp = () => {
        setMouseIsPressed(false);
        setPressedNodeType('wall');
    };

/////////////////////// Dijkstra AREA ///////////////////////
    const animateShortestPath = (nodesInShortestPathOrder) => {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            const timeoutId = setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                if (!node.isStart && !node.isFinish) 
                    document.getElementById(`node-${node.row}-${node.col}`).className = "node node-shortest-path";
            }, 50*i);
            timeoutIds.current.push(timeoutId);
        }
        const finalTimeout = setTimeout(() => {
            setIsRunning(false);
        }, 50 * nodesInShortestPathOrder.length);
        timeoutIds.current.push(finalTimeout);
    };

    const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                const timeoutId = setTimeout(() => {
                    animateShortestPath(nodesInShortestPathOrder);
                }, 10*i);
                timeoutIds.current.push(timeoutId);
                return;
            }

            // Finding animation
            const timeoutId = setTimeout(() => {
                const node = visitedNodesInOrder[i];
                if (!node.isStart && !node.isFinish)
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
            }, 10*i);
            timeoutIds.current.push(timeoutId);
        }
    };

    const visualiseDijkstra = () => {
    // Each run of the algorithm should be done on a clear matrix, obviously
    clearAllTimeouts();
    setIsRunning(true);  // Drawing walls is now forbidden during the animation
    const cleanGrid = grid.slice();
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 50; col++) {
        const node = cleanGrid[row][col];
        
        node.distance = Infinity;
        node.isVisited = false;
        node.previousNode = null;
        
        // All cells get erased except START, FINISH and WALL nodes
        if (!node.isStart && !node.isFinish && !node.isWall)
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
      }
    }
    
    let startNode, finishNode;
    for (let row = 0; row < 20; row++)
        for (let col = 0; col < 50; col++) {
            if (cleanGrid[row][col].isStart) startNode = cleanGrid[row][col];
            if (cleanGrid[row][col].isFinish) finishNode = cleanGrid[row][col];
    }
    
    const visitedNodesInOrder = dijkstra(cleanGrid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };
/////////////////////// Dijkstra AREA ///////////////////////
    
    return (
        <>
        <button
            onClick={() => visualiseDijkstra()}
            style={{ margin: '20px', padding: '10px 20px', fontSize: '18px', cursor: 'pointer' }}
        >
            Run Dijkstra</button>
        <div className="grid">
            {grid.map((row, rowIndex) => {
                return (
                    <div key={rowIndex} className="row">
                        {row.map((node,nodeIndex) => {
                            return <Node key={nodeIndex} row={node.row} col={node.col}
                            isStart={node.isStart} isFinish={node.isFinish} isWall={node.isWall}
                            onMouseLeave={() => setMouseIsPressed(false)}
                            onMouseDown={(row, col, e) => handleMouseDown(row, col, e)}
                            onMouseEnter={(row, col, e) => handleMouseEnter(row, col, e)}
                            onMouseUp={() => handleMouseUp()}
                            />
                        })}
                    </div>
                );
            })}
        </div></>
    )

}

// Copies the matrix, modifies the affected cell and returns the resulted matrix
const getNewGridWithWallToggled = (grid, row, col, makeWall) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if (node.isStart || node.isFinish) return newGrid;
    const newNode = {...node, isWall: makeWall,};
    newGrid[row][col] = newNode;
    return newGrid;
};

const getNewGridWithNodeMoved = (grid, row, col, type) => {
    const newGrid = grid.slice();
    for (let r = 0; r < 20; r++)
        for (let c = 0; c < 50; c++) {
            if (newGrid[r][c].isStart && type === 'start') newGrid[r][c] = {...newGrid[r][c], isStart: false};
            if (newGrid[r][c].isFinish && type === 'finish') newGrid[r][c] = {...newGrid[r][c], isFinish: false};
    }
    const node = newGrid[row][col];
    newGrid[row][col] = {...node, 
        isStart: type === 'start' ? true : node.isStart,
        isFinish: type === 'finish' ? true : node.isFinish,
        isWall: false
    };
    return newGrid;
}


