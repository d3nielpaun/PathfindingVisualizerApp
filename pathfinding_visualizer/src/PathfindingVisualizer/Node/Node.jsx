/*
 * Manages node display.
 * Determines node styles based on its properties.
 */

import './Node.css';


/**
 * Renders a grid node with specific styles based on its properties.
 * The node can represent different types (e.g., start, finish, wall, weighted nodes)
 * Handles mouse events for user interaction with node.
 * 
 * @param {number} row - The row index of the node.
 * @param {number} col - The column index of the node.
 * @param {boolean} isStart - Whether the node is the start node.
 * @param {boolean} isFinish - Whether the node is the finish node.
 * @param {string|null} type - The type of node (e.g., Wall, Mud, Water, etc.) or null.
 * @param {boolean} isVisited - Whether the node has been visited by the algorithm.
 * @param {boolean} isShortestPath - Whether the node is part of the shortest path.
 * @param {function} onMouseDown - Event handler for mouse down on the node.
 * @param {function} onMouseEnter - Event handler for mouse enter on the node.
 * @param {function} onMouseUp - Event handler for mouse up on the node.
 * @param {function} onMouseLeave - Event handler for mouse leave on the node.
 * 
 * @returns {JSX.Element} - A div representing a node in the grid with appropriate styling and mouse event handlers.
 */
const Node = ({ row, col, isStart, isFinish, type, isVisited, isShortestPath,
   onMouseDown, onMouseEnter, onMouseUp, onMouseLeave }) => {

   // Determines node div className
   let nodeClass = 'node';
   if (isStart) {
      nodeClass += ' node-start';
   }
   else if (isFinish) {
      nodeClass += ' node-finish';
   }
   else if (type === "Wall") {
      nodeClass += ' node-wall';
   }
   else if (type === "Mud") {
      nodeClass += ' node-mud';
   }
   else if (type === "Water") {
      nodeClass += ' node-water'
   }
   else if (type === "Sand") {
      nodeClass += ' node-sand'
   }
   else if (type === "Grass") {
      nodeClass += ' node-grass'
   }

   if (isVisited) {
      nodeClass += ' node-visited';
   }

   // Returns div representing node with appropriate className
   return (
      <div
         id={`node-${row}-${col}`}
         className={nodeClass}
         onMouseDown={(event) => onMouseDown(event, row, col)}
         onMouseEnter={() => onMouseEnter(row, col)}
         onMouseUp={() => onMouseUp()}
         onMouseLeave={() => onMouseLeave(row, col)}>
      </div>
   );
};

export default Node;
