import React, { useState, useEffect } from 'react';
import { Select, Input, Button, Table, Form, Row, Col, notification } from 'antd';
import api from '../../../../utils/form/api';

function ChairmanScoreCSB02() {
  const [projects, setProjects] = useState([]);
  const [csb02Data, setCsb02Data] = useState([]);
  const [approvedProjects, setApprovedProjects] = useState(new Set());
  const [selectedProject, setSelectedProject] = useState(null);
  const [data, setData] = useState([{ id: 1, name: 'คะแนนรวม', fullscores: '90', score: '' }]);
  const [logBookScore, setLogBookScore] = useState(''); 

  useEffect(() => {
    const fetchProjectsAndCSB02Data = async () => {
      try {
        const projectRes = await api.getProjects(); 
        const csb02Res = await api.getcsb02(); 

        if (projectRes.data.body.length > 0) {
          console.log("Fetched Projects:", projectRes.data.body);
          setProjects(projectRes.data.body);
        }

        if (csb02Res.data.body.length > 0) {
          console.log("Fetched CSB02 Data:", csb02Res.data.body);
          setCsb02Data(csb02Res.data.body);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        notification.error({
          message: 'Error fetching data',
          description: 'Unable to load project and CSB02 data.',
        });
      }
    };

    fetchProjectsAndCSB02Data();
  }, []);

  const handleProjectChange = (value) => {
    const selected = projects.find((p) => p.projectName === value);
    const csb02Entry = csb02Data.find((c) => c.projectId === selected._id);

    if (selected && csb02Entry) {
      setSelectedProject(selected);
      setData([{ id: 1, name: 'คะแนนรวม', fullscores: '90', score: csb02Entry.unconfirmScore }]);
      setLogBookScore(''); // Reset logBookScore when project is changed
    } else {
      setSelectedProject(null);
      setData([{ id: 1, name: 'คะแนนรวม', fullscores: '90', score: '' }]);
      setLogBookScore(''); // Reset logBookScore when project is changed
    }
  };

  const handleScoreChange = (e) => {
    const newScore = e.target.value;
    const fullScore = Number(data[0].fullscores);
    if (newScore < 0 || newScore > fullScore) {
      notification.error({
        message: 'กรอกคะแนนผิดพลาด',
        description: `คะแนนต้องอยู่ระหว่าง 0 และ ${fullScore}`,
      });
    } else {
      setData((prevData) => prevData.map((item) => ({ ...item, score: newScore })));
    }
  };

  const handleLogBookScoreChange = (e) => {
    const newLogBookScore = e.target.value;
    // Validate logBookScore (should be between 0 and 100)
    if (newLogBookScore < 0 || newLogBookScore > 10) {
      notification.error({
        message: 'กรอกคะแนนผิดพลาด',
        description: 'logBookScore ต้องอยู่ระหว่าง 0 และ 10',
      });
    } else {
      setLogBookScore(newLogBookScore);
    }
  };

  const resetForm = () => {
    setSelectedProject(null);
    setData([{ id: 1, name: 'คะแนนรวม', fullscores: '90', score: '' }]);
    setLogBookScore('');
  };

  const handleSubmit = async () => {
    if (!selectedProject) { 
      notification.error({
        message: 'ผิดพลาด',
        description: 'กรุณาเลือกชื่อโครงงานก่อน',
      });
      return;
    }

    const updatedData = data.find((item) => item.name === 'คะแนนรวม')?.score || '';
    if (!updatedData) {
      notification.error({
        message: 'ผิดพลาด',
        description: 'กรุณากรอกคะแนนให้ครบถ้วน',
      });
      return;
    }

    const unconfirmScore = Number(updatedData);
    const totalConfirmScore = unconfirmScore + Number(logBookScore); // Calculate confirmScore

    try {
      const response = await api.chaircsb02({
        projectId: selectedProject._id, // Use _id for projectId
        confirmScore: totalConfirmScore,
        logBookScore: logBookScore,
      });

      console.log(response.data);
      notification.success({
        message: 'อนุมัติโครงงานสำเร็จ!',
        description: `โครงงาน: ${selectedProject.projectName} | คะแนนที่ได้: ${totalConfirmScore}`,
      });
      setApprovedProjects((prev) => new Set(prev).add(selectedProject.projectName));
      resetForm();
    } catch (error) {
      console.error(error);
      notification.error({
        message: 'ไม่สามารถอนุมัติโครงงานได้',
        description: 'กรุณาลองใหม่อีกครั้ง',
      });
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const filteredProjects = projects.filter((project) => !approvedProjects.has(project.projectName));

  const columns = [
    {
      title: 'คะแนนเต็ม',
      dataIndex: 'fullscores',
      key: 'fullscores',
      render: (text) => <span>{text}</span>,
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
        <h1 style={{ textAlign: 'center' }}>แบบประเมินโครงงานพิเศษ 1 (สอบก้าวหน้า)</h1>

        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item>
                <h3>เลือกชื่อโครงงาน</h3>
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
                    <Input value={selectedProject.student[0]?.FirstName + ' ' + selectedProject.student[0]?.LastName} disabled style={{ width: '100%', borderRadius: '4px' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="ชื่อ-สกุลนักศึกษาคนที่ 2">
                    <Input value={selectedProject.student[1]?.FirstName + ' ' + selectedProject.student[1]?.LastName} disabled style={{ width: '100%', borderRadius: '4px' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="ชื่ออาจารย์ที่ปรึกษา">
                    <Input value={selectedProject.lecturer[0]?.T_name} disabled style={{ width: '100%', borderRadius: '4px' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              {/* LogBookScore input field */}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="คะแนน logBook">
                    <Input
                      value={logBookScore}
                      onChange={handleLogBookScoreChange}
                      type="number"
                      style={{ width: '100%', borderRadius: '4px' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <h2>ตารางคะแนนสำหรับประธานกรรมการสอบ</h2>
              <Table
                dataSource={data}
                columns={columns}
                pagination={false}
                rowKey="id"
                bordered
                style={{ marginTop: '16px' }}
              />

              <Row gutter={16} style={{ marginTop: '16px', justifyContent: 'center' }}>
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

export default ChairmanScoreCSB02;  
