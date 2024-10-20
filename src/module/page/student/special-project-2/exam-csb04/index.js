// import React, { useState, useEffect } from "react";
// import { Typography, Button, Row, Col, notification } from "antd";
// import cis from '../../../../public/image/cis.png';
// import api from '../../../../utils/form/api';
// import loadingGif from "../../../../public/image/giphy (1).gif"

// const { Title, Paragraph } = Typography;

// export default function ExamCSB04() {
//   const [data, setData] = useState({
//     projectId: "",
//     projectName: "",
//     student: [],
//     lecturer: [],
//   });

//   const [loading, setLoading] = useState(true);
//   const [username, setUsername] = useState("");
//   const [project, setProject] = useState(null); // Store the entire project object

//   const handleAccept = async () => {
//     try {
//       const response = await api.studentactivecsb04({
//                 projectId: data.projectId,
//                 activeStatus: 1, // ส่ง activeStatus เป็น 1
//                 status: "รอดำเนินการ", // ส่ง status เป็น "รอดำเนินการ"
//               });

//       notification.success({
//         message: 'Success',
//         description: response.data.message,
//         placement: 'topRight',
//       });
//     } catch (error) {
//       console.error(error);
//       notification.error({
//         message: 'Error',
//         description: 'Unable to create CSB04 data. Please try again later.',
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
//           // Filter projects based on the logged-in user's studentId
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

//   // Check if CSB01 is ผ่าน for the filtered project
//   const isCSB03Passed = Array.isArray(project) &&
//   project.length > 0 &&
//   (project[0]?.status?.CSB03?.status === "ผ่านการอนุมัติจากอาจารย์" || project[0]?.status?.CSB03?.status === "ผ่าน");

//   const hasLecturer = Array.isArray(data.lecturer) && data.lecturer.length > 0;

//   console.log("isCSB03Passed", isCSB03Passed, "hasLecturer", hasLecturer);

//   if (loading) {
//     return <div>ทำเจคให้ไม่มีบัคก่อนค่อยยื่นทดสอบจ้า</div>;
//   }

//   return (
//     <div style={{ maxWidth: 1000, margin: "auto", backgroundColor: "#fff", flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRadius: 15 }}>
//       <img src={cis} alt="logo" style={{ display: "block", margin: "0 auto", width: "150px" }} />

//       <Typography style={{ textAlign: "center", marginBottom: 24 }}>
//         <Title level={3} style={{ fontWeight: "bold" }}>แบบฟอร์มขอสอบป้องกันโครงงานพิเศษ</Title>
//         <Paragraph style={{ fontSize: "16px" }}>
//           โครงการพิเศษ (สองภาษา) ภาควิชาวิทยาการคอมพิวเตอร์และสารสนเทศ <br />
//           คณะวิทยาศาสตร์ประยุกต์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
//         </Paragraph>
//       </Typography>

//       {isCSB03Passed  && hasLecturer ? (
//         <>
//         <div><br />
//         <Paragraph style={{ fontSize: "18px" }}>โครงงาน</Paragraph>
//         <Paragraph style={{ fontSize: "16px", color: "#555" }}>{data.projectName}</Paragraph>
//       </div>

//       <Row gutter={[16, 16]} style={{ width: '100%' }}>
//         <Col span={12}>
//           {data.student.length > 0 && (
//             <div><br />
//               <Paragraph style={{ fontSize: "18px" }}>รายชื่อนักศึกษา</Paragraph>
//               {data.student.map((student, index) => (
//                 <Paragraph key={index} style={{ fontSize: "16px", color: "#555" }}>
//                   {index + 1}. {`${student.FirstName} ${student.LastName}`}
//                 </Paragraph>
//               ))}
//             </div>
//           )}
//         </Col>
//         <Col span={12}>
//           <div><br />
//             <Paragraph style={{ fontSize: "18px" }}>อาจารย์ที่ปรึกษา</Paragraph>
//             {data.lecturer.length > 0 && (
//               data.lecturer.map((lecturer, index) => (
//                 <Paragraph key={index} style={{ fontSize: "16px", color: "#555" }}>
//                   {index + 1}. {lecturer.T_name}
//                 </Paragraph>
//               ))
//             )}
//           </div>
//         </Col>
//       </Row>
//       <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
//         <Row gutter={16}>
//           <Col>
//             <Button type="primary" onClick={handleAccept} style={{ padding: "6px 30px", fontSize: "16px" }}>
//               ยินยอม
//             </Button>
//           </Col>
//         </Row>
//       </div>
//         </>
//               ): (
//                 <>
//                 <Paragraph>ไม่สามารถดำเนินการได้ เนื่องจากสถานะ CSB03 ยังไม่ผ่านกการอนุมัติจากอาจารย์ที่ปรึกษา หรือแกยังไม่ยื่นอะป่าว ?</Paragraph>
//                 {/* <img src={loadingGif} alt="Loading..." style={{ width: "100%" }} /> */}
//                 </>

