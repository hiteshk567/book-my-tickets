import React from "react";

import "./node.css";

const Node = (props) => {
  const newClass = props.isAvailable
    ? props.isSelected
      ? "yellow"
      : "green"
    : "red";
  return (
    <div
      className={`node ${newClass}`}
      id={`node-${props.row}-${props.col}`}
      row={props.row}
      col={props.col}
      onClick={() => {
        return !props.isAvailable
          ? null
          : !props.isSelected
          ? props.addSeat(
              props.row,
              props.col,
              props.isSelected,
              props.isAvailable
            )
          : props.removeSeat(
              props.row,
              props.col,
              props.isSelected,
              props.isAvailable
            );
      }}
    >
      <i class="fas fa-couch"></i>
    </div>
  );
};

export default Node;
