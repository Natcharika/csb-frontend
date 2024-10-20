import React, { useState, useEffect } from "react";
import { Typography, Upload, Button, message, Modal } from "antd";
import cis from "../../../../public/image/cis.png";
import loadingGif from "../../../../public/image/giphy (1).gif"
import axios from "axios";
import "../../../../theme/css/buttons.css";

const { Title, Paragraph } = Typography;

export default function ProviderSp2() {
  const [transcriptFile, setTranscriptFile] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [username, setUsername] = useState("");
  const [project, setProject] = useState(null); // Store the entire project object

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("jwtToken");
  
      // ตรวจสอบการมีอยู่ของ token
      if (token) {
        const payload = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payload));
  
        // ตรวจสอบ username ใน decodedPayload
        if (decodedPayload.username) {
          const trimmedUsername = decodedPayload.username.slice(1);
          setUsername(trimmedUsername);
        }
      }
  
      try {

        const response2 = await fetch("http://localhost:8788/project-students", {
          method: "GET",
        });
        // const response2 = await fetch("http://202.44.40.169:8788/project-students", {
        //   method: "GET",
        // });
  
        const data = await response2.json();
  
        // ตรวจสอบว่า data เป็นอาร์เรย์หรือไม่ก่อนกรอง
        if (Array.isArray(data.body)) {
          // กรองข้อมูลเพื่อเช็คว่า username ตรงกับ studentId
          const filteredProjects = data.body.filter((project) =>
            project.student.some((student) => student.studentId === username)
          );
  
          setProject(filteredProjects);
          console.log("Filtered projects:", filteredProjects);
        } else {
          console.error("Data body is not an array:", data.body);
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };
  
    fetchData();
  }, [username]); // เพิ่ม username ใน dependencies
  

  // const handleUploadTranscript = (uploadedFile) => {
  //   setTranscriptFile(uploadedFile);
  //   setFileUrl(URL.createObjectURL(uploadedFile));
  //   return false;
  // };

  const handleUploadTranscript = (uploadedFile) => {
    // Check if the uploaded file is a PDF
    if (uploadedFile.type !== "application/pdf") {
      message.error("กรุณาอัปโหลดไฟล์ PDF เท่านั้น");
      return false;
    }
  
    setTranscriptFile(uploadedFile);
    setFileUrl(URL.createObjectURL(uploadedFile));
    return false;
  };
  

  const handleSubmit = async () => {
    if (!username) {
      message.error("กรุณาเข้าสู่ระบบก่อนที่จะส่งไฟล์");
      return;
    }

    if (!transcriptFile) {
      message.error("กรุณาอัปโหลดไฟล์ผลการศึกษาก่อนที่จะส่ง");
      return;
    }

    const formData = new FormData();
    formData.append("transcriptFile", transcriptFile);
    formData.append("std", username);

    try {

      const response = await fetch("http://localhost:8788/files", {
        method: "POST",
        body: formData,
      });

      // const response = await fetch("http://202.44.40.169:8788/files", {
      //   method: "POST",
      //   body: formData,
      // });


      if (response.ok) {
        message.success("ส่งไฟล์สำเร็จ!");
      } else {
        message.error("การส่งไฟล์ล้มเหลว");
      }

      await handleFileUpload(username);
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("เกิดข้อผิดพลาดในการอัปโหลดไฟล์");
    }
  };

  const handleFileUpload = async (fi_id) => {
    try {
      await axios.patch(`http://localhost:8788/files/${fi_id}`);
      
      // await axios.patch(`http://202.44.40.169:8788/files/${fi_id}`);
    } catch (error) {
      console.error("Error updating file status:", error);
    }
  };

  const handlePreview = () => {
    setPreviewVisible(true);
  };

  const handleClosePreview = () => {
    setPreviewVisible(false);
  };

  // Render loading if project data is not yet loaded
  if (!project) {
    return <div>Loading...</div>;
  }
  const isCSB02Passed = project[0]?.status?.CSB02?.status === "ผ่าน";
  console.log("isCSB02Passed",isCSB02Passed)

  return (
    <div style={{ margin: "auto", padding: 40, backgroundColor: "#fff", borderRadius: 10, maxWidth: 820 }}>
      <img src={cis} alt="logo" style={{ display: "block", margin: "0 auto", width: "150px" }} />
      <center><Title level={3}>ตรวจสอบคุณสมบัติยื่นโครงงานพิเศษ 2</Title></center>
      {isCSB02Passed ? (
        <>
          <Title level={5}>เกณฑ์การประเมิน</Title>
          <Paragraph>
            1. นักศึกษาโครงการพิเศษสองภาษาต้องลงทะเบียนเรียนวิชา 040613405 Special Project II <br/>
            2. โดยใช้ ไฟล์ผลการศึกษา จาก Reg Kmutnb<br/>
            <div style={{ marginLeft: "20px" }}>
    2.1 ผลการศึกษา สามารถ Ctrl + p และเลือก Printer เป็น Save as PDF และบันทึกไฟล์ได้ จาก Reg Kmutnb
    <br />
    <a href="https://reg.kmutnb.ac.th/registrar/grade" target="_blank" rel="noopener noreferrer">
      https://reg.kmutnb.ac.th/registrar/grade
    </a>
  </div>
          </Paragraph>

          <Upload beforeUpload={handleUploadTranscript} showUploadList={false}>
            <Button className="All-button" type="primary">อัปโหลดไฟล์ผลการศึกษา</Button>
          </Upload>
          {transcriptFile && (
            <div style={{ marginTop: 16 }}>
              <Paragraph>
                <strong>ชื่อไฟล์ผลการศึกษา: </strong> {transcriptFile.name}
              </Paragraph>
              <Button className="All-button" type="default" onClick={handlePreview} style={{ marginTop: 10 }}>
                ดูไฟล์
              </Button>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <Button className="All-button" type="primary" onClick={handleSubmit}>
              ส่งไฟล์
            </Button>
          </div>
        </>
      ) : (
        <>
        <Paragraph>ไม่สามารถดำเนินการได้ เนื่องจากสถานะ CSB02 ไม่ผ่าน</Paragraph>
        {/* <img src={loadingGif} alt="Loading..." style={{ width: "100%" }} /> */}
        </>
        
      )}

      <Modal
        title="ดูไฟล์"
        visible={previewVisible}
        footer={null}
        onCancel={handleClosePreview}
        width={1000}
        style={{ top: 20 }}
      >
        <iframe
          src={fileUrl}
          style={{ width: "100%", height: "600px" }}
          title="File Preview"
        />
      </Modal>
    </div>
  );
}
