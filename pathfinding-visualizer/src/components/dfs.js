export function dfs(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const stack = [];

    stack.push(startNode);
    //startNode.isVisited = true;
    startNode.distance = 0;

    while (stack.length > 0) {
        const currentNode = stack.pop();
        if (currentNode.isWall) continue;
        if (currentNode.isVisited) continue;

        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);
        
        if (currentNode === finishNode) return visitedNodesInOrder;
        const unvisitedNeighbours = getUnvisitedNeighbours(currentNode, grid);
        for (const neighbour of unvisitedNeighbours) {
            neighbour.previousNode = currentNode;
            neighbour.distance = currentNode.distance + neighbour.weight;
            stack.push(neighbour);
        }
    }

    return visitedNodesInOrder;
}

function getUnvisitedNeighbours(node, grid) {
    const neighbours = [];
    const {col, row} = node;
    // N, S, E, W directions are checked ensuring the limits of the matrix
    if (row > 0) neighbours.push(grid[row-1][col]);
    if (row < grid.length-1) neighbours.push(grid[row+1][col]);
    if (col > 0) neighbours.push(grid[row][col-1]);
    if (col < grid[0].length-1) neighbours.push(grid[row][col+1]);

    return neighbours.filter(neighbour => !neighbour.isVisited);
}