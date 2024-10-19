import React, { useState, useEffect } from "react";
import api from '../../../utils/form/api';
import { Table, Button, message } from "antd";

export default function CheckOCR() {
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = async () => {
    try {
      const filesResponse = await api.getfiles();
      console.log("Files Response:", filesResponse);
      const studentResponse = await api.getStudent();
      console.log("Student Response:", studentResponse);

      const filesData = filesResponse.data.body || [];
      const studentsData = studentResponse.data.body || [];

      // Map the students to a dictionary for easier lookup by S_id
      const studentMap = studentsData.reduce((acc, student) => {
        acc[student.S_id] = student; // Use S_id as the key for mapping
        return acc;
      }, {});
      console.log("Student Map:", studentMap);

      // Group files by student
      const studentFilesMap = {};
      filesData.forEach((file) => {
        const student = studentMap[file.fi_id];
        if (student) {
          const studentId = student.S_id;
          if (!studentFilesMap[studentId]) {
            studentFilesMap[studentId] = {
              student,
              files: [],
            };
          }
          studentFilesMap[studentId].files.push(file); // Add file to the student's file array
        }
      });
      

      // Convert grouped data to an array for the table
      const mergedData = Object.values(studentFilesMap).flatMap(({ student, files }) =>
        files.map((file) => ({
          ...file,
          students: student,
        }))
      );

      console.log("Merged Data:", mergedData);

      // Sort the projects by date in descending order
      const sortedProjects = mergedData.sort((a, b) => new Date(b.date) - new Date(a.date));

      setFilteredData(sortedProjects);
      console.log("Sorted Projects:", sortedProjects);
    } catch (err) {
      console.log("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (record) => {
    try {
      await api.updateFileStatus(record._id, { fi_status: "ผ่าน" });
      message.success("สถานะถูกอัพเดตเป็น 'ผ่าน' เรียบร้อยแล้ว");
      fetchData();
    } catch (error) {
      message.error("การอัพเดตสถานะล้มเหลว");
      console.log("Error updating status:", error);
    }
  };
  
  

  const handleReject = async (record) => {
    try {
      await api.updateFileStatus(record._id, { fi_status: "ไม่ผ่าน" });
      message.success("สถานะถูกอัพเดตเป็น 'ไม่ผ่าน' เรียบร้อยแล้ว");
      fetchData();
    } catch (error) {
      message.error("การอัพเดตสถานะล้มเหลว");
      console.log("Error updating status:", error);
    }
  };

  const columns = [
    {
      title: "ชื่อนักศึกษา",
      dataIndex: "students",
      render: (students) => (
        <span>{students ? students.S_name : "No student"}</span>
      ),
      width: 100
    },
    {
      title: "ไฟล์",
      dataIndex: "fi_file",
      render: (fi_file, record) => {
        // Join file names with a line break if there are multiple files
        const files = filteredData
          .filter(item => item.students.S_id === record.students.S_id) // Find all files for the same student
          .map(item => item.fi_file)
          .join('\n'); // Use '\n' to create new lines
          
        return <span>{files || "No file name available"}</span>;
      },
      width: 300
    },
    {
      title: "ผลการตรวจไฟล์",
      dataIndex: "fi_result",
      render: (fi_result) => (
        <span>{fi_result ? fi_result : "No result available"}</span>
      ),
      width: 175
    },
    {
      title: "จัดการ",
      render: (text, record) => (
        <>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => handleApprove(record)}
          >
            ผ่าน
          </Button>
          <Button
            type="danger"
            onClick={() => handleReject(record)}
          >
            ไม่ผ่าน
          </Button>
        </>
      ),
      width: 100
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("Table parameters:", pagination, filters, sorter, extra);
  };

  const components = {
    header: {
      cell: (props) => (
        <th
          style={{
            backgroundColor: "#F77100",
            color: "#FFFFFF",
            borderBottom: "2px solid #FFFFFF",
          }}
        >
          {props.children}
        </th>
      ),
    },
  };

  return (
    <div>
      <div id="print-section">
        <Table
          className="custom-table"
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          onChange={onChange}
          components={components}
        />
      </div>
    </div>
  );
}