//               )}

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

export default function ExamCSB04() {
  const [data, setData] = useState({
    projectId: "",
    projectName: "",
    student: [],
    lecturer: [],
  });

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [project, setProject] = useState(null); // Store the entire project object
  const [isCSB04Submitted, setIsCSB04Submitted] = useState(false); // State to check CSB04 submission

  const handleAccept = async () => {
    try {
      const response = await api.studentactivecsb04({
        projectId: data.projectId,
        activeStatus: 1, // ส่ง activeStatus เป็น 1
        status: "รอดำเนินการ", // ส่ง status เป็น "รอดำเนินการ"
      });

      notification.success({
        message: "Success",
        description: response.data.message,
        placement: "topRight",
      });

      // Set the state to indicate CSB04 has been submitted
      setIsCSB04Submitted(true);
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error",
        description: "Unable to create CSB04 data. Please try again later.",
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
          // Filter projects based on the logged-in user's studentId
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

            // Check if CSB04 status is ผ่านการอนุมัติจากอาจารย์ or ผ่าน
            if (
              projectData.status.CSB04?.status === "ผ่านการอนุมัติจากอาจารย์" ||
              projectData.status.CSB04?.status === "ผ่าน"
            ) {
              setIsCSB04Submitted(true);
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

  // Check if CSB03 is ผ่าน for the filtered project
  const isCSB03Passed =
    Array.isArray(project) &&
    project.length > 0 &&
    project[0]?.status?.CSB03?.status === "ผ่านการอนุมัติจากอาจารย์";

  const hasLecturer = Array.isArray(data.lecturer) && data.lecturer.length > 0;

  console.log(
    "isCSB03Passed",
    isCSB03Passed,
    "hasLecturer",
    hasLecturer,
    "isCSB04Submitted",
    isCSB04Submitted
  );

  if (loading) {
    return <div>ทำเจคให้ไม่มีบัคก่อนค่อยยื่นทดสอบจ้า</div>;
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
          แบบฟอร์มขอสอบป้องกันโครงงานพิเศษ
        </Title>
        <Paragraph style={{ fontSize: "16px" }}>
          โครงการพิเศษ (สองภาษา) ภาควิชาวิทยาการคอมพิวเตอร์และสารสนเทศ <br />
          คณะวิทยาศาสตร์ประยุกต์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
        </Paragraph>
      </Typography>

      {isCSB04Submitted ? (
        <Paragraph>ท่านยื่นสอบป้องกันเเล้ว</Paragraph>
      ) : (
        <>
          {isCSB03Passed && hasLecturer ? (
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
                    {data.lecturer.length > 0 &&
                      data.lecturer.map((lecturer, index) => (
                        <Paragraph
                          key={index}
                          style={{ fontSize: "16px", color: "#555" }}
                        >
                          {index + 1}. {lecturer.T_name}
                        </Paragraph>
                      ))}
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
                      type="primary"
                      onClick={handleAccept}
                      style={{ padding: "6px 30px", fontSize: "16px" }}
                      className="All-button"
                    >
                      ยินยอม
                    </Button>
                  </Col>
                </Row>
              </div>
            </>
          ) : (
            <Paragraph>
              ไม่สามารถดำเนินการได้ เนื่องจากสถานะ CSB03
              ยังไม่ผ่านการอนุมัติจากอาจารย์ที่ปรึกษา
            </Paragraph>
          )}
        </>
      )}
    </div>
  );
}
