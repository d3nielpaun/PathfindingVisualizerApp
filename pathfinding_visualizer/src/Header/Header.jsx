/*
 * Manages Header component.
 * Allows user to select algorithm, node type, and start/reset visualization.
 */

import './Header.css';
import { FaPlay, FaPause, FaRedo, FaStepForward } from 'react-icons/fa';
import AlgDropdown from './Dropdowns/AlgDropdown'
import NodeDropdown from './Dropdowns/NodeDropdown'
import ResetDropdown from './Dropdowns/ResetDropdown'

/**
 * The Header component for the pathfinding visualizer. 
 * It provides user controls for selecting the pathfinding algorithm, node types, and 
 * starting or resetting the algorithm visualization.
 */
const Header = ({ algorithms, resetTypes, animationSpeed, isRunning, isPaused, isDone,
   selectedAlgorithm, onAlgorithmChange, nodeTypes, selectedNodeType, onNodeTypeChange,
   onNodeWeightChange, handleSpeedClick, handleResetClick, handleStartClick,
   handlePauseClick, handleRestartClick, handleSkipClick }) => {

   // Returns React component for header
   return (
      <div className="header-container">
         <header className="header-title">
            Pathfinding<br />Visualizer
         </header>
         <div className="selection-container">
            <AlgDropdown
               algorithms={algorithms}
               selectedAlgorithm={selectedAlgorithm}
               onAlgorithmChange={onAlgorithmChange}>
            </AlgDropdown>
            <NodeDropdown
               nodeTypes={nodeTypes}
               selectedNodeType={selectedNodeType}
               onNodeTypeChange={onNodeTypeChange}
               onNodeWeightChange={onNodeWeightChange}>
            </NodeDropdown>
            <ResetDropdown
               resetTypes={resetTypes}
               handleResetClick={handleResetClick}>
            </ResetDropdown>
            <div className="speed-container">
               <p className="speed-header">Speed:</p>
               <div className="animation-speed" onClick={handleSpeedClick}>
                  {animationSpeed}
               </div>
            </div>
         </div>
         <div className="control-container">
            {(!isRunning || isPaused || isDone) &&
               (<div
                  className={`button ${isDone ? "disabled-btn" : ""}`}
                  id="start-btn"
                  onClick={isDone ? undefined : handleStartClick}>
                  <FaPlay className={isDone ? "disabled" : ""} />
               </div>)}
            {(isRunning && !isPaused && !isDone) &&
               (<div
                  className="button"
                  id="pause-btn"
                  onClick={handlePauseClick}>
                  <FaPause />
               </div>)}
            <div
               className={`button ${!isRunning ? "disabled-btn" : ""}`}
               id="restart-btn"
               onClick={!isRunning ? undefined : handleRestartClick}>
               <FaRedo className={!isRunning ? "disabled" : ""} />
            </div>
            <div
               className={`button ${isRunning && !isDone ? "" : "disabled-btn"}`}
               id="skip-btn"
               onClick={isRunning && !isDone ? handleSkipClick : undefined}>
               <FaStepForward className={isRunning && !isDone ? "" : "disabled"} />
            </div>
         </div>
      </div>
   );
};

export default Header;