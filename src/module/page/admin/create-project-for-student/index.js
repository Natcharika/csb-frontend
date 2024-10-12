import React, { useState } from "react";
import { Form, Input, Button, Typography, Row, Col, notification } from "antd";
import api from "../../../utils/form/api";

const { Title } = Typography;

export default function CreateProjectForStudent() {
  const [form] = Form.useForm();
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const handleSubmit = async (values) => {
    const body = {
      projectName: values.projectName,
      projectType: values.projectType,
      projectStatus: "0",
      projectDescription: values.projectDescription,
      student: values.student,
      lecturer: values.lecturer,
      scoreId: "",
    };
    console.log("asdadsad", body);

    api
      .createProject(body)
      .then((res) => {
        form.resetFields();
        setIsSubmitDisabled(true);
        notification.success({
          message: "สำเร็จ",
          description: "สร้างโปรเจกต์สำเร็จ",
          placement: "topRight",
        });
      })

      .catch((error) => {
        console.error(error);
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถสร้างโปรเจกต์ได้",
          placement: "topRight",
        });
      });
  };

  return (
    <div
      style={{
        margin: "auto",
        backgroundColor: "#fff",
        padding: 40,
        borderRadius: 10,
      }}
    >
      <Typography style={{ textAlign: "center", marginBottom: 24 }}>
        <Title level={3}>แบบฟอร์มเสนอหัวข้อโครงงานพิเศษ</Title>
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
          name={["student", "student1", "studentId"]}
          rules={[{ required: true, message: "กรุณากรอกรหัสนักศึกษา 1" }]}
        >
          <Input placeholder="รหัสนักศึกษา 1" />
        </Form.Item>

        <Form.Item label="ชื่อและนามสกุลนักศึกษา 1">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={["student", "student1", "FirstName"]}
                rules={[
                  { required: true, message: "กรุณากรอกชื่อจริงนักศึกษา 1" },
                ]}
              >
                <Input placeholder="ชื่อจริงนักศึกษา 1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["student", "student1", "LastName"]}
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
          name={["student", "student2", "studentId"]}
          rules={[{ required: true, message: "กรุณากรอกรหัสนักศึกษา 2" }]}
        >
          <Input placeholder="รหัสนักศึกษา 2" />
        </Form.Item>

        <Form.Item label="ชื่อและนามสกุลนักศึกษา 2">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={["student", "student2", "FirstName"]}
                rules={[
                  { required: true, message: "กรุณากรอกชื่อจริงนักศึกษา 2" },
                ]}
              >
                <Input placeholder="ชื่อจริงนักศึกษา 2" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["student", "student2", "LastName"]}
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
          ]}
        >
          <Input placeholder="ชื่อโครงงานภาษาอังกฤษ" />
        </Form.Item>

        <Form.Item
          label="รายละเอียด"
          name="projectDescription"
          rules={[{ required: true, message: "กรุณากรอกรายละเอียด" }]}
        >
          <Input.TextArea placeholder="กรอกรายละเอียด" rows={4} />
        </Form.Item>

        <Form.Item style={{ display: "flex", justifyContent: "center" }}>
          <Button type="primary" htmlType="submit" disabled={isSubmitDisabled}>
            บันทึก
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
