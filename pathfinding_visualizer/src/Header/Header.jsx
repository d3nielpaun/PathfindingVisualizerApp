/*
 * Manages Header component.
 * Allows user to select algorithm, node type, and start/reset visualization.
 */

import './Header.css';
import AlgDropdown from './Dropdowns/AlgDropdown'
import NodeDropdown from './Dropdowns/NodeDropdown'

/**
 * The Header component for the pathfinding visualizer. 
 * It provides user controls for selecting the pathfinding algorithm, node types, and 
 * starting or resetting the algorithm visualization.
 * 
 * @param {boolean} isVisualizing - Indicates if an algorithm is currently being visualized.
 * @param {string[]} algorithms - List of available algorithms for the user to choose from.
 * @param {string} selectedAlgorithm - The currently selected algorithm.
 * @param {function} onAlgorithmChange - Handler for updating the selected algorithm.
 * @param {Array<Object>} nodeTypes - List of node types with associated weights for the grid.
 * @param {string} selectedNodeType - The currently selected node type.
 * @param {function} onNodeTypeChange - Handler for updating the selected node type.
 * @param {function} onNodeWeightChange - Handler for updating the weights of node types.
 * @param {function} onStartButtonClick - Handler for starting the visualization.
 * @param {function} onResetButtonClick - Handler for resetting the grid.
 * 
 * @returns {JSX.Element} - A header section with dropdowns for algorithm and node type selection, 
 * and buttons for starting or resetting the visualization.
 */
const Header = ({ isVisualizing, algorithms, selectedAlgorithm, onAlgorithmChange,
   nodeTypes, selectedNodeType, onNodeTypeChange, onNodeWeightChange,
   onStartButtonClick, onResetButtonClick }) => {

   // Returns React component for header
   return (
      <div className="header-container">
         <header className="header-title">Pathfinding Visualizer</header>
         {!isVisualizing && (
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
            </div>
         )}
         {isVisualizing && (
            <div className="output-container">
               <p className="output-text" id="output-text"></p>
            </div>
         )}
         <div className="button-container">
            <button className="start-button" onClick={onStartButtonClick}>Start</button>
            <button className="reset-button" onClick={onResetButtonClick}>Reset</button>
         </div>
      </div>
   );
};


export default Header;
