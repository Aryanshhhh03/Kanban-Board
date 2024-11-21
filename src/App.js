import React, { useEffect, useState } from 'react';
import TaskStatusOverview from '../src/components/taskStatusOverview';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load saved settings from localStorage or default values
  const [groupBy, setGroupBy] = useState(() => localStorage.getItem('groupBy') || 'status');
  const [orderBy, setOrderBy] = useState(() => localStorage.getItem('orderBy') || 'priority');
  const [displayType, setDisplayType] = useState('grouped');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api.quicksell.co/v1/internal/frontend-assignment'
        );
        const data = await response.json();
        setTasks(data.tickets);
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Save state to localStorage whenever groupBy or orderBy changes
  useEffect(() => {
    localStorage.setItem('groupBy', groupBy);
  }, [groupBy]);

  useEffect(() => {
    localStorage.setItem('orderBy', orderBy);
  }, [orderBy]);

  const handleGroupByChange = (event) => {
    setGroupBy(event.target.value);
  };

  const handleOrderByChange = (event) => {
    setOrderBy(event.target.value);
  };

  const sortTasks = (tasksToSort) => {
    return tasksToSort.sort((a, b) => {
      if (orderBy === 'priority') {
        return b.priority - a.priority;
      } else if (orderBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  const groupTasks = (tasksToGroup) => {
    const userMap = users.reduce((map, user) => {
      map[user.id] = user.name;
      return map;
    }, {});

    return tasksToGroup.reduce((acc, task) => {
      let groupKey;

      if (groupBy === 'user') {
        groupKey = userMap[task.userId] || 'Unassigned';
      } else {
        groupKey = task[groupBy];
      }

      acc[groupKey] = acc[groupKey] || [];
      acc[groupKey].push(task);
      return acc;
    }, {});
  };

  const filteredTasks = groupTasks(sortTasks(tasks));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <div className="taskbar">
        <div className="dropdown">
          <button className="dropdown-button">
            <i className="icon-filter"></i> Display
          </button>
          <div className="dropdown-content">
            <div className="dropdown-section">
              <label>Grouping</label>
              <select value={groupBy} onChange={handleGroupByChange}>
                <option value="status">Status</option>
                <option value="priority">Priority</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="dropdown-section">
              <label>Ordering</label>
              <select value={orderBy} onChange={handleOrderByChange}>
                <option value="priority">Priority</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {displayType === 'grouped' ? (
        <TaskStatusOverview groupedTasks={filteredTasks} />
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-item">
              <h4>{task.title}</h4>
              <p>Status: {task.status}</p>
              <p>Priority: {task.priority}</p>
              <p>Assigned to: {task.assignee ? task.assignee.name : 'Unassigned'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
