/* eslint-disable react/prop-types */
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import iconCheck from "../assets/images/icon-check.svg";
import iconCross from "../assets/images/icon-cross.svg";

function ListItem({
  index,
  checkHandler,
  removeItemHandler,
  title,
  isCompleted,
}) {
  const [hover, setHover] = useState(false);

  return (
    <Draggable draggableId={`item-${index}`} index={index}>
      {(provided) => (
        <div
          className={`item flex space-x-4 border-b p-3`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}>
          <div
            onClick={(e) => {
              checkHandler(e, index);
            }}
            className={`circle ${
              isCompleted ? "bg-blue-500" : ""
            } flex h-5 w-5 items-center justify-center rounded-full border border-gray-400 hover:cursor-pointer`}>
            {isCompleted && <img src={iconCheck} alt="" />}
          </div>
          <p
            className={`${
              isCompleted ? "line-through" : ""
            } w-[85%] overflow-auto`}>
            {title}
          </p>
          {hover && (
            <div className="crossIcon px-2">
              <img
                onClick={() => {
                  removeItemHandler(index);
                }}
                src={iconCross}
                alt="cross"
                className="cursor-pointer"
              />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default ListItem;
