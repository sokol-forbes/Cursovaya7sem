import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import "./Task.css";

export const Tasks = ({ departmentId, owner_id }) => {
  const history = useHistory();
  const { request } = useHttp();
  const [tasks, setTasks] = useState([]);
  const user = useMemo(() => {
    const stored = localStorage.getItem("userData");

    if (stored) {
      return {
        role: JSON.parse(stored).role,
        id: JSON.parse(stored).userId,
      };
    }
  }, [localStorage.getItem("userData")]);

  const load = async (departmentId, user_id) => {
    const response = await request(
      `/task?dep=${departmentId}${user_id ? `&usr_id?=${user_id}` : ""}`,
      "GET"
    );

    if (response.status === 200) {
      setTasks(response.body);
      console.log(response);
    }
  };

  useEffect(() => {
    if (!departmentId) return;
    if (user.id == owner_id || user.role === "admin") {
      load(departmentId);
    } else {
      load(departmentId, user.id);
    }
  }, [user, owner_id, departmentId]);

  return (
    <div>
      <h2>
        {user.role === "admin" || owner_id == user.id
          ? "Department tasks"
          : "My tasks"}
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: "20px",
          justifyContent: "center",
        }}
      >
        {tasks.map((task) => {
          const color =
            task.priority === "low"
              ? undefined
              : task.priority === "medium"
              ? "green"
              : task.priority === "high"
              ? "warning"
              : "danger";

          return (
            <Task
              key={task.id}
              title={task.title}
              value={task.user.email}
              description={task.priority}
              color={color}
              onClick={() => history.push('/tasks/' + task.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export const Task = ({
  title,
  description,
  color = "disabled",
  value,
  onClick,
  className,
}) => (
  <button className={["card", className].join(" ")} onClick={onClick}>
    <div className={["card__indicator", `card__indicator_${color}`].join(" ")}>
      &nbsp;
    </div>
    <div className={"text__wrapper"}>
      <div className={"card__title"}>{title}</div>
      <div className={"card__description"}>
        {description} ({"2022-12-12"} - {"2022-13-13"})
      </div>
    </div>

    <div className={"value__wrapper"}>
      <div className={["card__value"].join(" ")}>{value}</div>
    </div>
  </button>
);
