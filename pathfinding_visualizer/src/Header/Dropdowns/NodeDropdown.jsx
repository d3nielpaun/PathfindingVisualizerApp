import React, { useState, useEffect } from 'react';
import './NodeDropdown.css'


const NodeDropdown = ({  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedNodeType, setSelectedNodeType] = useState("Wall");

	const toggleDropdown = () => setIsOpen(!isOpen);  // toggle dropdown
	
    const handleOptionClick = (nodeType) => {
        setSelectedNodeType(nodeType.name);
        setIsOpen(false); // close dropdown after selection
    };

    const nodeTypes = [
		{
			name: "Wall",
			weight: Infinity
		},
		{
			name: "Mud",
			weight: 80
		},
		{
			name: "Water",
			weight: 50
		},
	];

	return (
		<div className="node-dropdown-container">
			<p>Node Type:</p>
			<div className="node-dropdown">
				<div className="node-dropdown-header">
					<div className="selected-node-container">
						<div className={`node-type ${selectedNodeType.toLowerCase()}`}></div>
						{selectedNodeType}
					</div>
					<div className="node-dropdown-arrow-container" onClick={toggleDropdown}>
						<span className="node-dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
					</div>
				</div>
				{isOpen && (
					<ul className="node-dropdown-list">
						{nodeTypes.map((nodeType, index) => (
							<li
								key={index}
								className="node-dropdown-list-item"
								onClick={() => handleOptionClick(nodeType)}>
								<div className={`node-type ${nodeType.name.toLowerCase()}`}></div>
								{nodeType.name}
								{nodeType.name !== "Wall" && (<input type="range" min="0" max="100" className="node-weight-slider"
									value={nodeType.weight} />)}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}


export default NodeDropdown;
