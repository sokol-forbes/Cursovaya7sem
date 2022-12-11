import { useHistory } from "react-router";
import { React, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMessage } from "../hooks/message.hook";
import { useHttp } from "../hooks/http.hook";
import { getDepsAction } from "../redux/actions/dep.actions";
import { DepartmentInfo } from "../components/DepartamentInfo";
import { Loader } from "../components/Loader";
import { MarkdownInput } from "../components/MarrkDownInput";
import { TaskForm } from "../components/TaskForm";
import { Tasks } from "../components/Tasks";

export const DepartmentPage = () => {
  const history = useHistory();
  const id = history.location.pathname.split("/")[2];
  const message = useMessage();
  const { request, loading } = useHttp();
  const deps = useSelector((state) => state.dep.deps);
  const dispatch = useDispatch();
  const [form, setForm] = useState();

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const getDeps = async () => {
    const data = await request("/department", "GET");
    if (data.status === 200) {
      dispatch(getDepsAction(data.body));
    }
  };

  const user = useMemo(() => {
    const stored = localStorage.getItem("userData");

    if (stored) {
      return {
        role: JSON.parse(stored).role,
        id: JSON.parse(stored).userId,
      };
    }
  }, [localStorage.getItem("userData")]);

  useEffect(() => {
    if (!deps && !loading) {
      getDeps();
    }
  }, [deps, loading]);

  if (loading) {
    return <Loader />;
  }

  const addHandler = async () => {
    const data = await request(`/department/${id}`, "PUT", { ...form });
    if (data.status === 404 || data.status === 400) {
      message(data.body.message);
      setForm("");
    } else if (data.status === 200) {
      message("Worker added");
      getDeps();
      setForm("");
      history.push(`/departments/${id}`);
    }
  };

  const changeBossHandler = async () => {
    const data = await request(`/department/${id}/change`, "PUT", { ...form });

    if (data.status === 404) {
      message(data.body.message);
    } else if (data.status === 400) {
      message(data.body.message);
    } else if (data.status === 200) {
      message(data.body.message);
      getDeps();
    }
  };

  return (
    <div
      style={{
        columnGap: "30px",
      }}
      className="d-flex"
    >
      <div className="d-flex flex-column">
        {!!deps &&
          deps.map((val, i) => {
            if (val.id === Number(id)) {
              return <DepartmentInfo data={val} key={1} />;
            }
          })}
        <div className="mb-3 d-flex flex-column justify-content-start">
          <label htmlFor="exampleFormControlInput1" className="form-label w-25">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            name="email"
            id="exampleFormControlInput1"
            placeholder="name@example.com"
            onChange={changeHandler}
          />
        </div>
        <div className="btn-group w-50">
          <button
            type="button"
            className="btn btn-dark"
            onClick={addHandler}
            disabled={loading}
          >
            Add
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={loading}
            onClick={changeBossHandler}
          >
            Change Boss
          </button>
        </div>
        <div className="mb-3 d-flex flex-column justify-content-start">
          <Tasks departmentId={id} owner_id={!!deps &&
          deps.filter((val, i) => {
            if (val.id === Number(id)) {
              return val.bossId;
            }
          })[0].bossId} />
        </div>
      </div>
      <div style={{ width: "100%" }}>
        {((user?.role && (user?.role === "admin" || user?.role === "boss")) ||
          (!!deps &&
            deps.filter((val) => {
              if (val.id === Number(id)) {
                return val.bossId;
              }
            }) === user?.id)) && (
          <TaskForm departmentId={id} />
        )}
      </div>
    </div>
  );
};
