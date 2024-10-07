import React, { useState } from 'react';
import './App.css';
import Header from './Header/Header';
import PathfindingVisualizer from './PathfindingVisualizer/PathfindingVisualizer';


const App = () => {
   const [selectedAlgorithm, setSelectedAlgorithm] = useState("Dijkstra");
   const [isVisualizing, setIsVisualizing] = useState(false);
   const [resetGrid, setResetGrid] = useState(false);

   const onAlgorithmChange = (algorithm) => {
      setSelectedAlgorithm(algorithm);
   };

   const onStartButtonClick = () => {
      setIsVisualizing(true);
   };

   const onResetButtonClick = () => {
      setResetGrid(prev => !prev);
      setIsVisualizing(false);
   };

   return (
      <div className="App">
         <div className="app-container">
            <Header
               onAlgorithmChange={onAlgorithmChange}
               onStartButtonClick={onStartButtonClick}
               onResetButtonClick={onResetButtonClick}>
            </Header>
            <PathfindingVisualizer
               selectedAlgorithm={selectedAlgorithm}
               isVisualizing={isVisualizing}
               resetGrid={resetGrid}>   
            </PathfindingVisualizer>
         </div>
      </div>
   );
};


export default App;
