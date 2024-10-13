import React, { useEffect, useState } from "react";
import { Table, Button, notification, Form, Select } from "antd";
import api from "../../../utils/form/api"; // Adjust the import based on your project structure

const { Option } = Select;

export default function AppointmentHeadofDepartment() {
  const [teachers, setTeachers] = useState([]);
  const [form] = Form.useForm();

  // Uncomment and use this useEffect if you want to fetch teachers dynamically
  // useEffect(() => {
  //   api.getAllTeachers() // Assuming you have this API endpoint
  //     .then((response) => {
  //       setTeachers(response.data.body); // Adjust based on your API response structure
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching teachers:", error);
  //       notification.error({
  //         message: "Error",
  //         description: "Could not fetch the list of teachers.",
  //       });
  //     });
  // }, []);

  const handleSubmit = (values) => {
    api.appointHeadOfDepartment(values)
      .then((response) => {
        notification.success({
          message: "Success",
          description: "Head of Department appointed successfully.",
        });
        form.resetFields();
      })
      .catch((error) => {
        console.error("Error appointing Head of Department:", error);
        notification.error({
          message: "Error",
          description: "Could not appoint the Head of Department.",
        });
      });
  };

  return (
    <div style={{ margin: "auto", padding: 40, backgroundColor: "#fff", borderRadius: 10, maxWidth: 820 }}>
        <h2 style={{ textAlign: "center" }}>Appointment of Head of Department</h2>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Select Teacher"
            name="teacherId"
            rules={[{ required: true, message: "Please select a teacher!" }]}
          >
            <Select placeholder="Select a teacher">
              {teachers.map((teacher) => (
                <Option key={teacher.id} value={teacher.id}>
                  {teacher.name} {/* Adjust based on the teacher object structure */}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Uncomment if you want to add an Appointment Date */}
          {/* <Form.Item
            label="Appointment Date"
            name="appointmentDate"
            rules={[{ required: true, message: "Please input the appointment date!" }]}
          >
            <Input type="date" />
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Appoint
            </Button>
          </Form.Item>
        </Form>
      </div>
  );
}
