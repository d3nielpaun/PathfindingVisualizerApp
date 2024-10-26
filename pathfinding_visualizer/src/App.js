import React, { useState } from 'react';
import './App.css';
import Header from './Header/Header';
import PathfindingVisualizer from './PathfindingVisualizer/PathfindingVisualizer';


const App = () => {
   const [selectedAlgorithm, setSelectedAlgorithm] = useState("Dijkstra's Algorithm");
   const [selectedNodeType, setSelectedNodeType] = useState("Wall");
   const [nodeTypes, setNodeTypes] = useState([
      {
         name: "Wall",
         weight: Infinity
      },
      {
         name: "Mud",
         weight: 80
      },
      {
         name: "Water",
         weight: 50
      },
   ]);
   const [isVisualizing, setIsVisualizing] = useState(false);
   const [resetGrid, setResetGrid] = useState(false);

   const onAlgorithmChange = (algorithm) => {
      setSelectedAlgorithm(algorithm);
   };

   const onNodeTypeChange = (nodeType) => {
      setSelectedNodeType(nodeType);
   }

   const onNodeWeightChange = (newNodeTypes) => {
      setNodeTypes(newNodeTypes);
   }

   const onStartButtonClick = () => {
      setIsVisualizing(true);
      setResetGrid(false);
   };

   const onResetButtonClick = () => {
      setResetGrid(true);
      setIsVisualizing(false);
   };

   const algorithms = ["Dijkstra's Algorithm", "Breadth-first Search", "Depth-first Search"];

   return (
      <div className="App">
         <div className="app-container">
            <Header
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
               selectedAlgorithm={selectedAlgorithm}
               nodeTypes={nodeTypes}
               selectedNodeType={selectedNodeType}
               isVisualizing={isVisualizing}
               resetGrid={resetGrid}>
            </PathfindingVisualizer>
         </div>
      </div>
   );
};


export default App;
