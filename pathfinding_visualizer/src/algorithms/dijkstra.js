/*
 * Implements Dijkstra's Algorithm
 */


const dijkstra = (grid, startNode, finishNode) => {

    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);

    while (unvisitedNodes.length > 0) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        if (closestNode.type === "Wall") continue;
        if (closestNode.distance === Infinity) {
            const numNodesVisited = visitedNodesInOrder.length - 1;  // Excludes start node
            return {
                visitedNodesInOrder,
                numNodesVisited,
                shortestPath: null, // No path found
                shortestPathLength: 0,
                totalDistance: 0
            };
        }
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        if (closestNode === finishNode) {
            const shortestPath = getNodesInShortestPathOrder(finishNode);
            const numNodesVisited = visitedNodesInOrder.length - 1;  // Excludes start node
            const shortestPathLength = shortestPath.length - 1;  // Excludes start node
            const totalDistance = finishNode.distance; // Final distance is stored in finishNode
            return {
                visitedNodesInOrder,
                numNodesVisited,
                shortestPath,
                shortestPathLength,
                totalDistance
            };
        }
        updateUnvisitedNeighbors(closestNode, grid);
    }
};


const getAllNodes = (grid) => {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
};


const sortNodesByDistance = (unvisitedNodes) => {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
};


const updateUnvisitedNeighbors = (node, grid) => {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        const newDistance = node.distance + neighbor.weight; // Calculate new distance using weight
        if (newDistance < neighbor.distance) { // Only update if new distance is shorter
            neighbor.distance = newDistance; // Update neighbor's distance
            neighbor.previousNode = node; // Set previous node
        }
    }
};


const getUnvisitedNeighbors = (node, grid) => {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
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


export { dijkstra };
