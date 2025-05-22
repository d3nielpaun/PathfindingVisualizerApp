/*
 * Facilitates transfer of user input between the Header and the PathfindingVisualizer components.
 */

import React, { useState, useRef } from 'react';
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
   const visualizerRef = useRef();
   const [selectedAlgorithm, setSelectedAlgorithm] = useState("Breadth-first Search");  // Currently selected algorithm.
   const [selectedNodeType, setSelectedNodeType] = useState("Wall");  // Currently selected node type.
   const [isRunning, setIsRunning] = useState(false);  // Boolean indicating animation in progress.
   const [isPaused, setIsPaused] = useState(false);  // Boolean indicating animation is paused.
   const [isDone, setIsDone] = useState(false);  // Boolean indicating animation is done.
   const [animationSpeed, setAnimationSpeed] = useState("1x");  // Animation speed for the visualizer.
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
      },
      {
         name: "Air",
         weight: 1,
      }
   ]);

   // Array of different algorithms
   const algorithms = [
      "Breadth-first Search",
      "Depth-first Search",
      "Dijkstra's Algorithm",
      "A* Search",
      "Greedy Best-first Search"
   ];

   // Array of different grid actions
   const resetTypes = [
      "Reset",
      "Clear Grid",
      "Remove Walls",
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
   };

   /**
    * Updates nodeTypes when user changes weights.
    * 
    * @param {Array<Object>} newNodeTypes - the new node types
    */
   const onNodeWeightChange = (newNodeTypes) => {
      setNodeTypes(newNodeTypes);
      visualizerRef.current?.updateWeights();
   };

   /**
    * Updates animation speed when user clicks on the speed button.
    */
   const handleSpeedClick = () => {
      switch (animationSpeed) {
         case "1x": setAnimationSpeed("1.5x"); break;
         case "1.5x": setAnimationSpeed("2x"); break;
         case "2x": setAnimationSpeed("0.5x"); break;
         case "0.5x": setAnimationSpeed("1x"); break;
         default: console.warn("Unknown speed:", animationSpeed);
      }
   }

   /**
    * Resets the grid based on the selected reset type.
    * 
    * @param {String} resetType - The type of reset action to perform.
    */
   const handleResetClick = (resetType) => {
      setIsRunning(false);
      setIsPaused(false);
      setIsDone(false);
      visualizerRef.current?.resetGrid(resetType);
   };

   /**
    * Starts/resumes algorithm visualization.
    */
   const handleStartClick = () => {
      if (!isRunning && !isPaused) {
         // Fresh start
         setIsRunning(true);
         setIsPaused(false);
         visualizerRef.current?.startVisualization(selectedAlgorithm);
      } else if (isRunning && isPaused) {
         // Resume
         setIsPaused(false);
         visualizerRef.current?.resumeVisualization();
      }
   };

   /**
    * Pauses algorithm visualization.
    */
   const handlePauseClick = () => {
      setIsPaused(true);
      visualizerRef.current?.pauseVisualization();
   };

   /**
    * Restarts algorithm visualization.
    */
   const handleRestartClick = () => {
      setIsRunning(true);
      setIsPaused(false);
      setIsDone(false);
      visualizerRef.current?.restartVisualization(selectedAlgorithm);
   };

   /**
    * Skips algorithm visualization.
    */
   const handleSkipClick = () => {
      visualizerRef.current?.skipVisualization();
   }

   /**
    * Handles the completion of the visualization.
    */
   const handleDoneVisualization = () => {
      setIsDone(true);
   }

   // Returns main structure of app
   return (
      <div className="App">
         <div className="app-container">
            <Header
               algorithms={algorithms}
               resetTypes={resetTypes}
               animationSpeed={animationSpeed}
               isRunning={isRunning}
               isPaused={isPaused}
               isDone={isDone}
               selectedAlgorithm={selectedAlgorithm}
               onAlgorithmChange={onAlgorithmChange}
               nodeTypes={nodeTypes}
               selectedNodeType={selectedNodeType}
               onNodeTypeChange={onNodeTypeChange}
               onNodeWeightChange={onNodeWeightChange}
               handleSpeedClick={handleSpeedClick}
               handleResetClick={handleResetClick}
               handleStartClick={handleStartClick}
               handlePauseClick={handlePauseClick}
               handleRestartClick={handleRestartClick}
               handleSkipClick={handleSkipClick}
               >
            </Header>
            <PathfindingVisualizer
               ref={visualizerRef}
               nodeTypes={nodeTypes}
               animationSpeed={animationSpeed}
               isRunning={isRunning}
               selectedNodeType={selectedNodeType}
               handleDoneVisualization={handleDoneVisualization}>
            </PathfindingVisualizer>
         </div>
      </div>
   );
};

export default App;