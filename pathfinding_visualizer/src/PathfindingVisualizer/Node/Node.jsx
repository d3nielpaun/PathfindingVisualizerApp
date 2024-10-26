import React, { useState, useEffect } from 'react';
import './Node.css';


const Node = ({ row, col, isStart, isFinish, type, isVisited,
   onMouseDown, onMouseEnter, onMouseUp, onMouseLeave }) => {

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

   return (
      <div
         id={`node-${row}-${col}`}
         className={nodeClass}
         onMouseDown={(event) => onMouseDown(event, row, col)}
         onMouseEnter={() => onMouseEnter(row, col)}
         onMouseUp={() => onMouseUp(row, col)}
         onMouseLeave={() => onMouseLeave(row, col)}>
      </div>
   );
};

export default Node;