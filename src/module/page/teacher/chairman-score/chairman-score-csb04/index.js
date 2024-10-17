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

function ChairmanScoreCSB04() {
  const [projects, setProjects] = useState([]); // State to hold project details
  const [csb04Data, setCsb04Data] = useState([]); // State for CSB04 data
  const [approvedProjects, setApprovedProjects] = useState(new Set());
  const [selectedProject, setSelectedProject] = useState(null);
  const [data, setData] = useState([
    { id: 1, name: "คะแนนรวม", fullscores: "100", score: "" },
  ]);
  const [logBookScore, setLogBookScore] = useState("");
  const [exhibitionScore, setExhibitionScore] = useState("");

  const SCORE_LIMIT = 80;
  const EXHIBITION_LIMIT = 10;
  const LOGBOOK_LIMIT = 10;

  useEffect(() => {
    //เหมือนกันทุกอันของประธาน
    const fetchProjectsAndCSB02Data = async () => {
      try {
        // Fetch projects from your API
        const token = localStorage.getItem("jwtToken");
        const projectsRes = await api.getChairManProject("สอบก้าวหน้า", token); // Ensure this API exists
        if (projectsRes.data.data.length > 0) {
          console.log("Projects fetched:", projectsRes.data.data);

          setProjects(projectsRes.data.data); // Set projects state
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        notification.error({
          message: "Error fetching data",
          description: "Unable to load project and CSB02 data.",
        });
      }
    };

    fetchProjectsAndCSB02Data();
  }, []);

  const handleNotification = (message, description, type) => {
    notification[type]({
      message,
      description,
    });
  };

  const handleProjectChange = (value) => {
    //เอาอันนี้ไปใส่อันอื่นด้วย
    const project = projects.find((p) => p.projectName === value);
    setSelectedProject(project);
    setData([
      {
        id: 1,
        name: "คะแนนรวม",
        fullscores: "90",
        score: project.unconfirmScore || "", // Show unconfirmScore in score
      },
    ]);
  };

  const handleScoreChange = (e) => {
    const newScore = e.target.value;
    const fullScore = Number(data[0]?.fullscores); // Use optional chaining to prevent errors
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

  // const handleExhibitionScoreChange = (e) => {
  //   const newScore = Number(e.target.value);
  //   if (newScore < 0 || newScore > EXHIBITION_LIMIT) {
  //     handleNotification('Invalid Score', `Exhibition score must be between 0 and ${EXHIBITION_LIMIT}`, 'error');
  //   } else {
  //     setExhibitionScore(newScore);
  //   }
  // };
  const handleExhibitionScoreChange = (e) => {
    const newExhibitionScore = e.target.value;
    // Validate ExhibitionScore (should be between 0 and 10)
    if (newExhibitionScore < 1 || newExhibitionScore > 10) {
      notification.error({
        message: "กรอกคะแนนผิดพลาด",
        description: "ExhibitionScore ต้องอยู่ระหว่าง 0 และ 10",
      });
    } else {
      setExhibitionScore(newExhibitionScore);
    }
  };

  // const handleLogBookScoreChange = (e) => {
  //   const newScore = Number(e.target.value);
  //   if (newScore < 0 || newScore > LOGBOOK_LIMIT) {
  //     handleNotification('Invalid Score', `LogBook score must be between 0 and ${LOGBOOK_LIMIT}`, 'error');
  //   } else {
  //     setLogBookScore(newScore);
  //   }
  // };
  const handleLogBookScoreChange = (e) => {
    const newLogBookScore = e.target.value;
    // Validate logBookScore (should be between 0 and 10)
    if (newLogBookScore < 1 || newLogBookScore > 10) {
      notification.error({
        message: "กรอกคะแนนผิดพลาด",
        description: "logBookScore ต้องอยู่ระหว่าง 0 และ 10",
      });
    } else {
      setLogBookScore(newLogBookScore);
    }
  };

  // const resetScores = () => {
  //   setLogBookScore('');
  //   setExhibitionScore('');
  // };

  const resetForm = () => {
    setSelectedProject(null);
    setData([]);
    setLogBookScore("");
    setExhibitionScore("");
  };

  // const calculateGrade = (totalScore) => {
  //   if (totalScore >= 0 && totalScore <= 54) return 'IP';
  //   if (totalScore >= 55 && totalScore <= 59) return 'D';
  //   if (totalScore >= 60 && totalScore <= 64) return 'D+';
  //   if (totalScore >= 65 && totalScore <= 69) return 'C';
  //   if (totalScore >= 70 && totalScore <= 74) return 'C+';
  //   if (totalScore >= 75 && totalScore <= 79) return 'B';
  //   if (totalScore >= 80 && totalScore <= 84) return 'B+';
  //   if (totalScore >= 85 && totalScore <= 100) return 'A';
  //   return 'Not Graded';
  // };

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
    const totalConfirmScore = unconfirmScore + Number(logBookScore); // Calculate confirmScore //ใน04เปลี่ยนด้วย

    try {
      const response = await api.chaircsb02({
        _id: selectedProject._id, // Use _id for projectId
        activeStatus: 3,
        unconfirmScore: unconfirmScore,
        logBookScore: logBookScore, //ใน04ต้องเปลี่ยน 01ไม่มีลบทิ้ง
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

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "60%", textAlign: "center" }}>
        <h1>แบบประเมินโครงงานพิเศษ 1 (สอบก้าวหน้า)</h1>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="เลือกชื่อโครงงาน">
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

              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                bordered
                rowKey="id"
                style={{ marginBottom: "16px" }}
              />

              <Row
                gutter={16}
                style={{ marginTop: "16px", justifyContent: "center" }}
              >
                <Col span={12}>
                  <Form.Item label="คะแนน Log Book">
                    <Input
                      value={logBookScore}
                      onChange={handleLogBookScoreChange}
                      type="number"
                      style={{ width: "100%", borderRadius: "4px" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="คะแนน exhibition">
                    <Input
                      value={exhibitionScore}
                      onChange={handleExhibitionScoreChange}
                      type="number"
                      style={{ width: "100%", borderRadius: "4px" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row
                gutter={16}
                style={{ marginTop: "16px", justifyContent: "center" }}
              >
                <Col>
                  <Button type="primary" onClick={handleSubmit}>
                    อนุมัติคะแนน
                  </Button>
                  <Button onClick={handleCancel} style={{ marginLeft: "10px" }}>
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

export default ChairmanScoreCSB04;
