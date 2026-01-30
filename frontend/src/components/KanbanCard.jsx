import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const KanbanCard = ({ issue, onDelete, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: issue.id,
  });

  // Apply transformation and reduce opacity while dragging for a better UI feel
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'pointer',
  };

  const handleCardClick = (e) => {
    // If the user is clicking the delete button, don't trigger Edit
    if (e.target.tagName.toLowerCase() === 'button') return;
    
    // Only trigger edit if the card isn't being actively dragged
    if (!isDragging) {
      onEdit(issue);
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="issue-card"
      onClick={handleCardClick}
      {...listeners} 
      {...attributes} 
    >
      <div className="issue-header">
        <span className="issue-id">#{issue.id}</span>
        <button 
          className="delete-btn" 
          title="Delete Issue"
          onClick={(e) => {
            e.stopPropagation(); // Stops the drag AND the card click
            onDelete(issue.id);
          }}
        >
          ×
        </button>
      </div>
      
      <div className="issue-body">
        <h3>{issue.title}</h3>
        <p>{issue.description}</p>
      </div>

      {/* Optional: Add a small visual indicator for the drag handle */}
      <div className="drag-handle-dots">⋮⋮</div>
    </div>
  );
};

export default KanbanCard;