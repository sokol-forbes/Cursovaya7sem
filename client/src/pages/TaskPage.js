import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { MarkdownInput } from "../components/MarrkDownInput";
import { useHttp } from "../hooks/http.hook";

export const TaskPage = () => {
  const { id } = useParams();
  const { request, loading } = useHttp();
  const [task, setTask] = useState();
  // const user = useMemo(() => {
  //   const stored = localStorage.getItem("userData");

  //   if (stored) {
  //     return {
  //       role: JSON.parse(stored).role,
  //       id: JSON.parse(stored).userId,
  //     };
  //   }
  // }, [localStorage.getItem("userData")]);

  const onStatusChange = async (e) => {
    setTask((prev) => ({ ...prev, status: e.target.value }));
    if (id && e.target.value && e.target.value !== task.status) {
      await request("/task/" + id, "PUT", { status: e.target.value });
    }
  };

  const load = async (id) => {
    const response = await request(`/task/${id}`, "GET");

    if (response.status === 200) {
      setTask(response.body);
      // console.log(response);
    }
  };

  useEffect(() => {
    if (id) {
      load(id);
    }
  }, [id]);

  return (
    <div
      // onSubmit={onSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: "20px",
      }}
    >
      <div>
        <label htmlFor="exampleFormControlInput1" className="form-label w-25">
          Status
        </label>
        <select
          className="form-select"
          // disabled
          onChange={onStatusChange}
          value={task?.status}
        >
          <option value="todo">TODO</option>
          <option value="wip">WIP</option>
          <option value="done">DONE</option>
        </select>
      </div>
      <div>
        <label htmlFor="exampleFormControlInput1" className="form-label w-25">
          Priority
        </label>
        <select
          className="form-select"
          disabled
          // onChange={(e) => setPriority(e.currentTarget.value)}
          value={loading ? "..." : task?.priority}
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
          disabled
          type="email"
          className="form-control"
          name="email"
          id="exampleFormControlInput1"
          placeholder="name@example.com"
          value={loading ? "..." : task?.user.email}
          // onChange={(e) => setEmployee(e.target.value)}
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
            // min={date.current}
            // value={date.start}
            value={loading ? "..." : task?.started_at}
            disabled
            // value={'2022-12-12'}
            type="date"
            className="form-control"
            // onChange={(e) => {
            //   // console.log('click', e.currentTarget.value);
            //   setDate((prev) => ({
            //     ...prev,
            //     start: e.target.value,
            //   }));
            // }}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">
            end date
          </span>
          <input
            // min={date.start}
            // value={date.end}
            value={loading ? "..." : task?.ended_at}
            disabled
            type="date"
            className="form-control"
            // onChange={(e) =>
            //   setDate((prev) => ({
            //     ...prev,
            //     end: e.target.value,
            //   }))
            // }
          />
        </div>
      </div>
      <input
        type="text"
        className="form-control"
        name="email"
        id="exampleFormControlInput1"
        placeholder="title"
        disabled
        value={loading ? "..." : task?.title}
        // onChange={(e) => setTitle(e.target.value)}
        // onChange={changeHandler}
      />
      <MarkdownInput
        disabled
        description={loading ? "..." : task?.description}
        // setDescription={setDescription}
      />
      {/* <button type="submit">create</button> */}
    </div>
  );
};
