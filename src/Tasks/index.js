import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  TASKS_QUERY,
  CREATE_TASK_MUTATION,
  DELETE_TASK_MUTATION,
} from "../client";

const Tasks = () => {
  const { data } = useQuery(TASKS_QUERY);
  const [createTask] = useMutation(CREATE_TASK_MUTATION);
  const [deleteTask] = useMutation(DELETE_TASK_MUTATION);
  const [description, setDescription] = useState("");
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTask({
            variables: { description },
            refetchQueries: ["Tasks"],
          });
          setDescription("");
        }}
      >
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </form>
      <ul>
        {data?.tasks?.map((task) => (
          <li key={task.key}>
            {task.description}
            <button
              onClick={() => {
                if (confirm("Are you sure?")) {
                  deleteTask({
                    variables: { key: task.key },
                    refetchQueries: ["Tasks"],
                  });
                }
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Tasks;
