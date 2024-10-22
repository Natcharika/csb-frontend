import React, { useState, useEffect } from "react";
import api from "../../../../utils/form/api";
import { Table } from "antd";

export default function CheckApproveCSB03() {
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = async () => {
    try {
      const csb03Response = await api.getcsb03();
      const projectsResponse = await api.getProjects();

      const csb03Data = csb03Response.data.body;
      const projectsData = projectsResponse.data.body;

      // Create a Map of _id to projectName
      const projectMap = new Map(
        projectsData.map((project) => [project._id, project])
      );

      // Create an array that combines the necessary data to display in the table
      const combinedData = csb03Data.map((item) => {
        const project = projectMap.get(item.projectId) || {};

        return {
          ...item,
          projectName: project.projectName,
          organizations: project.organization,
          startDate: item.startDate,
          endDate: item.endDate,
          students: project.student || [], // Get students from the project
          lecturers: project.lecturer || [], // Get lecturers from the project
        };
      });

      setFilteredData(combinedData);
    } catch (err) {
      console.log(err);
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
      dataIndex: "students", // Ensure this matches your combined data structure
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
      dataIndex: "lecturers", // Ensure this matches your combined data structure
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
      title: "วันที่เริ่มการทดสอบ",
      dataIndex: "startDate", // Correctly referencing start date
      render: (date) => date || "No date available", // Directly return the date
    },
    {
      title: "วันที่สิ้นสุดการทดสอบ",
      dataIndex: "endDate", // Correctly referencing end date
      render: (date) => date || "No date available", // Directly return the date
    },
    // ... other columns

    {
      title: "หน่วยงานที่ทำการทดสอบ",
      dataIndex: "organization",
      render: (organizations) =>
        organizations ? organizations : "No organization available",
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
          <b>ข้อมูลการยื่นขอทดสอบโครงงาน</b>
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
