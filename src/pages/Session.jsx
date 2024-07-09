import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Endpoints } from "../api";
import { deleteCookie } from "../utils";
import Errors from "../components/Errors";

const Session = ({ history }) => {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [errors, setErrors] = useState([]);

  const token = document.cookie.split("token=")[1];

  const headers = {
    Accept: "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };


  const getUserInfo = useCallback(async () => {
    try {
      setIsFetching(true);
      const res = await axios.get(Endpoints.session, {
        headers,
        withCredentials: true,
      });

      if (res.status !== 200) logout();

      const { success, errors = [], user } = res.data;
      setErrors(errors);
      if (!success) history.push("/login");
      setUser(user);
    } catch (e) {
      setErrors([e.toString()]);
    } finally {
      setIsFetching(false);
    }
    // eslint-disable-next-line
  }, [headers, history]);

  const logout = async () => {
    try {
      const res = await axios.get(Endpoints.logout, {
        headers,
        withCredentials: true,
      });

      if (res.status === 200) {
        deleteCookie("token");
        history.push("/login");
      }
    } catch (e) {
      setErrors([e.toString()]);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return (
    <div className="wrapper">
      <div>
        {isFetching ? (
          <div>fetching details...</div>
        ) : (
          <div>
            {user && (
              <div>
                <h1>Welcome, {user && user.name}</h1>
                <p>{user && user.email}</p>
                <br />
                <button onClick={logout}>logout</button>
              </div>
            )}
          </div>
        )}

        <Errors errors={errors} />
      </div>
    </div>
  );
};

export default Session;
