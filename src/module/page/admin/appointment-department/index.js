import React, { useEffect, useState } from "react";
import { Table, Button, notification, Form, Select } from "antd";
import api from "../../../utils/form/api"; // Adjust the import based on your project structure

const { Option } = Select;

export default function AppointmentHeadofDepartment() {
  const [form] = Form.useForm();
  const [teachers, setTeachers] = useState([]); // Updated from Teacher to teachers

  const fetchTeachers = async () => {
    try {
      const res = await api.getTeacher();
      console.log(res.data.body); 
      setTeachers(res.data.body);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeachers(); 
  }, []);

  const handleSubmit = (values) => {
    const { teacherId } = values;
    const teacherName = teachers.find(teacher => teacher.T_id === teacherId).T_name; // Get the teacher's name
  
    api.appointHeadOfDepartment(teacherId, teacherName, "Head of Department")
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
            {teachers.map((teacher) => ( // Make sure the naming is consistent
              <Option key={teacher.T_id} value={teacher.T_id}>
                {teacher.T_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Appoint
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
