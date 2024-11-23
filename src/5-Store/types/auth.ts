
//request
export interface AdminLoginRequest {
  email: String;
  password: String;
} 

export interface AdminRegisterRequest {
  email: String;
  password: String;
  firstname: String;
  lastname: String;
  phoneNumber: String;
 
}

export interface AdminLogoutRequest {
  id: String;
}

//Responses
 interface User {
  email: String;
  password: String;
  firstname: String;
  lastname: String;
  privileges: String;
  role: String;
  phoneNumber: String;
  createdDate: String;
}

export interface AdminLoginResponse {
  User: User;
  token: String;
}

export interface AdminRegisterResponse {
  message: String;
}

export interface AdminLogoutResponse {
  message: String;
}