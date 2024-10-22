import React, { useState, useEffect } from "react";
import api from "../../../utils/form/api";
import "../../../theme/css/buttons.css";
import {
  Form,
  Select,
  Button,
  Typography,
  Row,
  Col,
  DatePicker,
  Input,
  notification,
} from "antd";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

function RoomManagement() {
  const [form] = Form.useForm();
  const [teacherCount, setTeacherCount] = useState(1);
  const [projectCount, setProjectCount] = useState(1);
  const [teachers, setTeachers] = useState([
    { T_id: "", T_name: "", role: "" },
  ]);
  const [projects, setProjects] = useState([
    { projectId: "", projectName: "", start_in_time: "" },
  ]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [data, setData] = useState([]);
  const [teacherNames, setTeacherNames] = useState([]);

  const projectTimes = [
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00",
    "11:15",
    "11:30",
    "11:45",
    "13:00",
    "13:15",
    "13:30",
    "13:45",
    "14:00",
    "14:15",
    "14:30",
    "14:45",
    "15:00",
    "15:15",
    "15:30",
    "15:45",
  ];

  useEffect(() => {
    api
      .getAllProject()
      .then((res) => {
        const projectData = res.data.body.map(
          ({ _id, projectName, start_in_time }) => ({
            projectId: _id,
            projectName,
            start_in_time,
          })
        );
        setData(projectData);
        setProjects([{ projectId: "", projectName: "", start_in_time: "" }]);
      })
      .catch(console.error);

    api
      .getTeacher()
      .then((res) => {
        console.log(res.data.body);
        setTeacherNames(res.data.body);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  
  const handleSubmit = (values) => {
    const body = {
      roomExam: values.examRoom,
      nameExam: values.examName,
      dateExam: values.examDate ? values.examDate.format("YYYY-MM-DD") : "", // Format the date properly
      teachers,
      projects,
    };

    // Log the body to ensure it's correct before sending
    console.log("Request body: ", body);

    // First, create the room management
    api
      .createRoomManagement(body)
      .then((res) => {
        form.resetFields();
        setTeachers([{ T_id: "", T_name: "", role: "" }]);
        setProjects([{ projectId: "", projectName: "", start_in_time: "" }]);
        setIsSubmitDisabled(true);

        notification.success({
          message: "สำเร็จ",
          description: "จัดการห้องสำเร็จ",
          placement: "topRight",
        });

        // After successful creation, call the summary API for the specific exam
        const token = localStorage.getItem("jwtToken");
        api
          .getSumaryRoomByExamName(token, values.examName)
          .then((summaryRes) => {
            console.log("Room Summary: ", summaryRes);
            // You can handle the display of summary data here
            // For example, update the UI with the fetched room summary
          })
          .catch((summaryError) => {
            console.error("Error fetching room summary:", summaryError);
          });
      })
      .catch((error) => {
        console.error("Error creating room:", error);

        // Extract error message from response
        const errorMessage =
          error.response && error.response.data.error
            ? error.response.data.error
            : "จัดการห้องไม่สำเร็จ"; // Fallback message

        notification.error({
          message: "ไม่สำเร็จ",
          description: errorMessage,
          placement: "topRight",
        });
      });
  };

  const checkFormValidity = () => {
    const values = form.getFieldsValue();
    const allFieldsFilled =
      values.examRoom &&
      values.examName &&
      values.examDate &&
      teachers.every(({ T_name, role }) => T_name && role) &&
      projects.every(
        ({ projectId, start_in_time }) => projectId && start_in_time
      );

    setIsSubmitDisabled(!allFieldsFilled);
  };

  useEffect(() => {
    checkFormValidity();
  }, [form, teachers, projects]);

  const handleDynamicFieldChange = (setState, fieldIndex, fieldName, value) => {
    setState((prevState) => {
      const updatedFields = [...prevState];
      updatedFields[fieldIndex][fieldName] = value;
      return updatedFields;
    });
  };

  const handleTeacherChange = (index, T_id) => {
    const selectedTeacher = teacherNames.find(
      (teacher) => teacher.T_id === T_id
    );
    if (selectedTeacher) {
      handleDynamicFieldChange(setTeachers, index, "T_id", T_id);
      handleDynamicFieldChange(
        setTeachers,
        index,
        "T_name",
        selectedTeacher.T_name
      );
    }
  };

  const handleProjectNameChange = (index, projectName) => {
    const selectedProject = data.find(
      (project) => project.projectName === projectName
    );
    handleDynamicFieldChange(setProjects, index, "projectName", projectName);
    if (selectedProject) {
      handleDynamicFieldChange(
        setProjects,
        index,
        "projectId",
        selectedProject.projectId
      );
    }
  };

  const handleCountChange = (
    setState,
    setCount,
    value,
    limit,
    fieldTemplate
  ) => {
    const count = Math.min(Number(value), limit);
    const newFields = Array.from({ length: count }, (_, index) => ({
      ...fieldTemplate,
      ...(setState[index] || {}),
    }));
    setState(newFields);
    setCount(count);
  };

  const filteredOptions = (options, selected, currentIndex) =>
    options.filter(
      (option) =>
        !selected.includes(option) || selected[currentIndex] === option
    );

  const handleRoleChange = (index, value) => {
    if (value === "main") {
      const isChairpersonExists = teachers.some(
        (teacher, i) => teacher.role === "main" && i !== index
      );
      if (isChairpersonExists) {
        alert("มีกรรมการสอบท่านอื่นเป็นประธานกรรมการอยู่แล้ว");
        return;
      }
    }
    handleDynamicFieldChange(setTeachers, index, "role", value);
  };

  return (
    <div style={{ maxWidth: "90%", margin: "auto", padding: "20px" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        แบบฟอร์มจัดห้องสอบ
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ examRoom: "", examName: "", examDate: null }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="ชื่อการสอบ (Exam Name)"
              name="examName"
              rules={[{ required: true, message: "กรุณาเลือกชื่อการสอบ" }]}
            >
              <Select placeholder="เลือกชื่อการสอบ">
                <Option value="สอบหัวข้อ">สอบหัวข้อ</Option>
                <Option value="สอบก้าวหน้า">สอบก้าวหน้า</Option>
                <Option value="สอบป้องกัน">สอบป้องกัน</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="ห้องสอบ (Exam Room)"
              name="examRoom"
              rules={[{ required: true, message: "กรุณาเลือกห้องสอบ" }]}
            >
              <Select placeholder="เลือกห้องสอบ">
                <Option value="617">617</Option>
                <Option value="618/1">618/1</Option>
                <Option value="618/2">618/2</Option>
                <Option value="619">619</Option>
                <Option value="621">621</Option>
                <Option value="623">623</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="วันที่สอบ (Exam Date)"
              name="examDate"
              rules={[{ required: true, message: "กรุณาเลือกวันที่สอบ" }]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                placeholder="เลือกวันที่สอบ"
                style={{ width: "100%", backgroundColor:"#fee9c4", borderColor:"#ffd28f"}}
                picker="date"
                onChange={(date) => {
                  form.setFieldsValue({ examDate: date });
                  checkFormValidity();
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="จำนวนกรรมการสอบ">
          <Input
            type="number"
            min={1}
            value={teacherCount}
            onChange={(e) =>
              handleCountChange(
                setTeachers,
                setTeacherCount,
                e.target.value,
                5,
                { T_id: "", T_name: "", role: "" }
              )
            }
            placeholder="กรอกจำนวนกรรมการสอบ"
          />
        </Form.Item>

        {teachers.map((_, index) => (
          <Row gutter={16} key={index}>
            <Col span={12}>
              <Form.Item
                label="ชื่อกรรมการสอบ"
                rules={[
                  { required: true, message: "กรุณาเลือกชื่อกรรมการสอบ" },
                ]}
              >
                <Select
                  placeholder="เลือกชื่อกรรมการสอบ"
                  value={teachers[index].T_name}
                  onChange={(value) => handleTeacherChange(index, value)}
                >
                  {filteredOptions(
                    teacherNames,
                    teachers.map((t) => t.T_id),
                    index
                  ).map(({ T_id, T_name }) => (
                    <Option key={T_id} value={T_id}>
                      {T_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="ตำแหน่ง (Role)"
                rules={[
                  { required: true, message: "กรุณาเลือกตำแหน่งกรรมการ" },
                ]}
              >
                <Select
                  placeholder="เลือกตำแหน่งกรรมการ"
                  value={teachers[index].role}
                  onChange={(value) => handleRoleChange(index, value)}
                  disabled={teachers[index].role === "main"}
                >
                  {teachers.every((teacher) => teacher.role !== "main") ||
                  teachers[index].role === "main" ? (
                    <>
                      <Option value="main">ประธานกรรมการ</Option>
                      <Option value="sub">กรรมการ</Option>
                    </>
                  ) : (
                    <Option value="sub">กรรมการ</Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        ))}

        <Form.Item label="จำนวนโครงงาน">
          <Input
            type="number"
            min={1}
            value={projectCount}
            onChange={(e) =>
              handleCountChange(
                setProjects,
                setProjectCount,
                e.target.value,
                20,
                { projectId: "", projectName: "", start_in_time: "" }
              )
            }
            placeholder="กรอกจำนวนโครงงาน"
          />
        </Form.Item>

        {projects.map((_, index) => (
          <Row gutter={16} key={index}>
            <Col span={12}>
              <Form.Item
                label="ชื่อโครงงาน"
                rules={[{ required: true, message: "กรุณาเลือกชื่อโครงงาน" }]}
              >
                <Select
                  placeholder="เลือกชื่อโครงงาน"
                  value={projects[index].projectName}
                  onChange={(value) => handleProjectNameChange(index, value)}
                >
                  {filteredOptions(
                    data.map(({ projectName }) => projectName),
                    projects.map(({ projectName }) => projectName),
                    index
                  ).map((projectName, idx) => (
                    <Option key={idx} value={projectName}>
                      {projectName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="เวลา (Time)"
                rules={[{ required: true, message: "กรุณาเลือกเวลา" }]}
              >
                <Select
                  placeholder="เลือกเวลา"
                  value={projects[index].start_in_time}
                  onChange={(value) =>
                    handleDynamicFieldChange(
                      setProjects,
                      index,
                      "start_in_time",
                      value
                    )
                  }
                >
                  {filteredOptions(
                    projectTimes,
                    projects.map(({ start_in_time }) => start_in_time),
                    index
                  ).map((time, idx) => (
                    <Option key={idx} value={time}>
                      {time}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        ))}

        <Form.Item>
          <Button
            className="All-button"
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
            disabled={isSubmitDisabled}
          >
            ส่งข้อมูล
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default RoomManagement;
