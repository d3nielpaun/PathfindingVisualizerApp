import React, { useState, useEffect, useRef } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import './PathfindingVisualizer.css';

// Initial global variables
const NUM_OF_ROWS = 20;
const NUM_OF_COLS = 50;
const START_NODE_ROW = 9;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 9;
const FINISH_NODE_COL = 44;


const PathfindingVisualizer = ({ selectedAlgorithm, isVisualizing, resetGrid }) => {
   const [grid, setGrid] = useState([]);
   const [mousePressed, setMousePressed] = useState(false);
   const animationTimeouts = useRef([]);


   useEffect(() => {
      const initialGrid = initializeGrid();
      console.log(initialGrid);
      setGrid(initialGrid);
   }, []);

   
   useEffect(() => {
      if (isVisualizing) {
         runAlgorithm();
      }
   }, [isVisualizing]);

   /*
   useEffect(() => {
      // Clear any active animations before resetting the grid
      clearTimeouts();
      // Reset the grid to the initial state
      const newGrid = resetAllNodes(grid);
      setGrid(newGrid);
   }, [resetGrid]);
   */

   const runAlgorithm = () => {
      if (selectedAlgorithm === "Dijkstra") {
         visualizeDijkstra();
      }
   };


   const clearTimeouts = () => {
      animationTimeouts.current.forEach(timeout => clearTimeout(timeout));
      animationTimeouts.current = [];
   };


   const handleMouseDown = (event, row, col) => {
      event.preventDefault();
      if (isVisualizing) return;
      setMousePressed(true);
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      setGrid(newGrid);
   };


   const handleMouseEnter = (row, col) => {
      if (mousePressed) {
         const newGrid = getNewGridWithWallToggled(grid, row, col);
         setGrid(newGrid);
      }
   };


   const handleMouseUp = () => {
      setMousePressed(false);
   };


   const handleMouseLeave = () => {
      setMousePressed(false);
   };


   const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
      for (let i = 1; i < visitedNodesInOrder.length; i++) {
         const node = visitedNodesInOrder[i];
         if (node.isFinish) {
            setTimeout(() => {
               animateShortestPath(nodesInShortestPathOrder);
               }, 10 * i);
               return;
         }
         setTimeout(() => {
            const node = visitedNodesInOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-visited';
         }, 10 * i);
      }
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
      for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
          setTimeout(() => {
              const node = nodesInShortestPathOrder[i];
              document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-shortest-path';
          }, 50 * i);
      }
  };
   

   const updateNodeInGrid = (grid, row, col, newProps) => {
      const newGrid = grid.slice();
      const node = newGrid[row][col];
      const updatedNode = { ...node, ...newProps };
      newGrid[row][col] = updatedNode;
      return newGrid;
   };

   
   const visualizeDijkstra = () => {
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
   };


   return (
      <div className="outer-grid-container">
         <div className="inner-grid-container">
            <div className="grid" onMouseLeave={handleMouseLeave}>
               {grid.map((row, rowIdx) => (
                  <div key={rowIdx} className="row">
                     {row.map((node, colIdx) => {
                        const { row, col, isStart, isFinish, isWall } = node;
                        return (
                           <Node
                              key={colIdx}
                              row={row}
                              col={col}
                              isStart={isStart}
                              isFinish={isFinish}
                              isWall={isWall}
                              onMouseDown={(event) => handleMouseDown(event, row, col)}
                              onMouseEnter={() => handleMouseEnter(row, col)}
                              onMouseUp={() => handleMouseUp()}>
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


// Function to toggle wall state of a node
const getNewGridWithWallToggled = (grid, row, col) => {
   const newGrid = grid.slice();
   const node = newGrid[row][col];
   const newNode = {
      ...node,
      isWall: !node.isWall,
   };
   newGrid[row][col] = newNode;
   return newGrid;
};


// Function to create a new node
const createNode = (row, col) => {
   return {
      row,
      col,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isWall: false,
      isVisited: false,
      previousNode: null,
   };
};

/*
// Function to reset all nodes
const resetAllNodes = (grid) => {
   const newGrid = grid.map(row =>
      row.map(node => ({
         ...node,
         isVisited: false,
         distance: Infinity,
         previousNode: null,
         isShortestPath: false,
         isWall: node.isWall, // Keep walls as they are
      }))
   );
   return newGrid;
};
*/

export default PathfindingVisualizer;
