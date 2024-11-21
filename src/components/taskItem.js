import React from "react";
import "./taskItem.css";
import defaultAvatar from "./icons/images.png";

const TaskItem = ({ task }) => {
  return (
    <div className="task-item">
      <div className="task-header">
        <span className="task-id">{task.id}</span>
        <img
          src={task.assigneeAvatar || defaultAvatar}
          alt="User Avatar"
          className="task-avatar"
        />
      </div>
      <h4 className="task-title">{task.title}</h4>
      <div className="task-meta">
        <span className="task-priority">
          <i className="priority-icon">!</i>
        </span>
        <span className="task-tag">{task.tag[0]}</span>
      </div>
    </div>
  );
};

export default TaskItem;
