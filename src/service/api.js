import React from "react";
import Axios from "axios";

//viacep.com.br/ws/01001000/json/

const api = Axios.create({
  baseURL: "https://viacep.com.br/ws/",
    timeout: 1000,
    headers: { "Content-Type": "application/json" },
    responseType: "json",
});

export default api;