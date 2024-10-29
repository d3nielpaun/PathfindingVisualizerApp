/*
 * Implements Breadth-first Search
 */


const bfs = (grid, startNode, finishNode) => {
    const visitedNodesInOrder = [];
    const queue = [];
    startNode.isVisited = true;
    queue.push(startNode);

    while (queue.length > 0) {
        const currentNode = queue.shift();
        visitedNodesInOrder.push(currentNode);

        // Check if we've reached the finish node
        if (currentNode === finishNode) {
            const shortestPath = getNodesInShortestPathOrder(finishNode);
            return {
                visitedNodesInOrder,
                numNodesVisited: visitedNodesInOrder.length - 1,
                shortestPath,
                shortestPathLength: shortestPath.length - 1,
            };
        }

        // Get unvisited neighbors
        const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid);
        for (const neighbor of unvisitedNeighbors) {
            neighbor.isVisited = true; // Mark neighbor as visited
            neighbor.previousNode = currentNode; // Track the path
            queue.push(neighbor); // Add to the queue
        }
    }

    // If we exit the loop without finding a path
    return {
        visitedNodesInOrder,
        numNodesVisited: visitedNodesInOrder.length - 1,
        shortestPath: null, // No path found
        shortestPathLength: 0,
    };
};

const getUnvisitedNeighbors = (node, grid) => {
    const neighbors = [];
    const { col, row } = node;
    
    // Check adjacent nodes (up, down, left, right)
    if (row > 0) neighbors.push(grid[row - 1][col]); // Up
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Down
    if (col > 0) neighbors.push(grid[row][col - 1]); // Left
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right

    return neighbors.filter(neighbor => !neighbor.isVisited && neighbor.type !== "Wall");
};

const getNodesInShortestPathOrder = (finishNode) => {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    
    return nodesInShortestPathOrder;
};


export { bfs };