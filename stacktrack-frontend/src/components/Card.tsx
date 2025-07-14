import React, { useState } from 'react';
import './Card.css';

interface CardProps {
  content: string;
  onDelete: () => void;
}

const Card: React.FC<CardProps> = ({ content, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardTitle, setCardTitle] = useState(content);
  const [cardDescription, setCardDescription] = useState('');

  const handleSave = () => {
    // Optional: Add save logic (API, local state, etc.)
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Card Preview */}
      <div className="card" onClick={() => setIsModalOpen(true)}>
        <span className="card-content" title={cardTitle}>
          {cardTitle.length > 40 ? `${cardTitle.slice(0, 40)}...` : cardTitle}
        </span>
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete Card"
          aria-label="Delete Card"
        >
          ×
        </button>
      </div>

      {/* Card Details Modal */}
      {isModalOpen && (
        <div className="card-modal">
          <div className="card-modal-content">
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>

            <input
              className="modal-title-input"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              placeholder="Card Title"
              maxLength={60}
            />

            <textarea
              className="modal-description"
              value={cardDescription}
              onChange={(e) => setCardDescription(e.target.value)}
              placeholder="Add more details..."
            />

            <button className="save-btn" onClick={handleSave}>Save</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
