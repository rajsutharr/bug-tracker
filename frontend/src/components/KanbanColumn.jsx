import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import KanbanCard from './KanbanCard';

// 1. Added onEdit to the destructured props
const KanbanColumn = ({ id, title, issues, onDelete, onEdit }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="kanban-column">
      <div className="column-header">
        <h3>{title}</h3>
        <span className="count">{issues.length}</span>
      </div>
      <div className="column-content" style={{ minHeight: '100px' }}>
        {issues.map((issue) => (
          <KanbanCard 
            key={issue.id} 
            issue={issue} 
            onDelete={onDelete} 
            onEdit={onEdit} // 2. Passing it down to each card
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;