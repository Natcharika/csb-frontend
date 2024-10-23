import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/form/api";
import "../../../theme/css/buttons.css";
import { Table, Button, notification, Modal, Form, Input, Select } from "antd";

export default function AddLecture() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [Teacher, setTeacher] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await api.getProjects();
      // Filter projects where CSB01 has status "ผ่าน" and activeStatus is 2
      console.log(res);
      const filtered = res.data.body.filter(
        (project) =>
          project.status.CSB01.status === "ผ่าน" &&
          project.status.CSB01.activeStatus === 2 &&
          (!project.lecturer || project.lecturer.length === 0)
      );
      setData(filtered);
      setFilteredData(filtered);
      console.log("Filtered Projects: ", filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeacher = async () => {
    try {
      const res = await api.getTeacher();
      setTeacher(res.data.body);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTeacher();
  }, []);

  const handleEdit = (record) => {
    setCurrentProject(record);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values) => {
    const currentAdvisors = currentProject.lecturer || [];
    const selectedAdvisors = values.lecturer;

    // Ensure the number of selected advisors is no more than 2
    if (selectedAdvisors.length + currentAdvisors.length > 2) {
      notification.error({
        message: "Error",
        description: "A maximum of 2 advisors can be assigned.",
      });
      return;
    }

    // Add the new advisors to the list
    const updatedAdvisors = [
      ...currentAdvisors,
      ...selectedAdvisors.map((id) => ({
        T_id: id,
      })),
    ];

    const payload = {
      projectId: currentProject._id,
      T_name: selectedAdvisors, // Make sure these are the actual T_ids of the selected teachers
      lecturers: updatedAdvisors,
    };

    try {
      const response = await api.assignTeacher(payload);
      notification.success({
        message: "สำเร็จ",
        description: "แต่งตั้งอาจารย์ที่ปรึกษาสำเร็จ",
      });
      setIsModalVisible(false);
      fetchData(); // Refresh the project list
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Error",
        description:
          err.response?.data.message || "มีปัญหาในการแต่งตั้งอาจารย์ที่ปรึกษา",
      });
    }
  };

  const components = {
    header: {
      cell: (props) => (
        <th
          style={{
            backgroundColor: "rgb(253 186 116)",
            borderBottom: "2px solid #FFFFFF",
          }}
        >
          {props.children}
        </th>
      ),
    },
  };

  const columns = [
    {
      title: "รายชื่อโครงงาน",
      dataIndex: "projectName",
      width: "30%",
      sorter: (a, b) => a.projectName.localeCompare(b.projectName),
    },
    {
      title: "รายชื่อนักศึกษา",
      dataIndex: "student",
      render: (students) => (
        <>
          {students.map((student, index) => (
            <span key={index}>
              {student.FirstName} {student.LastName}
              <br />
            </span>
          ))}
        </>
      ),
      sorter: (a, b) => {
        const studentA = a.student[0]?.FirstName || "";
        const studentB = b.student[0]?.FirstName || "";
        return studentA.localeCompare(studentB);
      },
    },
    {
      title: "เพิ่มอาจารย์ที่ปรึกษาโครงงาน",
      key: "action",
      render: (text, record) => (
        <Button
          className="AddLecture-button"
          onClick={() => handleEdit(record)}
          style={{ marginRight: 8 }}
        >
          เพิ่มอาจารย์ที่ปรึกษา
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "20px",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          <b>เพิ่มอาจารย์ที่ปรึกษาโครงงาน</b>
        </h1>
      </div>
      <Table
        className="custom-table"
        columns={columns}
        dataSource={filteredData}
        components={components}
      />

      <Modal
        title="Edit Project"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null} // No footer needed, as we are handling actions in the form
      >
        <Form
          initialValues={{
            projectName: currentProject?.projectName,
            lecturer: currentProject?.lecturer
              ? currentProject.lecturer[0]?.T_id
              : undefined,
          }}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Project Name"
            name="projectName"
            rules={[
              { required: true, message: "Please input the project name!" },
            ]}
          >
            <Input value={currentProject?.projectName} disabled />
          </Form.Item>

          <Form.Item
            label="Lecturer"
            name="lecturer"
            rules={[
              {
                required: true,
                message: "Please select at least one lecturer!",
              },
            ]}
          >
            <Select
              mode="multiple"
              maxTagCount={2} // Limit the number of tags displayed
              placeholder="Select up to 2 advisors"
              onChange={(value) => {
                if (value.length > 2) {
                  notification.warning({
                    message: "Warning",
                    description: "You can only select up to 2 advisors.",
                  });
                }
              }}
            >
              {Teacher.map((teacher) => (
                <Select.Option key={teacher.T_id} value={teacher.T_id}>
                  {teacher.T_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
