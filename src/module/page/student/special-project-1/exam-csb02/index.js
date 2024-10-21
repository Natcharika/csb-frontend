// import React, { useState, useEffect } from "react";
// import { Typography, Button, Row, Col, notification } from "antd";
// import cis from '../../../../public/image/cis.png';
// import api from '../../../../utils/form/api';
// import loadingGif from "../../../../public/image/giphy (1).gif"
// import "../../../../theme/css/buttons.css";

// const { Title, Paragraph } = Typography;

// export default function ExamCSB02() {
//   const [data, setData] = useState({
//     projectId: "",
//     projectName: "",
//     student: [],
//     lecturer: [],
//   });
//   const [username, setUsername] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [project, setProject] = useState(null); // Store the entire project object
//   const [isCSB01Submitted, setIsCSB01Submitted] = useState(false); // State to check CSB01 submission

//   const handleAccept = async () => {
//     try {
//       const response = await api.studentactivecsb02({
//         projectId: data.projectId,
//         activeStatus: 1,
//       });
//       notification.success({
//         message: 'Success',
//         description: response.data.message,
//         placement: 'topRight',
//       });
//       setIsCSB01Submitted(true);
//     } catch (error) {
//       console.error(error);
//       notification.error({
//         message: 'Error',
//         description: 'Unable to create CSB02 data. Please try again later.',
//         placement: 'topRight',
//       });
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("jwtToken");

//     if (token) {
//       const payload = token.split('.')[1];
//       const decodedPayload = JSON.parse(atob(payload));

//       if (decodedPayload.username) {
//         const trimmedUsername = decodedPayload.username.slice(1);
//         setUsername(trimmedUsername);
//       }
//     }

//     const fetchProjectData = async () => {
//       try {
//         const res = await api.getAllProject();
//         if (Array.isArray(res.data.body) && res.data.body.length > 0) {
//           const filteredProjects = res.data.body.filter((project) =>
//             project.student.some((student) => student.studentId === username)
//           );

//           if (filteredProjects.length > 0) {
//             const projectData = filteredProjects[0];
//             setData({
//               projectId: projectData._id || "",
//               projectName: projectData.projectName || "",
//               student: projectData.student || [],
//               lecturer: projectData.lecturer || [],
//             });
//             setProject(filteredProjects); // Update the project state with the filtered projects

//             if (projectData.status.CSB02?.status === "ผ่านการอนุมัติจากอาจารย์" || projectData.status.CSB02?.status === "ผ่าน") {
//               setIsCSB01Submitted(true);
//             }
//           } else {
//             console.log("No projects found for this user.");
//           }
//         } else {
//           console.error("Data body is not an array or is empty:", res.data.body);
//         }
//         setLoading(false);
//       } catch (err) {
//         console.log(err);
//         notification.error({
//           message: 'Error Fetching Projects',
//           description: 'Unable to fetch project data. Please try again later.',
//           placement: 'topRight',
//         });
//         setLoading(false);
//       }
//     };

//     if (username) {
//       fetchProjectData();
//     }
//   }, [username]);

//   const isCSB01Passed = Array.isArray(project) && project.length > 0 && project[0]?.status?.CSB01?.status;
//   const hasLecturer = Array.isArray(data.lecturer) && data.lecturer.length > 0;
//   console.log("isCSB01Passed", isCSB01Passed, "hasLecturer", hasLecturer);

//   if (loading) {
//     return <div>ยังไม่มีโครงงานในระบบ กรุณายื่นสอบหัวข้อก่อน</div>;
//   }

//   return (
//     <div style={{ maxWidth: 1000, margin: "auto", backgroundColor: "#fff", flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRadius: 15 }}>
//       <img src={cis} alt="logo" style={{ display: "block", margin: "0 auto", width: "150px" }} />
//       <Typography style={{ textAlign: "center", marginBottom: 24 }}>
//         <Title level={3} style={{ fontWeight: "bold" }}>แบบฟอร์มขอสอบความก้าวหน้าโครงงานพิเศษ</Title>
//         <Paragraph style={{ fontSize: "16px" }}>
//           โครงการพิเศษ (สองภาษา) ภาควิชาวิทยาการคอมพิวเตอร์และสารสนเทศ <br />
//           คณะวิทยาศาสตร์ประยุกต์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
//         </Paragraph>
//       </Typography>

