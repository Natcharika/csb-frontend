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
      console.log(record);

      await api.updateFileStatus({
        _id: record._id,
        fi_status: "ผ่าน",
      }); // Only send fi_status
      message.success("สถานะถูกอัพเดตเป็น 'ผ่าน' เรียบร้อยแล้ว");
      fetchData(); // Refresh the data to reflect the updated status
    } catch (error) {
      message.error("การอัพเดตสถานะล้มเหลว");
      console.log("Error updating status:", error);
    }
  };

  const handleReject = async (record) => {
    try {
      await api.updateFileStatus({
        _id: record._id,
        fi_status: "ไม่ผ่าน",
      }); // Only send fi_status
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
              {file.fileName.length > 20
                ? file.fileName.substring(0, 20) +
                  "... (" +
                  file.fileName.split(".").pop() +
                  ")"
                : file.fileName}
            </a>
          </Tag>
        ));
      },
      width: 100,
    },
    {
      title: "สถานะปัจจุบัน",
      dataIndex: "fi_result",
      render: (fi_result) => {
        console.log("fi_result:", fi_result);
        return fi_result.project_1.status == "ผ่าน" ? "project 2" : "project 1";
      },
      width: 95,
    },

    {
      title: "หน่วยกิตรวม",
      dataIndex: "fi_result",
      render: (fi_result) => {
        return (
          <div
            className={
              fi_result.project_1.total_credits.passed
                ? "text-green-500"
                : "text-red-500"
            }
          >
            {fi_result.project_1.total_credits.score}
          </div>
        );
      },
      width: 90,
    },
    {
      title: "หน่วยกิตประจำภาค",
      dataIndex: "fi_result",
      render: (fi_result) => {
        return (
          <div
            className={
              fi_result.project_1.major_credits.passed
                ? "text-green-500"
                : "text-red-500"
            }
          >
            {fi_result.project_1.major_credits.score}
          </div>
        );
      },
      width: 100,
    },
    {
      title: "Project1",
      dataIndex: "fi_result",
      render: (fi_result) => {
        return (
          <div>
            {fi_result.project_1.passed_project_1 == true ? (
              <Tag color="green">ผ่าน</Tag>
            ) : (
              <Tag color="red">ไม่ผ่าน</Tag>
            )}
          </div>
        );
      },
      width: 100,
    },
    {
      title: "Project2",
      dataIndex: "fi_result",
      render: (fi_result) => {
        return (
          <div>
            {fi_result.project_2.passed_project_2 == true ? (
              <Tag color="green">ผ่าน</Tag>
            ) : (
              <Tag color="red">ไม่ผ่าน</Tag>
            )}
          </div>
        );
      },
      width: 100,
    },
    {
      title: "จัดการ",
      render: (_, record) => (
        <>
          <Button onClick={() => handleApprove(record)}>ผ่าน</Button>
          <Button type="primary" danger onClick={() => handleReject(record)}>
            ไม่ผ่าน
          </Button>
        </>
      ),
      width: 130,
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
