import React, { useState, useEffect } from 'react';
import './Header.css';
import AlgDropdown from './Dropdowns/AlgDropdown'
import NodeDropdown from './Dropdowns/NodeDropdown'

const Header = ({ onAlgorithmChange, onStartButtonClick, onResetButtonClick }) => {


   return (
      <div className="header-container">
         <header className="header-title">Pathfinding Visualizer</header>
         <AlgDropdown
            onAlgorithmChange={onAlgorithmChange}>
         </AlgDropdown>
         <NodeDropdown>
         </NodeDropdown>
         <div className="button-container">
            <button className="start-button" onClick={onStartButtonClick}>Start</button>
            <button className="reset-button" onClick={onResetButtonClick}>Reset</button>
         </div>
      </div>
   );
};


export default Header;
