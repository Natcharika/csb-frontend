import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/form/api";
import { Table, Button, notification, Modal, Form, Input, Select } from "antd";

export default function AddLecture() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [Teacher, setTeacher] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    const body = { projectValidate: [0, 0] };
    try {
        const res = await api.getProjects(body);
        // Filter projects where the lecturer field is not empty or has at least one lecturer assigned
        const filtered = res.data.body.filter(
            (project) => !project.lecturer || project.lecturer.length === 0
        );
        setData(filtered);
        setFilteredData(filtered);
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
            message: "Success",
            description: "Lecturer(s) have been assigned successfully.",
        });
        setIsModalVisible(false);
        fetchData(); // Refresh the project list
    } catch (err) {
        console.error(err);
        notification.error({
            message: "Error",
            description: err.response?.data.message || "There was an issue assigning the lecturer(s).",
        });
    }
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
        onCancel={handleModalCancel}
        footer={null} // No footer needed, as we are handling actions in the form
      >
        <Form
          initialValues={{
            projectName: currentProject?.projectName,
            lecturer: currentProject?.lecturer ? currentProject.lecturer[0]?.T_id : undefined,
          }}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Project Name"
            name="projectName"
            rules={[{ required: true, message: "Please input the project name!" }]}
          >
            <Input value={currentProject?.projectName} disabled />
          </Form.Item>

          <Form.Item
    label="Lecturer"
    name="lecturer"
    rules={[{ required: true, message: "Please select at least one lecturer!" }]}
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
