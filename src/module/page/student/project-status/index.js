import React, { useState, useEffect } from "react";
import { Typography ,Layout,Table, Row, Col } from "antd";
import api from "../../../utils/form/api";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function ProjectStatus() {
  const [loading, setLoading] = useState(true);

  const initialData = [
    {id: 1,name: "ตรวจสอบคุณสมบัติการยื่นสอบโครงงานพิเศษ 1",status: "",remark: "" },
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
          const projectData = res.data.body[0];
          console.log("Project Data:", projectData);
          const updatedStatus = initialData.map((item) => ({
            ...item,
            status: projectData[item.id - 1]?.status || "",
            remark: projectData[item.id - 1]?.remark || "",
            projectStatus: projectData[item.id - 1]?.projectStatus || 0,
          }));
          setCheckAllStatus(updatedStatus);
        }
      })
      .catch((err) => {
        console.error("Error fetching project data:", err);
      });
  }, []);

  const columns = [
    { title: "ลำดับที่", dataIndex: "id", key: "id" },
    { title: "รายการ", dataIndex: "name", key: "name" },
    { title: "สถานะ", dataIndex: "status", key: "status" },
    { title: "หมายเหตุ", dataIndex: "remark", key: "remark" },
    { title: "สถานะโครงการ", dataIndex: "projectStatus", key: "projectStatus" },
  ];

  const [data, setData] = useState({
    projectId: "",
    projectName: "",
    student: [],
    lecturer: [],
  });

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
            student: projectData.student || [],
            lecturer: projectData.lecturer || [],
          });
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
          <Paragraph style={{ fontSize: "18px" }}>รายชื่อนักศึกษาและอาจารย์ที่ปรึกษา</Paragraph>
          {data.student.map((student, index) => (
            <Row key={index} style={{ marginBottom: "8px" }}>
              <Col span={12}>
                <Paragraph style={{ fontSize: "16px", color: "#555" }}>
                  {`${index + 1}. ${student.FirstName} ${student.LastName}`}
                </Paragraph>
              </Col>
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