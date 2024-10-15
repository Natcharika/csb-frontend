import React, { useState, useEffect } from 'react';
import { Select, Input, Button, Table, Form, Row, Col, message ,notification} from 'antd';
import api from '../../../../utils/form/api';

const { Option } = Select;

function DepartmentHeadScoreCSB04() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectDetails, setProjectDetails] = useState(null);
    const [data, setData] = useState([{ id: 1, name: 'คะแนนรวม', fullscores: '100', score: '' }]);
    const [csb04Data, setCsb04Data] = useState([]);
    const [confirmScore, setConfirmScore] = useState([]);

    
    useEffect(() => {
        const fetchProjectsAndCSB02Data = async () => {
            try {
                const projectRes = await api.getProjects(); 
                const csb04Res = await api.getcsb04(); 

                if (projectRes.data.body.length > 0) {
                    console.log("Fetched Projects:", projectRes.data.body);
                    setProjects(projectRes.data.body);
                }

                if (csb04Res.data.body.length > 0) {
                    console.log("Fetched CSB03 Data:", csb04Res.data.body);
                    setCsb04Data(csb04Res.data.body);
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

    const filteredProjects = projects.filter((project) => !confirmScore.includes(project.projectName));


    const handleProjectChange = (value) => {
        const selected = projects.find((p) => p.projectName === value);
        const csb04Entry = csb04Data.find((c) => c.projectId === selected._id);
    
        if (selected && csb04Entry) {
          setSelectedProject(selected);
          setData([{ id: 1, name: 'คะแนนรวม', fullscores: '100', score: csb04Entry.confirmScore }]);

        } else {
          setSelectedProject(null);
          setData([{ id: 1, name: 'คะแนนรวม', fullscores: '100', score: '' }]);

        }
      };


      const handleSubmit = async () => {
        if (!selectedProject) {
            message.warning("กรุณาเลือกชื่อโครงงานก่อน");
            return;
        }
    
        try {
            const updatedScore = data.find(item => item.name === 'คะแนนรวม')?.score;
    
            if (!updatedScore) {
                message.error("กรุณากรอกคะแนนให้ครบถ้วน");
                return;
            }
    
            // Sending projectId and activeStatus to backend
            const response = await api.departcsb04({
                projectId: selectedProject._id,
                activeStatus: 3, // Set as needed
            });
    
            if (response.status === 200) {
                message.success("บันทึกคะแนนสำเร็จ!");
                setProjects(prevProjects => prevProjects.filter(p => p._id !== selectedProject._id));
                resetForm();
            } else {
                message.error("บันทึกคะแนนไม่สำเร็จ! กรุณาลองใหม่อีกครั้ง");
            }
        } catch (error) {
            console.error('Error submitting score:', error);
            notification.error({
                message: 'Error submitting score',
                description: 'Unable to save the score. Please try again.',
            });
        }
    };
    
    const handleCancel = () => {
        resetForm();
      };

      const resetForm = () => {
        setSelectedProject(null);

      };
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '60%', textAlign: 'center' }}>
            <h1 >แบบประเมินโครงงานพิเศษ 2 (ปริญญานิพนธ์)</h1>
                <Form layout="vertical">
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
                            <Form.Item label="ชื่ออาจารย์ที่ปรึกษา">
                            <Input value={selectedProject.lecturer[0]?.T_name} disabled style={{ width: '100%', borderRadius: '4px' }} />
                            </Form.Item>

                            <h2 style={{ textAlign: 'center' }}>ตารางคะแนนสำหรับหัวหน้าภาควิชา</h2>
                            <Table
                                dataSource={data}
                                columns={[
                                    { title: 'คะแนนเต็ม', dataIndex: 'fullscores', key: 'fullscores' },
                                    { title: 'คะแนนได้', dataIndex: 'score', key: 'score' }
                                ]}
                                pagination={false}
                                rowKey="id"
                            />

                            <div style={{ marginTop: 16, textAlign: 'center' }}>
                                <Button type="primary" onClick={handleSubmit}>
                                    อนุมัติคะแนน
                                </Button>
                                <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
                                    ยกเลิก
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
            </div>
    );
}

export default DepartmentHeadScoreCSB04;
