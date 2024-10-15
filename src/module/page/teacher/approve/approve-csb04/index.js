import React, { useState, useEffect } from 'react';
import { Select, Input, Button, Form, Row, Col, message, notification } from 'antd';
import api from '../../../../utils/form/api';

export default function ApproveCSB04() {
  const [projects, setProjects] = useState([]);
  const [approvedProjects, setApprovedProjects] = useState(new Set());
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    projectId: "",
    projectName: "",
    student: [],
    lecturer: [],
  });

  useEffect(() => {
    api.getAllProject()
      .then((res) => {
        if (res.data.body.length > 0) {
          setProjects(res.data.body); // Update projects state here

          const projectData = res.data.body[0];
          setData({
            projectId: projectData._id || "",
            projectName: projectData.projectName || "",
            student: projectData.student || [],
            lecturer: projectData.lecturer || [],
          });
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


  const handleProjectChange = (value) => {
    const selected = projects.find((p) => p.projectName === value);
    console.log(selected);
    setSelectedProject(selected);
    setProjectDetails(selected);
  };

  const resetForm = () => {
    setSelectedProject(null);
    setProjectDetails(null);
  };

  const handleApprove = async () => {
    if (!selectedProject) {
      message.warning('กรุณาเลือกชื่อโครงงานก่อน');
      return;
    }

    try {
      const response = await api.approveCSB04({
        projectId: selectedProject.projectId,
        activeStatus: 2,
      });

      console.log(response.data);
      message.success(`อนุมัติโครงงาน ${selectedProject.projectName} สำเร็จ`);
      setApprovedProjects((prev) => new Set(prev).add(selectedProject.projectName));
      resetForm();
    } catch (error) {
      console.error(error);
      message.error('ไม่สามารถอนุมัติโครงงานได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleReject = async () => {
    if (!selectedProject) {
      message.warning('กรุณาเลือกชื่อโครงงานก่อน');
      return;
    }

    try {
      await api.rejectCSB04(selectedProject.projectId); // Assuming selectedProject contains projectId
      message.warning(`ปฏิเสธการยื่นสอบป้องกันโครงงาน ${selectedProject.projectName}`);
      resetForm();
    } catch (error) {
      message.error('ไม่สามารถปฏิเสธโครงงานได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  const filteredProjects = projects.filter((project) => !approvedProjects.has(project.projectName));

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <h1 style={{ textAlign: 'center' }}>อนุมัติการยื่นสอบป้องกันโครงงาน</h1>

        <Form layout="vertical">
          <Row justify="center" gutter={16}>
            <Col span={12}>
              <Form.Item style={{ textAlign: 'center' }}>
                <h3>เลือกชื่อโครงงาน</h3>

                <Select
                  value={selectedProject?.projectName || ''}
                  placeholder="เลือกโครงงาน"
                  style={{ width: '100%' }}
                  onChange={handleProjectChange}
                >
                  {filteredProjects.map((project) => (
                    <Select.Option key={project.projectId} value={project.projectName}>
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
                    <Input value={`${projectDetails.student[0].FirstName} ${projectDetails.student[0].LastName}`} disabled style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="ชื่อ-สกุลนักศึกษาคนที่ 2">
                    <Input value={`${projectDetails.student[1].FirstName} ${projectDetails.student[1].LastName}`} disabled style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  {
                    projectDetails.lecturer.map((lecturer, index) => (
                      <Form.Item label={`ชื่ออาจารย์ที่ปรึกษา ${index + 1}`}>
                        <Input value={`${lecturer.T_name}`} disabled style={{ width: '100%' }} />
                      </Form.Item>
                    ))
                  }

                  {/*<Form.Item label="ชื่ออาจารย์ที่ปรึกษา">
                    <Input value={projectDetails.lecturer} disabled style={{ width: '100%' }} />
                  </Form.Item>*/}
                </Col>
              </Row>

              <Row gutter={16} style={{ marginTop: '16px' }}>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <Button type="primary" onClick={handleApprove}>
                    อนุมัติการยื่นสอบป้องกันโครงงาน
                  </Button>
                </Col>
                <Col span={12}>
                  <Button type="primary" danger onClick={handleReject}>
                    ปฏิเสธการยื่นสอบป้องกันโครงงาน
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
