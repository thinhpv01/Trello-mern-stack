import React from "react";
import "./Card.scss";
const Card = ({ card }) => {
  return (
    <div className="card-item">
      {card.cover && (
        <img
          className="card-cover"
          src={card.cover}
          alt="avatar"
          onMouseDown={(e) => e.preventDefault()}
        />
      )}
      {card.title}
    </div>
  );
};

export default Card;
