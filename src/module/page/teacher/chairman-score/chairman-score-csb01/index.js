import React, { useState, useEffect } from 'react';
import { Select, Input, Button, Table, Form, Row, Col, notification } from 'antd';
import api from '../../../../utils/form/api';

function ChairmanScoreCSB01() {
  const [projects, setProjects] = useState([]);
  const [approvedProjects, setApprovedProjects] = useState(new Set()); 
  const [selectedProject, setSelectedProject] = useState(null);
  const [data, setData] = useState([{ id: 1, name: 'คะแนนรวม', fullscores: '80', score: '' }]);
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getAllProject()
      .then((res) => {
        console.log("Response from API:", res.data.body);
        if (res.data.body.length > 0) {
          setProjects(res.data.body);
          setData([{ id: 1, name: 'คะแนนรวม', fullscores: '80', score: '' }]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: 'Error Fetching Projects',
          description: 'Unable to fetch project data. Please try again later.',
          placement: 'topRight',
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleProjectChange = (value) => {
    const selected = projects.find((p) => p.projectName === value);
    setSelectedProject(selected);
    setProjectDetails(selected); 
    setData([{ id: 1, name: 'คะแนนรวม', fullscores: '80', score: selected || '' }]);
  };

  const handleScoreChange = (e) => {
    const newScore = e.target.value;
    const fullScore = parseFloat(data[0].fullscores);

    // ตรวจสอบคะแนนที่กรอก
    if (newScore === '' || (parseFloat(newScore) >= 0 && parseFloat(newScore) <= fullScore)) {
      setData((prevData) => prevData.map((item) => ({ ...item, score: newScore })));
    } else {
      notification.error({
        message: 'ผิดพลาด',
        description: `กรุณากรอกคะแนนระหว่าง 0 ถึง ${fullScore}`,
      });
    }
  };

  const resetForm = () => {
    setSelectedProject(null);
    setProjectDetails(null);
    setData([{ id: 1, name: 'คะแนนรวม', fullscores: '80', score: '' }]);
  };

  const handleSubmit = () => {
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

    notification.success({
      message: 'อัปเดตข้อมูลสำเร็จ!',
      description: `คะแนนที่ได้: ${updatedData}, โครงงาน: ${selectedProject.Er_Pname}`,
    });

    setApprovedProjects((prev) => new Set(prev).add(selectedProject.Er_Pname));

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
          style={{ width: '80px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
        />
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '60%', textAlign: 'center' }}>
        <h1>แบบประเมินโครงงานพิเศษ 1 (สอบหัวข้อ)</h1>

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
                    <Select.Option key={project.projectName} value={project.projectName}>
                      {project.projectName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {projectDetails && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="ชื่อ-สกุลนักศึกษาคนที่ 1">
                    <Input 
                      value={projectDetails.student[0]?.FirstName + ' ' + projectDetails.student[0]?.LastName} 
                      disabled 
                      style={{ width: '100%', borderRadius: '4px' }} 
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="ชื่อ-สกุลนักศึกษาคนที่ 2">
                    <Input 
                      value={projectDetails.student[1]?.FirstName + ' ' + projectDetails.student[1]?.LastName} 
                      disabled 
                      style={{ width: '100%', borderRadius: '4px' }} 
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="ชื่ออาจารย์ที่ปรึกษา">
                    <Input 
                      value={projectDetails.lecturer[0]?.T_name} 
                      disabled 
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
              </Row>
            </>
          )}
        </Form>
      </div>
    </div>
  );
}

export default ChairmanScoreCSB01;
