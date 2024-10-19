import React, { useState, useEffect } from 'react';
import './Node.css';


const Node = ({ row, col, isStart, isFinish, isWall, isVisited,
   onMouseDown, onMouseEnter, onMouseUp }) => {

   let nodeClass = 'node';
   
   if (isStart) {
      nodeClass += ' node-start';
   }
   else if (isFinish) {
      nodeClass += ' node-finish';
   }
   else if (isWall) {
      nodeClass += ' node-wall';
   }
   if (isVisited) {
      nodeClass += ' node-visited';
   }

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

export default Node;