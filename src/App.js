import React, { useEffect, useState } from "react";
import api from "./module/utils/form/api";
import Home from "./module/page/all/Home";
import Login from "./module/page/all/Login";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExamCSB01 from "./module/page/student/special-project-1/exam-csb01";
import ExamCSB02 from "./module/page/student/special-project-1/exam-csb02";
import ExamCSB03 from "./module/page/student/special-project-2/exam-csb03";
import ExamCSB04 from "./module/page/student/special-project-2/exam-csb04";
import InputScoreCSB02 from "./module/page/teacher/input-score/inputscore-csb02";
import InputScoreCSB01 from "./module/page/teacher/input-score/inputscore-csb01";
import InputScoreCSB04 from "./module/page/teacher/input-score/inputscore-csb04";
import ChairmanScoreCSB01 from "./module/page/teacher/chairman-score/chairman-score-csb01";
import ChairmanScoreCSB02 from "./module/page/teacher/chairman-score/chairman-score-csb02";
import ChairmanScoreCSB04 from "./module/page/teacher/chairman-score/chairman-score-csb04";
import DepartmentHeadScoreCSB01 from "./module/page/teacher/department-score/department-score-csb01";
import DepartmentHeadScoreCSB02 from "./module/page/teacher/department-score/department-score-csb02";
import DepartmentHeadScoreCSB04 from "./module/page/teacher/department-score/department-score-csb04";
import ApproveCSB02 from "./module/page/teacher/approve/approve-csb02";
import ApproveCSB03 from "./module/page/teacher/approve/approve-csb03";
import ApproveCSB04 from "./module/page/teacher/approve/approve-csb04";
import SiderBar from "./module/component/sidebar";
import ExamManage from "./module/page/admin/exam-management";
import Sp1 from "./module/page/admin/member-spacial-project/sp-1";
import Sp2 from "./module/page/admin/member-spacial-project/sp-2";
import SumaryRoom from "./module/page/admin/sumary-room";
import AddLecture from "./module/page/admin/add-lecture";
import CreateProjectForStudent from "./module/page/admin/create-project-for-student";
import RoomManagement from "./module/page/admin/room-management";
import ProviderSp1 from "./module/page/student/special-project-1/provider";
import ProviderSp2 from "./module/page/student/special-project-2/provider";
import ProjectStatus from "./module/page/student/project-status";
import AppointmentHeadofDepartment from "./module/page/admin/appointment-department";
import Viewcsb03 from "./module/page/admin/view-csb03";
import CheckApproveCSB01 from "./module/page/admin/check-approve/csb01";
import CheckApproveCSB02 from "./module/page/admin/check-approve/csb02";
import CheckApproveCSB03 from "./module/page/admin/check-approve/csb03";

