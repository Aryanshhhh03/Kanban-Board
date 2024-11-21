import React from "react";
import TaskList from "./taskList";
import "./taskStatusOverview.css";

const TaskStatusOverview = ({ groupedTasks }) => {
  // Dynamically retrieve all statuses from the groupedTasks keys
  const statuses = Object.keys(groupedTasks);

  return (
    <div className="task-status-overview">
      {statuses.map((status) => (
        <div className="task-column" key={status}>
          <div className="column-header">
            <h3>{status}</h3>
            <span className="task-count">
              {groupedTasks[status]?.length || 0}
            </span>
          </div>
          <TaskList tasks={groupedTasks[status] || []} />
        </div>
      ))}
    </div>
  );
};

export default TaskStatusOverview;
