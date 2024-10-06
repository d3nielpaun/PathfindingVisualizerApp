import React, { useState, useEffect } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import './PathfindingVisualizer.css';

// Initial start and finish node positions
const START_NODE_ROW = 9;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 9;
const FINISH_NODE_COL = 44;


const PathfindingVisualizer = () => {
    const [grid, setGrid] = useState([]);
    const [mousePressed, setMousePressed] = useState(false);

    useEffect(() => {
        const initialGrid = initializeGrid();
        setGrid(initialGrid);
    }, []);

    const handleMouseDown = (row, col) => {
        setMousePressed(true);
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
    };

    const handleMouseEnter = (row, col) => {
        if (mousePressed) {
            const newGrid = getNewGridWithWallToggled(grid, row, col);
            setGrid(newGrid);
        }
    };

    const handleMouseUp = () => {
        setMousePressed(false);
    };

    const handleMouseLeave = () => {
        setMousePressed(false);
    };

    const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-visited';
            }, 10 * i);
        }
    };

    const animateShortestPath = (nodesInShortestPathOrder) => {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-shortest-path';
            }, 50 * i);
        }
    };

    const visualizeDijkstra = () => {
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    };

    return (
        <div className="app-container">
            <header className="header">
                <h1>Pathfinding Visualizer</h1>
                <button onClick={() => visualizeDijkstra()}>
                    Dijkstra
                </button>
            </header>
            <div className="outer-grid-container">
                <div className="inner-grid-container">
                    <div className="grid" onMouseLeave={handleMouseLeave}>
                        {grid.map((row, rowIdx) => (
                            <div key={rowIdx} className="row">
                                {row.map((node, colIdx) => {
                                    const { isStart, isFinish, isWall } = node;
                                    return (
                                        <Node
                                            key={colIdx}
                                            row={rowIdx}
                                            col={colIdx}
                                            isStart={isStart}
                                            isFinish={isFinish}
                                            isWall={isWall}
                                            onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                                            onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                                            onMouseUp={() => handleMouseUp()}
                                        />
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

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const initializeGrid = () => {
    const initialGrid = [];
    for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
            currentRow.push(createNode(row, col));
        }
        initialGrid.push(currentRow);
    }
    return initialGrid;
};

const createNode = (row, col) => {
    return {
        row,
        col,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};

export default PathfindingVisualizer;
