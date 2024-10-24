import React, { useState, useEffect } from "react";
import { Typography, Upload, Button, message, Modal } from "antd";
import axios from "axios";
import "../../../../theme/css/buttons.css";

const { Title, Paragraph } = Typography;

export default function ProviderSp1() {
  const [transcriptFile, setTranscriptFile] = useState(null);
  const [englishScoreFile, setEnglishScoreFile] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      const payload = token.split(".")[1]; // ส่วน Payload
      const decodedPayload = JSON.parse(atob(payload)); // ถอดรหัส Base64

      // ตรวจสอบว่ามี username ใน Payload หรือไม่
      if (decodedPayload.username) {
        const trimmedUsername = decodedPayload.username.slice(1);
        setUsername(trimmedUsername);
      }
    }
  }, []);

  const handleUploadTranscript = (uploadedFile) => {
    setTranscriptFile(uploadedFile);
    setFileUrl(URL.createObjectURL(uploadedFile)); // For preview purposes
    return false; // Prevent automatic upload
  };

  const handleUploadEnglishScore = (uploadedFile) => {
    setEnglishScoreFile(uploadedFile);
    setFileUrl(URL.createObjectURL(uploadedFile)); // For preview purposes
    return false; // Prevent automatic upload
  };

  const handleSubmit = async () => {
    if (!transcriptFile || !englishScoreFile) {
      message.error(
        "กรุณาอัปโหลดทั้งไฟล์ผลการศึกษาและไฟล์คะแนนภาษาอังกฤษก่อนที่จะส่ง"
      );
      return;
    }

    const formData = new FormData();
    formData.append("transcriptFile", transcriptFile);
    formData.append("englishScoreFile", englishScoreFile);
    formData.append("std", username);

    try {
      // const response = await fetch(`http://202.44.40.169:8788/files?=${username}`, {
      //   method: "POST",
      //   body: formData,
      // });

      const response = await fetch(`http://localhost:8788/files?=${username}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        message.success("ส่งไฟล์สำเร็จ!");
        // เคลียร์ไฟล์ที่อัปโหลดสำเร็จ
        setTranscriptFile(null);
        setEnglishScoreFile(null);
        setFileUrl(""); // เคลียร์ URL สำหรับ preview
      } else {
        message.error("การส่งไฟล์ล้มเหลว");
      }

      // await handleFileUpload(username);
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("เกิดข้อผิดพลาดในการอัปโหลดไฟล์");
    }
  };

  // const handleSubmit = async () => {
  //   if (!transcriptFile || !englishScoreFile) {
  //     message.error(
  //       "กรุณาอัปโหลดทั้งไฟล์ผลการศึกษาและไฟล์คะแนนภาษาอังกฤษก่อนที่จะส่ง"
  //     );
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("transcriptFile", transcriptFile);
  //   formData.append("englishScoreFile", englishScoreFile);
  //   formData.append("std", username);

  //   // Append file names
  //   formData.append("transcriptFileName", transcriptFile.name);
  //   formData.append("englishScoreFileName", englishScoreFile.name);

  //   try {
  //     // const response = await fetch(`http://202.44.40.169/files?=${username}`, {
  //     //   method: "POST",
  //     //   body: formData,
  //     // });
  //     const response = await fetch(`http://localhost:8788/files?=${username}`, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       message.success("ส่งไฟล์สำเร็จ!");
  //       await handleFileUpload(username);
  //     } else {
  //       message.error("การส่งไฟล์ล้มเหลว");
  //     }
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     message.error("เกิดข้อผิดพลาดในการอัปโหลดไฟล์");
  //   }
  // };

  // const handleFileUpload = async (fi_id) => {
  //   try {
  //     // await axios.patch(`http://202.44.40.169:8788/files/${fi_id}`);
  //     await axios.patch(`http://localhost:8788/files/${fi_id}`);
  //   } catch (error) {
  //     console.error("Error updating file status:", error);
  //   }
  // };

  const handlePreview = (file) => {
    setFileUrl(URL.createObjectURL(file));
    setPreviewVisible(true);
  };

  const handleClosePreview = () => {
    setPreviewVisible(false);
  };

  return (
    <div
      style={{
        margin: "auto",
        padding: 40,
        backgroundColor: "#fff",
        borderRadius: 10,
        maxWidth: 820,
        border: "2px solid #ffd28f", // กำหนดกรอบสีส้มอ่อน
        backgroundColor: "#fff5e6", // พื้นหลังสีส้มอ่อน
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // เพิ่มเงาให้กรอบ
      }}
    >
      <img
        src={"http://cs.kmutnb.ac.th/img/logo.png"}
        alt="logo"
        style={{ display: "block", margin: "0 auto", width: "150px" }}
      />

      <center>
        <Title level={3}>ตรวจสอบคุณสมบัติยื่นโครงงานพิเศษ 1</Title>
      </center>

      <Title level={5}>เกณฑ์การประเมิน</Title>
      <Paragraph>
        1. นักศึกษาโครงการพิเศษสองภาษาต้องลงทะเบียนเรียนวิชา 040613404
        SpecialProject I ได้ผลการเรียนรวม ≥ 102 หน่วยกิต
        และได้ผลการเรียนรายวิชาภาคฯ 0406xxxxx ≥ 57 หน่วยกิต
        <br />
        <div style={{ marginLeft: "20px" }}>
          1.1 โดยใช้ ไฟล์ผลการศึกษา จาก Reg Kmutnb สามารถ Ctrl + p และเลือก
          Printer เป็น Save as PDF และบันทึกไฟล์ได้
          <br />
          <a
            href="https://reg.kmutnb.ac.th/registrar/grade"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://reg.kmutnb.ac.th/registrar/grade
          </a>
        </div>
        2. นักศึกษาโครงการพิเศษสองภาษาต้องอัปไฟล์คะแนนภาษาอังกฤษ
      </Paragraph>

      {/* Upload for Transcript File */}
      <Upload beforeUpload={handleUploadTranscript} showUploadList={false}>
        <Button type="primary" className="All-button">
          อัปโหลดไฟล์ผลการศึกษา
        </Button>
      </Upload>
      {transcriptFile && (
        <div style={{ marginTop: 16 }}>
          <Paragraph>
            <strong>ชื่อไฟล์ผลการศึกษา: </strong> {transcriptFile.name}
          </Paragraph>
          <Button
            type="default"
            onClick={() => handlePreview(transcriptFile)}
            style={{ marginTop: 10 }}
            className="AddLecture-button"
          >
            ดูไฟล์
          </Button>
        </div>
      )}

      {/* Upload for English Score File */}
      <br />
      <br />
      <Upload beforeUpload={handleUploadEnglishScore} showUploadList={false}>
        <Button type="primary" className="All-button">
          อัปโหลดไฟล์คะแนนภาษาอังกฤษ
        </Button>
      </Upload>
      {englishScoreFile && (
        <div style={{ marginTop: 16 }}>
          <Paragraph>
            <strong>ชื่อไฟล์คะแนนภาษาอังกฤษ: </strong> {englishScoreFile.name}
          </Paragraph>
          <Button
            type="default"
            onClick={() => handlePreview(englishScoreFile)}
            style={{ marginTop: 10 }}
            className="AddLecture-button"
          >
            ดูไฟล์
          </Button>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <Button type="primary" onClick={handleSubmit} className="All-button">
          ส่งไฟล์
        </Button>
      </div>

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
