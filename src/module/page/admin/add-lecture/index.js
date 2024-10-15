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
      setData(res.data.body);
      const filtered = res.data.body.filter(
        (project) => !project.Teacher || project.Teacher.length === 0
      );
      setFilteredData(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeacher = async () => {
    try {
      const res = await api.getTeacher();
      console.log(res.data.body); 
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
    console.log(record);
    setCurrentProject(record);
    setIsModalVisible(true);
  };


  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values) => {
    const payload = {
      projectId: currentProject._id, 
      lecturer: values.lecturer,
    };
    
    try {
      const response = await api.assignTeacher(payload.projectId, [payload.lecturer]);
      console.log(response);
      
      fetchData();
  
      notification.success({
        message: "Success",
        description: "Lecturer assigned successfully!",
      });
  
      setIsModalVisible(false); 
    } catch (err) {
      console.error("Error assigning lecturer:", err);
      notification.error({
        message: "Error",
        description: "There was an issue assigning the lecturer.",
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
        footer={[
        ]}
      >
        <Form
          initialValues={{
            projectName: currentProject?.projectName,
            lecturer: currentProject?.teacher ? currentProject.teacher.id : undefined,
          }}
          onFinish={handleSubmit}
          
        >
          <Form.Item
            label="Project Name"
            name="projectName"
            rules={[{ required: true, message: "Please input the project name!" }]}
            
          >
             
            <Input value={currentProject?.projectName} disabled /> 
            {/* Show project name, not editable */}
          </Form.Item>

          <Form.Item
            label="Lecturer"
            name="lecturer"
            rules={[{ required: true, message: "Please select a lecturer!" }]}
          >
            <Select >
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
