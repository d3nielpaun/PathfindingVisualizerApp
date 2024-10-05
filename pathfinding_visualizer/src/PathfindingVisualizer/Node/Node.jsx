import React, { useState } from 'react';
import './Node.css';


const Node = ({ isStart, isFinish }) => {
    
    // Sets class for start and finish nodes
    let extraClass = '';
    if (isStart) {
        extraClass = 'node-start';
    }
    else if (isFinish) {
        extraClass = 'node-finish';
    }

    return <div className={`node ${extraClass}`}></div>;
};

export default Node;