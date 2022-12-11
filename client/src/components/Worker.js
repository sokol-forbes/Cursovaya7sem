import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { delDepsAction, getDepsAction } from "../redux/actions/dep.actions";
import { Loader } from "./Loader";

export const Worker = ({ user, numbering, bossId, name, length, id }) => {
  const { request, loading } = useHttp();
  const history = useHistory();
  const dispatch = useDispatch();
  const message = useMessage();

  const dismissHandler = async () => {
    if (user.id === Number(bossId)) {
      if (length === 1) {
        const data = await request(`/department/${id}`, "DELETE", {
          userId: bossId,
        });

        if (data.status === 400) {
          message(data.body.message);
        }
        if (data.status === 200) {
          message(data.body.message);
          dispatch(delDepsAction());
          history.push("/departments");
          return;
        }
        return;
      }
      message("You can't dismiss department boss");
    } else {
      const data = await request(
        `/department/${id}/workers/${user.id}`,
        "DELETE"
      );
      if (data.status === 400) {
        message(data.body.message);
      }
      if (data.status === 200) {
        message(data.body.message);
        dispatch(getDepsAction());
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <tr className="link__bg">
      <th scope="row">{numbering + 1}</th>
      <td>
        <Link
          className="dropdown-item link link__bg"
          to={`/workers/${user.id}`}
        >
          {user.name}
        </Link>
      </td>
      <td>
        <Link
          className="dropdown-item link link__bg"
          to={`/workers/${user.id}`}
        >
          {user.email}
        </Link>
      </td>
      <td>{bossId === String(user.id) ? "boss" : "clerk"}</td>
      <td>{name}</td>
      <td>
        <button type="button" className="btn btn-dark" onClick={dismissHandler}>
          Yes
        </button>
      </td>
    </tr>
  );
};
