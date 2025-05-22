/*
 * Implements Breadth-first Search
 */


/**
 * Executed Breadth-first Search.
 * Marks each visited node.
 * 
 * @param {Array<Array<Object>>} grid - 2D array representing the grid of nodes. 
 * @param {Object} startNode - The node to start BFS from.
 * @param {Object} finishNode - The target node to find in the grid.
 * 
 * @returns {Object} - Object holding statistics of BFS.
 */
const bfs = (grid, startNode, finishNode) => {

    // Sets up BFS
    const visitedNodesInOrder = [];
    const queue = [];
    startNode.isVisited = true;
    queue.push(startNode);

    // Executes BFS
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

    // Finish node was not found
    return {
        visitedNodesInOrder,
        numNodesVisited: visitedNodesInOrder.length - 1,
        shortestPath: [], // No path found
        shortestPathLength: 0,
    };
};


/**
 * Returns all neighbors of node that have yet to be visited.
 * 
 * @param {Object} node - The node to retrieve the neighbors for.
 * @param {Array<Array<Object>>} grid - 2D array representing the grid of nodes.
 * 
 * @returns {Array<Object>} - Array of neighbors that haven't been visited.
 */
const getUnvisitedNeighbors = (node, grid) => {
    const neighbors = [];
    const { col, row } = node;
    
    // Check adjacent nodes (up, down, left, right)
    if (row > 0) neighbors.push(grid[row - 1][col]); // Up
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Down
    if (col > 0) neighbors.push(grid[row][col - 1]); // Left
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right

    return neighbors.filter(neighbor => !neighbor.isVisited && neighbor.weight !== Infinity);
};


/**
 * Obtains all node objects that are a part of the shortest path by traversing from the finish node.
 * 
 * @param {Object} finishNode - The target node that was found by the algorithm.
 * 
 * @returns {Array<Object>} - An array of all nodes in the shortest path.
 */
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
