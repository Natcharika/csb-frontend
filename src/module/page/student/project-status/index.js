import React, { useState, useEffect } from "react";
import { Typography, Layout, Table, Row, Col } from "antd";
import api from "../../../utils/form/api";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function ProjectStatus() {
  const [loading, setLoading] = useState(true);

  const initialData = [
    { id: 1, name: "ตรวจสอบคุณสมบัติการยื่นสอบโครงงานพิเศษ 1", status: "", remark: "" },
    { id: 2, name: "การสอบหัวข้อ", status: "", remark: "" },
    { id: 3, name: "การสอบก้าวหน้า", status: "", remark: "" },
    { id: 4, name: "ตรวจสอบคุณสมบัติการยื่นสอบโครงงานพิเศษ 2", status: "", remark: "" },
    { id: 5, name: "การยื่นทดสอบโครงงาน", status: "", remark: "" },
    { id: 6, name: "การสอบป้องกัน", status: "", remark: "" },
  ];

  const [checkAllStatus, setCheckAllStatus] = useState(initialData);

  useEffect(() => {
    api
      .getAllProject()
      .then((res) => {
        console.log("Response from API:", res.data.body);
        if (res.data.body.length > 0) {
          const projectData = res.data.body[0]; // Get the first project from the response

          const updatedStatus = initialData.map((item) => {
            switch (item.id) {
              case 1: // ตรวจสอบคุณสมบัติการยื่นสอบโครงงานพิเศษ 1
                // const studentMatch = projectData.student.find(student => student.studentId === dataFiles.fi_id);
                return { ...item, status: dataFiles.fi_status || "waiting" }; // Update as needed
              case 2: // การสอบหัวข้อ
                return { ...item, status: projectData.status?.CSB01?.status || "No status" };
              case 3: // การสอบก้าวหน้า
                return { ...item, status: projectData.status?.CSB02?.status || "No status" };
              case 4: // ตรวจสอบคุณสมบัติการยื่นสอบโครงงานพิเศษ 2
                return { ...item, status: dataFiles.fi_status || "waiting" }; // Update as needed
              case 5: // การยื่นทดสอบโครงงาน
                return { ...item, status: projectData.status?.CSB03?.status || "No status" };
              case 6: // การสอบป้องกัน
                return { ...item, status: projectData.status?.CSB04?.status || "No status" };
              default:
                return item; // ข้าม phases 1 และ 4
            }
          });

          setCheckAllStatus(updatedStatus); // อัปเดตสถานะใน state
        }
      })
      .catch((err) => {
        console.error("Error fetching project data:", err);
      });
  }); // Added dataFiles as dependency

  const columns = [
    { title: "ลำดับที่", dataIndex: "id", key: "id" },
    { title: "รายการ", dataIndex: "name", key: "name" },
    { title: "สถานะ", dataIndex: "status", key: "status" },
    { title: "หมายเหตุ", dataIndex: "remark", key: "remark" },
  ];

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

  const getFiless = () => {
    api.getFile() // Assuming this is the correct API method
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

  useEffect(() => {
    api
      .getAllProject()
      .then((res) => {
        console.log("Response from API:", res.data.body);
        if (res.data.body.length > 0) {
          const projectData = res.data.body[0];
          setData({
            projectId: projectData._id || "",
            projectName: projectData.projectName || "",
            status: projectData.status || {},
            student: projectData.student || [],
            lecturer: projectData.lecturer || [],
          });
          getFiless();
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Content>
      {data.student.length > 0 && (
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
          {data.student.map((student, index) => (
            <Row key={index} style={{ marginBottom: "8px" }}>
              <Col span={12}>
                {data.lecturer[index] && (
                  <Paragraph style={{ fontSize: "16px", color: "#555" }}>
                    {`${index + 1}. ${data.lecturer[index].T_name}`}
                  </Paragraph>
                )}
              </Col>
            </Row>
          ))}
        </div>
      )}
      <Title level={2} style={{ textAlign: "center" }}>
        ตรวจสอบสถานะต่างๆ
      </Title>
      <Table
        dataSource={checkAllStatus}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </Content>
  );
} 