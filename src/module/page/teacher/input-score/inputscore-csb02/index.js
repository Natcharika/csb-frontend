import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Input,
  Modal,
  Typography,
  Select,
  Card,
  InputNumber,
  Form,
  message,
  notification,
} from "antd";
import api from "../../../../utils/form/api";

const { TextArea } = Input;

function InputScoreCSB02() {
  const [scores, setScores] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [comment, setComment] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [evaluatedRows, setEvaluatedRows] = useState({});
  const [successfulEvaluations, setSuccessfulEvaluations] = useState(new Set());
  const [loading, setLoading] = useState(true); // State for loading status
  const [data, setData] = useState({
    projectId: "",
    projectName: "",
    student: [],
    lecturer: [],
  });

  // Criteria data
  const criteriaData = [
    { key: "1", criteria: "วัตถุประสงค์และขอบเขตโครงงาน", maxScore: 10 },
    { key: "2", criteria: "ความเข้าใจระบบงานเดิม/ทฤษฎีหรืองานวิจัย ที่นำมาใช้พัฒนาโครงงาน", maxScore: 20},
    { key: "3",criteria: "การศึกษาความต้องการของระบบ และการออกแบบ", maxScore: 20},
    { key: "4", criteria: "การนำเสนอโครงงาน", maxScore: 20 },
    { key: "5", criteria: "รูปแบบรายงาน", maxScore: 10 },
    { key: "6", criteria: "แนวทางการดำเนินงาน", maxScore: 10 },
  ];

  useEffect(() => {
    const fetchProjectsAndRooms = async () => {
      setLoading(true);
      try {
        const res = await api.getAllProject();
        console.log("All Projects Data:", res.data.body); // ตรวจสอบข้อมูลที่ได้จาก API
        
        if (res.data.body.length > 0) {
          const projectData = res.data.body[0];
          console.log("First Project Data:", projectData); // ตรวจสอบโครงสร้างของ project ว่ามีฟิลด์ student หรือไม่
  
          setData({
            projectId: projectData._id || "",
            projectName: projectData.projectName || "",
            student: projectData.student || [], // เช็คว่ามีข้อมูล student หรือไม่
            lecturer: projectData.lecturer || [],
          });
        }
  
        const resRooms = await api.getRoomPage();
        const roomsData = resRooms.data.body;
        const projects = roomsData.flatMap((room) =>
          room.projects.map((project) => ({
            ...project,
            dateExam: room.dateExam,
            evaluationDate: room.dateExam,
            roomName: room.roomExam,
          }))
        );
  
        const rescsb02 = await api.getcsb02();
        const csb02Data = rescsb02.data.body;
  
        // Filter out projects that have a numerical value in unconfirmScore in csb02Data
        const filteredProjects = projects.filter(
          (project) => !csb02Data.some(
            (csb02) =>
              csb02.projectId === project.projectId && typeof csb02.unconfirmScore === "number"
          )
        );
  
        setProjects(filteredProjects);
      } catch (err) {
        console.error(err);
        notification.error({
          message: "Error Fetching Data",
          description:
            "Unable to fetch project or room data. Please try again later.",
          placement: "topRight",
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchProjectsAndRooms();
  }, []);
  

  const availableDates = [
    ...new Set(projects.map((project) => project.dateExam)),
  ]
    .filter(Boolean)
    .map((date) =>
      new Date(date).toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    );

    const handleDateChange = (value) => {
      // Convert the selected date back to the original format (e.g., "YYYY-MM-DD")
      const originalDate = projects.find(
        (project) =>
          new Date(project.dateExam).toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }) === value
      )?.dateExam;
    
      if (originalDate) {
        const filtered = projects
          .filter((project) => project.dateExam === originalDate)
          .filter((project) => !project.unconfirmScore);
    
        setFilteredProjects(filtered);
      } else {
        setFilteredProjects([]);
      }
      setSelectedDate(value);
    };
    

    const handleLinkClick = (index) => {
      const project = filteredProjects[index];
      console.log("Selected Project:", project); // ตรวจสอบข้อมูลของ project ที่เลือก
      setSelectedProject(project);
      
      // ตรวจสอบว่า project มีฟิลด์ student หรือไม่
      if (project.student && project.student.length > 0) {
        setData((prevData) => ({
          ...prevData,
          student: project.student || [], // ถ้ามี ให้ตั้งค่า student
        }));
      } else {
        console.warn("No student data found for this project");
      }
    
      setModalVisible(true);
    };

  const handleClose = () => {
    setModalVisible(false);
    setComment("");
    setScores({});
  };

  const handleScoreChange = (value, key) => {
    setScores((prevScores) => ({
      ...prevScores,
      [key]: value,
    }));
  };

  useEffect(() => {
    const total = criteriaData.reduce((sum, item) => {
      return sum + (scores[item.key] || 0);
    }, 0);
    setTotalScore(total);
  }, [scores]);

  const onSubmit = async () => {
    const result = {
      projectId: selectedProject.projectId,
      unconfirmScore: totalScore,
      comment: comment,
      referee: [],
    };
    console.log("Result submitted: ", result);

    try {
      const res = await api.scorecsb02(result);
      if (
        res.data.message === "CSB02 score updated successfully" ||
        res.data.message === "CSB02 score saved successfully"
      ) {
        message.success("บันทึกคะแนนสำเร็จ");
        setSuccessfulEvaluations((prev) =>
          new Set(prev).add(selectedProject.projectId)
        );
        setEvaluatedRows((prev) => ({
          ...prev,
          [selectedProject.projectId]: "evaluated",
        }));
        console.log("555: ", result);
      } else {
        notification.error({
          message: "Error",
          description: res.data.message,
          placement: "topRight",
        });
      }
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Error Submitting Score",
        description: "Unable to submit the score. Please try again later.",
        placement: "topRight",
      });
    }

    setScores({});
    setComment("");
    setModalVisible(false);
  };

  const handleDisableEvaluation = (projectId) => {
    setEvaluatedRows((prev) => ({ ...prev, [projectId]: "notEvaluated" }));
  };

  const columns = [
    {
      title: "เกณฑ์พิจารณา",
      dataIndex: "criteria",
      key: "criteria",
    },
    {
      title: "คะแนนเต็ม",
      dataIndex: "maxScore",
      key: "maxScore",
    },
    {
      title: "คะแนนที่ได้",
      key: "score",
      render: (text, record) =>
        record.key === "total" ? (
          <strong>{totalScore}</strong>
        ) : (
          <InputNumber
            min={0}
            max={record.maxScore}
            value={scores[record.key] || 0}
            onChange={(value) => handleScoreChange(value, record.key)}
          />
        ),
    },
  ];

  const totalScoreRow = {
    key: "total",
    criteria: <strong>คะแนนรวม</strong>,
    maxScore: criteriaData.reduce((total, item) => total + item.maxScore, 0),
    score: totalScore,
  };

  const tableData = [...criteriaData, totalScoreRow];

  const hasEvaluatedProjects = () => {
    return filteredProjects.some(
      (project) => evaluatedRows[project.projectId] === "evaluated"
    );
  };

  const isScoreComplete = () => {
    return criteriaData.every(
      (item) => scores[item.key] !== undefined && scores[item.key] !== null
    );
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
        <Typography.Title level={2}>
          ประเมินการโครงงานพิเศษ 1 (สอบก้าวหน้า)
        </Typography.Title>
        <Typography.Text>เลือกวันที่ที่จะทำการประเมิน:</Typography.Text>
        <Select
          style={{ width: "100%" }}
          placeholder="เลือกวันที่"
          onChange={handleDateChange}
          options={availableDates.map((formattedDate) => ({
            value: formattedDate,
            label: formattedDate,
          }))}
        />
        <div style={{ marginTop: 20 }} />

        {selectedDate && filteredProjects.length > 0 ? (
          <div>
            <Button
              onClick={() =>
                filteredProjects.forEach((project) =>
                  handleDisableEvaluation(project.projectId)
                )
              }
              style={{
                backgroundColor: hasEvaluatedProjects() ? "gray" : "red",
                borderColor: hasEvaluatedProjects() ? "gray" : "red",
                color: "white",
                marginBottom: "10px",
              }}
              disabled={hasEvaluatedProjects()}
            >
              ไม่ประเมินทั้งหมด
            </Button>
            <Table
              dataSource={filteredProjects}
              columns={[
                {
                  title: "ลำดับที่",
                  key: "index",
                  render: (text, record, index) => index + 1,
                },
                {
                  title: "ชื่อโครงงาน",
                  dataIndex: "projectName",
                  key: "projectName",
                },
                {
                  title: "ประเมิน",
                  key: "evaluate",
                  render: (_, record) => {
                    const evaluationStatus = evaluatedRows[record.projectId];
            
                    // If the project already has an unconfirmScore, show 'ประเมินสำเร็จ' status
                    if (record.unconfirmScore) {
                      return <span style={{ color: "green" }}>ประเมินสำเร็จ</span>;
                    }
            
                    if (evaluationStatus === "evaluated") {
                      return <span style={{ color: "green" }}>ประเมินสำเร็จ</span>;
                    }
            
                    if (evaluationStatus === "notEvaluated") {
                      return <span style={{ color: "red" }}>ไม่ประเมิน</span>;
                    }
            
                    return (
                      <>
                        <Button
                          onClick={() =>
                            handleLinkClick(filteredProjects.indexOf(record))
                          }
                          type="primary"
                        >
                          ประเมิน
                        </Button>
                        <Button
                          onClick={() => handleDisableEvaluation(record.projectId)}
                          style={{
                            marginLeft: 8,
                            backgroundColor: "red",
                            borderColor: "red",
                            color: "white",
                          }}
                        >
                          ไม่ประเมิน
                        </Button>
                      </>
                    );
                  },
                },
              ]}
              pagination={false}
              bordered
            />
          </div>
        ) : (
          <Typography.Text>
            {selectedDate
              ? null
              : "กรุณาเลือกวันที่เพื่อแสดงโครงงานที่สามารถประเมินได้ !!"}
          </Typography.Text>
        )}

<Modal
  title="กรอกคะแนน"
  visible={modalVisible}
  onCancel={handleClose}
  footer={null}
  width={1000}
>
  <Card>
    <p>
      <strong>ชื่อโครงงาน : </strong> {selectedProject?.projectName}
    </p>
    <div>
      {selectedProject?.student && selectedProject.student.length > 0 ? (
        selectedProject.student.map((student, index) => (
          <p key={index}>
            <strong>นักศึกษาคนที่ {index + 1} : </strong>
            {`${student.FirstName} ${student.LastName}`}
          </p>
        ))
      ) : (
        <p>ไม่มีนักศึกษา</p>
      )}
    </div>
    <p>
      <strong>วันที่ประเมิน : </strong>{" "}
      {new Date(selectedProject?.evaluationDate).toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })}
    </p>
    <p>
      {data.lecturer.length > 0 ? (
        data.lecturer.map((lecturer, index) => (
          <p key={index}>
            <strong>อาจารย์ที่ปรึกษา : </strong> {lecturer.T_name}
          </p>
        ))
      ) : (
        <p>ไม่มีอาจารย์ที่ปรึกษา</p>
      )}
    </p>
  </Card>

          <Table dataSource={tableData} columns={columns} pagination={false} />
          <Form layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item label="ความคิดเห็น">
              <TextArea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                onClick={onSubmit}
                disabled={!isScoreComplete() || loading}
              >
                บันทึกคะแนน
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default InputScoreCSB02;
