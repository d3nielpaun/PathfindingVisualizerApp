import React, { useState } from 'react';
import './App.css';
import Header from './Header/Header';
import PathfindingVisualizer from './PathfindingVisualizer/PathfindingVisualizer';


const App = () => {
   const [isVisualizing, setIsVisualizing] = useState(null);
   const [resetGrid, setResetGrid] = useState(null);
   const [selectedAlgorithm, setSelectedAlgorithm] = useState("Dijkstra's Algorithm");
   const [selectedNodeType, setSelectedNodeType] = useState("Wall");
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

   const algorithms = [
      "Dijkstra's Algorithm",
      "Breadth-first Search",
      "Depth-first Search"
   ];

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
   };

   const onResetButtonClick = () => {
      setResetGrid(prev => !prev);
      
   };

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
