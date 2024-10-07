import React, { useState, useEffect } from 'react';
import './Node.css';


const Node = ({ row, col, isStart, isFinish, isWall, isVisited,
   onMouseDown, onMouseEnter, onMouseUp }) => {
   const [nodeClass, setNodeClass] = useState('node');

   useEffect(() => {
      let newClass = 'node';
      
      if (isStart) {
        newClass += ' node-start';
      }
      else if (isFinish) {
         newClass += ' node-finish';
      }
      else if (isWall) {
         newClass += ' node-wall';
      }
      if (isVisited) newClass += ' node-visited';
      setNodeClass(newClass);
   }, [isStart, isFinish, isWall, isVisited]);

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