//       {isCSB01Submitted ? (
//         <Paragraph>ท่านได้ยื่นทดสอบก้าวหน้า CSB02 แล้ว</Paragraph>
//       ) : (
//         <>
//           {isCSB01Passed && hasLecturer ? (
//             <>
//               <div><br />
//                 <Paragraph style={{ fontSize: "18px" }}>โครงงาน</Paragraph>
//                 <Paragraph style={{ fontSize: "16px", color: "#555" }}>{data.projectName}</Paragraph>
//               </div>
//               <Row gutter={[16, 16]} style={{ width: '100%' }}>
//                 <Col span={12}>
//                   {data.student.length > 0 && (
//                     <div><br />
//                       <Paragraph style={{ fontSize: "18px" }}>รายชื่อนักศึกษา</Paragraph>
//                       {data.student.map((student, index) => (
//                         <Paragraph key={index} style={{ fontSize: "16px", color: "#555" }}>
//                           {index + 1}. {`${student.FirstName} ${student.LastName}`}
//                         </Paragraph>
//                       ))}
//                     </div>
//                   )}
//                 </Col>
//                 <Col span={12}>
//                   <div><br />
//                     <Paragraph style={{ fontSize: "18px" }}>อาจารย์ที่ปรึกษา</Paragraph>
//                     {data.lecturer.length > 0 ? (
//                       data.lecturer.map((lecturer, index) => (
//                         <Paragraph key={index} style={{ fontSize: "16px", color: "#555" }}>
//                           {index + 1}. {lecturer.T_name}
//                         </Paragraph>
//                       ))
//                     ) : (
//                       <Paragraph style={{ fontSize: "16px", color: "#555" }}>
//                         ไม่มีอาจารย์ที่ปรึกษา
//                       </Paragraph>
//                     )}
//                   </div>
//                 </Col>
//               </Row>
//               <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
//                 <Row gutter={16}>
//                   <Col>
//                     <Button className="All-button" type="primary" onClick={handleAccept} style={{ padding: "6px 30px", fontSize: "16px" }}>
//                       ยินยอม
//                     </Button>
//                   </Col>
//                 </Row>
//               </div>
//             </>
//           ) : (
//             <>
//               <Paragraph style={{ fontSize: "16px", color: "#f5222d", textAlign: "center", marginTop: 40, lineHeight: 1.8 }}>
//                 ไม่สามารถดำเนินการได้เนื่องจาก:<br />
//                 1. สถานะ CSB01 ของท่านไม่ผ่าน<br />
//                 2. ท่านยังไม่ยื่น CSB01<br />
//                 3. ท่านยังไม่ได้รับการแต่งตั้งอาจารย์ที่ปรึกษา
//               </Paragraph>
//               <img src={loadingGif} alt="Loading..." style={{ width: "100%" }} />
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { Typography, Button, Row, Col, notification } from "antd";
import cis from "../../../../public/image/cis.png";
import api from "../../../../utils/form/api";
import loadingGif from "../../../../public/image/giphy (1).gif";
import "../../../../theme/css/buttons.css";

const { Title, Paragraph } = Typography;

