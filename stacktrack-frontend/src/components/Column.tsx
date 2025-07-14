import React, { useState } from 'react';
import {
  Droppable,
  Draggable,
  DraggableProvidedDragHandleProps
} from '@hello-pangea/dnd';
import Card from './Card';
import './Column.css';

interface ColumnProps {
  columnId: string;
  column: {
    name: string;
    items: { id: string; content: string }[];
  };
  dragHandleProps?: DraggableProvidedDragHandleProps;
  onDeleteColumn?: () => void;
  onAddCard?: (content: string) => void;
  onDeleteCard?: (cardId: string) => void;
}

const Column: React.FC<ColumnProps> = ({
  columnId,
  column,
  dragHandleProps,
  onDeleteColumn,
  onAddCard,
  onDeleteCard
}) => {
  const [newCard, setNewCard] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAddCard = () => {
    if (newCard.trim() && onAddCard) {
      onAddCard(newCard.trim());
      setNewCard('');
      setShowInput(false);
    }
  };

  return (
    <div className="column">
      <div className="column-header" {...dragHandleProps}>
        <h2>{column.name}</h2>
        {onDeleteColumn && (
          <button
            className="delete-column-btn"
            onClick={onDeleteColumn}
            title="Delete Column"
          >
            ✕
          </button>
        )}
      </div>

      <Droppable droppableId={columnId} type="card">
        {(provided) => (
          <div
            className="droppable-column"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {column.items.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className="card-wrapper"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card
                      content={item.content}
                      onDelete={() => onDeleteCard?.(item.id)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {showInput ? (
        <div className="add-card-input">
          <input
            type="text"
            placeholder="New card content"
            value={newCard}
            onChange={(e) => setNewCard(e.target.value)}
          />
          <button onClick={handleAddCard}>Add</button>
        </div>
      ) : (
        <button className="add-card-btn" onClick={() => setShowInput(true)}>
          + Add Card
        </button>
      )}
    </div>
  );
};

export default Column;
