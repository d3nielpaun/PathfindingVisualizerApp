import React, { useState, useEffect } from 'react';
import './AlgDropdown.css'

const AlgDropdown = ({ onAlgorithmChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState("Dijkstra's Algorithm");

	useEffect(() => {
		onAlgorithmChange(selectedAlgorithm);
	}, [selectedAlgorithm])

	const toggleDropdown = () => setIsOpen(!isOpen);  // toggle dropdown
	
    const handleOptionClick = (algorithm) => {
        setSelectedAlgorithm(algorithm);
        setIsOpen(false); // close dropdown after selection
    };

    const algorithms = ["Dijkstra's Algorithm", "Breadth-first Search", "Depth-first Search"];

	return (
		<div className="alg-dropdown-container">
			<p>Algorithm:</p>
			<div className="alg-dropdown">
				<div className="alg-dropdown-header" onClick={toggleDropdown}>
					{selectedAlgorithm}
					<span className="arrow">{isOpen ? "▲" : "▼"}</span>
				</div>
				{isOpen && (
					<ul className="dropdown-list">
					{algorithms.map((algorithm, index) => (
						<li
						key={index}
						className="dropdown-list-item"
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