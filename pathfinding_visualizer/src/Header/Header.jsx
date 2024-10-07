import React, { useState, useEffect } from 'react';
import './Header.css'

const Header = ({ onAlgorithmChange, onStartButtonClick, onResetButtonClick }) => {

   const handleAlgorithmChange = (event) => {
      onAlgorithmChange(event.target.value);
   };

   return (
      <div className="header-container">
         <header className="header-title">Pathfinding Visualizer</header>
         <div className="dropdown-container">
               <label htmlFor="alg-dropdown" className="label">Algorithm: </label>
               <select id="alg-dropdown" className="dropdown" onChange={handleAlgorithmChange}>
                  <option value="Dijkstra">Dijkstra's Algorithm</option>
               </select>
         </div>
         <div className="button-container">
            <button className="start-button" onClick={onStartButtonClick}>Start</button>
            <button className="reset-button" onClick={onResetButtonClick}>Reset</button>
         </div>
      </div>
   );
};

export default Header;
