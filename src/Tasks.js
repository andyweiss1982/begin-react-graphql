import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/react-hooks";
import {
  USER_QUERY,
  CREATE_TASK_MUTATION,
  DELETE_TASK_MUTATION,
} from "./graphql-queries";
import { AuthContext } from "./Authentication";

const Tasks = () => {
  const { user, signOut } = useContext(AuthContext);
  const [createTask] = useMutation(CREATE_TASK_MUTATION);
  const [deleteTask] = useMutation(DELETE_TASK_MUTATION);
  const [description, setDescription] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    createTask({
      variables: { description },
      refetchQueries: [{ query: USER_QUERY }],
    });
    setDescription("");
  };

  const handleDelete = (task) => {
    if (confirm("Are you sure?")) {
      deleteTask({
        variables: { key: task.key },
        refetchQueries: [{ query: USER_QUERY }],
      });
    }
  };

  return (
    <main>
      <form name="tasks" onSubmit={handleSubmit}>
        <input
          type="text"
          required
          autoComplete="off"
          placeholder={`What's on the agenda, ${user.key}?`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="button" onClick={signOut}>
          Sign Out
        </button>
      </form>
      <ul>
        {user.tasks.map((task) => (
          <li key={task.key}>
            {task.description}
            <button className="danger" onClick={() => handleDelete(task)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Tasks;
