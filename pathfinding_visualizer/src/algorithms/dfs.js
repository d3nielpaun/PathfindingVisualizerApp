/*
 * Implements Depth-first Search using recursion
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

    return false; // If no path is found
};

const getUnvisitedNeighbors = (node, grid) => {
    const neighbors = [];
    const { col, row } = node;

    // Check adjacent nodes (up, down, left, right)
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Down
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right
    if (row > 0) neighbors.push(grid[row - 1][col]); // Up
    if (col > 0) neighbors.push(grid[row][col - 1]); // Left

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

// Wrapper function to initiate DFS
const dfs = (grid, startNode, finishNode) => {
    const visitedNodesInOrder = [];
    runDFS(grid, startNode, finishNode, visitedNodesInOrder);

    // Check if we reached the finishNode to create the path
    const shortestPath = finishNode.isVisited ? getNodesInShortestPathOrder(finishNode) : null;

    return {
        visitedNodesInOrder,
        numNodesVisited: visitedNodesInOrder.length - 1,
        shortestPath,
        shortestPathLength: shortestPath ? shortestPath.length - 1 : 0,
    };
};



export { dfs };