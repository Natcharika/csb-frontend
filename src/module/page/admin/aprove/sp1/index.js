import React, { useState, useEffect } from "react";
import api from '../../../../utils/form/api';
import { Table } from "antd";

export default function CheckSP1() {
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = async () => {
    try {
      const projectsResponse = await api.getProjects();
      console.log("Projects Response:", projectsResponse);

      const projectsData = projectsResponse.data.body;

      // Filter projects where status.CSB01.activeStatus is 1 and status.CSB01.status is "waiting"
      const filteredProjects = projectsData
        .filter(
          (project) =>
            project.status?.CSB01?.activeStatus === 1 &&
            project.status?.CSB01?.status === "waiting"
        )
        .map((item) => ({
            projectName: item.projectName,
            students: item.student || [], // Get students from the project
            lecturers: item.lecturer || [], // Get lecturers from the project
            date: item.status.CSB01.date,
        }))
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
      title: "Project Name",
      dataIndex: "projectName",
      render: (projectName) => <span>{projectName}</span>,
    },
    {
      title: "Student",
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
      title: "Advisors",
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
        title: "Date Approve",
        dataIndex: "date",
        render: (date) => {
          if (!date) return "No date available";
      
          // Convert the date string to a JavaScript Date object
          const dateObj = new Date(date);
      
          // Format the date to DD/MM/YYYY
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
      }
      
      
      
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
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
