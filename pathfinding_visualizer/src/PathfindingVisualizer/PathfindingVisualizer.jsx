import React, { useState, useEffect } from 'react';
import Node from './Node/Node';
import './PathfindingVisualizer.css';


const PathfindingVisualizer = () => {
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        // Initializes nodes for graph
        const initialNodes = [];
        for (let row = 0; row < 20; row++) {
            const currentRow = [];
            for (let col = 0; col < 50; col++) {
                const currentNode = {
                    row,
                    col,
                    isStart: row === 9 && col === 5,
                    isFinish: row === 9 && col === 45
                };
                currentRow.push(currentNode);
            }
            initialNodes.push(currentRow);
        }
        setNodes(initialNodes); // Set the nodes state with the initial structure
    }, []);

    return (
        <div className="app-container">
            <header className="header">
                <h1>Pathfinding Visualizer</h1>
            </header>
            <div className="outer-grid-container">
                <div className="inner-grid-container">
                    <div className="grid">
                        {nodes.map((row, rowIdx) => (
                            <div key={rowIdx} className="row">
                                {row.map((node, colIdx) => {
                                    const { isStart, isFinish } = node;
                                    return (
                                        <Node
                                            key={colIdx}
                                            isStart={isStart}
                                            isFinish={isFinish}>
                                        </Node>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PathfindingVisualizer;