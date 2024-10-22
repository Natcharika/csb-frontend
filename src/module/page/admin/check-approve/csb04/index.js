import api from "../../../../utils/form/api";
import React, { useState, useEffect } from "react";
import { Table } from "antd";

export default function CheckApproveCSB04() {
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = async () => {
    try {
      const projectsResponse = await api.getProjects();
      console.log("Projects Response:", projectsResponse);

      const projectsData = projectsResponse.data.body;

      // Filter projects where status.CSB03.activeStatus is 2 and status.CSB03.status is "ผ่านการอนุมัติจากอาจารย์"
      const filteredProjects = projectsData
        .filter(
          (project) =>
            project.status?.CSB04?.activeStatus === 2 &&
            project.status?.CSB04?.status === "ผ่านการอนุมัติจากอาจารย์"
        )
        .map((item) => ({
          projectName: item.projectName,
          students: item.student || [], // Get students from the project
          lecturers: item.lecturer || [], // Get lecturers from the project
          date: item.status.CSB03.date,
        }))
        // Sort by date in descending order (latest first)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setFilteredData(filteredProjects);
    } catch (err) {
      console.log("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "รายชื่อโครงงาน",
      dataIndex: "projectName",
      render: (projectName) => <span>{projectName}</span>,
    },
    {
      title: "รายชื่อนักศึกษา",
      dataIndex: "students",
      render: (students) => (
        <>
          {Array.isArray(students) && students.length > 0 ? (
            <span>
              {students[0].FirstName} {students[0].LastName}
              {students.length > 1 && (
                <>
                  <br />
                  {students[1].FirstName} {students[1].LastName}
                </>
              )}
            </span>
          ) : (
            <span>No students available</span>
          )}
        </>
      ),
    },
    {
      title: "รายชื่ออาจารย์ที่ปรึกษาโครงงาน",
      dataIndex: "lecturers",
      render: (lecturers) => (
        <>
          {Array.isArray(lecturers) ? (
            lecturers.map((lecturer, index) => (
              <span key={index}>
                {lecturer.T_name}
                <br />
              </span>
            ))
          ) : (
            <span>No advisors available</span>
          )}
        </>
      ),
    },
    {
      title: "วันที่อนุมัติโครงงาน",
      dataIndex: "date",
      render: (date) => {
        if (!date) return "No date available";

        const dateObj = new Date(date);

        const formattedDate = dateObj.toLocaleString("en-GB", {
          timeZone: "Asia/Bangkok", // Set time zone to Bangkok, Thailand
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour24: true,
        });

        return formattedDate;
      },
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
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
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "20px",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          <b>ข้อมูลการยื่นขอสอบป้องกัน</b>
        </h1>
      </div>
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
