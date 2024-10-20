import React, { useState, useEffect } from "react";
import api from "../../../utils/form/api";
import { Table, Button, message, Tag } from "antd";
import "../../../theme/css/buttons.css";

export default function CheckOCR() {
  const [filteredData, setFilteredData] = useState([]);
  

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const { data } = await api.getfiles(token);
      console.log("Data:", data.body);

      setFilteredData(data.body);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
    
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (record) => {
    try {
      await api.updateFileStatus(record._id, { fi_status: "ผ่าน" }); // Only send fi_status
      message.success("สถานะถูกอัพเดตเป็น 'ผ่าน' เรียบร้อยแล้ว");
      fetchData(); // Refresh the data to reflect the updated status
    } catch (error) {
      message.error("การอัพเดตสถานะล้มเหลว");
      console.log("Error updating status:", error);
    }
  };
  

  const handleReject = async (record) => {
    try {
      await api.updateFileStatus(record._id, { fi_status: "ไม่ผ่าน" }); // Only send fi_status
      message.success("สถานะถูกอัพเดตเป็น 'ไม่ผ่าน' เรียบร้อยแล้ว");
      fetchData(); // Refresh the data to reflect the updated status
    } catch (error) {
      message.error("การอัพเดตสถานะล้มเหลว");
      console.log("Error updating status:", error);
    }
  };
  

  const columns = [
    {
      title: "ชื่อนักศึกษา",
      dataIndex: "studentName",
      render: (students) => <span>{students ? students : "ไม่มีข้อมูล"}</span>,
      width: 100,
    },
    {
      title: "ไฟล์",
      dataIndex: "fi_file",
      render: (fi_file) => {
        return fi_file.map((file, index) => (
          <Tag key={index} color="blue">
            <a
              href={`http://localhost:8788/view/${file.linkFile}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {file.fileName}
            </a>
          </Tag>
        ));
      },
      width: 300,
    },
    {
      title: "ผลการตรวจไฟล์",
      dataIndex: "fi_result",
      render: (fi_result) => (
        <span>{fi_result ? fi_result : "No result available"}</span>
      ),
      width: 180,
    },
    {
      title: "จัดการ",
      render: (text, record) => (
        <>
          <Button
            className="All-button"
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => handleApprove(record)}
          >
            ผ่าน
          </Button>
          <Button
            className="All-button"
            type="danger"
            onClick={() => handleReject(record)}
          >
            ไม่ผ่าน
          </Button>
        </>
      ),
      width: 100,
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
            backgroundColor: "rgb(253 186 116)",
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