function App() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [level, setLevel] = useState("all");

  useEffect(() => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        api.getLogin(token).then((response) => {
          if (response.status !== 200) {
            localStorage.clear();
          }
          const { username, role, level, jwtToken } = response.data;
          localStorage.setItem("jwtToken", jwtToken);
          setRole(role);
          setUsername(username);
          if (role == "teacher") {
            api.getlevel(username).then((response) => {
              setLevel(response.data.level);
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onLoginSuccess = (data) => {
    const { username, role, level, jwtToken } = data;
    localStorage.setItem("jwtToken", jwtToken);
    setRole(role);
    setUsername(username);
    setLevel(level);
  };

  const logout = () => {
    localStorage.clear();
    setRole("");
    setUsername("");
    setLevel("");
  };
  return (
    <div>
      <BrowserRouter>
        {/* <div>
          <button onClick={() => setRole("")}>หายตัว!!!</button>
          <button onClick={() => setRole("teacher")}>
            กลายร่างเป็นอาจารย์
          </button>
          <button onClick={() => setRole("student")}>
            กลายร่างเป็นนักศึกษา
          </button>
          <button onClick={() => setRole("admin")}>
            กลายร่างเป็นเจ้าหน้าที่
          </button>
        </div> */}
        <SiderBar role={role} username={username} level={level} logout={logout}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={<Login onLoginSuccess={onLoginSuccess} />}
            />
            {role === "student" && (
              <>
                <Route
                  path="/special-project-1/provider"
                  element={<ProviderSp1 />}
                />
                <Route
                  path="/special-project-1/exam-csb01"
                  element={<ExamCSB01 />}
                />
                <Route
                  path="/special-project-1/exam-csb02"
                  element={<ExamCSB02 />}
                />
                <Route
                  path="/special-project-2/provider"
                  element={<ProviderSp2 />}
                />
                <Route
                  path="/special-project-2/exam-csb03"
                  element={<ExamCSB03 />}
                />
                <Route
                  path="/special-project-2/exam-csb04"
                  element={<ExamCSB04 />}
                />
                <Route path="/project-status" element={<ProjectStatus />} />
              </>
            )}
            {role === "teacher" && (
              <>
                <Route
                  path="/input-score/inputscore-csb02"
                  element={<InputScoreCSB02 />}
                />
                <Route
                  path="/input-score/inputscore-csb01"
                  element={<InputScoreCSB01 />}
                />
                <Route
                  path="/input-score/inputscore-csb02"
                  element={<InputScoreCSB02 />}
                />
                <Route
                  path="/input-score/inputscore-csb04"
                  element={<InputScoreCSB04 />}
                />
                <Route
                  path="/chairman-score/chairman-score-csb01"
                  element={<ChairmanScoreCSB01 />}
                />
                <Route
                  path="/chairman-score/chairman-score-csb02"
                  element={<ChairmanScoreCSB02 />}
                />
                <Route
                  path="/chairman-score/chairman-score-csb04"
                  element={<ChairmanScoreCSB04 />}
                />
                {/* <Route
                  path="/department-score/department-score-csb01"
                  element={<DepartmentHeadScoreCSB01 />}
                />
                <Route
                  path="/department-score/department-score-csb02"
                  element={<DepartmentHeadScoreCSB02 />}
                />
                <Route
                  path="/department-score/department-score-csb04"
                  element={<DepartmentHeadScoreCSB04 />}
                /> */}
                <Route
                  path="/approve/approve-csb02"
                  element={<ApproveCSB02 />}
                />
                <Route
                  path="/approve/approve-csb03"
                  element={<ApproveCSB03 />}
                />
                <Route
                  path="/approve/approve-csb04"
                  element={<ApproveCSB04 />}
                />
              </>
            )}
            {role === "admin" && (
              <>
                <Route path="/exam-management" element={<ExamManage />} />
                <Route path="/room-management" element={<RoomManagement />} />
                <Route path="/member-spacial-project/sp-1" element={<Sp1 />} />
                <Route path="/member-spacial-project/sp-2" element={<Sp2 />} />
                <Route path="/sumary-room" element={<SumaryRoom />} />
                <Route path="/add-lecture" element={<AddLecture />} />
                {/* <Route path="/create-project-for-student" element={<CreateProjectForStudent />}/>
                <Route path="/appointment-department" element={<AppointmentHeadofDepartment />} /> */}
                <Route path="/view-csb03" element={<Viewcsb03 />} />
                <Route
                  path="/check-approve/csb01"
                  element={<CheckApproveCSB01 />}
                />
                <Route
                  path="/check-approve/csb02"
                  element={<CheckApproveCSB02 />}
                />
                <Route
                  path="/check-approve/csb03"
                  element={<CheckApproveCSB03 />}
                />
              </>
            )}
          </Routes>
        </SiderBar>
      </BrowserRouter>
    </div>
  );
}
// {
//     path: "/room-management",
//     element: (
//       <SideBar
//         page={ <RoomManagement />}
//         pageName={"สร้างห้องสอบ"}
//         pageSub={""}
//         path={"/room-management"}
//       />
//     ),
//   },
//   {
//     path: "/member-spacial-project/sp-1",
//     element: (
//       <SideBar
//         page={ < Sp1/>}
//         pageName={"รายชื่อนักศึกษา"}
//         pageSub={"sp-1"}
//         path={"/member-spacial-project/sp-1"}
//       />
//     ),
//   },
//   {
//     path: "/member-spacial-project/sp-2",
//     element: (
//       <SideBar
//         page={ < Sp2/>}
//         pageName={"รายชื่อนักศึกษา"}
//         pageSub={"sp-2"}
//         path={"/member-spacial-project/sp-2"}
//       />
//     ),
//   },
//   {
//     path: "/sumary-room",
//     element: (
//       <SideBar
//         page={ <SumaryRoom />}
//         pageName={"สรุปห้องสอบ"}
//         pageSub={""}
//         path={"/sumary-room"}
//       />
//     ),
//   },
//   {
//     path: "/add-lecture",
//     element: (
//       <SideBar
//         page={ <AddLecture />}
//         pageName={"รายชื่อโครงงาน"}
//         pageSub={""}
//         path={"/add-lecture"}
//       />
//     ),
//   },
//   {
//     path: "/create-project-for-student",
//     element: (
//       <SideBar
//         page={ <CreateProjectForStudent />}
//         pageName={""}
//         pageSub={""}
//         path={"/create-project-for-student"}
//       />
//     ),
//   },
export default App;
