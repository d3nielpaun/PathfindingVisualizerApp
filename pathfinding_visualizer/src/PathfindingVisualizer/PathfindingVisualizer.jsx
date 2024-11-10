/*
 * Manages grid display.
 * Controls algorithm execution and animation.
 */

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

/**
 * Manages the grid and controls the execution of pathfinding algorithm animations.
 * Handles user interaction with the grid.
 * 
 * @param {boolean} isVisualizing - Indicates if algorithm is currently being visualized.
 * @param {function} setIsVisualizing - Function to update 'isVisualizing' state.
 * @param {boolean} resetGrid - Indicates to reset the grid when it is changed.
 * @param {String} selectedAlgorithm - Indicates which algorithm user has selected to visualize.
 * @param {Array<Object>} nodeTypes - List of objects representing each node type.
 * @param {String} selectedNodeType - Indicates which node type user currently has selected.
 *  
 * @returns {JSX.Element} - React component representing the grid.
 */
const PathfindingVisualizer = ({ isVisualizing, setIsVisualizing, resetGrid,
   selectedAlgorithm, nodeTypes, selectedNodeType }) => {
   const [grid, setGrid] = useState([]);  // 2D array that holds Node objects
   const [mousePressed, setMousePressed] = useState(false);  // Tracks when mouse is pressed down and held
   const [movingStartNode, setMovingStartNode] = useState(false);  // Tracks if user is moving start node
   const [movingFinishNode, setMovingFinishNode] = useState(false);  // Tracks if user is moving finish node
   const animationTimeouts = useRef([]);  // Stores the animation timeouts for animation


   /**
    * Initializes grid when the component mounts.
    * Runs only once on app start.
    */
   useEffect(() => {
      const initialGrid = initializeGrid();
      setGrid(initialGrid);
   }, []);


   /**
    * Initiates algorithm visualization when isVisualizing is true.
    */
   useEffect(() => {
      // Determines which algorithm to visualize
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
   }, [isVisualizing, selectedAlgorithm]);


   /**
    * Resets grid whenever resetGrid is toggled.
    */
   useEffect(() => {
      if (resetGrid !== null) {
         clearTimeouts();
         const newGrid = resetAllNodes(grid); // Reset node properties and DOM elements
         setGrid(newGrid); // Update the grid with the reset nodes
         setIsVisualizing(false);
      }
   }, [resetGrid]);


   /**
    * Updates node type weights whenever nodeTypes is updated/changed.
    */
   useEffect(() => {
      updateWeights();
   }, [nodeTypes]);

   
   /**
    * Clears animation timeouts.
    * Called when user resets grid.
    */
   const clearTimeouts = () => {
      animationTimeouts.current.forEach(timeout => clearTimeout(timeout));
      animationTimeouts.current = [];
   };

   
   /**
    * Handles the mouse down event on a grid node.
    * If user presses on start node, sets movingStartNode to true.
    * If user presses on finish node, sets movingFinishNode to true.
    * Else, changes the node's type to the users selected node type.
    * 
    * @param {MouseEvent} event - The mouse event trigged by user interaction with grid.
    * @param {number} row - The row index of node that was pressed.
    * @param {number} col - The column index of the node that was pressed.
    * 
    * @returns {void} - Doesn't return anything.
    */
   const handleMouseDown = (event, row, col) => {
      event.preventDefault();  // Prevents default drag-and-drop behavior of browser
      if (isVisualizing) return;  // Doesn't allow grid-altering during animation
      setMousePressed(true);
      const node = grid[row][col];

      if (node.isStart) {  // Clicking on the start node
         setMovingStartNode(true);
      }
      else if (node.isFinish) {  // Clicking on finish node
         setMovingFinishNode(true);
      }
      else {
         if (node.type === null) {  // Clicking on default node -> sets type and weight to match selected node type
            node.type = selectedNodeType;
            const nodeType = nodeTypes.find((nodeType) => nodeType.name === selectedNodeType);
            node.weight = nodeType.weight;
         }
         else {  // Clicking on node with a type -> resets node to default
            node.type = null;
            node.weight = 1;
         }
      }

      setGrid([...grid]); // Trigger re-render with a new reference to the grid array
   };
   
   
   /**
    * Handles the mouse enter event on a grid node.
    * When user drags mouse into node, proper action is carried out (move start/finish node, set node type).
    * 
    * @param {number} row - The row index of node that was pressed.
    * @param {number} col - The column index of the node that was pressed.
    * 
    * @returns {void} - Doesn't return anything.
    */
   const handleMouseEnter = (row, col) => {
      if (!mousePressed) return;  // Does nothing if mouse is not pressed

      const node = grid[row][col];

      // Carries out appropriate action for each scenario
      if (movingStartNode) {
         if (!node.isFinish && !node.type) {  // Prevents drag overtop of finish or non-default nodes
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
         if (!node.isStart && !node.type) {  // Prevents drag overtop of start or non-default nodes
            node.isFinish = true;
            FINISH_NODE_ROW = row;
            FINISH_NODE_COL = col;
         }
         else {
            const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
            finishNode.isFinish = true;
         }
      }
      else {  // Changing type of node
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
   
   
   /**
    * Handles mouse leave event on a grid node.
    * Used for when user is moving start or finish node.
    * 
    * @param {number} row - The row index of node that was pressed.
    * @param {number} col - The column index of the node that was pressed.
    * 
    * @returns {void} - Doesn't return anything.
    */
   const handleMouseLeaveNode = (row, col) => {
      if (!mousePressed) return;  // Does nothing if mouse is not pressed

      const node = grid[row][col];
   
      // Carries out appropriate action
      if (movingStartNode) {
         if (!node.isFinish && !node.type) { // Only unset start if not leaving special node
            node.isStart = false;
         }
         else {
            const prevStartNode = grid[START_NODE_ROW][START_NODE_COL];
            prevStartNode.isStart = false;
         }
      }
      else if (movingFinishNode) {
         if (!node.isStart && !node.type) {  // Only unset finish if not leaving special node
            node.isFinish = false;
         }
         else {
            const prevFinishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
            prevFinishNode.isFinish = false;
         }
      }

      setGrid([...grid]); // Trigger re-render with a new reference to the grid array
   };
   

   /**
    * Handles mouse up event on a grid node.
    * Resets all mouse trackers.
    * 
    * @returns {void} - Doesn't return anything.
    */
   const handleMouseUp = () => {
      setMousePressed(false);
      if (movingStartNode) {
         setMovingStartNode(false);
      }
      else if (movingFinishNode) {
         setMovingFinishNode(false);
      }
   };


   /**
    * Handles mouse leave event for entire grid.
    * Resets mouse trackers.
    * Sets start/finish node to last node that was pressed.
    * 
    * @returns {void} - Doesn't return anything.
    */
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


   /**
    * Updates the weights of each type node when nodeTypes is changed.
    * 
    * @returns {void} - Doesn't return anything.
    */
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
   

   /**
    * Animates the visited nodes on the grid by changing DOM node className.
    * 
    * @param {Array<Node>} visitedNodesInOrder - Array of nodes that were visited in order.
    * @param {Array<Node>} nodesInShortestPathOrder - Array of nodes that are in the shortest path.
    * 
    * @returns {void} - Doesn't return anything.
    */
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


   /**
    * Animates nodes in shortest path by changing DOM node elements className
    * 
    * @returns {void} - Doesn't return anything.
    */
   const animateShortestPath = (nodesInShortestPathOrder) => {
      for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
         animationTimeouts.current.push(setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className +=
               ' node node-shortest-path';
         }, 50 * i));
      }
   };   

   
   /**
    * Handles the visualization of Dijkstra's Algorithm.
    * Formats output for Dijkstra's Algorithm.
    * 
    * @returns {void} - Doesn't return anything.
    */
   const visualizeDijkstra = () => {
      // Calls dijkstra.js
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const dijkstraOutput = dijkstra(grid, startNode, finishNode);
      
      // Formats and displays output
      const outputText = document.getElementById("output-text");
      outputText.innerHTML = `
               Dijkstra's Algorithm visited ${dijkstraOutput.numNodesVisited} nodes. 
               ${dijkstraOutput.shortestPath === null ? "Could not find the finish node." :
               `Shortest Path Length: ${dijkstraOutput.shortestPathLength}.`}
            `;
      
      // Animates visualization
      animateVisitedNodes(dijkstraOutput.visitedNodesInOrder, dijkstraOutput.shortestPath);
   };


   /**
    * Handles the visualization of Breadth-first Search.
    * Formats output for Breadth-first Search.
    * 
    * @returns {void} - Doesn't return anything.
    */
   const visualizeBFS = () => {
      // Calls bfs.js
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const bfsOutput = bfs(grid, startNode, finishNode);

      // Formats and displays output
      const outputText = document.getElementById("output-text");
      outputText.innerHTML = `Breadth-first Search visited ${bfsOutput.numNodesVisited} nodes. 
      ${bfsOutput.shortestPath === null ? "Could not find the finish node." :
            `Shortest Path Length: ${bfsOutput.shortestPathLength}.`}`;
      
      // Animates visualization
      animateVisitedNodes(bfsOutput.visitedNodesInOrder, bfsOutput.shortestPath);
   };


   /**
    * Handles the visualization of Depth-first Search.
    * Formats output for Depth-first Search.
    * 
    * @returns {void} - Doesn't return anything.
    */
   const visualizeDFS = () => {
      // Calls dfs.js
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const dfsOutput = dfs(grid, startNode, finishNode);

      // Formats output
      const outputText = document.getElementById("output-text");
      outputText.innerHTML = `Depth-first Search visited ${dfsOutput.numNodesVisited} nodes. 
      ${dfsOutput.shortestPath === null ? "Could not find the finish node." :
            `Shortest Path Length: ${dfsOutput.shortestPathLength}.`}`;
      
      // Animates visualization
      animateVisitedNodes(dfsOutput.visitedNodesInOrder, dfsOutput.shortestPath);
   };


   // Returns React component representing grid
   return (
      <div className="outer-grid-container">
         <div className="inner-grid-container">
            <div className="grid" onMouseLeave={handleMouseLeaveGrid}>
               {grid.map((row, rowIdx) => (
                  <div key={rowIdx} id={rowIdx} className="row">
                     {row.map((node) => {
                        const { row, col, isStart, isFinish, type, isVisited } = node;
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
                              onMouseUp={() => handleMouseUp()}
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


/**
 * Creates a 2D array of default Objects that represent nodes in the grid.
 * 
 * @returns {Array<Array<Object>>} - 2D Array of Objects representing nodes.
 */
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


/**
 * Creates an object representing a node in the grid.
 * 
 * @param {number} row - The row index of the node.
 * @param {number} col - The column index of the node.
 * @returns {Object} - Object representing a node.
 */
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


/**
 * Resets all nodes to their default state.
 * 
 * @param {Array<Array<Object>>} grid - The grid to reset.
 * 
 * @returns {Array<Array<Object>>} - A new grid that is reset.
 */
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
