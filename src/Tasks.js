import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  TASKS_QUERY,
  CREATE_TASK_MUTATION,
  DELETE_TASK_MUTATION,
} from "./graphql-client";

const Tasks = () => {
  const { data } = useQuery(TASKS_QUERY);
  const [createTask] = useMutation(CREATE_TASK_MUTATION);
  const [deleteTask] = useMutation(DELETE_TASK_MUTATION);
  const [description, setDescription] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    createTask({
      variables: { description },
      refetchQueries: [{ query: TASKS_QUERY }],
    });
    setDescription("");
  };

  const handleDelete = (task) => {
    if (confirm("Are you sure?")) {
      deleteTask({
        variables: { key: task.key },
        refetchQueries: [{ query: TASKS_QUERY }],
      });
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          required
          autoComplete="off"
          placeholder="What's on the agenda?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </form>
      <ul>
        {data?.tasks?.map((task) => (
          <li key={task.key}>
            {task.description}
            <button onClick={() => handleDelete(task)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Tasks;
