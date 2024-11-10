/*
 * Algorithm Dropdown component in Header
 */

import React, { useState, useEffect } from 'react';
import './AlgDropdown.css'


/**
 * Algorithm Dropdown Component in Header.
 * Allows user to select an algorithm to visualize.
 * 
 * @param {string[]} algorithms - List of available algorithms for the user to choose from.
 * @param {string} selectedAlgorithm - The currently selected algorithm.
 * @param {function} onAlgorithmChange - Handler for updating the selected algorithm.
 * @param {Array<Object>} nodeTypes - List of node types with associated weights for the grid.
 * 
 * @returns {JSX.Element} - A dropdown for algorithm selection.
 */
const AlgDropdown = ({ algorithms, selectedAlgorithm, onAlgorithmChange }) => {
	const [isOpen, setIsOpen] = useState(false); // Boolean for if dropdown is open.
	
	const toggleDropdown = () => setIsOpen(!isOpen);  // toggles dropdown
	
	/**
	 * Handles algorithm selection.
	 * 
	 * @param {String} algorithm - algorithm that user selected.
	 */
    const handleOptionClick = (algorithm) => {
		setIsOpen(false);  // close dropdown after selection
		onAlgorithmChange(algorithm);
    };


	// Returns React component for algorithm dropdown
	return (
		<div className="alg-dropdown-container">
			<p>Algorithm:</p>
			<div className="alg-dropdown">
				<div className="alg-dropdown-header" onClick={toggleDropdown}>
					{selectedAlgorithm}
					<span className="alg-dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
				</div>
				{isOpen && (
					<ul className="alg-dropdown-list">
						{algorithms.map((algorithm, index) => (
							<li
								key={index}
								className="alg-dropdown-list-item"
								onClick={() => handleOptionClick(algorithm)}>
								{algorithm}
								{algorithm === selectedAlgorithm &&
									(<span className="selected-alg-checkmark">&#10004;</span>)
								}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}


export default AlgDropdown;
