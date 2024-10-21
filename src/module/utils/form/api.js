import axios from "axios";
import AuthServices from "./AuthServices";
// import { get } from "mongoose";

const BASE = "http://localhost:8788";
const FRONTEND = "http://localhost:3000";
// const BASE = "http://202.44.40.169:8788";
// const FRONTEND = "http://202.44.40.169:3000";

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

  getProjectById: (projectId) => service.get(`/projects/${projectId}`),

  // getStudent
  getStudent: (data) => service.get("/students", { data }),

  // getLeacturer
  getLeacturer: (params) => service.get("/lecturers", { params }),

  // getAnouncement
  createAnouncement: (data) => service.post("/create-anouncement", data),

  // getSumaryRoom
  getSumaryRoom: (params) => service.get("/sumary-room", { params }),

  getSumaryRoomByExamName: (token, examName) =>
    service.post(
      "/sumary-room-by-name-exam",
      {
        examName,
      },
      { headers: { Authorization: `Bearer ${token}` } } // Adjust the endpoint according to your API structure
    ),

  // getCreateProjectForStudent
  createProject: (data) => service.post("/create-form", { data }),

  studentactivecsb01: (params) => service.post("/student-csb01", { params }),
  approveCSB01: (params) => service.post("/approveCSB01", { params }),
  rejectCSB01: (params) => service.post("/rejectCSB01", { params }),
  scorecsb01: (params) => service.post("/score-csb01", { params }),

  studentactivecsb02: (params) => service.post("/student-csb02", { params }),
  approveCSB02: (params) => service.post("/approveCSB02", { params }),
  rejectCSB02: (params) => service.post("/rejectCSB02", { params }),
  scorecsb: (params, token) =>
    service.post(
      "/score-csb",
      { params },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  studentactivecsb03: (params) => service.post("/student-csb03", { params }),
  approveCSB03: (params) => service.post("/approveCSB03", { params }),
  rejectCSB03: (params) => service.post("/rejectCSB03", { params }),
  scorecsb03: (params) => service.post("/score-csb03", { params }),

  studentactivecsb04: (params) => service.post("/student-csb04", { params }),
  approveCSB04: (params) => service.post("/approveCSB04", { params }),
  rejectCSB04: (params) => service.post("/rejectCSB04", { params }),
  scorecsb04: (params) => service.post("/score-csb04", { params }),

  getProjects: (data) => service.get("/projects", { data }),
  getProjectAcceptace: (examName, token) =>
    service.post(
      "/project-acceptance",
      { examName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  getcsb01: (data) => service.get("/csb01", { data }),
  chaircsb01: (params) => service.post("/chair-csb01", { params }),
  departcsb01: (params) => service.post("/depart-csb01", { params }),

  getcsb02: (data) => service.get("/csb02", { data }),
  chaircsb02: (params) => service.post("/chair-csb02", { params }),
  departcsb02: (params) => service.post("/depart-csb02", { params }),

  getcsb03: (data) => service.get("/csb03", { data }),

  getcsb04: (data) => service.get("/csb04", { data }),
  chaircsb04: (params) => service.post("/chair-csb04", { params }),
  departcsb04: (params) => service.post("/depart-csb04", { params }),

  getfiles: (token) =>
    service.get(`/files`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  updateFileStatus: (params) => service.patch("/files", { params }),

  // anouncement: (data) => service.post("/anouncements", data),
  getanouncement: (data) => service.get("/anouncements", { data }),
  postanouncement: (data) => service.post("/anouncements", { data }),

  getLogin: (token) =>
    service.get("/auth/login", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getlevel: (username) => service.post("/auth/level", { username }),

  getTeacher: (params) => service.get("/teachers", { params }),
  // assignTeacher: (params) => service.post("/assignteacher", {  params }),
  // // In your api.js
  assignTeacher: (params) => {
    return service.post("/assignteacher", {
      params,
    });
  },

  getChairManProject: (nameExam, token) =>
    service.post(
      "/get-chairman-project",
      {
        nameExam,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  appointHeadOfDepartment: (t_id, t_name, t_super_role) =>
    service.post("/appointHeadOfDepartment", {
      T_id: t_id,
      T_name: t_name,
      T_super_role: t_super_role,
    }),

  getWhitelist: (token) =>
    service.get("/whitelist", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  addWhitelist: (data, token) =>
    service.post("/whitelist", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  deleteWhitelist: (data, token) =>
    service.delete("/whitelist", {
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
export const getProjectById = async (projectId) => {
  return await axios.get(`/api/projects/${projectId}`); // Adjust the endpoint according to your API structure
};

export const updateFileStatus = (fi_id, status) => {
  const token = localStorage.getItem("jwtToken");
  return axios.patch(`http://localhost:8788/files/${fi_id}`, status, {
    headers: {
      Authorization: `Bearer ${token}`, // If you are using authentication
    },
  });
};
