import React, { useState, useEffect } from "react";
import {
  Select,
  Input,
  Button,
  Table,
  Form,
  Row,
  Col,
  notification,
} from "antd";
import api from "../../../../utils/form/api";
import "../../../../theme/css/texts.css";
import "../../../../theme/css/tables.css";

function ChairmanScoreCSB01() {
  const [projects, setProjects] = useState([]); // State to hold projects
  const [csb01Data, setCsb01Data] = useState([]); // State for CSB01 data
  const [approvedProjects, setApprovedProjects] = useState(new Set());
  const [selectedProject, setSelectedProject] = useState(null);
  const [data, setData] = useState([
    { id: 1, name: "คะแนนรวม", fullscores: "33", score: "" },
  ]);

  useEffect(() => {
    //เหมือนกันทุกอันของประธาน
    const fetchProjectsAndCSB01Data = async () => {
      try {
        // Fetch projects from your API
        const token = localStorage.getItem("jwtToken");
        const projectsRes = await api.getChairManProject("สอบหัวข้อ", token); // Ensure this API exists
        if (projectsRes.data.data.length > 0) {
          console.log("Projects fetched:", projectsRes.data.data);

          setProjects(projectsRes.data.data); // Set projects state
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        notification.error({
          message: "Error fetching data",
          description: "Unable to load project and CSB01 data.",
        });
      }
    };

    fetchProjectsAndCSB01Data();
  }, []);

  const handleProjectChange = (value) => {
    //เอาอันนี้ไปใส่อันอื่นด้วย
    const project = projects.find((p) => p.projectName === value);
    setSelectedProject(project);
    setData([
      {
        id: 1,
        name: "คะแนนรวม",
        fullscores: "100",
        score: project.unconfirmScore || "", // Show unconfirmScore in score
      },
    ]);
  };

  const handleScoreChange = (e) => {
    const newScore = e.target.value;
    const fullScore = Number(data[0].fullscores);
    if (newScore < 0 || newScore > fullScore) {
      notification.error({
        message: "กรอกคะแนนผิดพลาด",
        description: `คะแนนต้องอยู่ระหว่าง 0 และ ${fullScore}`,
      });
    } else {
      setData((prevData) =>
        prevData.map((item) => ({ ...item, score: newScore }))
      );
    }
  };

  const resetForm = () => {
    setSelectedProject(null);
    setData([]);
  };

  const handleSubmit = async () => {
    //อันนี้ไปใส่อันอื่นด้วย
    if (!selectedProject) {
      notification.error({
        message: "ผิดพลาด",
        description: "กรุณาเลือกชื่อโครงงานก่อน",
      });
      return;
    }

    const updatedData =
      data.find((item) => item.name === "คะแนนรวม")?.score || "";
    if (!updatedData) {
      notification.error({
        message: "ผิดพลาด",
        description: "กรุณากรอกคะแนนให้ครบถ้วน",
      });
      return;
    }

    const unconfirmScore = Number(updatedData);
    const totalConfirmScore = unconfirmScore;

    try {
      const response = await api.chaircsb01({
        _id: selectedProject._id, // Use _id for projectId
        activeStatus: 2,
        unconfirmScore: unconfirmScore,
      });

      console.log(response.data);
      notification.success({
        message: "อนุมัติโครงงานสำเร็จ!",
        description: `โครงงาน: ${selectedProject.projectName} | คะแนนที่ได้: ${totalConfirmScore}`,
      });
      setApprovedProjects((prev) =>
        new Set(prev).add(selectedProject.projectName)
      );
      resetForm();
    } catch (error) {
      console.error(error);
      notification.error({
        message: "ไม่สามารถอนุมัติโครงงานได้",
        description: "กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const columns = [
    {
      title: "คะแนนเต็ม",
      dataIndex: "fullscores",
      key: "fullscores",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "คะแนนได้",
      dataIndex: "score",
      key: "score",
      render: (_, record) => (
        <Input
          value={record.score}
          onChange={handleScoreChange}
          type="number"
          style={{
            width: "80px",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
          }}
        />
      ),
    },
  ];

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

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "60%", textAlign: "center" }}>
        <h1 style={{ textAlign: "center" }}>
          แบบประเมินโครงงานพิเศษ 1 (สอบหัวข้อ)
        </h1>

        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item>
                <h3>เลือกชื่อโครงงาน</h3>
                <Select
                  onChange={handleProjectChange}
                  placeholder="เลือกโครงงาน"
                >
                  {projects.map((project) => (
                    <Select.Option
                      key={project._id}
                      value={project.projectName}
                    >
                      {project.projectName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {selectedProject && (
            <>
              <Row gutter={16}>
                {selectedProject.student.map(
                  (
                    student,
                    index //01เทียบ
                  ) => (
                    <Col span={12} key={student._id}>
                      <Form.Item label={`ชื่อ-สกุลนักศึกษาคนที่ ${index + 1}`}>
                        <Input
                          value={`${student.FirstName} ${student.LastName}`}
                          disabled
                          style={{ width: "100%", borderRadius: "4px" }}
                        />
                      </Form.Item>
                    </Col>
                  )
                )}
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  {selectedProject.lecturer.map(
                    (
                      lecturer,
                      index //อันนี้ด้วย
                    ) => (
                      <Form.Item
                        label={`ชื่ออาจารย์ที่ปรึกษา ${index + 1}`}
                        key={lecturer._id}
                      >
                        <Input
                          value={lecturer.T_name}
                          disabled
                          style={{ width: "100%", borderRadius: "4px" }}
                        />
                      </Form.Item>
                    )
                  )}
                </Col>
              </Row>

              <h2>ตารางคะแนนสำหรับประธานกรรมการสอบ</h2>
              <Table
                className="custom-table"
                dataSource={data}
                columns={columns}
                pagination={false}
                rowKey="id"
                bordered
                style={{ marginTop: "16px" }}
                components={components}
              />

              <Row
                gutter={16}
                style={{ marginTop: "16px", justifyContent: "center" }}
              >
                <Col>
                  <Button type="primary" onClick={handleSubmit}>
                    อนุมัติคะแนน
                  </Button>
                </Col>
                <Col>
                  <Button danger onClick={handleCancel}>
                    ยกเลิก
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Form>
      </div>
    </div>
  );
}

export default ChairmanScoreCSB01;
