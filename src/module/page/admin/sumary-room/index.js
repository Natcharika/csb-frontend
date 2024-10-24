import React, { useState, useEffect } from "react";
import api from "../../../utils/form/api";
import { Table, Tag, Button, Dropdown, Menu } from "antd";
import moment from "moment";
import "../../../theme/css/tables.css";
import "../../../theme/css/buttons.css";

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

        // Sort the data by date in descending order
        const sortedData = fetchedData.sort(
          (a, b) => new Date(b.dateExam) - new Date(a.dateExam)
        );
        setData(sortedData);
        setFilteredData(sortedData);

        const uniqueDates = [
          ...new Set(
            sortedData.map((item) => moment(item.dateExam).format("YYYY-MM-DD"))
          ),
        ];
        setDates(uniqueDates);
        console.log(sortedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const handleDateSelect = (date) => {
  //   setSelectedDate(date);

  //   if (date === "all") {
  //     setFilteredData(data); // Show all data when "All" is selected
  //   } else if (date) {
  //     const filtered = data.filter((item) =>
  //       moment(item.dateExam).isSame(date, "day")
  //     );
  //     setFilteredData(filtered);
  //   } else {
  //     setFilteredData(data);
  //   }
  // };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  
    if (date === "all") {
      setFilteredData(data); // แสดงข้อมูลทั้งหมดเมื่อเลือก "All"
    } else if (date) {
      const filtered = data.filter((item) =>
        moment(item.dateExam).isSame(date, "day")
      );
      setFilteredData(filtered); // แสดงข้อมูลที่กรองตามวันที่เลือก
    } else {
      setFilteredData(data); // แสดงข้อมูลทั้งหมดหากไม่มีวันที่เลือก
    }
  };
  

  const columns = [
    {
      title: "รายชื่อโครงงาน",
      dataIndex: "projects",
      render: (projects) => (
        <>
          {Array.isArray(projects) ? (
            projects.map((project, index) => (
              <span key={index}>
                {project.projectName}
                <br />
              </span>
            ))
          ) : (
            <span>No projects available</span>
          )}
        </>
      ),
    },
    {
      title: "ห้องสอบ",
      dataIndex: "roomExam",
    },
    {
      title: "ชื่อการสอบ",
      dataIndex: "nameExam",
    },
    {
      title: "เวลาสอบ",
      dataIndex: "projects",
      render: (projects) => (
        <>
          {Array.isArray(projects) ? (
            projects.map((project, index) => (
              <span key={index}>
                <Tag color="purple">{project.start_in_time}</Tag>
                <br />
              </span>
            ))
          ) : (
            <span>No times available</span>
          )}
        </>
      ),
    },
    {
      title: "รายชื่อกรรมการสอบ",
      dataIndex: "teachers",
      render: (teachers) => (
        <>
          {Array.isArray(teachers) ? (
            teachers.map((teacher, index) => (
              <span key={index}>
                {teacher.T_name}
                <br />
              </span>
            ))
          ) : (
            <span>No teachers available</span>
          )}
        </>
      ),
    },
    {
      title: "ตำแหน่งกรรมการสอบ",
      dataIndex: "teachers",
      render: (teachers) => (
        <>
          {Array.isArray(teachers) ? (
            teachers.map((teacher, index) => (
              <span key={index}>
                {/* <Tag color="blue">{teacher.role}</Tag> */}
                {teacher.role == "main" ? (
                  <div>
                    <Tag color="pink">ประธานกรรมการ</Tag>
                  </div>
                ) : (
                  <div>
                    <Tag color="blue">กรรมการ</Tag>
                  </div>
                )}
              </span>
            ))
          ) : (
            <span>No roles available</span>
          )}
        </>
      ),
    },
    {
      title: "วันที่สอบ",
      dataIndex: "dateExam",
      render: (dateExam) =>
        dateExam ? moment(dateExam).format("DD/MM/YYYY") : "No date available",
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
      <Menu.Item key="all" onClick={() => handleDateSelect("all")}>
        All
      </Menu.Item>
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
          <b>สรุปรายละเอียดห้องสอบทั้งหมด</b>
        </h1>
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
        <Button className="All-button" type="primary" onClick={handlePrint}>
          พิมพ์เอกสาร
        </Button>
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import api from "../../../utils/form/api";
// import {
//   Table,
//   Tag,
//   Button,
//   Dropdown,
//   Menu,
//   Modal,
//   Select,
//   Form,
//   Space,
//   Input,
// } from "antd";
// import moment from "moment";
// import "../../../theme/css/tables.css";
// import "../../../theme/css/buttons.css";

// export default function SumaryRoom() {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [dates, setDates] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [projectOptions, setProjectOptions] = useState([]);

//   const fetchData = async () => {
//     api
//       .getSumaryRoom()
//       .then((res) => {
//         const fetchedData = res.data.body;

//         // Sort the data by date in descending order
//         const sortedData = fetchedData.sort(
//           (a, b) => new Date(b.dateExam) - new Date(a.dateExam)
//         );

//         setFilteredData(sortedData);

//         const uniqueDates = [
//           ...new Set(
//             sortedData.map((item) => moment(item.dateExam).format("YYYY-MM-DD"))
//           ),
//         ];
//         setDates(uniqueDates);
//         console.log(sortedData);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const fetchProjectOptions = async () => {
//     // Fetch project options from an API or define static data here
//     api
//       .getAllProject() // Replace with your API call to fetch project list
//       .then((res) => {
//         setProjectOptions(res.data.body); // Assuming your API returns an array of projects
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   useEffect(() => {
//     fetchData();
//     fetchProjectOptions();
//   }, []);

//   const handleDateSelect = (date) => {
//     setSelectedDate(date);

//     if (date === "all") {
//       setFilteredData(data); // Show all data when "All" is selected
//     } else if (date) {
//       const filtered = data.filter((item) =>
//         moment(item.dateExam).isSame(date, "day")
//       );
//       setFilteredData(filtered);
//     } else {
//       setFilteredData(data);
//     }
//   };

//   const handleEdit = (record) => {
//     setSelectedRecord({ ...record }); // Clone the record to avoid modifying original data
//     setIsModalVisible(true);
//   };

//   const handleModalOk = () => {
//     // Save changes and close modal
//     console.log("Updated record:", selectedRecord);
//     // Update the data in your state and API if necessary
//     setIsModalVisible(false);
//   };

//   const handleModalCancel = () => {
//     setIsModalVisible(false);
//   };

//   const handleProjectChange = (index, field, value) => {
//     const updatedProjects = [...selectedRecord.projects];
//     updatedProjects[index][field] = value;
//     setSelectedRecord({ ...selectedRecord, projects: updatedProjects });
//   };

//   const addProject = () => {
//     const updatedProjects = [
//       ...(selectedRecord.projects || []),
//       { projectName: "", start_in_time: "" },
//     ];
//     setSelectedRecord({ ...selectedRecord, projects: updatedProjects });
//   };

//   const removeProject = (index) => {
//     const updatedProjects = [...selectedRecord.projects];
//     updatedProjects.splice(index, 1);
//     setSelectedRecord({ ...selectedRecord, projects: updatedProjects });
//   };

//   const columns = [
//     {
//       title: "รายชื่อโครงงาน",
//       dataIndex: "projects",
//       render: (projects) => (
//         <>
//           {Array.isArray(projects) ? (
//             projects.map((project, index) => (
//               <span key={index}>
//                 {project.projectName}
//                 <br />
//               </span>
//             ))
//           ) : (
//             <span>No projects available</span>
//           )}
//         </>
//       ),
//     },
//     {
//       title: "ห้องสอบ",
//       dataIndex: "roomExam",
//     },
//     {
//       title: "ชื่อการสอบ",
//       dataIndex: "nameExam",
//     },
//     {
//       title: "เวลาสอบ",
//       dataIndex: "projects",
//       render: (projects) => (
//         <>
//           {Array.isArray(projects) ? (
//             projects.map((project, index) => (
//               <span key={index}>
//                 <Tag color="purple">{project.start_in_time}</Tag>
//                 <br />
//               </span>
//             ))
//           ) : (
//             <span>No times available</span>
//           )}
//         </>
//       ),
//     },
//     {
//       title: "รายชื่อกรรมการสอบ",
//       dataIndex: "teachers",
//       render: (teachers) => (
//         <>
//           {Array.isArray(teachers) ? (
//             teachers.map((teacher, index) => (
//               <span key={index}>
//                 {teacher.T_name}
//                 <br />
//               </span>
//             ))
//           ) : (
//             <span>No teachers available</span>
//           )}
//         </>
//       ),
//     },
//     {
//       title: "วันที่สอบ",
//       dataIndex: "dateExam",
//       render: (dateExam) =>
//         dateExam ? moment(dateExam).format("DD/MM/YYYY") : "No date available",
//     },
//     {
//       title: "แก้ไขห้องสอบ",
//       render: (_, record) => (
//         <Button type="link" onClick={() => handleEdit(record)}>
//           แก้ไข
//         </Button>
//       ),
//     },
//   ];

//   const menu = (
//     <Menu>
//       <Menu.Item key="all" onClick={() => handleDateSelect("all")}>
//         All
//       </Menu.Item>
//       {dates.map((date, index) => (
//         <Menu.Item key={index} onClick={() => handleDateSelect(date)}>
//           {moment(date).format("DD/MM/YYYY")}
//         </Menu.Item>
//       ))}
//     </Menu>
//   );

//   return (
//     <div>
//       <div style={{ textAlign: "center" }}>
//         <h1
//           style={{
//             fontSize: "20px",
//             textAlign: "center",
//             marginBottom: "10px",
//           }}
//         >
//           <b>สรุปรายละเอียดห้องสอบทั้งหมด</b>
//         </h1>
//       </div>
//       <div style={{ marginBottom: 16, textAlign: "center" }}>
//         <Dropdown overlay={menu}>
//           <Button className="custom-dropdown-button">
//             {selectedDate
//               ? moment(selectedDate).format("DD/MM/YYYY")
//               : "เลือกวันที่"}
//           </Button>
//         </Dropdown>
//       </div>

//       <div id="print-section">
//         <Table
//           className="custom-table"
//           columns={columns}
//           dataSource={filteredData}
//           rowKey="_id"
//         />
//       </div>

//       <Modal
//         title="แก้ไขห้องสอบ"
//         visible={isModalVisible}
//         onOk={handleModalOk}
//         onCancel={handleModalCancel}
//         width={800}
//       >
//         {selectedRecord && (
//           <div>
//             <h3>โครงงาน:</h3>
//             {selectedRecord.projects.map((project, index) => (
//               <Space key={index} style={{ marginBottom: 8 }}>
//                 <Select
//                   placeholder="เลือกชื่อโครงงาน"
//                   value={project.projectName}
//                   onChange={(value) =>
//                     handleProjectChange(index, "projectName", value)
//                   }
//                   style={{ width: 200 }}
//                 >
//                   {projectOptions.map((option) => (
//                     <Select.Option key={option._id} value={option.projectName}>
//                       {option.projectName}
//                     </Select.Option>
//                   ))}
//                 </Select>
//                 <Input
//                   placeholder="เวลาสอบ"
//                   value={project.start_in_time}
//                   onChange={(e) =>
//                     handleProjectChange(index, "start_in_time", e.target.value)
//                   }
//                   style={{ width: 150 }}
//                 />
//                 <Button type="danger" onClick={() => removeProject(index)}>
//                   ลบ
//                 </Button>
//               </Space>
//             ))}
//             <Button type="dashed" onClick={addProject}>
//               เพิ่มโครงงาน
//             </Button>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// }
