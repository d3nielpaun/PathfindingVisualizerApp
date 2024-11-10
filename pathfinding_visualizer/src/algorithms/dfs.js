/*
 * Implements Depth-first Search using recursion.
 */


/**
 * Uses recursion to execute Depth-first Search on grid.
 * Marks each visited node.
 * 
 * @param {Array<Array<Object>>} grid - 2D array representing the grid of nodes.
 * @param {Object} node - The current node being evaluated during the search.
 * @param {Object} finishNode - The target node to find in the grid.
 * @param {Array<Object>} visitedNodesInOrder - An array that stores the nodes visited during the DFS.
 * 
 * @returns {boolean} - Returns `true` if a path to the finish node is found, `false` otherwise.
 */
const runDFS = (grid, node, finishNode, visitedNodesInOrder = []) => {
    // Base case: if the node is null, a wall, or already visited, return false
    if (!node || node.type === "Wall" || node.isVisited) {
        return false;
    }

    // Mark the node as visited and add it to the visited list
    node.isVisited = true;
    visitedNodesInOrder.push(node);

    // Check if we've reached the finish node
    if (node === finishNode) {
        return true; // Path found
    }

    // Explore neighbors one at a time
    const neighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of neighbors) {
        neighbor.previousNode = node; // Track the path
        if (runDFS(grid, neighbor, finishNode, visitedNodesInOrder)) {
            return true; // If path is found, return true
        }
    }

    return false; // No path was found
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
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Down
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right
    if (row > 0) neighbors.push(grid[row - 1][col]); // Up
    if (col > 0) neighbors.push(grid[row][col - 1]); // Left

    // Filters out neighbors that were visited
    return neighbors.filter(neighbor => !neighbor.isVisited && neighbor.type !== "Wall");
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
        currentNode = currentNode.previousNode;  // Trace back to start node by following previous node
    }

    return nodesInShortestPathOrder;
};


/**
 * Calls functions for Depth-first Search.
 * Formats output.
 * 
 * @param {Array<Array<Object>>} grid - 2D array representing the grid of nodes.
 * @param {Onject} startNode - The node to start dfs from.
 * @param {*} finishNode - The target node to find with DFS.
 * 
 * @returns {Object} - Object that holds DFS statistics as output.
 */
const dfs = (grid, startNode, finishNode) => {

    // Calls runDFS to execute DFS algorithm
    const visitedNodesInOrder = [];
    runDFS(grid, startNode, finishNode, visitedNodesInOrder);

    // Check if we reached the finishNode to create the path
    const shortestPath = finishNode.isVisited ? getNodesInShortestPathOrder(finishNode) : null;

    // Returns statistics
    return {
        visitedNodesInOrder,
        numNodesVisited: visitedNodesInOrder.length - 1,
        shortestPath,
        shortestPathLength: shortestPath ? shortestPath.length - 1 : 0,
    };
};


export { dfs };
