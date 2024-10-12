import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/form/api";
import { Table, Button, notification, Modal, Form, Input, Select } from "antd";

export default function AddLecture() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [lecturer, setLecturer] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    const body = { projectValidate: [0, 0] };
    try {
      const res = await api.getAllProject(body);
      setData(res.data.body);
      const filtered = res.data.body.filter(
        (project) => !project.lecturer || project.lecturer.length === 0
      );
      setFilteredData(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLecturer = async () => {
    try {
      const res = await api.getLeacturer();
      console.log(res.data.body); // Log the response
      setLecturer(res.data.body);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLecturer();
  }, []);

  const handleEdit = (record) => {
    console.log(record);
    setCurrentProject(record);
    setIsModalVisible(true);
  };

  const handleModalOk = async (values) => {
    try {
      await api.updateProject(currentProject.id, values);
      notification.success({ message: "Project updated successfully!" });
      setIsModalVisible(false);
      fetchData();
    } catch (err) {
      notification.error({ message: "Failed to update project." });
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const components = {
    header: {
      cell: (props) => (
        <th
          style={{
            backgroundColor: "#F77100",
            color: "#FFFFFF",
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
      title: "Project Name",
      dataIndex: "projectName",
      width: "30%",
      sorter: (a, b) => a.projectName.localeCompare(b.projectName),
    },
    {
      title: "Name Student",
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
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          className="Add-button"
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
      <Table
        className="custom-table"
        columns={columns}
        dataSource={filteredData}
        components={components}
      />

      <Modal
        title="Edit Project"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form
          initialValues={{
            projectName: currentProject?.projectName,
            lecturer: currentProject?.lecturer
              ? currentProject.lecturer.id
              : undefined,
          }}
          onFinish={handleModalOk}
        >
          <Form.Item
            label="Project Name"
            name="projectName"
            rules={[
              { required: true, message: "Please input the project name!" },
            ]}
          >
            <Input value={currentProject?.projectName} disabled />{" "}
            {/* Show project name, not editable */}
          </Form.Item>

          <Form.Item
            label="Lecturer"
            name="lecturer"
            rules={[{ required: true, message: "Please select a lecturer!" }]}
          >
            <Select>
              {lecturer.map((lecturers) => (
                <Select.Option
                  key={lecturers.id}
                  value={lecturers.nameLecturer}
                >
                  {lecturers.nameLecturer}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