export default function ExamCSB02() {
  const [data, setData] = useState({
    projectId: "",
    projectName: "",
    student: [],
    lecturer: [],
  });
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [isCSB01Submitted, setIsCSB01Submitted] = useState(false);
  const [approvalPending, setApprovalPending] = useState(false); // New state for approval message

  const handleAccept = async () => {
    try {
      const response = await api.studentactivecsb02({
        projectId: data.projectId,
        activeStatus: 1,
      });

      notification.success({
        message: "Success",
        description: response.data.message,
        placement: "topRight",
      });

      // Check if CSB02 is now active
      if (response.data.activeStatus === "1") {
        setApprovalPending(true); // Set approval pending state
      }

      setIsCSB01Submitted(true);
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error",
        description: "Unable to create CSB02 data. Please try again later.",
        placement: "topRight",
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      const payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));

      if (decodedPayload.username) {
        const trimmedUsername = decodedPayload.username.slice(1);
        setUsername(trimmedUsername);
      }
    }

    const fetchProjectData = async () => {
      try {
        const res = await api.getAllProject();
        if (Array.isArray(res.data.body) && res.data.body.length > 0) {
          const filteredProjects = res.data.body.filter((project) =>
            project.student.some((student) => student.studentId === username)
          );

          if (filteredProjects.length > 0) {
            const projectData = filteredProjects[0];
            setData({
              projectId: projectData._id || "",
              projectName: projectData.projectName || "",
              student: projectData.student || [],
              lecturer: projectData.lecturer || [],
            });
            setProject(filteredProjects); // Update the project state with the filtered projects

            if (
              projectData.status.CSB02?.status === "ผ่านการอนุมัติจากอาจารย์" ||
              projectData.status.CSB02?.status === "ผ่าน"
            ) {
              setIsCSB01Submitted(true);
            }
          } else {
            console.log("No projects found for this user.");
          }
        } else {
          console.error(
            "Data body is not an array or is empty:",
            res.data.body
          );
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        notification.error({
          message: "Error Fetching Projects",
          description: "Unable to fetch project data. Please try again later.",
          placement: "topRight",
        });
        setLoading(false);
      }
    };

    if (username) {
      fetchProjectData();
    }
  }, [username]);

  const isCSB01Passed =
    Array.isArray(project) &&
    project.length > 0 &&
    project[0]?.status?.CSB01?.status;
  const hasLecturer = Array.isArray(data.lecturer) && data.lecturer.length > 0;
  console.log("isCSB01Passed", isCSB01Passed, "hasLecturer", hasLecturer);

  if (loading) {
    return <div>ยังไม่มีโครงงานในระบบ กรุณายื่นสอบหัวข้อก่อน</div>;
  }

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "auto",
        backgroundColor: "#fff",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        borderRadius: 15,
      }}
    >
      <img
        src={cis}
        alt="logo"
        style={{ display: "block", margin: "0 auto", width: "150px" }}
      />
      <Typography style={{ textAlign: "center", marginBottom: 24 }}>
        <Title level={3} style={{ fontWeight: "bold" }}>
          แบบฟอร์มขอสอบความก้าวหน้าโครงงานพิเศษ
        </Title>
        <Paragraph style={{ fontSize: "16px" }}>
          โครงการพิเศษ (สองภาษา) ภาควิชาวิทยาการคอมพิวเตอร์และสารสนเทศ <br />
          คณะวิทยาศาสตร์ประยุกต์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
        </Paragraph>
      </Typography>

      {isCSB01Submitted ? (
        <>
          {approvalPending ? (
            <Paragraph>
              คุณได้ยื่นขอสอบก้าวหน้าเเล้ว รออาจารย์ที่ปรึกษาอนุมัติ
            </Paragraph>
          ) : (
            <Paragraph>ท่านได้ยื่นขอสอบก้าวหน้า CSB02 แล้ว</Paragraph>
          )}
        </>
      ) : (
        <>
          {isCSB01Passed && hasLecturer ? (
            <>
              <div>
                <br />
                <Paragraph style={{ fontSize: "18px" }}>โครงงาน</Paragraph>
                <Paragraph style={{ fontSize: "16px", color: "#555" }}>
                  {data.projectName}
                </Paragraph>
              </div>
              <Row gutter={[16, 16]} style={{ width: "100%" }}>
                <Col span={12}>
                  {data.student.length > 0 && (
                    <div>
                      <br />
                      <Paragraph style={{ fontSize: "18px" }}>
                        รายชื่อนักศึกษา
                      </Paragraph>
                      {data.student.map((student, index) => (
                        <Paragraph
                          key={index}
                          style={{ fontSize: "16px", color: "#555" }}
                        >
                          {index + 1}.{" "}
                          {`${student.FirstName} ${student.LastName}`}
                        </Paragraph>
                      ))}
                    </div>
                  )}
                </Col>
                <Col span={12}>
                  <div>
                    <br />
                    <Paragraph style={{ fontSize: "18px" }}>
                      อาจารย์ที่ปรึกษา
                    </Paragraph>
                    {data.lecturer.length > 0 ? (
                      data.lecturer.map((lecturer, index) => (
                        <Paragraph
                          key={index}
                          style={{ fontSize: "16px", color: "#555" }}
                        >
                          {index + 1}. {lecturer.T_name}
                        </Paragraph>
                      ))
                    ) : (
                      <Paragraph style={{ fontSize: "16px", color: "#555" }}>
                        ไม่มีอาจารย์ที่ปรึกษา
                      </Paragraph>
                    )}
                  </div>
                </Col>
              </Row>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 40,
                }}
              >
                <Row gutter={16}>
                  <Col>
                    <Button
                      className="All-button"
                      type="primary"
                      onClick={handleAccept}
                      style={{ padding: "6px 30px", fontSize: "16px" }}
                    >
                      ยินยอมขอสอบก้าวหน้า
                    </Button>
                  </Col>
                </Row>
              </div>
            </>
          ) : (
            <>
              <Paragraph
                style={{
                  fontSize: "16px",
                  color: "#f5222d",
                  textAlign: "center",
                  marginTop: 40,
                  lineHeight: 1.8,
                }}
              >
                ไม่สามารถดำเนินการได้เนื่องจาก:
                <br />
                1. สถานะ CSB01 ของท่านไม่ผ่าน
                <br />
                2. ท่านยังไม่ยื่น CSB01
                <br />
                3. ท่านยังไม่ได้รับการแต่งตั้งอาจารย์ที่ปรึกษา
              </Paragraph>
              <img
                src={loadingGif}
                alt="Loading..."
                style={{ width: "100%" }}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
