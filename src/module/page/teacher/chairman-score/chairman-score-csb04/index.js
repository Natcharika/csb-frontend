import React, { useState, useEffect } from 'react';
import { Select, Input, Button, Table, Form, Row, Col, notification } from 'antd';
import api from '../../../../utils/form/api';

function ChairmanScoreCSB04() {
  const [projects, setProjects] = useState([]);
  const [csb04Data, setCsb04Data] = useState([]);
  const [approvedProjects, setApprovedProjects] = useState(new Set());
  const [selectedProject, setSelectedProject] = useState(null);
  const [data, setData] = useState([{ id: 1, name: 'คะแนนรวม', fullscores: '100', score: '' }]);
  const [logBookScore, setLogBookScore] = useState('');
  const [exhibitionScore, setExhibitionScore] = useState('');

  const SCORE_LIMIT = 80;
  const EXHIBITION_LIMIT = 10;
  const LOGBOOK_LIMIT = 10;

  useEffect(() => {
    const fetchProjectsAndCSB04Data = async () => {
      try {
        const projectRes = await api.getProjects();
        const csb04Res = await api.getcsb04();

        setProjects(projectRes.data.body || []);
        setCsb04Data(csb04Res.data.body || []);
      } catch (error) {
        handleNotification('Error fetching data', 'Unable to load project and CSB04 data.', 'error');
      }
    };

    fetchProjectsAndCSB04Data();
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

    try {
      const response = await api.chaircsb04({
        projectId: selectedProject._id,
        confirmScore: totalScore,
        logBookScore,
        exhibitionScore,
      });

      handleNotification('Success', `Project: ${selectedProject.projectName} | Total Score: ${totalScore}`, 'success');
      setApprovedProjects((prev) => new Set(prev).add(selectedProject.projectName));
      resetForm();
    } catch (error) {
      handleNotification('Error', 'Unable to approve the project. Please try again.', 'error');
    }
  };

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
                  {projects
                    .filter((project) => !approvedProjects.has(project.projectName))
                    .map((project) => (
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
