import React, { useState, useEffect } from 'react';
import './AlgDropdown.css'

const AlgDropdown = ({ algorithms, selectedAlgorithm, onAlgorithmChange }) => {
    const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => setIsOpen(!isOpen);  // toggle dropdown
	
    const handleOptionClick = (algorithm) => {
		setIsOpen(false);  // close dropdown after selection
		onAlgorithmChange(algorithm);
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