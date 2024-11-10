/*
 * Implements Dijkstra's Algorithm using MinHeap
 */


/**
 * MinHeap class used for Dijkstra's Algorithm
 */
class MinHeap {

    constructor() {
        this.nodes = [];
    }

    // Inserts a node into the MinHeap and ensures the heap property is maintained
    insert(node) {
        this.nodes.push(node);
        this.bubbleUp();
    }

    // Extracts and returns the minimum node from the MinHeap
    extractMin() {
        if (this.nodes.length === 0) return null;
        const minNode = this.nodes[0];
        const end = this.nodes.pop();
        if (this.nodes.length > 0) {
            this.nodes[0] = end;
            this.bubbleDown();
        }
        return minNode;
    }

    // Moves the last node up the heap to restore the heap property
    bubbleUp() {
        let index = this.nodes.length - 1;
        const element = this.nodes[index];
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            let parent = this.nodes[parentIndex];
            if (element.distance >= parent.distance) break;
            this.nodes[index] = parent;
            index = parentIndex;
        }
        this.nodes[index] = element;
    }

    // Moves the root node down the heap to restore the heap property
    bubbleDown() {
        let index = 0;
        const length = this.nodes.length;
        const element = this.nodes[0];
        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIndex < length) {
                leftChild = this.nodes[leftChildIndex];
                if (leftChild.distance < element.distance) {
                    swap = leftChildIndex;
                }
            }
            if (rightChildIndex < length) {
                rightChild = this.nodes[rightChildIndex];
                if (
                    (swap === null && rightChild.distance < element.distance) ||
                    (swap !== null && rightChild.distance < leftChild.distance)
                ) {
                    swap = rightChildIndex;
                }
            }
            if (swap === null) break;
            this.nodes[index] = this.nodes[swap];
            index = swap;
        }
        this.nodes[index] = element;
    }

    // Checks if the heap is empty
    isEmpty() {
        return this.nodes.length === 0;
    }
}


/**
 * Uses MinHeap to execute Dijkstra's Algorithm.
 * Marks each visited node.
 * 
 * @param {Array<Array<Object>>} grid - 2D array representing the grid of nodes. 
 * @param {Object} startNode - The node to start Dijkstra's Search from.
 * @param {Object} finishNode - The target node to find in the grid.
 * 
 * @returns {Object} - Object holding statistics of Dijkstra's Algorithm.
 */
const dijkstra = (grid, startNode, finishNode) => {

    // Sets up Dijkstra's Algorithm
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const minHeap = new MinHeap();
    minHeap.insert(startNode);

    // Runs Dijkstra's Algorithm
    while (!minHeap.isEmpty()) {
        const closestNode = minHeap.extractMin();
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        if (closestNode === finishNode) {  // Finish node was found
            const shortestPath = getNodesInShortestPathOrder(finishNode);
            return {
                visitedNodesInOrder,
                numNodesVisited: visitedNodesInOrder.length - 1,
                shortestPath,
                shortestPathLength: shortestPath.length - 1,
            };
        }

        updateUnvisitedNeighbors(closestNode, grid, minHeap);
    }

    // Finish node could not be found
    return {
        visitedNodesInOrder,
        numNodesVisited: visitedNodesInOrder.length - 1,
        shortestPath: null, // No path found
        shortestPathLength: 0,
    };
};


/**
 * Calculates distance of neighbors of a node.
 * Places neighbors in MinHeap.
 * 
 * @param {Object} node - The node to retrieve and calculate distance of neighbors for.
 * @param {Array<Array<Object>>} grid - 2D array representing the grid of nodes.
 * @param {MinHeap} minHeap - MinHeap used to store nodes to be visited.
 * 
 * @returns {void} - Doesn't return anything.
 */
const updateUnvisitedNeighbors = (node, grid, minHeap) => {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);

    for (const neighbor of unvisitedNeighbors) {
        const newDistance = node.distance + neighbor.weight; // Calculate new distance using weight
        if (newDistance < neighbor.distance) { // Only update if new distance is shorter
            neighbor.distance = newDistance; // Update neighbor's distance
            neighbor.previousNode = node; // Set previous node
            minHeap.insert(neighbor);
        }
    }
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
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
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
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
};


export { dijkstra };
