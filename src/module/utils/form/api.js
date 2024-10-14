import axios from "axios";
import AuthServices from "./AuthServices";
// import { get } from "mongoose";

const BASE = "http://localhost:8788";
const FRONTEND = "http://localhost:3000";

const service = axios.create({ baseURL: BASE });

service.interceptors.request.use(function (config) {
  if (typeof window !== "undefined") {
    return config;
  }
  const gobalToken = AuthServices.getToken();
  const userId = AuthServices.getUserId();
  const usertoken = AuthServices.getUserToken();

  if (gobalToken && config.headers.acess_token) {
    config.headers["global-token"] = gobalToken;
  }
  if (usertoken && config.headers.acess_token) {
    config.headers.Authorization = "bearer" + usertoken;
  }
  if (userId) {
    config.headers["user-id"] = userId;
  }

  if (AuthServices.isNearExpired() && !/auth/g.test(config.url)) {
    AuthServices.getNewToken();
  }

  return config;
});

export default {
  service,
  apiUrl: BASE,
  frontendUrl: FRONTEND,

  login: (data) => service.post("/auth/login", data),
  getNewToken: () => service.post("/auth/refresh-token"),

  getHomePage: (params) => service.get("/", { params }),

  // RoomManagement
  getRoomPage: (params) => service.get("/room-management", { params }),
  createRoomManagement: (data) => service.post("/create-room-management", data),

  // getAllProject
  getAllProject: (params) => service.get("/project-students", { params }),
  updateProject: (data) => service.post("/create-form", { data }), //เพิ่มอาจารย์ที่ปรึกษา
  // createProject: (data) => service.post("/project-students", { data }),

  // getStudent
  getStudent: (data) => service.post("/students", { data }),

  // getLeacturer
  getLeacturer: (params) => service.get("/lecturers", { params }),

  // getAnouncement
  createAnouncement: (data) => service.post("/create-anouncement", data),

  // getSumaryRoom
  getSumaryRoom: (params) => service.get("/sumary-room", { params }),

  // getCreateProjectForStudent
  createProject: (data) => service.post("/create-form", { data }),

  //createCSB
  createCSB02: ({ projectId, confirmScore, unconfirmScore, logBookScore, csb02Status, referee }) =>
    service.post("/createCSB02", {
      projectId,
      confirmScore,
      unconfirmScore,
      logBookScore,
      csb02Status,
      referee
  }),

  getcsb02: (params) => service.get("/csb02", { params }),

  approveCSB02 : ( ProjectId) => service.post("/approveCSB02", {
    projectId : ProjectId
  }), 



  createCSB03: ({ projectId, confirmScore, unconfirmScore, logBookScore, csb03Status, referee}) =>
    service.post("/createCSB03", {
      projectId,
      confirmScore,
      unconfirmScore,
      logBookScore,
      csb03Status,
      referee
  }),

  approveCSB03 : ({ ProjectId, Csb03Status}) => service.post("/approveCSB03", {
    projectId : ProjectId,
    csb03Status:  Csb03Status,
  }), 


  createCSB04: ({ projectId, confirmScore, unconfirmScore, logBookScore, csb04Status, referee }) =>
    service.post("/createCSB04", {
      projectId,
      confirmScore,
      unconfirmScore,
      logBookScore,
      csb04Status,
      referee
  }),



  getLogin: (token) => service.get("/auth/login", { 
    headers: {
      Authorization: `Bearer ${token}`
    }
   }),



  getTeacher: (params) => service.get("/teachers", { params }),
  assignTeacher: (projectName, t_id) => service.post("/assignteacher", {
    ProjectName: projectName,
    T_id: t_id
  }),

  appointHeadOfDepartment: (t_id, t_name, t_super_role) => service.post("/appointHeadOfDepartment", {
    T_id: t_id,
    T_name: t_name,
    T_super_role: t_super_role
  })

};