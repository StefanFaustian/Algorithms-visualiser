export function astar(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const unvisitedNodes = [];
    
    // Final Score for all nodes needs initialization
    for (const row of grid) {
        for (const node of row) {
            node.fScore = Infinity;
            unvisitedNodes.push(node);
        }
    }

    startNode.distance = 0; 
    startNode.fScore = manhattanDistance(startNode, finishNode);

    while (unvisitedNodes.length > 0) {
        // Sorting the nodes after the final score ensures that the best nodes will be selected
        unvisitedNodes.sort((nodeA, nodeB) => nodeA.fScore - nodeB.fScore);
        const closestNode = unvisitedNodes.shift();

        if (closestNode.isWall) continue;
        
        if (closestNode.distance === Infinity) return visitedNodesInOrder;

        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        if (closestNode === finishNode) return visitedNodesInOrder;

        updateUnvisitedNeighbours(closestNode, grid, finishNode);
    }
    
    return visitedNodesInOrder;
}

function updateUnvisitedNeighbours(node, grid, finishNode) {
    const unvisitedNeighbours = getUnvisitedNeighbours(node, grid);
    for (const neighbour of unvisitedNeighbours) {
        const tentativeDistance = node.distance + neighbour.weight;

        if (tentativeDistance < neighbour.distance) {
            neighbour.previousNode = node;
            neighbour.distance = tentativeDistance;
            
            // Final score = real cost (tentativeDistance) + estimated cost until destination (manhattanDistance)
            neighbour.fScore = tentativeDistance + manhattanDistance(neighbour, finishNode);
        }
    }
}

function getUnvisitedNeighbours(node, grid) {
    const neighbours = [];
    const {col, row} = node;
    if (row > 0) neighbours.push(grid[row-1][col]);
    if (row < grid.length-1) neighbours.push(grid[row+1][col]);
    if (col > 0) neighbours.push(grid[row][col-1]);
    if (col < grid[0].length-1) neighbours.push(grid[row][col+1]);
    return neighbours.filter(neighbour => !neighbour.isVisited);
}

// Aproximation heuristic: Manhattan Distance - the sum of absolute values of differences in the goal's x and y coordinates and the current cell's x and y coordinates respectively
function manhattanDistance(nodeA, nodeB) {
    const dx = Math.abs(nodeA.row - nodeB.row);
    const dy = Math.abs(nodeA.col - nodeB.col);
    
    // Multiplicator chosen by testing different values. Using 5 came to be the closest to the Dijkstra optimal path
    return (dx + dy) * 5; 
}