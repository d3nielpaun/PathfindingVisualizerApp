import React, { useState, useEffect, useRef } from 'react';
import Node from './Node/Node';
import { dijkstra } from '../algorithms/dijkstra';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import './PathfindingVisualizer.css';


// Initial global variables
const NUM_OF_ROWS = 20;
const NUM_OF_COLS = 50;
let START_NODE_ROW = 9;
let START_NODE_COL = 5;
let FINISH_NODE_ROW = 9;
let FINISH_NODE_COL = 44;


const PathfindingVisualizer = ({ isVisualizing, setIsVisualizing, resetGrid,
   selectedAlgorithm, nodeTypes, selectedNodeType }) => {
   const [grid, setGrid] = useState([]);
   const [mousePressed, setMousePressed] = useState(false);
   const [movingStartNode, setMovingStartNode] = useState(false);
   const [movingFinishNode, setMovingFinishNode] = useState(false);
   const animationTimeouts = useRef([]);


   useEffect(() => {
      const initialGrid = initializeGrid();
      setGrid(initialGrid);
   }, []);


   useEffect(() => {
      if (isVisualizing === true) {
         if (selectedAlgorithm === "Dijkstra's Algorithm") {
            visualizeDijkstra();
         }
         else if (selectedAlgorithm === "Breadth-first Search") {
            visualizeBFS();
         }
         else if (selectedAlgorithm === "Depth-first Search") {
            visualizeDFS();
         }
      }
   }, [isVisualizing]);

   useEffect(() => {
      if (resetGrid !== null) {
         clearTimeouts();
         const newGrid = resetAllNodes(grid); // Reset node properties and DOM elements
         setGrid(newGrid); // Update the grid with the reset nodes
         setIsVisualizing(false);
      }
   }, [resetGrid]);


   useEffect(() => {
      updateWeights();
   }, [nodeTypes]);

   
   const clearTimeouts = () => {
      animationTimeouts.current.forEach(timeout => clearTimeout(timeout));
      animationTimeouts.current = [];
   };

   
   const handleMouseDown = (event, row, col) => {
      event.preventDefault();  // Prevents default drag-and-drop behavior of browser
      if (isVisualizing) return;  // Doesn't allow grid-altering during animation
      setMousePressed(true);
      const node = grid[row][col];

      if (node.isStart) {  // Clicking on the start node
         setMovingStartNode(true);
      }
      else if (node.isFinish) {
         setMovingFinishNode(true);
      }
      else {  // Clicking on default node
         if (node.type === null) {
            node.type = selectedNodeType;
            const nodeType = nodeTypes.find((nodeType) => nodeType.name === selectedNodeType);
            node.weight = nodeType.weight;
         }
         else {
            node.type = null;
            node.weight = 1;
         }

      }
      setGrid([...grid]); // Trigger re-render with a new reference to the grid array
   };
   
   
   const handleMouseEnter = (row, col) => {
      if (!mousePressed) return;
      const node = grid[row][col];
      if (movingStartNode) {
         if (!node.isFinish && !node.type) {
            node.isStart = true;
            START_NODE_ROW = row;
            START_NODE_COL = col;
         }
         else {
            const startNode = grid[START_NODE_ROW][START_NODE_COL];
            startNode.isStart = true;
         }
      }
      else if (movingFinishNode) {
         if (!node.isStart && !node.type) {
            node.isFinish = true;
            FINISH_NODE_ROW = row;
            FINISH_NODE_COL = col;
         }
         else {
            const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
            finishNode.isFinish = true;
         }
      }
      else if (!node.isStart && !node.isFinish) {
         if (node.type === null) {
            node.type = selectedNodeType;
            const nodeType = nodeTypes.find((nodeType) => nodeType.name === selectedNodeType);
            node.weight = nodeType.weight;
         }
         else {
            node.type = null;
            node.weight = 1;
         }
      }
      setGrid([...grid]); // Trigger re-render with a new reference to the grid array
   };
   
   
   const handleMouseLeaveNode = (row, col) => {
      if (!mousePressed) return;
      const node = grid[row][col];
   
      if (movingStartNode) {
         if (!node.isFinish && !node.type) { // Only unset if not leaving the finish node
            node.isStart = false;
         }
         else {  // Leaving the finish node
            const prevStartNode = grid[START_NODE_ROW][START_NODE_COL];
            prevStartNode.isStart = false;
         }
      }
      else if (movingFinishNode) {
         if (!node.isStart && !node.type) {
            node.isFinish = false;
         }
         else {  // Leaving start node
            const prevFinishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
            prevFinishNode.isFinish = false;
         }
      }
      setGrid([...grid]); // Trigger re-render with a new reference to the grid array
   };
   

   const handleMouseUp = (row, col) => {
      setMousePressed(false);
      if (movingStartNode) {
         setMovingStartNode(false);
      }
      else if (movingFinishNode) {
         setMovingFinishNode(false);
      }
   };


   const handleMouseLeaveGrid = () => {
      setMousePressed(false);
      if (movingStartNode) {
         setMovingStartNode(false);
         const startNode = grid[START_NODE_ROW][START_NODE_COL];
         startNode.isStart = true;
         setGrid([...grid]);
      }
      else if (movingFinishNode) {
         setMovingFinishNode(false);
         const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
         finishNode.isFinish = true;
         setGrid([...grid]);
      }
   };


   const updateWeights = () => {
      for (const row of grid) {
         for (const node of row) {
            if (node.type !== null) {
               const nodeType = nodeTypes.find((nodeType) => nodeType.name === node.type);
               node.weight = nodeType.weight;
            }
         }
      }
   };
   

   const animateVisitedNodes = (visitedNodesInOrder, nodesInShortestPathOrder) => {
      for (let i = 1; i < visitedNodesInOrder.length; i++) {
         const node = visitedNodesInOrder[i];
         if (node.isFinish) {
            animationTimeouts.current.push(setTimeout(() => {
               animateShortestPath(nodesInShortestPathOrder);
            }, 10 * i));
            return;
         }
         animationTimeouts.current.push(setTimeout(() => {
            const node = visitedNodesInOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className +=
               ' node-visited';
         }, 10 * i));
      }
   };


   const animateShortestPath = (nodesInShortestPathOrder) => {
      for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
         animationTimeouts.current.push(setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className +=
               ' node node-shortest-path';
         }, 50 * i));
      }
   };   

   
   const visualizeDijkstra = () => {
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const dijkstraOutput = dijkstra(grid, startNode, finishNode);

      const outputText = document.getElementById("output-text");
      outputText.innerHTML = `
               Dijkstra's Algorithm visited ${dijkstraOutput.numNodesVisited} nodes. 
               ${dijkstraOutput.shortestPath === null ? "Could not find the finish node." :
               `Shortest Path Length: ${dijkstraOutput.shortestPathLength}.`}
            `;
      
      animateVisitedNodes(dijkstraOutput.visitedNodesInOrder, dijkstraOutput.shortestPath);
   };


   const visualizeBFS = () => {
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const bfsOutput = bfs(grid, startNode, finishNode);

      const outputText = document.getElementById("output-text");
      outputText.innerHTML = `Breadth-first Search visited ${bfsOutput.numNodesVisited} nodes. 
      ${bfsOutput.shortestPath === null ? "Could not find the finish node." :
            `Shortest Path Length: ${bfsOutput.shortestPathLength}.`}`;
      
      animateVisitedNodes(bfsOutput.visitedNodesInOrder, bfsOutput.shortestPath);
   };


   const visualizeDFS = () => {
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const dfsOutput = dfs(grid, startNode, finishNode);

      const outputText = document.getElementById("output-text");
      outputText.innerHTML = `Depth-first Search visited ${dfsOutput.numNodesVisited} nodes. 
      ${dfsOutput.shortestPath === null ? "Could not find the finish node." :
            `Shortest Path Length: ${dfsOutput.shortestPathLength}.`}`;
      
      animateVisitedNodes(dfsOutput.visitedNodesInOrder, dfsOutput.shortestPath);
   };


   return (
      <div className="outer-grid-container">
         <div className="inner-grid-container">
            <div className="grid" onMouseLeave={handleMouseLeaveGrid}>
               {grid.map((row, rowIdx) => (
                  <div key={rowIdx} id={rowIdx} className="row">
                     {row.map((node) => {
                        const { row, col, isStart, isFinish, type, isVisited, isShortestPath } = node;
                        return (
                           <Node
                              key={`${row}-${col}`}
                              row={row}
                              col={col}
                              isStart={isStart}
                              isFinish={isFinish}
                              type={type}
                              isVisited={isVisited}
                              onMouseDown={(event) => handleMouseDown(event, row, col)}
                              onMouseEnter={() => handleMouseEnter(row, col)}
                              onMouseUp={() => handleMouseUp(row, col)}
                              onMouseLeave={() => handleMouseLeaveNode(row, col)}>
                           </Node>
                        );
                     })}
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};


// Function to initialize a new grid
const initializeGrid = () => {
   const initialGrid = [];
   for (let row = 0; row < NUM_OF_ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < NUM_OF_COLS; col++) {
         currentRow.push(createNode(row, col));
      }
      initialGrid.push(currentRow);
   }
   return initialGrid;
};


// Function to create a new node
const createNode = (row, col) => {
   return {
      row,
      col,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      type: null,
      weight: 1,
      isVisited: false,
      previousNode: null,
   };
};



const resetAllNodes = (grid) => {
   const newGrid = grid.map(row =>
      row.map(node => {
         // Reset the node class in the DOM to remove animations
         const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
         if (nodeElement && nodeElement.classList.contains("node-visited")) {
            nodeElement.className = 'node'; // Reset to default node class
         }
         // Reset the node properties in the grid
         return {
            ...node,
            isVisited: false,
            isStart: node.isStart,
            isFinish: node.isFinish,
            type: null,
            weight: 1,
            distance: Infinity,
            previousNode: null,
         };
      })
   );
   return newGrid;
};



export default PathfindingVisualizer;
