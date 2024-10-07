import React from 'react';
import './Node.css';


const Node = ({ row, col, isStart, isFinish, isWall,
   onMouseDown, onMouseEnter, onMouseUp }) => {

   // Sets class for start, finish, and wall nodes
   let extraClass = '';
   if (isStart) {
      extraClass = 'node-start';
   }
   else if (isFinish) {
      extraClass = 'node-finish';
   } 
   else if (isWall) {
      extraClass = 'node-wall'
   }

   return (
      <div
         id={`node-${row}-${col}`}
         className={`node ${extraClass}`}
         onMouseDown={(event) => onMouseDown(event, row, col)}
         onMouseEnter={() => onMouseEnter(row, col)}
         onMouseUp={() => onMouseUp()}>
      </div>
   );
};

export default Node;