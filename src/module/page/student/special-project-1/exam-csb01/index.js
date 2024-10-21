import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Checkbox,
  Button,
  Typography,
  Row,
  Col,
  notification,
} from "antd";
import cis from "../../../../public/image/cis.png";
import api from "../../../../utils/form/api";
import "../../../../theme/css/buttons.css";
import "../../../../theme/css/texts.css";

const { Title, Paragraph } = Typography;

export default function ExamCSB01() {
  const [form] = Form.useForm();
  const [isOtherChecked, setIsOtherChecked] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [studentExists, setStudentExists] = useState(false); // State to check if the student is already in a project
  const [loading, setLoading] = useState(true); // State to manage loading
  const [username, setUsername] = useState("");
  const [project, setProject] = useState(null); // Store the entire project object

  const handleCheckboxChange = (checkedValues) => {
    setIsOtherChecked(checkedValues.includes("topic6"));
  };

  const handleSubmit = async (values) => {
    const formattedStudents = Object.keys(values.student).map((key) => ({
      studentId: values.student[key].studentId,
      FirstName: values.student[key].FirstName,
      LastName: values.student[key].LastName,
    }));

    const body = {
      projectName: values.projectName,
      projectType: 0,
      projectStatus: 0,
      projectDescription: values.projectDescription,
      student: formattedStudents,
      Status: "",
    };

    try {
      // Fetch existing projects
      const res = await api.getAllProject();
      if (Array.isArray(res.data.body) && res.data.body.length > 0) {
        const existingStudentIds = res.data.body.flatMap((project) =>
          project.student.map((student) => student.studentId)
        );

        // Check if any of the submitted student IDs are already associated with a project
        const studentAlreadyInProject = formattedStudents.some((student) =>
          existingStudentIds.includes(student.studentId)
        );

        if (studentAlreadyInProject) {
          // If a student is already in a project, show a notification and stop the submission
          notification.error({
            message: "เกิดข้อผิดพลาด",
            description:
              "นักศึกษามีโครงงานอยู่แล้ว ไม่สามารถสร้างโครงงานใหม่ได้",
            placement: "topRight",
          });
          return; // Stop the form submission
        }
      }

      // If no conflict, proceed with creating the project
      await api.createProject(body);
      form.resetFields();
      setIsSubmitDisabled(true);
      notification.success({
        message: "สำเร็จ",
        description: "สร้างโปรเจกต์สำเร็จ",
        placement: "topRight",
      });
    } catch (error) {
      console.error(error);
      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างโปรเจกต์ได้",
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
    const fetchExistingProjects = async () => {
      try {
        const res = await api.getAllProject();
        if (Array.isArray(res.data.body) && res.data.body.length > 0) {
          const existingStudents = res.data.body.flatMap((project) =>
            project.student.map((student) => student.studentId)
          );

          // Check if the form's student ID is already in an existing project
          const isStudentInProject = existingStudents.some(
            (id) =>
              form.getFieldValue(["student", "0", "studentId"]) === id ||
              form.getFieldValue(["student", "1", "studentId"]) === id
          );

          setStudentExists(isStudentInProject);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
      setLoading(false);
    };

    fetchExistingProjects();
  }, [username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (studentExists) {
    return (
      <div style={{ textAlign: "center", margin: "40px auto" }}>
        <Paragraph style={{ fontSize: "18px", color: "#f5222d" }}>
          นักศึกษาอยู่ในโครงงานอยู่แล้ว ไม่สามารถสร้างโครงงานใหม่ได้
        </Paragraph>
      </div>
    );
  }

  return (
    <div
      style={{
        margin: "auto",
        backgroundColor: "#fff",
        padding: 40,
        borderRadius: 10,
      }}
    >
      <img
        src={cis}
        alt="logo"
        style={{ display: "block", margin: "0 auto", width: "150px" }}
      />
      <Typography style={{ textAlign: "center", marginBottom: 24 }}>
        <Title level={3}>แบบฟอร์มเสนอหัวข้อโครงงานพิเศษ</Title>
        <Paragraph>
          โครงการพิเศษ (สองภาษา) ภาควิชาวิทยาการคอมพิวเตอร์และสารสนเทศ
          <br />
          คณะวิทยาศาสตร์ประยุกต์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
        </Paragraph>
      </Typography>

      <Form
        form={form}
        name="projectForm"
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 600, margin: "auto" }}
      >
        {/* Form Fields */}
        <Form.Item
          label="รหัสนักศึกษา 1"
          name={["student", "0", "studentId"]}
          rules={[{ required: true, message: "กรุณากรอกรหัสนักศึกษา 1" }]}
        >
          <Input placeholder="รหัสนักศึกษา 1" />
        </Form.Item>

        <Form.Item label="ชื่อและนามสกุลนักศึกษา 1">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={["student", "0", "FirstName"]}
                rules={[
                  { required: true, message: "กรุณากรอกชื่อจริงนักศึกษา 1" },
                ]}
              >
                <Input placeholder="ชื่อจริงนักศึกษา 1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["student", "0", "LastName"]}
                rules={[
                  { required: true, message: "กรุณากรอกนามสกุลนักศึกษา 1" },
                ]}
              >
                <Input placeholder="นามสกุลนักศึกษา 1" />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label="รหัสนักศึกษา 2"
          name={["student", "1", "studentId"]}
          rules={[{ required: true, message: "กรุณากรอกรหัสนักศึกษา 2" }]}
        >
          <Input placeholder="รหัสนักศึกษา 2" />
        </Form.Item>

        <Form.Item label="ชื่อและนามสกุลนักศึกษา 2">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={["student", "1", "FirstName"]}
                rules={[
                  { required: true, message: "กรุณากรอกชื่อจริงนักศึกษา 2" },
                ]}
              >
                <Input placeholder="ชื่อจริงนักศึกษา 2" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["student", "1", "LastName"]}
                rules={[
                  { required: true, message: "กรุณากรอกนามสกุลนักศึกษา 2" },
                ]}
              >
                <Input placeholder="นามสกุลนักศึกษา 2" />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label="ชื่อโครงงานภาษาอังกฤษ"
          name="projectName"
          rules={[
            { required: true, message: "กรุณากรอกชื่อโครงงานภาษาอังกฤษ" },
            {
              pattern: /^[A-Za-z\s]+$/, // Regular expression for English letters and spaces
              message: "กรุณากรอกเฉพาะตัวอักษรภาษาอังกฤษ",
            },
          ]}
        >
          <Input placeholder="ชื่อโครงงานภาษาอังกฤษ" />
        </Form.Item>

        <Form.Item
          label="ประเภทโครงงาน"
          name="projectType"
          rules={[{ required: true, message: "กรุณาเลือกประเภทโครงงาน" }]}
        >
          <Checkbox.Group onChange={handleCheckboxChange}>
            <Row>
              <Col span={24}>
                <Checkbox value="topic1">Network & Cyber Security</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="topic2">Mobile and Web Technology</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="topic3">Smart Technology</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="topic4">Artificial Intelligence</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="topic5">Games & Multimedia</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="topic6">Other</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>

        {isOtherChecked && (
          <Form.Item
            label="กรุณาระบุประเภทโครงงานอื่นๆ"
            name="otherProjectType"
            rules={[{ required: true, message: "กรุณาระบุประเภทโครงงานอื่นๆ" }]}
          >
            <Input placeholder="โปรดระบุ" />
          </Form.Item>
        )}

        <Form.Item
          label="รายละเอียด"
          name="projectDescription"
          rules={[{ required: true, message: "กรุณากรอกรายละเอียด" }]}
        >
          <Input.TextArea placeholder="กรอกรายละเอียด" rows={4} />
        </Form.Item>

        <Form.Item
          label="เครื่องมือที่ใช้"
          name="tools"
          rules={[{ required: true, message: "กรุณากรอกเครื่องมือที่ใช้" }]}
        >
          <Input placeholder="กรอกเครื่องมือที่ใช้" />
        </Form.Item>

        <Form.Item style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={isSubmitDisabled}
            className="All-button"
          >
            บันทึก
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
