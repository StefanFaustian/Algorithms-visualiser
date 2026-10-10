import React, { useState, useEffect, useRef } from 'react';
import Node from './Node';
import './PathfindingVisualiser.css';
import { dijkstra, getNodesInShortestPathOrder } from './dijkstra';
import { bfs } from './bfs';
import { dfs } from './dfs';

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
    const [pathCost, setPathCost] = useState(null);
    const timeoutIds = useRef([]);

    const clearAllTimeouts = () => {
        timeoutIds.current.forEach(timeoutId => clearTimeout(timeoutId));
        timeoutIds.current = [];
    }

    const clearBoard = () => {
        clearAllTimeouts();
        setIsRunning(false);
        const newGrid = [];
        for (let row = 0; row < 20; row++) {
            const currentRow = [];
            for (let col = 0; col < 50; col++) {
                const node = grid[row][col];
                const newNode = {...node, isWall: false, distance: Infinity, isVisited: false, previousNode: null};
                currentRow.push(newNode);

                if (newNode.isStart) document.getElementById(`node-${row}-${col}`).className = 'node node-start';
                else if (newNode.isFinish) document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
                else document.getElementById(`node-${row}-${col}`).className = 'node';
            }
            newGrid.push(currentRow);
        }
        setGrid(newGrid);
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
                    weight: Math.floor(Math.random() * 20) + 1,
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

const animateAlgorithm = (visitedNodesInOrder, nodesInShortestPathOrder, cost) => {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                const timeoutId = setTimeout(() => {
                    animateShortestPath(nodesInShortestPathOrder, cost);
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

    const animateShortestPath = (nodesInShortestPathOrder, cost) => {
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
            setPathCost(cost);
        }, 50 * nodesInShortestPathOrder.length);
        timeoutIds.current.push(finalTimeout);
    };

    const visualiseAlgorithm = (algorithm) => {
        clearAllTimeouts();
        setIsRunning(true);

        const cleanGrid = grid.map(row => 
        row.map(node => {
            if (!node.isStart && !node.isFinish && !node.isWall) 
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
            return {...node, distance: Infinity, isVisited: false, previousNode: null};
            })
        );

        let startNode, finishNode;
        for (let row = 0; row < 20; row++)
            for (let col = 0; col < 50; col++) {
                if (cleanGrid[row][col].isStart) startNode = cleanGrid[row][col];
                if (cleanGrid[row][col].isFinish) finishNode = cleanGrid[row][col];
            }

        setPathCost(null);
        let visitedNodesInOrder;
        if (algorithm === "DIJKSTRA")
            visitedNodesInOrder = dijkstra(cleanGrid, startNode, finishNode);
        else if (algorithm === "BFS") 
            visitedNodesInOrder = bfs(cleanGrid, startNode, finishNode);
        else if (algorithm === "DFS") 
            visitedNodesInOrder = dfs(cleanGrid, startNode, finishNode);

        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, finishNode.distance);
    }

    return (
        <>
        <div className='button-container'>
            <button
                onClick={() => visualiseAlgorithm("DIJKSTRA")}
            >
                Run Dijkstra</button>
            <button
                onClick={() => visualiseAlgorithm("BFS")}            
            >
                Run BFS</button>
            <button
                onClick={() => visualiseAlgorithm("DFS")}            
            >
                Run DFS</button>
            <button
                onClick={() => clearBoard()}
            >Clear board</button>
        </div>
        <div className="grid">
            {grid.map((row, rowIndex) => {
                return (
                    <div key={rowIndex} className="row">
                        {row.map((node,nodeIndex) => {
                            return <Node key={nodeIndex} row={node.row} col={node.col} weight={node.weight}
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
        </div>
        {pathCost !== null && (
            <h2 className="info">
            {pathCost === Infinity ? "There is no path to the destination!"
                : `Total cost of the path: ${pathCost}`
            }
            </h2>)}
        </>
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


