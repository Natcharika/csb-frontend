import React, { useEffect, useState } from "react";
import api from "../../../../utils/form/api";
import { Table } from "antd";

export default function Sp1() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const projectRes = await api.getAllProject(); // Fetch the project data
      console.log("Fetched Project Data:", projectRes.data.body); // Debug the fetched data
      const projects = projectRes.data.body;

      // Filter projects where CSB01 status is "ผ่าน" and activeStatus is 2
      const filteredProjects = projects.filter(
        (project) =>
          project.status.CSB01.status === "ผ่าน" &&
          project.status.CSB01.activeStatus === 2 &&
          // Ensure CSB02 status is not "ผ่าน" with activeStatus 3
          !(project.status.CSB02.status === "ผ่าน" && project.status.CSB02.activeStatus === 3)
      );

      setData(filteredProjects);
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Project Name",
      dataIndex: "projectName",
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.projectName.startsWith(value),
      width: "30%",
      sorter: (a, b) => a.projectName.localeCompare(b.projectName),
    },
    {
      title: "Name Student",
      dataIndex: "student",
      render: (students) => (
        <>
          {students.map((student, index) => (
            <span key={index}>
              {student.FirstName} {student.LastName}
              <br />
            </span>
          ))}
        </>
      ),
    },
    {
      title: "Name Lecturer",
      dataIndex: "lecturer",
      render: (lecturers) => (
        <>
          {lecturers && lecturers.length > 0 ? (
            lecturers.map((lecturer, index) => (
              <span key={index}>
                {lecturer.T_name}
                <br />
              </span>
            ))
          ) : (
            <span> </span>
          )}
        </>
      ),
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
      <h1>Project List</h1>
      <Table
        className="custom-table"
        columns={columns}
        dataSource={data}
        onChange={onChange}
        components={components}
        rowKey="_id" // Assuming each project has a unique _id
      />
    </div>
  );
}
