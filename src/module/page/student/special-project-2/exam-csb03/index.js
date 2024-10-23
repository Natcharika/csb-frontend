import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Input,
  DatePicker,
  notification,
} from "antd";
import cis from "../../../../public/image/cis.png";
import api from "../../../../utils/form/api";
import "../../../../theme/css/buttons.css";

const { Title, Paragraph } = Typography;

export default function ExamCSB03() {
  const [data, setData] = useState({
    projectId: "",
    projectName: "",
    student: [],
    lecturer: [],
  });
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [project, setProject] = useState(null);
  const [organization, setOrganization] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isCSB03Approved, setIsCSB03Approved] = useState(false);

  const disabledDate = (current) =>
    current && current < new Date().setHours(0, 0, 0, 0);

  const calculateEndDate = (date) => {
    if (date) {
      const end = new Date(date);
      end.setDate(end.getDate() + 30);
      return formatDate(end);
    }
    return null;
  };

  const formatDate = (date) => {
    if (date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return null;
  };

  const handleAccept = async () => {
    try {
      const response = await api.studentactivecsb03({
        projectId: data.projectId,
        activeStatus: 1,
        organization,
        startDate,
        endDate,
      });
      notification.success({
        message: "Success",
        description: response.data.message,
        placement: "topRight",
      });
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error",
        description: "Unable to create CSB03 data. Please try again later.",
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
        setUsername(decodedPayload.username.slice(1));
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
            setProject(filteredProjects);

            if (
              projectData.status?.CSB03?.status === "ผ่านการอนุมัติจากอาจารย์"
            ) {
              setIsCSB03Approved(true);
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

  const isCSB02Passed = project?.[0]?.status?.CSB02?.status;
  const hasLecturer = data.lecturer.length > 0;

  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if CSB02 is not passed
  if (isCSB02Passed === "ไม่ผ่าน") {
    return (
      <div style={{ textAlign: "center", margin: "20px" }}>
        <Paragraph>
          ไม่สามารถเข้าถึงหน้านี้ได้ เนื่องจากสถานะ CSB02 ไม่ผ่าน
        </Paragraph>
      </div>
    );
  }

  return (
    <div
      style={{
        margin: "auto",
        padding: 40,
        backgroundColor: "#fff",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        borderRadius: 10,
        maxWidth: 820,
        border: "2px solid #ffd28f", // กำหนดกรอบสีส้มอ่อน
        backgroundColor: "#fff5e6", // พื้นหลังสีส้มอ่อน
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // เพิ่มเงาให้กรอบ
      }}
    >
      <img
        src={"http://cs.kmutnb.ac.th/img/logo.png"}
        alt="logo"
        style={{ display: "block", margin: "0 auto", width: "150px" }}
      />
      <Typography>
        <Title level={3}>หนังสือรับรองการทดสอบโครงงานพิเศษ</Title>
        <Paragraph>
          โครงการพิเศษ (สองภาษา) ภาควิชาวิทยาการคอมพิวเตอร์และสารสนเทศ
          <br />
          คณะวิทยาศาสตร์ประยุกต์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
        </Paragraph>
      </Typography>

      {isCSB03Approved ? (
        <Paragraph>คุณส่งยื่นทดสอบไปแล้ว</Paragraph>
      ) : (
        <>
          {isCSB02Passed && hasLecturer ? (
            <>
              <div>
                <Paragraph style={{ fontSize: "18px" }}>โครงงาน</Paragraph>
                <Paragraph style={{ fontSize: "16px", color: "#555" }}>
                  {data.projectName}
                </Paragraph>
              </div>
              <Row gutter={[16, 16]} style={{ width: "100%" }}>
                <Col span={12}>
                  {data.student.length > 0 && (
                    <div>
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
                    <Paragraph style={{ fontSize: "18px" }}>
                      อาจารย์ที่ปรึกษา
                    </Paragraph>
                    {data.lecturer.map((lecturer, index) => (
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
              <Form
                onFinish={handleAccept}
                layout="vertical"
                style={{ width: "100%" }}
              >
                <Space direction="vertical" style={{ width: "80%" }}>
                  <Form.Item
                    label="หน่วยงานที่จะใช้ทดสอบ"
                    name="organization"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกชื่อหน่วยงานที่จะใช้ทดสอบ",
                      },
                    ]}
                  >
                    <Input
                      placeholder="กรอกชื่อหน่วยงาน"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      style={{ backgroundColor: "#FFF" }}
                    />
                  </Form.Item>
                  <Form.Item label="วันที่เริ่มทดสอบ" required>
                    <DatePicker
                      style={{ width: "90%" }}
                      disabledDate={disabledDate}
                      onChange={(date) => {
                        setStartDate(formatDate(date ? date.toDate() : null));
                        setEndDate(
                          calculateEndDate(date ? date.toDate() : null)
                        );
                      }}
                    />
                  </Form.Item>
                  {endDate && (
                    <Paragraph>วันที่สิ้นสุดทดสอบ: {endDate}</Paragraph>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 40,
                    }}
                  >
                    <Button
                      className="All-button"
                      type="primary"
                      htmlType="submit"
                      style={{ padding: "6px 30px", fontSize: "16px" }}
                    >
                      ยินยอมขอยื่นทดสอบโครงงาน
                    </Button>
                  </div>
                </Space>
              </Form>
            </>
          ) : (
            <Paragraph>
              ไม่สามารถดำเนินการได้ เนื่องจากสถานะ CSB02 ไม่ผ่าน
            </Paragraph>
          )}
        </>
      )}
    </div>
  );
}
