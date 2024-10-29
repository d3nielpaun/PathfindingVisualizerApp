/*
 * Implements Dijkstra's Algorithm using Min-Heap
 */


class MinHeap {
    constructor() {
        this.nodes = [];
    }

    insert(node) {
        this.nodes.push(node);
        this.bubbleUp();
    }

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

    isEmpty() {
        return this.nodes.length === 0;
    }
}


const dijkstra = (grid, startNode, finishNode) => {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    
    const minHeap = new MinHeap();
    minHeap.insert(startNode);

    while (!minHeap.isEmpty()) {
        const closestNode = minHeap.extractMin();
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        if (closestNode === finishNode) {
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

    return {
        visitedNodesInOrder,
        numNodesVisited: visitedNodesInOrder.length - 1,
        shortestPath: null, // No path found
        shortestPathLength: 0,
    };
};


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


const getUnvisitedNeighbors = (node, grid) => {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
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


export { dijkstra };
