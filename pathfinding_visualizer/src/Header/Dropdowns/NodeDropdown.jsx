import React, { useState, useEffect } from 'react';
import './AlgDropdown.css'

const AlgDropdown = ({  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedNodeType, setSelectedNodeType] = useState(null);

	const toggleDropdown = () => setIsOpen(!isOpen);  // toggle dropdown
	
    const handleOptionClick = (nodeType) => {
        setSelectedNodeType(nodeType);
        setIsOpen(false); // close dropdown after selection
    };

    const nodeTypes = ["Wall", "Air", "Water"];

	return (
		<div className="node-dropdown-container">
			<p>Node Type:</p>
			<div className="node-dropdown">
				<div className="node-dropdown-header" onClick={toggleDropdown}>
					<span className="arrow">{isOpen ? "▲" : "▼"}</span>
				</div>
				{isOpen && (
					<ul className="dropdown-list">
					{nodeTypes.map((nodeType, index) => (
						<li
						key={index}
						className="dropdown-list-item"
						onClick={() => handleOptionClick(nodeType)}>
						{nodeType}
						</li>
					))}
					</ul>
				)}
			</div>
		</div>
	);
}


const selectedNodeView = (nodeType) => {
    
}


export default AlgDropdown;