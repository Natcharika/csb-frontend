import React, { useState, useEffect } from 'react';
import { Select, Input, Button, Table, Form, Row, Col, notification } from 'antd';
import api from '../../../../utils/form/api';

function ChairmanScoreCSB04() {
  const [projects, setProjects] = useState([]); // State to hold project details
  const [csb04Data, setCsb04Data] = useState([]); // State for CSB04 data
  const [approvedProjects, setApprovedProjects] = useState(new Set());
  const [selectedProject, setSelectedProject] = useState(null);
  const [data, setData] = useState([{ id: 1, name: 'คะแนนรวม', fullscores: '100', score: '' }]);
  const [logBookScore, setLogBookScore] = useState('');
  const [exhibitionScore, setExhibitionScore] = useState('');

  const SCORE_LIMIT = 80;
  const EXHIBITION_LIMIT = 10;
  const LOGBOOK_LIMIT = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const csb04Res = await api.getcsb04();
        console.log("Fetched CSB04 Data:", csb04Res.data.body);
        setCsb04Data(csb04Res.data.body || []);

        // Fetch project details based on project IDs from csb04Data
        const projectIds = csb04Res.data.body.map(entry => entry.projectId);
        const projectsRes = await api.getProjects({ ids: projectIds });
        setProjects(projectsRes.data.body || []);
      } catch (error) {
        handleNotification('Error fetching data', 'Unable to load CSB04 data.', 'error');
      }
    };

    fetchData();
  }, []);

  const handleNotification = (message, description, type) => {
    notification[type]({
      message,
      description,
    });
  };

  const handleProjectChange = (value) => {
    const selected = projects.find((p) => p.projectName === value);
    const csb04Entry = csb04Data.find((c) => c.projectId === selected?._id);

    setSelectedProject(selected || null);
    setData([{ id: 1, name: 'คะแนนรวม', fullscores: '100', score: csb04Entry?.unconfirmScore || '' }]);
    resetScores();
  };

  const handleScoreChange = (e) => {
    const newScore = Number(e.target.value);
    if (newScore < 0 || newScore > SCORE_LIMIT) {
      handleNotification('Invalid Score', `Score must be between 0 and ${SCORE_LIMIT}`, 'error');
    } else {
      setData((prevData) => prevData.map((item) => ({ ...item, score: newScore })));
    }
  };

  const handleExhibitionScoreChange = (e) => {
    const newScore = Number(e.target.value);
    if (newScore < 0 || newScore > EXHIBITION_LIMIT) {
      handleNotification('Invalid Score', `Exhibition score must be between 0 and ${EXHIBITION_LIMIT}`, 'error');
    } else {
      setExhibitionScore(newScore);
    }
  };

  const handleLogBookScoreChange = (e) => {
    const newScore = Number(e.target.value);
    if (newScore < 0 || newScore > LOGBOOK_LIMIT) {
      handleNotification('Invalid Score', `LogBook score must be between 0 and ${LOGBOOK_LIMIT}`, 'error');
    } else {
      setLogBookScore(newScore);
    }
  };

  const resetScores = () => {
    setLogBookScore('');
    setExhibitionScore('');
  };

  const resetForm = () => {
    setSelectedProject(null);
    setData([{ id: 1, name: 'คะแนนรวม', fullscores: '100', score: '' }]);
    resetScores();
  };

  const calculateGrade = (totalScore) => {
    if (totalScore >= 0 && totalScore <= 54) return 'IP';
    if (totalScore >= 55 && totalScore <= 59) return 'D';
    if (totalScore >= 60 && totalScore <= 64) return 'D+';
    if (totalScore >= 65 && totalScore <= 69) return 'C';
    if (totalScore >= 70 && totalScore <= 74) return 'C+';
    if (totalScore >= 75 && totalScore <= 79) return 'B';
    if (totalScore >= 80 && totalScore <= 84) return 'B+';
    if (totalScore >= 85 && totalScore <= 100) return 'A';
    return 'Not Graded';
  };

  const handleSubmit = async () => {
    if (!selectedProject) {
      handleNotification('Error', 'Please select a project first.', 'error');
      return;
    }

    const totalScore = Number(data[0].score || 0) + Number(logBookScore) + Number(exhibitionScore);
    if (Number.isNaN(totalScore)) {
      handleNotification('Error', 'Please enter valid scores.', 'error');
      return;
    }

    const grade = calculateGrade(totalScore); // Calculate the grade based on the total score

    try {
      const response = await api.chaircsb04({
        projectId: selectedProject._id,
        confirmScore: totalScore,
        activeStatus:3,
        logBookScore,
        exhibitionScore,
        grade,
      });

      handleNotification('Success', `Project: ${selectedProject.projectName} | Total Score: ${totalScore} | Grade: ${grade}`, 'success');
      setApprovedProjects((prev) => new Set(prev).add(selectedProject.projectName));
      resetForm();
    } catch (error) {
      handleNotification('Error', 'Unable to approve the project. Please try again.', 'error');
    }
  };

  // Filter projects to show only those with unconfirmScore and without confirmScore
  const filteredProjects = projects.filter((project) => {
    const csb04Entry = csb04Data.find((c) => c.projectId === project._id);
    return !approvedProjects.has(project.projectName) && csb04Entry?.unconfirmScore && !csb04Entry?.confirmScore;
  });

  const columns = [
    {
      title: 'คะแนนเต็ม',
      dataIndex: 'fullscores',
      key: 'fullscores',
    },
    {
      title: 'คะแนนได้',
      dataIndex: 'score',
      key: 'score',
      render: (_, record) => (
        <Input
          value={record.score}
          onChange={handleScoreChange}
          type="number"
          style={{ width: '80px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
        />
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '60%', textAlign: 'center' }}>
        <h1>แบบประเมินโครงงานพิเศษ 1 (สอบก้าวหน้า)</h1>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="เลือกชื่อโครงงาน">
                <Select
                  value={selectedProject?.projectName}
                  onChange={handleProjectChange}
                  placeholder="เลือกโครงงาน"
                >
                  {filteredProjects.map((project) => (
                    <Select.Option key={project._id} value={project.projectName}>
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
                <Col span={12}>
                  <Form.Item label="ชื่อ-สกุลนักศึกษาคนที่ 1">
                    <Input
                      value={`${selectedProject.student[0]?.FirstName || ''} ${selectedProject.student[0]?.LastName || ''}`}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="ชื่อ-สกุลนักศึกษาคนที่ 2">
                    <Input
                      value={`${selectedProject.student[1]?.FirstName || ''} ${selectedProject.student[1]?.LastName || ''}`}
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="ชื่ออาจารย์ที่ปรึกษา">
                    <Input value={selectedProject.lecturer[0]?.T_name || ''} disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="คะแนน logBook">
                    <Input value={logBookScore} onChange={handleLogBookScoreChange} type="number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="คะแนน exhibition">
                    <Input value={exhibitionScore} onChange={handleExhibitionScoreChange} type="number" />
                  </Form.Item>
                </Col>
              </Row>
              <h2>ตารางคะแนนสำหรับประธานกรรมการสอบ</h2>
              <Table dataSource={data} columns={columns} pagination={false} rowKey="id" bordered />
              <Row gutter={16} style={{ marginTop: '16px', justifyContent: 'center' }}>
                <Col>
                  <Button type="primary" onClick={handleSubmit}>อนุมัติคะแนน</Button>
                </Col>
                <Col>
                  <Button onClick={resetForm}>ยกเลิก</Button>
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
