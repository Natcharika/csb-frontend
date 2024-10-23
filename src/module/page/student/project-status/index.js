import React, { useState, useEffect } from "react";
import { Typography, Layout, Table, Row, Col } from "antd";
import api from "../../../utils/form/api";
import "../../../theme/css/tables.css";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function ProjectStatus() {
  const [loading, setLoading] = useState(true);
  const [allProjectStatus, setAllProjectStatus] = useState([]);

  // Fetch username from token
  const fecthData = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await api.projectStatus(token);
      console.log("data", res);

      if (res.status === 200) {
        setAllProjectStatus(res.data.body);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching project status:", err);
    }
  };

  useEffect(() => {
    fecthData();
  }, []);

  // Fetch project data and files
  // useEffect(() => {
  //   if (username) {
  //     console.log("username", username);
  //     api
  //       .getAllProject()
  //       .then((res) => {
  //         console.log("Response from API:", res.data.body);
  //         if (res.data.body.length > 0) {
  //           const projectData = res.data.body; // Get the entire array of projects

  //           // Flag to check if any authorized user is found
  //           let foundAuthorizedUser = false;

  //           // Iterate through all projects
  //           projectData.forEach((project) => {
  //             // Check if project has student and lecturer arrays
  //             if (project.student && project.lecturer) {
  //               // Check if username matches any student or lecturer
  //               const isAuthorizedUser =
  //                 project.student.find(
  //                   (student) => student.studentId === username
  //                 ) ||
  //                 project.lecturer.find(
  //                   (lecturer) => lecturer.T_name === username
  //                 );

  //               console.log("isAuthorizedUser", isAuthorizedUser);
  //               console.log("projectData.student", project.student);

  //               if (isAuthorizedUser) {
  //                 foundAuthorizedUser = true;

  //                 // Set the data based on the matched project
  //                 setData({
  //                   projectId: project._id || "",
  //                   projectName: project.projectName || "",
  //                   status: project.status || {},
  //                   student: project.student || [],
  //                   lecturer: project.lecturer || [],
  //                 });

  //                 getFiless();

  //                 const updatedStatus = initialData.map((item) => {
  //                   switch (item.id) {
  //                     case 1:
  //                       return {
  //                         ...item,
  //                         status: dataFiles.fi_result.project_1?.status,
  //                         username,
  //                       };
  //                     case 2:
  //                       return {
  //                         ...item,
  //                         status: project.status?.CSB01?.status,
  //                         username,
  //                       };
  //                     case 3:
  //                       return {
  //                         ...item,
  //                         status: project.status?.CSB02?.status,
  //                         username,
  //                       };
  //                     case 4:
  //                       return {
  //                         ...item,
  //                         status: dataFiles.fi_result.project_2?.status,
  //                         username,
  //                       };
  //                     case 5:
  //                       return {
  //                         ...item,
  //                         status: project.status?.CSB03?.status,
  //                         username,
  //                       };
  //                     case 6:
  //                       return {
  //                         ...item,
  //                         status: project.status?.CSB04?.status,
  //                         username,
  //                       };
  //                     default:
  //                       return item;
  //                   }
  //                 });

  //                 setCheckAllStatus(updatedStatus);
  //               }
  //             } else {
  //               console.error(
  //                 "Project data does not contain student or lecturer arrays."
  //               );
  //             }
  //           });

  //           // If no authorized user is found, you can handle that case here
  //           if (!foundAuthorizedUser) {
  //             console.log("No authorized user found for any project.");
  //           }
  //         }
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         console.error("Error fetching project data:", err);
  //         setLoading(false);
  //       });
  //   }
  // }, [username]);

  // const getFiless = async () => {
  //   try {
  //     const token = localStorage.getItem("jwtToken");
  //     const { data } = await api.getFileByToken(token);
  //     setDataFiles(data.body);
  //     console.log("data", data);
  //   } catch (err) {
  //     console.error("Error fetching files:", err);
  //   }
  // };

  // useEffect(() => {
  //   if (username) {
  //     console.log("username", username);
  //     api
  //       .getAllProject()
  //       .then((res) => {
  //         console.log("Response from API:", res.data.body);
  //         if (res.data.body.length > 0) {
  //           const projectData = res.data.body; // Get the entire array of projects

  //           // Flag to check if any authorized user is found
  //           let foundAuthorizedUser = false;

  //           // Iterate through all projects
  //           projectData.forEach((project) => {
  //             // Check if project has student and lecturer arrays
  //             if (project.student && project.lecturer) {
  //               // Check if username matches any student or lecturer
  //               const isAuthorizedUser =
  //                 project.student.find(
  //                   (student) => student.studentId === username
  //                 ) ||
  //                 project.lecturer.find(
  //                   (lecturer) => lecturer.T_name === username
  //                 );

  //               if (isAuthorizedUser) {
  //                 foundAuthorizedUser = true;

  //                 // Set the data based on the matched project
  //                 setData({
  //                   projectId: project._id || "",
  //                   projectName: project.projectName || "",
  //                   status: project.status || {},
  //                   student: project.student || [],
  //                   lecturer: project.lecturer || [],
  //                 });

  //                 // Fetch files after setting the project data
  //                 getFiless();
  //               }
  //             } else {
  //               console.error(
  //                 "Project data does not contain student or lecturer arrays."
  //               );
  //             }
  //           });

  //           // If no authorized user is found, handle that case here
  //           if (!foundAuthorizedUser) {
  //             console.log("No authorized user found for any project.");
  //           }
  //         }
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         console.error("Error fetching project data:", err);
  //         setLoading(false);
  //       });
  //   }
  // }, [username]);

  // Fetch the files and update dataFiles state
  // const getFiless = async () => {
  //   try {
  //     const token = localStorage.getItem("jwtToken");
  //     const { data } = await api.getFileByToken(token);
  //     setDataFiles(data.body);
  //     console.log("data", data);
  //   } catch (err) {
  //     console.error("Error fetching files:", err);
  //   }
  // };

  // Update checkAllStatus when dataFiles or data changes
  // useEffect(() => {
  //   console.log("dataFiles", dataFiles, "data", data);

  //   if (dataFiles && data.projectId) {
  //     const updatedStatus = initialData.map((item) => {
  //       switch (item.id) {
  //         case 1:
  //           return {
  //             ...item,
  //             status: dataFiles.fi_result?.project_1?.status,
  //             username,
  //           };
  //         case 2:
  //           return {
  //             ...item,
  //             status: data.status?.CSB01?.status,
  //             username,
  //           };
  //         case 3:
  //           return {
  //             ...item,
  //             status: data.status?.CSB02?.status,
  //             username,
  //           };
  //         case 4:
  //           return {
  //             ...item,
  //             status: dataFiles.fi_result?.project_2?.status,
  //             username,
  //           };
  //         case 5:
  //           return {
  //             ...item,
  //             status: data.status?.CSB03?.status,
  //             username,
  //           };
  //         case 6:
  //           return {
  //             ...item,
  //             status: data.status?.CSB04?.status,
  //             username,
  //           };
  //         default:
  //           return item;
  //       }
  //     });
  //     console.log("updatedStatus", updatedStatus);

  //     setCheckAllStatus(updatedStatus);
  //   }
  // }, [dataFiles, data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const components = {
    header: {
      cell: (props) => (
        <th
          style={{
            backgroundColor: "rgb(253 186 116)",
            borderBottom: "2px solid #FFFFFF",
          }}
        >
          {props.children}
        </th>
      ),
    },
  };

  return (
    <Content>
      {/* {data.student.length > 0 && (
        <div>
          <Paragraph style={{ fontSize: "16px", color: "#555" }}>
            {data.projectName}
          </Paragraph>
          <br />
          <Paragraph style={{ fontSize: "18px" }}>รายชื่อนักศึกษา</Paragraph>
          {data.student.map((student, index) => (
            <Row key={index} style={{ marginBottom: "8px" }}>
              <Col span={12}>
                <Paragraph style={{ fontSize: "16px", color: "#555" }}>
                  {`${index + 1}. ${student.FirstName} ${student.LastName}`}
                </Paragraph>
              </Col>
            </Row>
          ))}
          <Paragraph style={{ fontSize: "18px" }}>อาจารย์ที่ปรึกษา</Paragraph>
          {data.lecturer.map((lecturer, index) => (
            <Row key={index} style={{ marginBottom: "8px" }}>
              <Col span={12}>
                <Paragraph style={{ fontSize: "16px", color: "#555" }}>
                  {`${index + 1}. ${lecturer.T_name}`}
                </Paragraph>
              </Col>
            </Row>
          ))}
        </div>
      )} */}
      <Title level={2} style={{ textAlign: "center" }}>
        ตรวจสอบสถานะโครงงาน
      </Title>
      <Table
        className="custom-table"
        dataSource={allProjectStatus}
        columns={[
          { title: "ลำดับที่", dataIndex: "id", key: "id" },
          { title: "รายการ", dataIndex: "name", key: "name" },
          { title: "สถานะ", dataIndex: "status", key: "status" },
          { title: "หมายเหตุ", dataIndex: "remark", key: "remark" },
        ]}
        rowKey="id"
        pagination={false}
        components={components}
      />
    </Content>
  );
}
