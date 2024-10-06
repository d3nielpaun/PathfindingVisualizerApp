import React, { useState } from 'react';
import './Node.css';


const Node = ({ row, col, isStart, isFinish,
    isWall, onMouseDown, onMouseEnter, onMouseUp }) => {

   
    // Sets class for start and finish nodes
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
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={() => onMouseUp()}>
        </div>
    );
};


export default Node;
