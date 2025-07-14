import React, { useState } from 'react';
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from '@hello-pangea/dnd';
import Column from './Column';
import './Board.css';

interface CardType {
  id: string;
  content: string;
}

interface ColumnType {
  name: string;
  items: CardType[];
}

const initialData: Record<string, ColumnType> = {
  todo: {
    name: 'To Do',
    items: [
      { id: '1', content: 'Set up project' },
      { id: '2', content: 'Create board layout' }
    ]
  },
  'in-progress': {
    name: 'In Progress',
    items: []
  },
  done: {
    name: 'Done',
    items: []
  }
};

const Board: React.FC = () => {
  const [columns, setColumns] = useState<Record<string, ColumnType>>(initialData);
  const [newColumnName, setNewColumnName] = useState('');

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === 'column') {
      const entries = Object.entries(columns);
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      setColumns(Object.fromEntries(entries));
      return;
    }

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceItems = [...sourceCol.items];
    const destItems = [...destCol.items];
    const [moved] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, moved);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceCol,
          items: sourceItems
        }
      });
    } else {
      destItems.splice(destination.index, 0, moved);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceCol,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destCol,
          items: destItems
        }
      });
    }
  };

  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;
    const id = Date.now().toString();
    setColumns({
      ...columns,
      [id]: {
        name: newColumnName,
        items: []
      }
    });
    setNewColumnName('');
  };

  const handleDeleteColumn = (id: string) => {
    const copy = { ...columns };
    delete copy[id];
    setColumns(copy);
  };

  const handleAddCard = (columnId: string, content: string) => {
    const id = Date.now().toString();
    const newCard: CardType = { id, content };
    const updated = {
      ...columns,
      [columnId]: {
        ...columns[columnId],
        items: [...columns[columnId].items, newCard]
      }
    };
    setColumns(updated);
  };

  const handleDeleteCard = (columnId: string, cardId: string) => {
    const updatedItems = columns[columnId].items.filter((card) => card.id !== cardId);
    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        items: updatedItems
      }
    });
  };

  return (
    <div className="board-wrapper">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <div className="board-container" ref={provided.innerRef} {...provided.droppableProps}>
              {Object.entries(columns).map(([id, column], index) => (
                <Draggable draggableId={id} index={index} key={id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="column-wrapper"
                    >
                      <Column
                        columnId={id}
                        column={column}
                        dragHandleProps={provided.dragHandleProps ?? undefined}
                        onDeleteColumn={() => handleDeleteColumn(id)}
                        onAddCard={(text) => handleAddCard(id, text)}
                        onDeleteCard={(cardId) => handleDeleteCard(id, cardId)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <div className="add-column">
                <input
                  type="text"
                  placeholder="New column name"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                />
                <button onClick={handleAddColumn}>+ Add Column</button>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Board;
