/*
 * Facilitates transfer of user input between the Header and the PathfindingVisualizer components.
 */

import React, { useState } from 'react';
import './App.css';
import Header from './Header/Header';
import PathfindingVisualizer from './PathfindingVisualizer/PathfindingVisualizer';


/**
 * Main app component for the pathfinding visualizer. It manages the state and interaction between
 * the Header and PathfindingVisualizer components. This includes handling user input for algorithm 
 * selection, node type customization, and triggering grid visualization and reset actions.
 * 
 * @returns {JSX.Element} - The main structure of the app, containing the Header and PathfindingVisualizer components.
 */
const App = () => {
   const [isVisualizing, setIsVisualizing] = useState(null);  // Boolean indicating if algorithm is currently being visualized.
   const [resetGrid, setResetGrid] = useState(null);  // Toggle used to indicate when user clicks reset button.
   const [selectedAlgorithm, setSelectedAlgorithm] = useState("Dijkstra's Algorithm");  // Currently selected algorithm.
   const [selectedNodeType, setSelectedNodeType] = useState("Wall");  // Currently selected node type.
   // Array of objects representing each node type
   const [nodeTypes, setNodeTypes] = useState([
      {
         name: "Wall",
         weight: Infinity
      },
      {
         name: "Mud",
         weight: 50
      },
      {
         name: "Water",
         weight: 30
      },
      {
         name: "Sand",
         weight: 10
      },
      {
         name: "Grass",
         weight: 5,
      }
   ]);

   // Array of different algorithms
   const algorithms = [
      "Dijkstra's Algorithm",
      "Breadth-first Search",
      "Depth-first Search"
   ];


   /**
    * Updates selectedAlgorithm.
    * 
    * @param {String} algorithm - The new selected algorithm.
    */
   const onAlgorithmChange = (algorithm) => {
      setSelectedAlgorithm(algorithm);
   };


   /**
    * Updates selectedNodeType.
    * 
    * @param {String} nodeType - The new selected node type.
    */
   const onNodeTypeChange = (nodeType) => {
      setSelectedNodeType(nodeType);
   }


   /**
    * Updates nodeTypes when user changes weights.
    * 
    * @param {Array<Object>} newNodeTypes - the new node types
    */
   const onNodeWeightChange = (newNodeTypes) => {
      setNodeTypes(newNodeTypes);
   }

   /**
    * Sets isVisualizing to true when user clicks start button.
    */
   const onStartButtonClick = () => {
      setIsVisualizing(true);
   };

   /**
    * Toggles resetGrid when user clicks reset button.
    */
   const onResetButtonClick = () => {
      setResetGrid(prev => !prev);
   };

   // Returns main structure of app
   return (
      <div className="App">
         <div className="app-container">
            <Header
               isVisualizing={isVisualizing}
               algorithms={algorithms}
               selectedAlgorithm={selectedAlgorithm}
               onAlgorithmChange={onAlgorithmChange}
               nodeTypes={nodeTypes}
               selectedNodeType={selectedNodeType}
               onNodeTypeChange={onNodeTypeChange}
               onNodeWeightChange={onNodeWeightChange}
               onStartButtonClick={onStartButtonClick}
               onResetButtonClick={onResetButtonClick}>
            </Header>
            <PathfindingVisualizer
               isVisualizing={isVisualizing}
               setIsVisualizing={setIsVisualizing}
               resetGrid={resetGrid}
               selectedAlgorithm={selectedAlgorithm}
               nodeTypes={nodeTypes}
               selectedNodeType={selectedNodeType}>
            </PathfindingVisualizer>
         </div>
      </div>
   );
};


export default App;
