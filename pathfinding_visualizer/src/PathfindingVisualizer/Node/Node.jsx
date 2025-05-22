/*
 * Manages node display.
 * Determines node styles based on its properties.
 */

import './Node.css';
import { memo } from 'react';

/**
 * Renders a grid node with specific styles based on its properties.
 * The node can represent different types (e.g., start, finish, wall, weighted nodes)
 * Handles mouse events for user interaction with node. 
 */
const Node = ({ row, col, type,
   onMouseDown, onMouseEnter, onMouseUp }) => {

   // Determines node div className
   let nodeClasses = ['node'];

   if (type === "Start") nodeClasses.push('node-start');
   else if (type === "Finish") nodeClasses.push('node-finish');
   else if (type === "Air") nodeClasses.push('node-air');
   else if (type === "Wall") nodeClasses.push('node-wall');
   else if (type === "Mud") nodeClasses.push('node-mud');
   else if (type === "Water") nodeClasses.push('node-water');
   else if (type === "Sand") nodeClasses.push('node-sand');
   else if (type === "Grass") nodeClasses.push('node-grass');

   const nodeClass = nodeClasses.join(' ');

   // Returns div representing node with appropriate className
   return (
      <div
         id={`node-${row}-${col}`}
         className={nodeClass}
         onMouseDown={(event) => onMouseDown(event, row, col)}
         onMouseEnter={() => onMouseEnter(row, col)}
         onMouseUp={() => onMouseUp()}>
      </div>
   );
};

export default memo(Node);
