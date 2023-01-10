import React from "react";
import "./Card.scss";
const Card = ({ card }) => {
  return (
    <li className="card-item">
      {card.cover && (
        <img className="card-cover" src={card.cover} alt="avatar" />
      )}
      {card.title}
    </li>
  );
};

export default Card;
