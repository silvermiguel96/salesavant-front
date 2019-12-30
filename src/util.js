export const AUTH_TOKEN = "jwt-token";

export function getAuthToken(){
  return localStorage.getItem(AUTH_TOKEN);
}

export function getAuthHeader(){
  return `JWT ${getAuthToken()}`;
}
