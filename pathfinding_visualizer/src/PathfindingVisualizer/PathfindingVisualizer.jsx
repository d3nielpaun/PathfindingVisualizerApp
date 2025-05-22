/*
 * Manages grid display.
 * Controls algorithm execution and animation.
 */

import { useState, useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import Node from './Node/Node';
import { dijkstra } from '../algorithms/dijkstra';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import { astar } from '../algorithms/astar';
import { gbfs } from '../algorithms/gbfs';
import './PathfindingVisualizer.css';


/**
 * Manages the grid and controls the execution of pathfinding algorithm animations.
 * Handles user interaction with the grid.
 */
const PathfindingVisualizer = forwardRef((props, ref) => {
	const {
		nodeTypes,  // List of node types with weights
		animationSpeed,  // Current animation speed
		selectedNodeType, // Current selected node type
		isRunning, // Tracks if algorithm is running
		handleDoneVisualization, // Callback function to handle when visualization is done
	} = props;
	const grid = useRef([]);  // 2D array that holds node objects
	const [gridVisual, setGridVisual] = useState([]);  // 2D array that holds node visual properties
	const NUM_OF_ROWS = useRef(null);  // Number of rows in the grid
	const NUM_OF_COLS = useRef(null);  // Number of columns in the grid
	const START_NODE_ROW = useRef(null);  // Row index of start node
	const START_NODE_COL = useRef(null);  // Column index of start node
	const FINISH_NODE_ROW = useRef(null);  // Row index of finish node
	const FINISH_NODE_COL = useRef(null);  // Column index of finish node
	const num_executions = useRef(0);  // Number of times an algorithm has been executed
	const [mousePressed, setMousePressed] = useState(false);  // Tracks when mouse is pressed down and held
	const [movingStartNode, setMovingStartNode] = useState(false);  // Tracks if user is moving start node
	const [movingFinishNode, setMovingFinishNode] = useState(false);  // Tracks if user is moving finish node
	const previousStartType = useRef("Air");  // Previous type of start node
	const previousFinishType = useRef("Air");  // Previous type of finish node
	const currentStep = useRef(0);  // Current step in the animation
	const animationSteps = useRef([]);  // Array of animation steps
	const animationTimeout = useRef(null);  // Timeout for animation
	const speedToDelay = useRef({  // Mapping of animation speed to delay time
		'0.5x': 50,
		'1x': 20,
		'1.5x': 10,
		'2x': 1,
	});

	/**
	 * Creates a 2D array of objects that represent nodes in the grid.
	 */
	const initializeGrid = useCallback(() => {
		NUM_OF_ROWS.current = Math.floor(window.innerHeight / 27) - 4;
		NUM_OF_COLS.current = Math.floor(window.innerWidth / 27);
		START_NODE_ROW.current = Math.floor(NUM_OF_ROWS.current / 2);
		START_NODE_COL.current = Math.floor(NUM_OF_COLS.current / 4);
		FINISH_NODE_ROW.current = Math.floor(NUM_OF_ROWS.current / 2);
		FINISH_NODE_COL.current = Math.floor((NUM_OF_COLS.current / 4) * 3);

		const initialGrid = [];
		const initialGridVisual = [];
		for (let row = 0; row < NUM_OF_ROWS.current; row++) {
			const currentRow = [];
			const currentRowVisual = [];
			for (let col = 0; col < NUM_OF_COLS.current; col++) {
				const node = createNode(row, col);
				const type =
					row === START_NODE_ROW.current && col === START_NODE_COL.current
						? "Start"
						: row === FINISH_NODE_ROW.current && col === FINISH_NODE_COL.current
							? "Finish"
							: "Air";
		
				currentRow.push(node);
				currentRowVisual.push(type);
			}
			initialGrid.push(currentRow);
			initialGridVisual.push(currentRowVisual);
		}
		grid.current = initialGrid;
		setGridVisual(initialGridVisual);
	}, []);

	/**
	 * Initializes the grid when the component mounts.
	 */
	useEffect(() => {
		initializeGrid();
	}, [initializeGrid]);

	/**
	 * Creates an object representing a node in the grid.
	 * 
	 * @param {number} row - The row index of the node.
	 * @param {number} col - The column index of the node.
	 * @returns {Object} - Object representing a node.
	 */
	const createNode = (row, col) => {
		return {
			row,
			col,
			g: Infinity,
			h: Infinity,
			f: Infinity,
			weight: 1,
			isVisited: false,
			previousNode: null,
		};
	};

	/**
	 * Updates the type of a node in the grid.
	 * Triggers a re-render of the grid.
	 * 
	 * @param {number} row - The row index of the node.
	 * @param {number} col  - The column index of the node.
	 * @param {String} newType - The new type of the node.
	 * @returns {void} - Doesn't return anything.
	 */
	const updateNodeType = (row, col, newType) => {
		setGridVisual(prev => {
			const newVisual = [...prev];
			newVisual[row] = [...newVisual[row]];
			newVisual[row][col] = newType;
			return newVisual;
		});
	};

	/**
	 * Handles the mouse down event on a grid node.
	 * If user presses on start node, sets movingStartNode to true.
	 * If user presses on finish node, sets movingFinishNode to true.
	 * Else, changes the node's type to the users selected node type.
	 * 
	 * @param {MouseEvent} event - The mouse event trigged by user interaction with grid.
	 * @param {number} row - The row index of node that was pressed.
	 * @param {number} col - The column index of the node that was pressed.
	 * @returns {void} - Doesn't return anything.
	 */
	const handleMouseDown = (event, row, col) => {
		event.preventDefault();  // Prevents default drag-and-drop behavior of browser
		if (isRunning) return;
		setMousePressed(true);
		const node = grid.current[row][col];
		const nodeType = gridVisual[row][col];
		if (nodeType === "Start") {  // Clicking on the start node
			setMovingStartNode(true);
		}
		else if (nodeType === "Finish") {  // Clicking on finish node
			setMovingFinishNode(true);
		}
		else if (nodeType !== selectedNodeType) {  // Changing node type
			updateNodeType(row, col, selectedNodeType);
			const nt = nodeTypes.find((nt) => nt.name === selectedNodeType);
			node.weight = nt.weight;
		}
	};
   
	/**
	 * Handles the mouse enter event on a grid node.
	 * When user drags mouse into node, proper action is carried out (move start/finish node, set node type).
	 * 
	 * @param {number} row - The row index of node that was pressed.
	 * @param {number} col - The column index of the node that was pressed.
	 * @returns {void} - Doesn't return anything.
	 */
	const handleMouseEnter = (row, col) => {
		if (!mousePressed) return;  // Does nothing if mouse is not pressed
		const node = grid.current[row][col];
		const nodeType = gridVisual[row][col];
		// Carries out appropriate action for each scenario
		if (movingStartNode) {
			if (row === FINISH_NODE_ROW.current && col === FINISH_NODE_COL.current) return;
			if (row === START_NODE_ROW.current && col === START_NODE_COL.current) return;
			// Reset previous start node
			updateNodeType(START_NODE_ROW.current, START_NODE_COL.current, previousStartType.current);
			const previousType = nodeTypes.find(nt => nt.name === previousStartType.current);
			grid.current[START_NODE_ROW.current][START_NODE_COL.current].weight = previousType.weight;
			
			// Set new start node
			previousStartType.current = nodeType;
			updateNodeType(row, col, "Start");
			node.weight = 0;
			START_NODE_ROW.current = row;
			START_NODE_COL.current = col;
		}
		else if (movingFinishNode) {
			if (row === FINISH_NODE_ROW.current && col === FINISH_NODE_COL.current) return;
			if (row === START_NODE_ROW.current && col === START_NODE_COL.current) return;
			// Reset previous finish node
			updateNodeType(FINISH_NODE_ROW.current, FINISH_NODE_COL.current, previousFinishType.current);
			const previousType = nodeTypes.find(nt => nt.name === previousFinishType.current);
			grid.current[FINISH_NODE_ROW.current][FINISH_NODE_COL.current].weight = previousType.weight;

			// Set new finish node
			previousFinishType.current = nodeType;
			updateNodeType(row, col, "Finish");
			node.weight = 0;
			FINISH_NODE_ROW.current = row;
			FINISH_NODE_COL.current = col;
		}
		else {
			if (nodeType === "Start" || nodeType === "Finish") return;
			if (nodeType !== selectedNodeType) {
				updateNodeType(row, col, selectedNodeType);
				const nt = nodeTypes.find(nt => nt.name === selectedNodeType);
				node.weight = nt.weight;
			}
		}
	};   

	/**
	 * Handles mouse up event on a grid node.
	 * Resets all mouse trackers.
	 * 
	 * @returns {void} - Doesn't return anything.
	 */
	const handleMouseUp = () => {
		setMousePressed(false);
		if (movingStartNode) {
			setMovingStartNode(false);
		}
		else if (movingFinishNode) {
			setMovingFinishNode(false);
		}
	};

	/**
	 * Handles mouse leave event for entire grid.
	 * Resets mouse trackers.
	 * Sets start/finish node to last node that was pressed.
	 * 
	 * @returns {void} - Doesn't return anything.
	 */
	const handleMouseLeaveGrid = () => {
		setMousePressed(false);
		if (movingStartNode) {
			setMovingStartNode(false);
			updateNodeType(START_NODE_ROW.current, START_NODE_COL.current, "Start");
		}
		else if (movingFinishNode) {
			setMovingFinishNode(false);
			updateNodeType(FINISH_NODE_ROW.current, FINISH_NODE_COL.current, "Finish");
		}
	};

	/**
	 * Updates the weights of each type node when nodeTypes is changed.
	 * 
	 * @returns {void} - Doesn't return anything.
	 */
	const updateWeights = () => {
		for (let i = 0; i < NUM_OF_ROWS.current; i++) {
			for (let j = 0; j < NUM_OF_COLS.current; j++) {
				const nodeType = gridVisual[i][j];
				if (nodeType !== "Start" && nodeType !== "Finish") {
					const nt = nodeTypes.find((nt) => nt.name === nodeType);
					grid.current[i][j].weight = nt.weight;
				}
			}
		}
	};  

	/**
	 * Begins visualization of selected algorithm.
	 * 
	 * @param {String} algorithm - The algorithm to be visualized.
	 * @returns {void} - Doesn't return anything.
	 */
	const startVisualization = (algorithm) => {
		currentStep.current = 0;
		switch (algorithm) {
			case "Dijkstra's Algorithm": visualizeDijkstra(); break;
			case "Breadth-first Search": visualizeBFS(); break;
			case "Depth-first Search": visualizeDFS(); break;
			case "A* Search": visualizeAStar(); break;
			case "Greedy Best-first Search": visualizeGBFS(); break;
			default: console.warn("Unknown algorithm:", algorithm);
		}
	};

	/**
	 * Resumes the visualization from the current step.
	 * 
	 * @returns {void} - Doesn't return anything.
	 */
	const resumeVisualization = () => {
		runNextStep();
	}

	/**
	 * Pauses the visualization.
	 * 
	 * @returns {void} - Doesn't return anything.
	 */
	const pauseVisualization = () => {
		if (animationTimeout.current) {
			clearTimeout(animationTimeout.current);
		}
	};

	/**
	 * Restarts the visualization from the beginning.
	 * 
	 * @returns {void} - Doesn't return anything.
	 */
	const restartVisualization = () => {
		if (animationTimeout.current) {
			clearTimeout(animationTimeout.current);
		}
		currentStep.current = 0;
		resetVisualization();
		runNextStep();
	};

	/**
	 * Resets the visualization by clearing all visited nodes and shortest path nodes.
	 * 
	 * @returns {void} - Doesn't return anything.
	 */
	const resetVisualization = () => {
		for (const row of grid.current) {
			for (const node of row) {
				node.isVisited = false;
				node.g = Infinity;
				node.h = Infinity;
				node.f = Infinity;
				node.previousNode = null;
			}
		}
	
		for (let row = 0; row < grid.current.length; row++) {
			for (let col = 0; col < grid.current[0].length; col++) {
				const nodeDiv = document.getElementById(`node-${row}-${col}`);
				if (nodeDiv) {
					nodeDiv.classList.remove("node-visited", "node-shortest-path");
				}
			}
		}
	};

	/**
	 * Skips the visualization by running all animation steps immediately.
	 * 
	 * @returns {void} - Doesn't return anything.
	 */
	const skipVisualization = () => {
		if (animationTimeout.current) {
			clearTimeout(animationTimeout.current);
		}
	  
		while (currentStep.current < animationSteps.current.length) {
			animationSteps.current[currentStep.current]();
			currentStep.current++;
		}
		handleDoneVisualization();
	};

	/**
	 * Cancels the visualization by clearing all animation steps and resetting the current step.
	 * 
	 * @returns {void} - Doesn't return anything.
	 */
	const cancelVisualization = () => {
		if (animationTimeout.current) {
		   clearTimeout(animationTimeout.current);
		}
		animationSteps.current = [];
		currentStep.current = 0;
	 };

	/**
	 * Builds the animation steps for the visualization and places them in the animationSteps array.
	 * Begins the animation by calling runNextStep.
	 * 
	 * @param {Array<Object>} visitedNodesInOrder - Array of nodes visited in order.
	 * @param {Array<Object>} nodesInShortestPathOrder - Array of nodes in the shortest path.
	 * @returns {void} - Doesn't return anything.
	 */
	const buildAnimationSteps = (visitedNodesInOrder, nodesInShortestPathOrder) => {
		const steps = [];
		for (let i = 1; i < visitedNodesInOrder.length; i++) {
		  	const node = visitedNodesInOrder[i];
		  	if (gridVisual[node.row][node.col] === "Finish") continue;
			steps.push(() => {
				const element = document.getElementById(`node-${node.row}-${node.col}`);
				if (element) element.classList.add("node-visited");
			});
		}
		
		for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
			const node = nodesInShortestPathOrder[i];
			steps.push(() => {
				const element = document.getElementById(`node-${node.row}-${node.col}`);
				if (element) element.classList.add("node-shortest-path");
			});
		}

		animationSteps.current = steps;
		currentStep.current = 0;
		runNextStep();
	};
	  
	const runNextStep = () => {
		const delay = speedToDelay.current[animationSpeed];
		console.log(delay);
		if (currentStep.current >= animationSteps.current.length) {
			handleDoneVisualization();
			return;
		};
	
		animationSteps.current[currentStep.current]();
		currentStep.current++;
	
		animationTimeout.current = setTimeout(() => runNextStep(delay), delay);
	};

	/**
	 * Handles the visualization of Dijkstra's Algorithm.
	 * Formats output for Dijkstra's Algorithm.
	 * 
	 * @returns {void} - Doesn't return anything.
	 */
	const visualizeDijkstra = () => {
		// Calls dijkstra.js
		const startNode = grid.current[START_NODE_ROW.current][START_NODE_COL.current];
		const finishNode = grid.current[FINISH_NODE_ROW.current][FINISH_NODE_COL.current];
		const dijkstraOutput = dijkstra(grid.current, startNode, finishNode);
		
		// Formats and displays output
		const outputWindow = document.getElementById("output-window");
		outputWindow.innerHTML += `<p>[${num_executions.current}] Dijkstra's Algorithm visited ${dijkstraOutput.numNodesVisited} nodes.
				${dijkstraOutput.shortestPath.length === 0 ? "Could not find the finish node." :
				`Shortest Path Length: ${dijkstraOutput.shortestPathLength}.`}</p>`;
		num_executions.current++;
		outputWindow.scrollTop = outputWindow.scrollHeight;

		// Animates visualization
		buildAnimationSteps(dijkstraOutput.visitedNodesInOrder, dijkstraOutput.shortestPath);
	};

	/**
	 * Handles the visualization of Breadth-first Search.
	 * Formats output for Breadth-first Search.
	 * 
	 * @returns {void} - Doesn't return anything.
	 */
	const visualizeBFS = () => {
		// Calls bfs.js
		const startNode = grid.current[START_NODE_ROW.current][START_NODE_COL.current];
		const finishNode = grid.current[FINISH_NODE_ROW.current][FINISH_NODE_COL.current];
		const bfsOutput = bfs(grid.current, startNode, finishNode);

		// Formats and displays output
		const outputWindow = document.getElementById("output-window");
		outputWindow.innerHTML += `<p>[${num_executions.current}] Breadth-first Search visited ${bfsOutput.numNodesVisited} nodes. 
				${bfsOutput.shortestPath.length === 0 ? "Could not find the finish node." :
				`Shortest Path Length: ${bfsOutput.shortestPathLength}.`}</p>`;
		num_executions.current++;
		outputWindow.scrollTop = outputWindow.scrollHeight;

		// Animates visualization
		buildAnimationSteps(bfsOutput.visitedNodesInOrder, bfsOutput.shortestPath);
	};

	/**
	 * Handles the visualization of Depth-first Search.
	 * Formats output for Depth-first Search.
	 * 
	 * @returns {void} - Doesn't return anything.
	 */
	const visualizeDFS = () => {
		// Calls dfs.js
		const startNode = grid.current[START_NODE_ROW.current][START_NODE_COL.current];
		const finishNode = grid.current[FINISH_NODE_ROW.current][FINISH_NODE_COL.current];
		const dfsOutput = dfs(grid.current, startNode, finishNode);

		// Formats output
		const outputWindow = document.getElementById("output-window");
		outputWindow.innerHTML = `<p>[${num_executions.current}] Depth-first Search visited ${dfsOutput.numNodesVisited} nodes. 
				${dfsOutput.shortestPath.length === 0 ? "Could not find the finish node." :
				`Shortest Path Length: ${dfsOutput.shortestPathLength}.`}</p>`;
		num_executions.current++;
		outputWindow.scrollTop = outputWindow.scrollHeight;

		// Animates visualization
		buildAnimationSteps(dfsOutput.visitedNodesInOrder, dfsOutput.shortestPath);
	};

	/**
	 * Handles the visualization of A* Search.
	 * Formats output for A* Search.
	 * 
	 * @returns {void} - Doesn't return anything.
	 */
	const visualizeAStar = () => {
		// Calls astar.js
		const startNode = grid.current[START_NODE_ROW.current][START_NODE_COL.current];
		const finishNode = grid.current[FINISH_NODE_ROW.current][FINISH_NODE_COL.current];
		const aStarOutput = astar(grid.current, startNode, finishNode);
		
		// Formats and displays output
		const outputWindow = document.getElementById("output-window");
		outputWindow.innerHTML += `<p>[${num_executions.current}] A* Search visited ${aStarOutput.numNodesVisited} nodes.
				${aStarOutput.shortestPath.length === 0 ? "Could not find the finish node." :
				`Shortest Path Length: ${aStarOutput.shortestPathLength}.`}</p>`;
		num_executions.current++;
		outputWindow.scrollTop = outputWindow.scrollHeight;

		// Animates visualization
		buildAnimationSteps(aStarOutput.visitedNodesInOrder, aStarOutput.shortestPath);
	};

	/**
	 * Handles the visualization of Greedy Best-first Search.
	 * Formats output for Greedy Best-first Search.
	 * 
	 * @returns {void} - Doesn't return anything.
	 */
	const visualizeGBFS = () => {
		// Calls gbfs.js
		const startNode = grid.current[START_NODE_ROW.current][START_NODE_COL.current];
		const finishNode = grid.current[FINISH_NODE_ROW.current][FINISH_NODE_COL.current];
		const gbfsOutput = gbfs(grid.current, startNode, finishNode);
		
		// Formats and displays output
		const outputWindow = document.getElementById("output-window");
		outputWindow.innerHTML += `<p>[${num_executions.current}] Greedy Best-first Search visited ${gbfsOutput.numNodesVisited} nodes.
				${gbfsOutput.shortestPath.length === 0 ? "Could not find the finish node." :
				`Shortest Path Length: ${gbfsOutput.shortestPathLength}.`}</p>`;
		num_executions.current++;
		outputWindow.scrollTop = outputWindow.scrollHeight;

		// Animates visualization
		buildAnimationSteps(gbfsOutput.visitedNodesInOrder, gbfsOutput.shortestPath);
	};

	/**
	 * Determines which reset type was selected and calls the appropriate function.
	 * 
	 * @param {String} resetType - The type of reset to be performed.
	 */
	const resetGrid = (resetType) => {
		cancelVisualization();
		resetVisualization();
		if (resetType === "Reset") {
			return;
		}
		else if (resetType === "Clear Grid") {
			resetAllNodes();
		}
		else if (resetType === "Remove Walls") {
			removeWalls();
		}
	};

	/**
	 * Resets all nodes to their default state.
	 * 
	 * @returns {Array<Array<Object>>} - A new grid that is reset.
	 */
	const resetAllNodes = () => {
		for (const row of grid.current) {
			for (const node of row) {
				node.isVisited = false;
				node.g = Infinity;
				node.h = Infinity;
				node.f = Infinity;
				node.weight = 1;
				node.previousNode = null;
			}
		}
		setGridVisual(prev =>
			prev.map(row =>
				row.map(type => {
					if (type === "Start" || type === "Finish") return type;
					return "Air";
				})
			)
		);
	};

	/**
	 * Removes all walls from the grid.
	 * 
	 * @returns {void} - Doesn't return anything.
	 */
	const removeWalls = () => {
		for (const row of grid.current) {
			for (const node of row) {
				node.isVisited = false;
				node.g = Infinity;
				node.h = Infinity;
				node.f = Infinity;
				node.weight = node.weight === Infinity ? 1 : node.weight;
				node.previousNode = null;
			}
		}
		setGridVisual(prev =>
			prev.map(row =>
				row.map(type => {
					if (type === "Wall") return "Air";
					return type;
				})
			)
		);
	};

	/**
	 * Forward ref to allow parent component to call functions in this component.
	 */
	useImperativeHandle(ref, () => ({
		startVisualization,
		resumeVisualization,
		pauseVisualization,
		restartVisualization,
		skipVisualization,
		resetGrid,
		updateWeights
	}));

	// Returns React component representing grid
	return (
		<div className="visualizer_container">
			<div className="output-window" id="output-window"></div>
			<div className="grid" onMouseLeave={handleMouseLeaveGrid}>
				{gridVisual.map((row, rowIndex) => (
					<div key={rowIndex} className="row">
						{row.map((type, colIndex) => (
							<Node
								key={`${rowIndex}-${colIndex}`}
								row={rowIndex}
								col={colIndex}
								type={type}
								onMouseDown={(event) => handleMouseDown(event, rowIndex, colIndex)}
								onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
								onMouseUp={() => handleMouseUp()}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
});

export default PathfindingVisualizer;