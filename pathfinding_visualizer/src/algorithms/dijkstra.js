/*
 * Implements Dijkstra's Algorithm using MinHeap
 */

import { Heap } from 'heap-js';

/**
 * Executes Dijkstra's Algorithm.
 * 
 * @param {Array<Array<Object>>} grid - 2D array representing the grid of nodes. 
 * @param {Object} startNode - The node to start Dijkstra's Search from.
 * @param {Object} finishNode - The target node to find in the grid.
 * @returns {Object} - Object holding statistics of Dijkstra's Algorithm.
 */
const dijkstra = (grid, startNode, finishNode) => {
    const visitedNodesInOrder = [];
    startNode.f = 0;
    const openList = new Heap((a, b) => a.f - b.f);
    openList.push(startNode);

    while (!openList.isEmpty()) {
        const current = openList.pop();
        if (current.isVisited) continue;
        current.isVisited = true;
        visitedNodesInOrder.push(current);

        if (current === finishNode) {  // Finish node was found
            const shortestPath = getNodesInShortestPathOrder(finishNode);
            return {
                visitedNodesInOrder,
                numNodesVisited: visitedNodesInOrder.length - 1,
                shortestPath,
                shortestPathLength: shortestPath.length - 1,
            };
        }

        const neighbors = getValidNeighbors(current, grid);

        for (const neighbor of neighbors) {
            const newF = current.f + neighbor.weight;
            if (newF < neighbor.f) {
                neighbor.f = newF;
                neighbor.previousNode = current;
                openList.push(neighbor);
            }
        }
    }

    // Finish node could not be found
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
const getValidNeighbors = (node, grid) => {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
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

export { dijkstra };