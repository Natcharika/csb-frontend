import React, { useState, useEffect } from "react";
import { Typography, Button, Row, Col, notification } from "antd";
import cis from '../../../../public/image/cis.png';
import api from '../../../../utils/form/api';

const { Title, Paragraph } = Typography;

export default function ExamCSB04() {
  const [data, setData] = useState({
    projectId: "",
    projectName: "",
    student: [],
    lecturer: [],
  });

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  const handleAccept = async () => {
    try {
      const response = await api.studentactivecsb04({ // Update the API call
        projectId: data.projectId,
        activeStatus: 1,
      });
      notification.success({
        message: 'Success',
        description: response.data.message,
        placement: 'topRight',
      });
    } catch (error) {
      console.error(error);
      notification.error({
        message: 'Error',
        description: 'Unable to create CSB04 data. Please try again later.',
        placement: 'topRight',
      });
    }
  };

  useEffect(() => {
    if (username) {
    api.getAllProject()
      .then((res) => {
        console.log("Response from API:", res.data.body); // ตรวจสอบข้อมูลที่ได้รับจาก API
        if (res.data.body.length > 0) {
          const projectData = res.data.body[0];
          console.log("Project Data:", projectData);

          
          const isAuthorizedUser = projectData.student.some(student => student.studentId === username) ||
          projectData.lecturer.some(lecturer => lecturer.T_name === username);

          setData({
            projectId: projectData._id || "",
            projectName: projectData.projectName || "",
            student: projectData.student || [],
            lecturer: projectData.lecturer || [],
          });

          // ตรวจสอบข้อมูลอาจารย์
          console.log("Lecturer Data:", projectData.lecturer);
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
    }
  }, []);

  if (loading) {
    return <div>ให้อาจารย์เซ็นต์ให้ผ่านก่อนนะ</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRadius: 15 }}>
      <img src={cis} alt="logo" style={{ display: "block", margin: "0 auto", width: "150px" }} />

      <Typography style={{ textAlign: "center", marginBottom: 24 }}>
        <Title level={3} style={{ fontWeight: "bold" }}>แบบฟอร์มขอสอบป้องกันโครงงานพิเศษ</Title>
        <Paragraph style={{ fontSize: "16px" }}>
          โครงการพิเศษ (สองภาษา) ภาควิชาวิทยาการคอมพิวเตอร์และสารสนเทศ <br />
          คณะวิทยาศาสตร์ประยุกต์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
        </Paragraph>
      </Typography>

      <div><br />
        <Paragraph style={{ fontSize: "18px" }}>โครงงาน</Paragraph>
        <Paragraph style={{ fontSize: "16px", color: "#555" }}>{data.projectName}</Paragraph>
      </div>

      <Row gutter={[16, 16]} style={{ width: '100%' }}>
        <Col span={12}>
          {data.student.length > 0 && (
            <div><br />
              <Paragraph style={{ fontSize: "18px" }}>รายชื่อนักศึกษา</Paragraph>
              {data.student.map((student, index) => (
                <Paragraph key={index} style={{ fontSize: "16px", color: "#555" }}>
                  {index + 1}. {`${student.FirstName} ${student.LastName}`}
                </Paragraph>
              ))}
            </div>
          )}
        </Col>
        <Col span={12}>
          <div><br />
            <Paragraph style={{ fontSize: "18px" }}>อาจารย์ที่ปรึกษา</Paragraph>
            {data.lecturer.length > 0 && (
              data.lecturer.map((lecturer, index) => (
                <Paragraph key={index} style={{ fontSize: "16px", color: "#555" }}>
                  {index + 1}. {lecturer.T_name}
                </Paragraph>
              ))
            )}
          </div>
        </Col>
      </Row>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
        <Row gutter={16}>
          <Col>
            <Button type="primary" onClick={handleAccept} style={{ padding: "6px 30px", fontSize: "16px" }}>
              ยินยอม
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
