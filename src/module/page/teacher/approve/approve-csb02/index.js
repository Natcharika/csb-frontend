import React, { useState, useEffect } from "react";
import {
  Select,
  Input,
  Button,
  Form,
  Row,
  Col,
  message,
  notification,
} from "antd";
import api from "../../../../utils/form/api";
import "../../../../theme/css/texts.css";
import "../../../../theme/css/buttons.css";

export default function ApproveCSB02() {
  const [projects, setProjects] = useState([]);
  const [approvedProjects, setApprovedProjects] = useState(new Set());
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const { data } = await api.getProjectAcceptace("CSB02", token);

      if (data.body.length > 0) {
        setProjects(data.body);
        // Set initial data for the first project if needed
        const projectData = data.body[0];
        setProjectDetails(projectData);
        setSelectedProject(projectData); // Store the first project as selected
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error Fetching Projects",
        description: "Unable to fetch project data. Please try again later.",
        placement: "topRight",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleProjectChange = (value) => {
    const selected = projects.find((p) => p._id === value);
    setSelectedProject(selected);
    setProjectDetails(selected);
  };

  const resetForm = () => {
    setSelectedProject(null);
    setProjectDetails(null);
  };

  const handleApprove = async () => {
    if (!selectedProject) {
      message.warning("กรุณาเลือกชื่อโครงงานก่อน");
      return;
    }

    try {
      const response = await api.approveCSB02({
        projectId: selectedProject._id,
        activeStatus: 2,
      });

      console.log(response.data);
      message.success(`อนุมัติโครงงาน ${selectedProject.projectName} สำเร็จ`);
      setApprovedProjects((prev) =>
        new Set(prev).add(selectedProject.projectName)
      );
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error(error);
      message.error("ไม่สามารถอนุมัติโครงงานได้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  const handleReject = async () => {
    if (!selectedProject) {
      message.warning("กรุณาเลือกชื่อโครงงานก่อน");
      return;
    }

    try {
      const response = await api.rejectCSB02({
        projectId: selectedProject._id, // Use _id from selectedProject
        activeStatus: 0,
      });
      console.log(response.data);
      message.warning(
        `ปฏิเสธการยื่นสอบก้าวหน้าโครงงาน ${selectedProject.projectName}`
      );
      resetForm();
    } catch (error) {
      message.error("ไม่สามารถปฏิเสธโครงงานได้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div
      // style={{
      //   display: "flex",
      //   justifyContent: "center",
      //   padding: "24px",
      //   fontFamily: "Arial, sans-serif",
      // }}
      style={{
        margin: "auto",
        padding: 24,
        backgroundColor: "#fff",
        // flexDirection: "column",
        display: "flex",
        justifyContent: "center",
        // alignItems: "center",
        // textAlign: "center",
        borderRadius: 10,
        maxWidth: 820,
        border: "2px solid #ffd28f", // กำหนดกรอบสีส้มอ่อน
        backgroundColor: "#fff5e6", // พื้นหลังสีส้มอ่อน
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // เพิ่มเงาให้กรอบ
      }}
    >
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <h1
          style={{
            fontSize: "20px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <b>อนุมัติการยื่นสอบก้าวหน้าโครงงาน</b>
        </h1>

        <Form layout="vertical">
          <Row justify="center" gutter={16}>
            <Col span={12}>
              <Form.Item style={{ textAlign: "center" }}>
                <h2>เลือกชื่อโครงงาน</h2>
                <Select
                  value={selectedProject?._id || ""} // Use _id as the value
                  placeholder="เลือกโครงงาน"
                  style={{ width: "100%" }}
                  onChange={handleProjectChange}
                >
                  {projects.map((project) => (
                    <Select.Option
                      key={project._id}
                      value={project._id}
                      style={{ backgroundColor: "#fad59e" }}
                    >
                      {project.projectName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {projectDetails && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="ชื่อ-สกุลนักศึกษาคนที่ 1">
                    <Input
                      value={`${projectDetails.student[0]?.FirstName || ""} ${
                        projectDetails.student[0]?.LastName || ""
                      }`}
                      disabled
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="ชื่อ-สกุลนักศึกษาคนที่ 2">
                    <Input
                      value={`${projectDetails.student[1]?.FirstName || ""} ${
                        projectDetails.student[1]?.LastName || ""
                      }`}
                      disabled
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  {projectDetails.lecturer.map((lecturer, index) => (
                    <Form.Item
                      key={index}
                      label={`ชื่ออาจารย์ที่ปรึกษา ${index + 1}`}
                    >
                      <Input
                        value={`${lecturer.T_name}`}
                        disabled
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  ))}
                </Col>
              </Row>

              <Row gutter={16} style={{ marginTop: "16px" }}>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Button
                    className="All-button"
                    type="primary"
                    onClick={handleApprove}
                  >
                    อนุมัติการยื่นสอบก้าวหน้าโครงงาน
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    className="red-button"
                    type="primary"
                    danger
                    onClick={handleReject}
                  >
                    ปฏิเสธการยื่นสอบก้าวหน้าโครงงาน
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Form>
      </div>
    </div>
  );
}
