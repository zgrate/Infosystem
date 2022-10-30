import axios from "axios";

export abstract class BackendException extends Error {
}

export class ConflictException extends BackendException {
}

export class NotFoundException extends BackendException {
}

export class UnauthorizedException extends BackendException {
}

export class Forbidden extends BackendException {
}


export const axiosService = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

if (localStorage.getItem("access_token")) {
  axiosService.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("access_token")}`;
}

axiosService.interceptors.response.use(response => {
  return response;
}, error => {
  const errorMessage = error?.response?.data?.message || "UNKNOWN";
  if (error?.response?.status === 409) throw new ConflictException(errorMessage);
  if (error?.response?.status === 403) throw new Forbidden(errorMessage);
  if (error?.response?.status === 404) throw new NotFoundException(errorMessage);
  if (error?.response?.status === 401) throw new UnauthorizedException(errorMessage);
  throw error;
});
