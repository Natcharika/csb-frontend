import React, { useState, useEffect } from "react";
import { Typography, Layout, Table, Row, Col } from "antd";
import api from "../../../utils/form/api";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function ProjectStatus() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [checkAllStatus, setCheckAllStatus] = useState([]);
  const [data, setData] = useState({
    projectId: "",
    projectName: "",
    status: {},
    student: [],
    lecturer: [],
  });
  const [dataFiles, setDataFiles] = useState({
    fi_id: "",
    fi_result: "",
    fi_status: "",
  });

  const initialData = [
    { id: 1, name: "ตรวจสอบคุณสมบัติการยื่นสอบโครงงานพิเศษ 1", status: "", remark: "" },
    { id: 2, name: "การสอบหัวข้อ", status: "", remark: "" },
    { id: 3, name: "การสอบก้าวหน้า", status: "", remark: "" },
    { id: 4, name: "ตรวจสอบคุณสมบัติการยื่นสอบโครงงานพิเศษ 2", status: "", remark: "" },
    { id: 5, name: "การยื่นทดสอบโครงงาน", status: "", remark: "" },
    { id: 6, name: "การสอบป้องกัน", status: "", remark: "" },
  ];

  // Fetch username from token
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));

      if (decodedPayload.username) {
        const trimmedUsername = decodedPayload.username.slice(1);
        setUsername(trimmedUsername);
      }
    }
  }, []);

  // Fetch project data and files
  useEffect(() => {
    if (username) {
      console.log("username", username);
      api
        .getAllProject()
        .then((res) => {
          console.log("Response from API:", res.data.body);
          if (res.data.body.length > 0) {
            const projectData = res.data.body; // Get the entire array of projects
  
            // Flag to check if any authorized user is found
            let foundAuthorizedUser = false;
  
            // Iterate through all projects
            projectData.forEach((project) => {
              // Check if project has student and lecturer arrays
              if (project.student && project.lecturer) {
                // Check if username matches any student or lecturer
                const isAuthorizedUser = project.student.find(student => student.studentId === username) ||
                  project.lecturer.find(lecturer => lecturer.T_name === username);
  
                console.log("isAuthorizedUser", isAuthorizedUser);
                console.log("projectData.student", project.student);
  
                if (isAuthorizedUser) {
                  foundAuthorizedUser = true;
  
                  // Set the data based on the matched project
                  setData({
                    projectId: project._id || "",
                    projectName: project.projectName || "",
                    status: project.status || {},
                    student: project.student || [],
                    lecturer: project.lecturer || [],
                  });
  
                  getFiless();
  
                  const updatedStatus = initialData.map((item) => {
                    switch (item.id) {
                      case 1:
                        return { ...item, status: dataFiles.fi_status || "waiting", username };
                      case 2:
                        return { ...item, status: project.status?.CSB01?.status || "No status", username };
                      case 3:
                        return { ...item, status: project.status?.CSB02?.status || "No status", username };
                      case 4:
                        return { ...item, status: dataFiles.fi_status || "waiting", username };
                      case 5:
                        return { ...item, status: project.status?.CSB03?.status || "No status", username };
                      case 6:
                        return { ...item, status: project.status?.CSB04?.status || "No status", username };
                      default:
                        return item;
                    }
                  });
  
                  setCheckAllStatus(updatedStatus);
                }
              } else {
                console.error("Project data does not contain student or lecturer arrays.");
              }
            });
  
            // If no authorized user is found, you can handle that case here
            if (!foundAuthorizedUser) {
              console.log("No authorized user found for any project.");
            }
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching project data:", err);
          setLoading(false);
        });
    }
  }, [username]);
  

  const getFiless = () => {
    api.getfiles()
      .then((res) => {
        console.log("Get File:", res.data.body);
        const files = res.data.body[1];
        setDataFiles({
          fi_id: files.fi_id || "",
          fi_result: files.fi_result || "",
          fi_status: files.fi_status || ""
        });
      })
      .catch((err) => {
        console.error("Error fetching files:", err);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
        ตรวจสอบสถานะต่างๆ
      </Title>
      <Table
        dataSource={checkAllStatus}
        columns={[
          { title: "ลำดับที่", dataIndex: "id", key: "id" },
          { title: "รายการ", dataIndex: "name", key: "name" },
          { title: "สถานะ", dataIndex: "status", key: "status" },
          { title: "หมายเหตุ", dataIndex: "remark", key: "remark" },
        ]}
        rowKey="id"
        pagination={false}
      />
    </Content>
  );
}
