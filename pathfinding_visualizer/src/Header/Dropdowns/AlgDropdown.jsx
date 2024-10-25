import React, { useState, useEffect } from 'react';
import './AlgDropdown.css'

const AlgDropdown = ({ onAlgorithmChange }) => {
    const [isOpen, setIsOpen] = useState(false);
	const [selectedAlgorithm, setSelectedAlgorithm] = useState("Dijkstra's Algorithm");
	
	const algorithms = ["Dijkstra's Algorithm", "Breadth-first Search", "Depth-first Search"];

	useEffect(() => {
		onAlgorithmChange(selectedAlgorithm);
	}, [selectedAlgorithm])

	const toggleDropdown = () => setIsOpen(!isOpen);  // toggle dropdown
	
    const handleOptionClick = (algorithm) => {
        setSelectedAlgorithm(algorithm);
        setIsOpen(false); // close dropdown after selection
    };

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