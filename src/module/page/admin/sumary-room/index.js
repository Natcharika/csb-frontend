import React, { useState, useEffect } from "react";
import api from "../../../utils/form/api";
import { Table, Tag, Button, Dropdown, Menu } from "antd";
import moment from "moment";

export default function SumaryRoom() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState([]);

  const fetchData = async () => {
    api
      .getSumaryRoom()
      .then((res) => {
        const fetchedData = res.data.body;
        setData(fetchedData);
        setFilteredData(fetchedData);

        const uniqueDates = [
          ...new Set(
            fetchedData.map((item) =>
              moment(item.dateExam).format("YYYY-MM-DD")
            )
          ),
        ];
        setDates(uniqueDates);
        console.log(res.data.body);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);

    if (date) {
      const filtered = data.filter((item) =>
        moment(item.dateExam).isSame(date, "day")
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const columns = [
    {
      title: "Project Name",
      dataIndex: "projects",
      render: (projects) => (
        <>
          {projects.map((project, index) => (
            <span key={index}>
              {project.projectName}
              <br />
            </span>
          ))}
        </>
      ),
    },
    {
      title: "Room",
      dataIndex: "roomExam",
    },
    {
      title: "nameExam",
      dataIndex: "nameExam",
    },
    {
      title: "Time",
      dataIndex: "projects",
      render: (projects) => (
        <>
          {projects.map((project, index) => (
            <span key={index}>
              <Tag color="purple">{project.start_in_time}</Tag>
              <br />
            </span>
          ))}
        </>
      ),
    },
    {
      title: "Referees",
      dataIndex: "referees",
      render: (referees) => (
        <>
          {referees.map((referee, index) => (
            <span key={index}>
              {referee.nameLecturer}
              <br />
            </span>
          ))}
        </>
      ),
    },
    {
      title: "Referees Role",
      dataIndex: "referees",
      render: (referees) => (
        <>
          {referees.map((referee, index) => (
            <span key={index}>
              <Tag color="blue">{referee.roleLecturer}</Tag>
              <br />
            </span>
          ))}
        </>
      ),
    },
    {
      title: "Date",
      dataIndex: "dateExam",
      render: (dateExam) => new Date(dateExam).toLocaleDateString(),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("print-section").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const menu = (
    <Menu>
      {dates.map((date, index) => (
        <Menu.Item key={index} onClick={() => handleDateSelect(date)}>
          {moment(date).format("DD/MM/YYYY")}
        </Menu.Item>
      ))}
    </Menu>
  );

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
      <div style={{ textAlign: "center" }}>
        <h1>Summary Room</h1>
      </div>
      <div style={{ marginBottom: 16, textAlign: "center" }}>
        <Dropdown overlay={menu}>
          <Button className="custom-dropdown-button">
            {selectedDate
              ? moment(selectedDate).format("DD/MM/YYYY")
              : "เลือกวันที่"}
          </Button>
        </Dropdown>
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
      <div style={{ textAlign: "center" }}>
        <Button className="Print-button" type="primary" onClick={handlePrint}>
          พิมพ์เอกสาร
        </Button>
      </div>
    </div>
  );
}
