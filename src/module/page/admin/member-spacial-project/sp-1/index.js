import React from "react";
import { useEffect, useState } from "react";
import api from "../../../../utils/form/api";
import { Table } from "antd";

export default function Sp1() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const body = { projectValidate: [1, 0] };
    api
      .getStudent(body)
      .then((res) => {
        // let filterData = res.data.body.filter((item) => item.projectStatus[0] == 1 && item.projectStatus[1] == 0);
        // console.log(filterData);
        setData(res.data.body);
        console.log(res.data.body);
      })
      .catch((err) => {
        console.log(err);
      });
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
      onFilter: (value, record) => record.name.startsWith(value),
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
      sorter: (a, b) => {
        const studentA = a.student[0]?.FirstName || "";
        const studentB = b.student[0]?.FirstName || "";
        return studentA.localeCompare(studentB);
      },
    },
    {
      title: "Name Lecturer",
      dataIndex: "lecturer",
      render: (lecturers) => (
        <>
          {lecturers.map((lecturer, index) => (
            <span key={index}>
              {lecturer.FirstName} {lecturer.LastName}
              <br />
            </span>
          ))}
        </>
      ),
      sorter: (a, b) => {
        const lecturerA = a.lecturer[0]?.FirstName || "";
        const lecturerB = b.lecturer[0]?.FirstName || "";
        return lecturerA.localeCompare(lecturerB);
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
      <h1>
        {/* {JSON.stringify(data)} */}
        <Table
          className="custom-table"
          columns={columns}
          dataSource={data}
          onChange={onChange}
          components={components}
        />
      </h1>
    </div>
  );
}
