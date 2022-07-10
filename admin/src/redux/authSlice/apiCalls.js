/** @format */

import axios from "axios";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
import { loginStart, loginSuccess, loginFailure } from "./index";

const apiUrl = process.env.REACT_APP_API_URL + "/login";

export const login = async (user, dispatch) => {
  dispatch(loginStart());
  try {
    const url = apiUrl;
    const { data } = await axios.post(url, user);
    console.log(data.data);
    let decodeData = jwt_decode(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmI4NjY1M2MxMmYzMDAzNDE2NzNlOTUiLCJuYW1lIjoiVGFudWogU2hhcm1hIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNjU3MTY1NTc1LCJleHAiOjE2NTc3NzAzNzV9.oY9KN8c0vpY8rtfa_H8_YR05WEbrOWWv6_-BfEwniBo"
    );
    // decodeData = {
    //   ...decodeData,
    //   isAdmin: true,
    // };
    console.log(decodeData);
    if (!decodeData.isAdmin) {
      toast.error("You don't have access");
      dispatch(loginFailure());
      return;
    }
    toast.success(data.message);
    dispatch(loginSuccess({ ...decodeData, token: data.data }));
    window.location = "/";
  } catch (error) {
    dispatch(loginFailure());
    if (error.response.status >= 400 && error.response.status < 500) {
      toast.error(error.response.data.message);
    }
  }
};
