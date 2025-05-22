/*
 * Algorithm Dropdown component in Header
 */

import { useState } from 'react';
import './AlgDropdown.css'


/**
 * Algorithm dropdown component in Header.
 * Allows user to select an algorithm to visualize.
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
					<div className="selected-alg-container">
						{selectedAlgorithm}
					</div>
					<div className="alg-dropdown-arrow-container" onClick={toggleDropdown}>
						<span className="alg-dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
					</div>
				</div>
				{isOpen && (
					<ul className="alg-dropdown-list">
						{algorithms
							.filter(algorithm => algorithm !== selectedAlgorithm)
							.map((algorithm, index) => (
							<li
								key={index}
								className="alg-dropdown-list-item"
								onClick={() => handleOptionClick(algorithm)}>
								{algorithm}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}


export default AlgDropdown;
