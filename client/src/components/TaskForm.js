import { useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

import { MarkdownInput } from "./MarrkDownInput";

export const TaskForm = ({ departmentId }) => {
  const message = useMessage();
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [employee, setEmployee] = useState("");
  const [title, setTitle] = useState("");
  const currentDate = new Date();
  const [date, setDate] = useState({
    current: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`,
    start: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`,
    end: '',
  });

  const { request, loading } = useHttp();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!employee || employee.length === 0) {
      message("Employee is required");
    }

    if (!title || title.length === 0) {
      message("Title is required");
    }

    if (!date?.end) {
      message("Task end date is required");
    }

    const response = await request('/task/create', 'POST', {
        title,
        priority,
        assignedTo: employee,
        description,
        departmentId,
        started_at: date.start,
        ended_at: date.end
    })

    if (response.status === 200 || response.status === 201) {
      message('Task created')
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: "20px",
      }}
    >
      <div>
        <label htmlFor="exampleFormControlInput1" className="form-label w-25">
          Priority
        </label>
        <select
          className="form-select"
          onChange={(e) => setPriority(e.currentTarget.value)}
          value={priority}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      <div>
        <label htmlFor="exampleFormControlInput1" className="form-label w-25">
          For
        </label>
        <input
          type="email"
          className="form-control"
          name="email"
          id="exampleFormControlInput1"
          placeholder="name@example.com"
          onChange={(e) => setEmployee(e.target.value)}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          columnGap: "20px",
        }}
      >
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">
            start date
          </span>
          <input
            min={date.current}
            value={date.start}
            // value={'2022-12-12'}
            type="date"
            className="form-control"
            onChange={(e) => {
              // console.log('click', e.currentTarget.value);
              setDate((prev) => ({
                ...prev,
                start: e.target.value,
              }));
            }}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">
            end date
          </span>
          <input
            min={date.start}
            value={date.end}
            type="date"
            className="form-control"
            onChange={(e) =>
              setDate((prev) => ({
                ...prev,
                end: e.target.value,
              }))
            }
          />
        </div>
      </div>
      <input
        type="text"
        className="form-control"
        name="email"
        id="exampleFormControlInput1"
        placeholder="title"
        onChange={(e) => setTitle(e.target.value)}
        // onChange={changeHandler}
      />
      <MarkdownInput
        description={description}
        setDescription={setDescription}
      />
      <button type="submit">create</button>
    </form>
  );
};
