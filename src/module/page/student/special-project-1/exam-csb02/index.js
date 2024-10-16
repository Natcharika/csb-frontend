import React, { useState, useEffect } from "react";
import { Typography, Button, Row, Col, notification, Input } from "antd"; // Import Input from Ant Design
import cis from '../../../../public/image/cis.png';
import api from '../../../../utils/form/api';
import loadingGif from "../../../../public/image/giphy (1).gif"


const { Title, Paragraph } = Typography;

export default function ExamCSB02() {

  const [data, setData] = useState({
    projectId: "",
    projectName: "",
    student: [],
    lecturer: [],
  });
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null); // Store the entire project object


  const handleAccept = async () => {
    try {
      const response = await api.studentactivecsb02({ // Update the API call
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
        description: 'Unable to create CSB02 data. Please try again later.',
        placement: 'topRight',
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));

      if (decodedPayload.username) {
        const trimmedUsername = decodedPayload.username.slice(1);
        setUsername(trimmedUsername);
      }
    }

    const fetchProjectData = async () => {
      try {
        const res = await api.getAllProject();
        if (res.data.body.length > 0) {
          const projectData = res.data.body[0];

          if (Array.isArray(res.data.body)) {
            const filteredProjects = res.data.body.filter((project) =>
              project.student.some((student) => student.studentId === username)
            );

            setProject(filteredProjects);
            console.log("Filtered projects:", filteredProjects);
          } else {
            console.error("Data body is not an array:", res.data.body);
          }
          setData({
            projectId: projectData._id || "",
            projectName: projectData.projectName || "",
            student: projectData.student || [],
            lecturer: projectData.lecturer || [],
          });
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        notification.error({
          message: 'Error Fetching Projects',
          description: 'Unable to fetch project data. Please try again later.',
          placement: 'topRight',
        });
        setLoading(false);
      }
    };

    if (username) {
      fetchProjectData();
    }
  }, [username]);

  const isCSB01Passed = project[0]?.status?.CSB01?.status;
  console.log("isCSB01Passed", isCSB01Passed);

  if (loading) {
    return <div>ยังไม่มีโครงงานในระบบ กรุณายื่นสอบหัวข้อให้ผ่านก่อนนะจ้า</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", backgroundColor: "#fff", flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRadius: 15 }}>
      <img src={cis} alt="logo" style={{ display: "block", margin: "0 auto", width: "150px" }} />
      <Typography style={{ textAlign: "center", marginBottom: 24 }}>
        <Title level={3} style={{ fontWeight: "bold" }}>แบบฟอร์มขอสอบความก้าวหน้าโครงงานพิเศษ</Title>
        <Paragraph style={{ fontSize: "16px" }}>
          โครงการพิเศษ (สองภาษา) ภาควิชาวิทยาการคอมพิวเตอร์และสารสนเทศ <br />
          คณะวิทยาศาสตร์ประยุกต์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
        </Paragraph>
      </Typography>
      {isCSB01Passed ? (


<>
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
            {data.lecturer.length > 0 ? (
              data.lecturer.map((lecturer, index) => (
                <Paragraph key={index} style={{ fontSize: "16px", color: "#555" }}>
                  {index + 1}. {lecturer.T_name}
                </Paragraph>
              ))
            ) : (
              <Paragraph style={{ fontSize: "16px", color: "#555" }}>
                ไม่มีอาจารย์ที่ปรึกษา
              </Paragraph>
            )}
          </div>
        </Col>
      </Row>

</>
      ): (
        <>
        <Paragraph>ไม่สามารถดำเนินการได้ เนื่องจากสถานะ CSB01 ไม่ผ่าน หรือแกยังไม่ยื่นอะป่าว ?</Paragraph>
        <img src={loadingGif} alt="Loading..." style={{ width: "100%" }} />
        </>
        
      )}
      
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
