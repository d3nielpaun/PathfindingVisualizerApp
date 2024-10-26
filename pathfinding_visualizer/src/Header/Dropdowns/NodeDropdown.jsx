import React, { useState } from 'react';
import './NodeDropdown.css'


const NodeDropdown = ({ nodeTypes, selectedNodeType, onNodeTypeChange, onNodeWeightChange }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => setIsOpen(!isOpen);  // toggle dropdown
	
	const handleOptionClick = (nodeType) => {
		setIsOpen(false); // close dropdown after selection
        onNodeTypeChange(nodeType.name);
	};
	
	const handleWeightChange = (weight, nodeType) => {
		nodeType.weight = parseInt(weight);
		onNodeWeightChange([...nodeTypes]);
	}


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
								className="node-dropdown-list-item">
								<div className="node-name-container" onClick={() => handleOptionClick(nodeType)}>
									<div className={`node-type ${nodeType.name.toLowerCase()}`}></div>
									{nodeType.name}
								</div>
								{nodeType.name !== "Wall" && (
									<div className="weight-slider-container">
										<label htmlFor={`${nodeType.name.toLowerCase()}-weight`}>{nodeType.weight}</label>
										<input className="node-weight-slider" id={`${nodeType.name.toLowerCase()}-weight`}
											type="range" min={1} max={100} step={1}  value={nodeType.weight}
											onChange={(e) => handleWeightChange(e.target.value, nodeType)} />
									</div>
								)}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}


export default NodeDropdown;
