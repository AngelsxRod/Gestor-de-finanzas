import axios from "axios";

export const httpClient = axios.create({
  baseURL: "/api/v1",
  timeout: 10_000,
});
