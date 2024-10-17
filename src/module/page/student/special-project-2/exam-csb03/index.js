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
import loadingGif from "../../../../public/image/giphy (1).gif";

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

  // Disable dates before today
  const disabledDate = (current) => {
    return current && current < new Date().setHours(0, 0, 0, 0);
  };

  // Calculate the end date and format it as DD/MM/YYYY
  const calculateEndDate = (date) => {
    if (date) {
      const end = new Date(date);
      end.setDate(end.getDate() + 30);
      return formatDate(end); // Use the formatDate function for consistency
    }
    return null;
  };

  // Format the date as DD-MM-YYYY
  const formatDate = (date) => {
    if (date) {
      const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with zero if needed
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-11) and pad with zero
      const year = date.getFullYear(); // Get full year
      return `${day}-${month}-${year}`; // Return formatted string
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
            setProject(filteredProjects);

            // Check if CSB03 status is "approved"
            if (projectData.status?.CSB03?.status === "approved") {
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

  const isCSB02Passed =
    Array.isArray(project) &&
    project.length > 0 &&
    project[0]?.status?.CSB02?.status;
  const hasLecturer = Array.isArray(data.lecturer) && data.lecturer.length > 0;

  if (loading) {
    return <div>ทำเจคให้ไม่มีบัคก่อนค่อยยื่นทดสอบจ้า</div>;
  }

  if (isCSB03Approved) {
    return (
      <div>
        <Paragraph>คุณส่งทดสอบไปแล้ว</Paragraph>
      </div>
    );
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
      <Typography>
        <Title level={3}>หนังสือรับรองการทดสอบโครงงานพิเศษ</Title>
        <Paragraph>
          โครงการพิเศษ (สองภาษา) ภาควิชาวิทยาการคอมพิวเตอร์และสารสนเทศ
          <br />
          คณะวิทยาศาสตร์ประยุกต์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
        </Paragraph>
      </Typography>
      {isCSB02Passed && hasLecturer ? (
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
                      {index + 1}. {`${student.FirstName} ${student.LastName}`}
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
                />
              </Form.Item>

              <Form.Item label="วันที่เริ่มทดสอบ" required>
                <DatePicker
                  style={{ width: "90%" }}
                  disabledDate={disabledDate}
                  onChange={(date) => {
                    setStartDate(formatDate(date ? date.toDate() : null)); // Format start date
                    setEndDate(calculateEndDate(date ? date.toDate() : null));
                  }}
                />
              </Form.Item>

              {endDate && <Paragraph>วันที่สิ้นสุดทดสอบ: {endDate}</Paragraph>}

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
                      htmlType="submit"
                      style={{ padding: "6px 30px", fontSize: "16px" }}
                    >
                      ยินยอม
                    </Button>
                  </Col>
                </Row>
              </div>
            </Space>
          </Form>
        </>
      ) : (
        <>
          <Paragraph>
            ไม่สามารถดำเนินการได้ เนื่องจากสถานะ CSB02 ไม่ผ่าน{" "}
          </Paragraph>
          <img src={loadingGif} alt="Loading..." style={{ width: "100%" }} />
        </>
      )}
    </div>
  );
}
