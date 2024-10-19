import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Input,
  Modal,
  Typography,
  Select,
  Card,
  InputNumber,
  Form,
  message,
  notification,
} from "antd";
import api from "../../../../utils/form/api";

const { TextArea } = Input;

function InputScoreCSB01() {
  const [scores, setScores] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [comment, setComment] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [evaluatedRows, setEvaluatedRows] = useState({});
  const [successfulEvaluations, setSuccessfulEvaluations] = useState(new Set());
  const [loading, setLoading] = useState(true); // State for loading status
  const [data, setData] = useState({
    projectId: "",
    projectName: "",
    student: [],
    lecturer: [],
  });

  const [allDate, setAllDate] = useState([]);
  const [dataProject, setDataProject] = useState([
    {
      dateExam: "",
      projectId: "",
      projectName: "",
      _id: "",
    },
  ]);

  const criteriaData = [
    {
      key: "1",
      criteria: "การแนะนำสมาชิกและการแนะนำระบบที่จะพัฒนา",
      maxScore: 3,
    },
    {
      key: "2",
      criteria: "พิจารณาถึงเนื้อหาในสไลด์และวิธีนำเสนองาน",
      maxScore: 3,
    },
    { key: "3", criteria: "ที่มาของปัญหา และหลักฐานสนับสนุน", maxScore: 3 },
    { key: "4", criteria: "แนวคิด / หลักการสามารถแก้ปัญหาได้", maxScore: 3 },
    {
      key: "5",
      criteria:
        "การนำเสนอต้นแบบของระบบ เช่น mockup / wirefreame / story board / system architecture",
      maxScore: 3,
    },
    {
      key: "6",
      criteria: "การกำหนดกลุ่มเป้าหมายของระบบ และผลกระทบที่คาดว่าจะได้รับ",
      maxScore: 3,
    },
    {
      key: "7",
      criteria:
        "การศึกษา เปรียบเทียบจุดเด่นและเจุดด้อยของระบบใกล้เคียง หรือระบบที่เกี่ยวข้อง",
      maxScore: 3,
    },
    { key: "8", criteria: "การต่อยอดงานในอนาคต", maxScore: 3 },
    {
      key: "9",
      criteria:
        "ศึกษาเทคนิค/วิธีการที่เกี่ยวข้องและข้อจำกัดของอุปกรณ์หรือระบบที่เกี่ยวข้อง",
      maxScore: 3,
    },
    {
      key: "10",
      criteria: "การเลือกใช้วิธี / เทคโนโลยีที่ถูกต้องและเหมาะสม ",
      maxScore: 3,
    },
    {
      key: "11",
      criteria:
        "ลักษณะงาน ขอบเขตที่เหมาะสมกับปริญญานิพนธ์ในสาขาวิชาวิทยาการคอมพิวเตอร์ รวมถึงปริมาณงานเหมาะสมตามกรอบเวลา",
      maxScore: 3,
    },
  ];

  const additionalData = [
    {
      detail1: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีการแนะนำสมาชิก
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีการเเนะนำระบบ / Application ถ้วน
        </div>
      ),
      detail2: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีการแนะนำบางส่วนแต่ไม่ครบถ้วน
        </div>
      ),
      detail3: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          <u>ไม่</u>มีการแนะนำสมาชิกหรือแนะนำระบบเลย
        </div>
      ),
    },
    {
      detail1: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีการสื่อกับผู้ฟัง สบตา น้ำเสียงน่าติดตาม พูดฉะฉาน ชัดถ้อยชัดคำ
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีการนำเสนอน่าติดตามตลอดการบรรยาย
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          เนื้อหากระชับ ครบถ้วน
        </div>
      ),
      detail2: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีการสื่อกับผู้ฟัง สบตาบ้าง
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          การนำเสนอน่าติดตามในบางช่วง
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          ความยาวเนื้อหาไม่เหมาะสม
        </div>
      ),
      detail3: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          <u>ไม่</u>มีการสื่อกับผู้ฟัง หรือ<u>ไม่</u>สบตา
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          การที่นำเสนอ<u>ไม่</u>น่าติดตาม
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          ความยาวเนื้อหา<u>ไม่</u>เหมาะสม
        </div>
      ),
    },
    {
      detail1: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          นำเสนอปัญหาตรงเป้า
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีข้อมูล หลักการ หรือผลทดสอบสนับสนุนการนำเสนอ
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          ใช้เเหล่งข้อมูลอ้างอิงที่มีความน่าเชื่อถือ
        </div>
      ),
      detail2: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          ปัญหาที่นำเสนอครอบคลุมบางส่วน
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีร่องรอยของหลักฐาน เช่น ข้อมูล หลักการ หรือผลทดสอบสนับสนุน
        </div>
      ),
      detail3: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          ระบุปัญหา<u>ไม่</u>ตรงเป้าหรือไม่ใช่ปัญหา
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          <u>ไม่</u>มีข้อมูล หลักการ หรือ ผลทดสอบ เพื่อสนับสนุนการนำเสนอปัญหา
        </div>
      ),
    },
    {
      detail1: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          แนวทางหรือหลักการ สามารถแก้ปัญหาได้อย่างสมบูรณ์
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          เป็นวิธีการที่มีประสิทธิภาพและมีความเหมาะสม
        </div>
      ),
      detail2: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          แนวทางการแก้ปัญหาได้บางส่วน แต่อาจยังไม่ครบถ้วน
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          แนวทางหรือหลักการยังไม่มีประสิทธิภาพเท่าที่ควร
        </div>
      ),
      detail3: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          แนวทางหรือหลักการที่นำเสนอแก้ปัญหา<u>ไม่</u>ตรงเป้า
        </div>
      ),
    },
    {
      detail1: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          ต้นแบบของระบบ มีความครบถ้วนและสมบูรณ์
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          System architecture ถูกต้องและครบถ้วน
        </div>
      ),
      detail2: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          นำเสนอต้นแบบของระบบ แต่ไม่ครบถ้วน
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีการนำเสนอ system architecture แต่ไม่ครบถ้วน
        </div>
      ),
      detail3: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          <u>ไม่มี</u>ต้นแบบของระบบ
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          <u>ไม่มี</u>system architecture
        </div>
      ),
    },
    {
      detail1: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          ระบุกลุ่มเป้าหมายที่ชัดเจนและถูกต้อง
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีการศึกษาผลกระทบต่อกลุ่มเป้าหมายที่คาดว่าจะได้รับ
        </div>
      ),
      detail2: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีการระบุกลุ่มเป้าหมาย แต่ไม่ชัดเจนหรือไม่ถูกต้อง
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีร่องรอยการศึกษาผลกระทบต่อกลุ่มเป้าหมาย
        </div>
      ),
      detail3: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          <u>ไม่มี</u>การกำหนดกลุ่มเป้าหมายของระบบงานที่นำเสนอ
        </div>
      ),
    },
    {
      detail1: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีการศึกษาระบบที่ใกล้เคียง/เกี่ยวข้องอย่างน้อย 2 ระบบ
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีการนำเสนอจุดเด่นและจุดด้อยของงานที่พัฒนา
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีการเปรียบเทียบระบบที่จะพัฒนาและระบบใกล้เคียง
        </div>
      ),
      detail2: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีร่องรอยการศึกษาระบบที่ใกล้เคียงหรือเกี่ยวข้อง
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีการนำเสนอจุดเด่นและจุดด้อยของงานที่พัฒนา
        </div>
      ),
      detail3: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          <u>ไม่มี</u>ร่องรอยการศึกษาระบบที่ใกล้เคียงหรือเกี่ยวข้อง
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          ไม่มีการนำเสนอจุดเด่นและจุดด้อยของงานที่จะพัฒนา
        </div>
      ),
    },
    {
      detail1: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีการนำเสนอแนวคิดต่อยอดไปข้างหน้าที่ชัดเจน
        </div>
      ),
      detail2: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีการนำเสนอแต่ไม่ชัดเจน
        </div>
      ),
      detail3: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          <u>ไม่มี</u>การนำเสนอการต่อยอดงาน
        </div>
      ),
    },
    {
      detail1: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีการศึกษาความเป็นไปได้ของวิธีการ
          รวมทั้งระบบงานที่เกี่ยวข้องงเป็นอย่างดี
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีการศึกษาถึงข้อจำกัดของอุปกรณ์/ระบบที่เกี่ยวข้อง
        </div>
      ),
      detail2: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          มีร่องรอยของการศึกษาความเป็นไปได้ของงานหรือระบบที่เกี่ยวข้อง
        </div>
      ),
      detail3: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          <u>ไม่มี</u>การศึกษาความเป็นไปได้ของวิธีการ หรือ<u>ไม่มี</u>
          การศึกษาถึงข้อจำกัดของอุปกรณ์/ระบบที่เกี่ยวข้อง
        </div>
      ),
    },
    {
      detail1: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          วิธีการหรือเทคโนโลยีมีความเหมาะสม
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          เป็นวิธีการหรือเทคโรโลยีที่ใช้ทันสมัย และเป็นปัจจุบัน
        </div>
      ),
      detail2: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          วิธีการหรือเทคโนโลยีมีความเหมาะสม แต่มีความยุ่งยากหรือซับซ้อนเกินไป
          <br />
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          วิธีการไม่มีความทันสมัยและเป็นปัจจุบัน
        </div>
      ),
      detail3: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          วิธีการหรือเทคโนโลยี<u>ไม่</u>เหมาะสมกับปัญหา
        </div>
      ),
    },
    {
      detail1: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          ขอบเขตและปริมาณงานมีความเหมาะสมสำหรับปริญญานิพนธ์ในสาขาวิชาวิทยาการคอมพิวเตอร์
        </div>
      ),
      detail2: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          ขอบเขตและปริมาณงานมีน้อย
          หรืออาจไม่เหมาะสมกับปริญญานิพนธ์ในสาขาวิทยาการคอมพิวเตอร์
        </div>
      ),
      detail3: (
        <div>
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "black",
              marginRight: "5px",
              marginBottom: "3px",
            }}
          ></span>
          ขอบเขตและปริมาณงานมีน้อย และ<u>ไม่</u>
          เหมาะสมกับปริญญานิพนธ์ในสาขาวิชาวิทยาการคอมพิวเตอร์
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchProjectsAndRooms = async () => {
      setLoading(true);
      try {
        const res = await api.getAllProject();
        console.log("All Projects Data:", res.data.body); // ตรวจสอบข้อมูลที่ได้จาก API

        // if (res.data.body.length > 0) {
        //   const projectData = res.data.body[0];
        //   console.log("First Project Data:", projectData); // ตรวจสอบโครงสร้างของ project ว่ามีฟิลด์ student หรือไม่

        //   setData({
        //     projectId: projectData._id || "",
        //     projectName: projectData.projectName || "",
        //     student: projectData.student || [], // เช็คว่ามีข้อมูล student หรือไม่
        //     lecturer: projectData.lecturer || [],
        //   });
        // }

        const resRooms = await api.getRoomPage();
        const roomsData = resRooms.data.body;
        const projects = roomsData.flatMap((room) =>
          room.projects.map((project) => ({
            ...project,
            dateExam: room.dateExam,
            evaluationDate: room.dateExam,
            roomName: room.roomExam,
          }))
        );

        const rescsb01 = await api.getcsb01();
        const csb01Data = rescsb01.data.body;

        // Filter out projects that have a numerical value in unconfirmScore in csb01Data
        const filteredProjects = projects.filter(
          (project) =>
            !csb01Data.some(
              (csb01) =>
                csb01.projectId === project.projectId &&
                typeof csb01.unconfirmScore === "number"
            )
        );

        setProjects(filteredProjects);
      } catch (err) {
        console.error(err);
        notification.error({
          message: "Error Fetching Data",
          description:
            "Unable to fetch project or room data. Please try again later.",
          placement: "topRight",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsAndRooms();
  }, []);

  const availableDates = [
    ...new Set(projects.map((project) => project.dateExam)),
  ]
    .filter(Boolean)
    .map((date) =>
      new Date(date).toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    );

  const handleDateChange = (value) => {
    console.log("Selected Date:", value); // ตรวจสอบวันที่ที่เลือก

    // const originalDate = projects.find(
    //   (project) =>
    //     new Date(project.dateExam).toLocaleDateString("th-TH", {
    //       day: "2-digit",
    //       month: "2-digit",
    //       year: "numeric",
    //     }) === value
    // )?.dateExam;

    // if (originalDate) {
    //   const filtered = projects
    //     .filter((project) => project.dateExam === originalDate)
    //     .filter((project) => !project.unconfirmScore);

    //   setFilteredProjects(filtered);
    // } else {
    //   setFilteredProjects([]);
    // }'
    setFilteredProjects(
      dataProject.filter((project) => project.dateExam === value)
    );
  };

  const handleLinkClick = (index) => {
    const project = filteredProjects[index];
    console.log("Selected Project:", project);

    // Set the selected project
    setSelectedProject(project);

    // Fetch project details based on selectedProject's projectId
    fetchProjectDetails(project.projectId);

    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
    setComment("");
    setScores({});
  };

  const handleScoreChange = (value, key) => {
    setScores((prevScores) => ({
      ...prevScores,
      [key]: value,
    }));
  };

  useEffect(() => {
    const total = criteriaData.reduce((sum, item) => {
      return sum + (scores[item.key] || 0);
    }, 0);
    setTotalScore(total);
  }, [scores]);

  const onSubmit = async () => {
    const result = {
      _id: selectedProject._id,
      score: totalScore,
      referee: [],
      comment: comment,
      nameExam: "สอบก้าวหน้า",
    };

    try {
      const token = localStorage.getItem("jwtToken");
      const res = await api.scorecsb(result, token);
      if (
        res.data.message === "CSB02 score updated successfully" ||
        res.data.message === "CSB02 score saved successfully"
      ) {
        message.success("บันทึกคะแนนสำเร็จ");
        setSuccessfulEvaluations((prev) =>
          new Set(prev).add(selectedProject.projectId)
        );
        setEvaluatedRows((prev) => ({
          ...prev,
          [selectedProject.projectId]: "evaluated",
        }));
        console.log("555: ", result);
      } else {
        notification.error({
          message: "Error",
          description: res.data.message,
          placement: "topRight",
        });
      }
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Error Submitting Score",
        description: "Unable to submit the score. Please try again later.",
        placement: "topRight",
      });
    }

    setScores({});
    setComment("");
    setModalVisible(false);
  };

  const handleDisableEvaluation = (projectId) => {
    setEvaluatedRows((prev) => ({ ...prev, [projectId]: "notEvaluated" }));
  };

  const columns = [
    {
      title: "เกณฑ์พิจารณา",
      dataIndex: "criteria",
      key: "criteria",
    },
    {
      title: "คะแนนเต็ม",
      dataIndex: "maxScore",
      key: "maxScore",
    },
    {
      title: "คะแนนที่ได้",
      key: "score",
      render: (text, record) =>
        record.key === "total" ? (
          <strong>{totalScore}</strong>
        ) : (
          <InputNumber
            min={0}
            max={record.maxScore}
            value={scores[record.key] || 0}
            onChange={(value) => handleScoreChange(value, record.key)}
          />
        ),
    },
    {
      title: "เกณฑ์คะแนน",
      children: [
        {
          title: "3",
          dataIndex: "detail1",
          key: "detail1",
          render: (text, record) => (
            <span>{additionalData[parseInt(record.key) - 1]?.detail1}</span>
          ),
        },
        {
          title: "2",
          dataIndex: "detail2",
          key: "detail2",
          render: (text, record) => (
            <span>{additionalData[parseInt(record.key) - 1]?.detail2}</span>
          ),
        },
        {
          title: "1",
          dataIndex: "detail3",
          key: "detail3",
          render: (text, record) => (
            <span>{additionalData[parseInt(record.key) - 1]?.detail3}</span>
          ),
        },
      ],
    },
  ];

  const totalScoreRow = {
    key: "total",
    criteria: <strong>คะแนนรวม</strong>,
    maxScore: criteriaData.reduce((total, item) => total + item.maxScore, 0),
    score: totalScore,
  };

  const tableData = [...criteriaData, totalScoreRow];

  const hasEvaluatedProjects = () => {
    return filteredProjects.some(
      (project) => evaluatedRows[project.projectId] === "evaluated"
    );
  };

  const isScoreComplete = () => {
    return criteriaData.every(
      (item) => scores[item.key] !== undefined && scores[item.key] !== null
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    api.getSumaryRoomByExamName(token, "สอบหัวข้อ").then((response) => {
      let { body } = response.data;
      const allDate = body.map((resp) => resp.dateExam);
      const dataProjects = body.flatMap((resp) => {
        return resp.projects.map((project) => {
          return {
            dateExam: resp.dateExam,
            projectId: project.projectId,
            projectName: project.projectName,
            _id: project._id,
          };
        });
      });
      setAllDate(allDate);
      setDataProject(dataProjects);
    });
  }, []);

  // Assuming you have a function to fetch project details
  const fetchProjectDetails = async (projectId) => {
    try {
      const response = await api.getProjectById(projectId); // Fetch project details
      const projectData = response.data.body;

      // Update the data state with the fetched details
      setData({
        projectId: projectData._id || "",
        projectName: projectData.projectName || "",
        student: projectData.student || [],
        lecturer: projectData.lecturer || [],
      });

      // Log student names and lecturer name
      projectData.student.forEach((student, index) => {
        console.log(
          `นักศึกษาคนที่ ${index + 1}: ${student.FirstName} ${student.LastName}`
        );
      });

      projectData.lecturer.forEach((lecturer) => {
        console.log(`อาจารย์ที่ปรึกษา: ${lecturer.T_name}`);
      });
    } catch (error) {
      console.error("Error fetching project details:", error);
      notification.error({
        message: "Error Fetching Project Details",
        description: "Unable to fetch project details. Please try again later.",
        placement: "topRight",
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "60%", textAlign: "center" }}>
        <Typography.Title level={2}>
          ประเมินการโครงงานพิเศษ 1 (สอบหัวข้อ)
        </Typography.Title>
        <Typography.Text>เลือกวันที่ที่จะทำการประเมิน:</Typography.Text>
        <Select
          style={{ width: "100%" }}
          placeholder="เลือกวันที่"
          onChange={handleDateChange}
          // options={availableDates.map((formattedDate) => ({
          //   value: formattedDate,
          //   label: formattedDate,
          // }))}
          options={allDate.map((date) => ({
            value: date,
            label: new Date(date).toLocaleDateString("th-TH", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
          }))}
        />
        <div style={{ marginTop: 20 }} />

        {dataProject.length > 0 ? (
          <div>
            <Button
              onClick={() =>
                filteredProjects.forEach((project) =>
                  handleDisableEvaluation(project.projectId)
                )
              }
              style={{
                backgroundColor: hasEvaluatedProjects() ? "gray" : "red",
                borderColor: hasEvaluatedProjects() ? "gray" : "red",
                color: "white",
                marginBottom: "10px",
              }}
              disabled={hasEvaluatedProjects()}
            >
              ไม่ประเมินทั้งหมด
            </Button>
            <Table
              dataSource={filteredProjects}
              columns={[
                {
                  title: "ลำดับที่",
                  key: "index",
                  render: (text, record, index) => index + 1,
                },
                {
                  title: "ชื่อโครงงาน",
                  dataIndex: "projectName",
                  key: "projectName",
                },
                {
                  title: "ประเมิน",
                  key: "evaluate",
                  render: (_, record) => {
                    const evaluationStatus = evaluatedRows[record.projectId];

                    // If the project already has an unconfirmScore, show 'ประเมินสำเร็จ' status
                    if (record.unconfirmScore) {
                      return (
                        <span style={{ color: "green" }}>ประเมินสำเร็จ</span>
                      );
                    }

                    if (evaluationStatus === "evaluated") {
                      return (
                        <span style={{ color: "green" }}>ประเมินสำเร็จ</span>
                      );
                    }

                    if (evaluationStatus === "notEvaluated") {
                      return <span style={{ color: "red" }}>ไม่ประเมิน</span>;
                    }

                    return (
                      <>
                        <Button
                          onClick={() =>
                            handleLinkClick(filteredProjects.indexOf(record))
                          }
                          type="primary"
                        >
                          ประเมิน
                        </Button>
                        <Button
                          onClick={() =>
                            handleDisableEvaluation(record.projectId)
                          }
                          style={{
                            marginLeft: 8,
                            backgroundColor: "red",
                            borderColor: "red",
                            color: "white",
                          }}
                        >
                          ไม่ประเมิน
                        </Button>
                      </>
                    );
                  },
                },
              ]}
              pagination={false}
              bordered
            />
          </div>
        ) : (
          <Typography.Text>
            {selectedDate
              ? null
              : "กรุณาเลือกวันที่เพื่อแสดงโครงงานที่สามารถประเมินได้ !!"}
          </Typography.Text>
        )}

        <Modal
          title="กรอกคะแนน"
          visible={modalVisible}
          onCancel={handleClose}
          footer={null}
          width={1500}
        >
          <Card>
            <p>
              <strong>ชื่อโครงงาน : </strong> {selectedProject?.projectName}
            </p>
            <div>
              {data.student.length > 0 ? (
                data.student.map((student, index) => {
                  // Log the student's full name
                  console.log(
                    `นักศึกษาคนที่ ${index + 1}: ${student.FirstName} ${
                      student.LastName
                    }`
                  );
                  return (
                    <p key={index}>
                      <strong>นักศึกษาคนที่ {index + 1} : </strong>
                      {`${student.FirstName} ${student.LastName}`}
                    </p>
                  );
                })
              ) : (
                <p>ไม่มีนักศึกษา</p>
              )}
            </div>
            <p>
              <strong>วันที่ประเมิน : </strong>{" "}
              {new Date(selectedProject?.dateExam).toLocaleDateString("th-TH", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
            <p>
              {data.lecturer.length > 0 ? (
                data.lecturer.map((lecturer, index) => {
                  // Log the lecturer's name
                  console.log(`อาจารย์ที่ปรึกษา: ${lecturer.T_name}`);
                  return (
                    <p key={index}>
                      <strong>อาจารย์ที่ปรึกษา : </strong> {lecturer.T_name}
                    </p>
                  );
                })
              ) : (
                <p>ไม่มีอาจารย์ที่ปรึกษา</p>
              )}
            </p>
          </Card>
          <Table dataSource={tableData} columns={columns} pagination={false} />
          <Form layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item label="ความคิดเห็น">
              <TextArea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                onClick={onSubmit}
                disabled={!isScoreComplete() || loading}
              >
                บันทึกคะแนน
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default InputScoreCSB01;
