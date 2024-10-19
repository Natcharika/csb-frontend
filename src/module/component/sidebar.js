// import React, { useState } from "react";
// import { Breadcrumb, Layout, Menu, theme } from "antd";
// import "../theme/css/sidebar.css";
// import kmutnb from "../public/image/kmutnb.png";
// import { Link, useNavigate } from "react-router-dom";
// const { Header, Content, Sider } = Layout;

// const menuItemsStudent = [
//   {
//     key: "/",
//     // icon: React.createElement(LaptopOutlined),
//     label: "หน้าหลัก",
//   },
//   {
//     key: "/special-project-1",
//     // icon: React.createElement(FormOutlined),
//     label: "Special Project 1",
//     children: [
//       {
//         key: "/special-project-1/provider",
//         // label: "ตรวจสอบคุณสมบัตินักศึกษา" <br/> "Special Project 1",
//         label: `${"ตรวจสอบคุณสมบัตินักศึกษา"} <br/> ${"Special Project 1"}`,
//       },
//       {
//         key: "/special-project-1/exam-csb01",
//         label: "ยื่นสอบหัวข้อ",
//       },
//       {
//         key: "/special-project-1/exam-csb02",
//         label: "ยื่นสอบก้าวหน้า",
//       },
//     ],
//   },
//   {
//     key: "/special-project-2",
//     // icon: React.createElement(FormOutlined),
//     label: "Special Project 2",
//     children: [
//       {
//         key: "/special-project-2/provider",
//         label: "ตรวจสอบคุณสมบัติ",
//       },
//       {
//         key: "/special-project-2/exam-csb03",
//         label: "ยื่นสอบทดสอบระบบ",
//       },
//       {
//         key: "/special-project-2/exam-csb04",
//         label: "ยื่นสอบป้องกัน",
//       },
//     ],
//   },
//   {
//     key: "/project-status",
//     // icon: React.createElement(LaptopOutlined),
//     label: "ตรวจสอบสถานะโครงงาน",
//   },
// ];
// const getMenuItemTeacher = (level) => {
//   const menuItemsTeacher = [
//     {
//       key: "/",
//       // icon: React.createElement(LaptopOutlined),
//       label: "หน้าหลัก",
//     },
//     {
//       key: "/approve",
//       // icon: React.createElement(FormOutlined),
//       label: "อนุมัติการยื่นสอบ",
//       children: [
//         {
//           key: "/approve/approve-csb02",
//           label: "อนุมัติการสอบก้าวหน้า",
//         },
//         {
//           key: "/approve/approve-csb03",
//           label: "อนุมัติการยื่นทดสอบโครงงาน",
//         },
//         {
//           key: "/approve/approve-csb04",
//           label: "อนุมัติการสอบป้องกัน",
//         },
//       ],
//     },
//     {
//       key: "/input-score",
//       // icon: React.createElement(FormOutlined),
//       label: "ประเมินคะแนน",
//       children: [
//         {
//           key: "/input-score/inputscore-csb01",
//           label: "ประเมินหัวข้อ",
//         },
//         {
//           key: "/input-score/inputscore-csb02",
//           label: "ประเมินก้าวหน้า",
//         },
//         {
//           key: "/input-score/inputscore-csb04",
//           label: "ประเมินป้องกัน",
//         },
//       ],
//     },
//   ];

//   const chairmanMenu = {
//     key: "/chairman-score",
//     // icon: React.createElement(FormOutlined),
//     label: "อนุมัติคะแนนสอบ(ประธานกรรมการ)",
//     children: [
//       {
//         key: "/chairman-score/chairman-score-csb01",
//         label: "อนุมัติคะแนนสอบหัวข้อโดยประธานกรรมการสอบ",
//       },
//       {
//         key: "/chairman-score/chairman-score-csb02",
//         label: "อนุมัติคะแนนสอบก้าวหน้าโดยประธานกรรมการสอบ",
//       },
//       {
//         key: "/chairman-score/chairman-score-csb04",
//         label: "อนุมัติคะแนนสอบป้องกันโดยประธานกรรมการสอบ",
//       },
//     ],
//   };
//   if (level === "chairman") {
//     menuItemsTeacher.push(chairmanMenu);
//   }

//   // const headMenu = {
//   //   key: "/department-score",
//   //   // icon: React.createElement(FormOutlined),
//   //   label: "อนุมัติคะแนนสอบ(หัวหน้าภาควิชา)",
//   //   children: [
//   //     {
//   //       key: "/department-score/department-score-csb01",
//   //       label: "อนุมัติคะแนนสอบหัวข้อหน้าโดยหัวหน้าภาควิชา",
//   //     },
//   //     {
//   //       key: "/department-score/department-score-csb02",
//   //       label: "อนุมัติคะแนนสอบก้าวหน้าโดยหัวหน้าภาควิชา",
//   //     },
//   //     {
//   //       key: "/department-score/department-score-csb04",
//   //       label: "อนุมัติคะแนนสอบป้องกันโดยหัวหน้าภาควิชา",
//   //     },
//   //   ],
//   // };
//   // if (level === "head") {
//   //   menuItemsTeacher.push(headMenu);
//   // }

//   if (level === "all") {
//     menuItemsTeacher.push(chairmanMenu);
//     // menuItemsTeacher.push(headMenu);
//   }

//   return menuItemsTeacher;
// };

// const menuItemsAdmin = [
//   {
//     key: "/",
//     // icon: React.createElement(HomeOutlined),
//     label: "หน้าหลัก",
//   },

//   {
//     key: "/checkstatus",
//     // icon: React.createElement(UserAddOutlined),
//     label: "เช็คสถานะนักศึกษา",
//   },

  

//   {
//     key: "/exam-management",
//     // icon: React.createElement(FormOutlined),
//     label: "จัดการเวลาสอบ",
//   },
//   {
//     key: "/room-management",
//     // icon: React.createElement(LaptopOutlined),
//     label: "สร้างห้องสอบ",
//     // children: [
//     //   {
//     //     key: "/room-management/add-room",
//     //     label: "เพิ่มห้องสอบ",
//     //   },
//     //   {
//     //     key: "/room-management/edit-room",
//     //     label: "แก้ไขห้องสอบ",
//     //   }
//     // ]
//   },
//   {
//     key: "/member-spacial-project",
//     // icon: React.createElement(UserOutlined),
//     label: "รายชื่อนักศึกษา",
//     children: [
//       {
//         key: "/member-spacial-project/sp-1",
//         label: "Special Project 1",
//       },
//       {
//         key: "/member-spacial-project/sp-2",
//         label: "Special Project 2",
//       },
//     ],
//   },
//   {
//     key: "/sumary-room",
//     // icon: React.createElement(LaptopOutlined),
//     label: "สรุปห้องสอบ",
//   },
//   // {
//   //   key: "/add-member-spacial-project",
//   //   icon: React.createElement(UserOutlined),
//   //   label: "เพิ่มรายชื่อนักศึกษา",
//   // },
//   {
//     key: "/add-lecture",
//     // icon: React.createElement(UserAddOutlined),
//     label: "เพิ่มอาจารย์ที่ปรึกษา",
//   },
//   {
//     key: "/view-csb03",
//     // icon: React.createElement(UserAddOutlined),
//     label: "ยื่นทดสอบระบบ",
//   },
//   {
//     key: "/check-approve",
//     // icon: React.createElement(UserOutlined),
//     label: "เช็คสถานะการยื่นขอสอบ",
//     children: [
//       {
//         key: "/check-approve/csb01",
//         label: "ยื่นสอบหัวข้อ",
//       },
//       {
//         key: "/check-approve/csb02",
//         label: "ยื่นสอบก้าวหน้า",
//       },
//       {
//         key: "/check-approve/csb03",
//         label: "ยื่นสอบป้องกัน",
//       },
//     ],
//   },




//   // {
//   //   key: "/create-project-for-student",
//   //   // icon: React.createElement(UserOutlined),
//   //   label: "สร้างโปรเจกต์ให้นักศึกษา",
//   // },
//   // {
//   //   key: "/appointment-department",
//   //   // icon: React.createElement(UserOutlined),
//   //   label: "แต่งตั้งหัวหน้าภาค",
//   // },
// ];
// const SiderBar = ({ children, role, username, level, logout }) => {
//   const [selectedKey, setSelectedKey] = useState("/");
//   const navigate = useNavigate();
//   const handleMenuClick = (e) => {
//     setSelectedKey(e.key);
//     navigate(e.key);
//   };

//   return (
//     <Layout>
//       <Header className="header bg-white h-[100px] shadow-md">
//         <img
//           src={kmutnb}
//           alt="logo"
//           className="w-[200px] h-auto items-center"
//         />
//         <span style={{ fontSize: "20px" }}>
//           Special Project Examination Management System for CSB Program
//         </span>
//         <span>
//           {username ? (
//             <h1
//               onClick={() => {
//                 logout();
//                 navigate("/login");
//               }}
//             >
//               {username}
//             </h1>
//           ) : (
//             <Link to={"/login"}>Log in</Link>
//           )}
//         </span>
//       </Header>

//       <Layout>
//         <Sider className="sider bg-white">
//           <h1 style={{ marginLeft: "20px" }}>
//             {role == "student"
//               ? "นักศึกษา"
//               : role == "teacher"
//               ? "อาจารย์"
//               : role == "admin"
//               ? "เจ้าหน้าที่"
//               : ""}
//           </h1>
//           <Menu
//             mode="inline"
//             selectedKeys={[selectedKey]}
//             // defaultOpenKeys={["sub1"]}
//             items={
//               role === "student"
//                 ? menuItemsStudent
//                 : role === "teacher"
//                 ? getMenuItemTeacher(level)
//                 : role === "admin"
//                 ? menuItemsAdmin
//                 : [menuItemsStudent[0]]
//             }
//             onClick={handleMenuClick}
//           />
//         </Sider>

//         <Layout style={{ padding: "0 24px 24px" }}>
//           {/* <Breadcrumb
//             className="breadcrumb"
//             items={[{ title: pageName }, { title: pageSub ?? "" }]}
//           /> */}

//           <Content
//             className="content"
//             style={{
//               borderRadius: "10px",
//             }}
//           >
//             {children}
//           </Content>
//         </Layout>
//       </Layout>
//     </Layout>
//   );
// };

// export default SiderBar;

import React, { useState } from "react";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import "../theme/css/sidebar.css";
import kmutnb from "../public/image/kmutnb.png";
import { Link, useNavigate } from "react-router-dom";
const { Header, Content, Sider } = Layout;

const menuItemsStudent = [
  {
    key: "/",
    // icon: React.createElement(LaptopOutlined),
    label: "หน้าหลัก",
  },
  {
    key: "/special-project-1",
    // icon: React.createElement(FormOutlined),
    label: "Special Project 1",
    children: [
      {
        key: "/special-project-1/provider",
        // label: "ตรวจสอบคุณสมบัตินักศึกษา" <br/> "Special Project 1",
        label: `${"ตรวจสอบคุณสมบัตินักศึกษา"} <br/> ${"Special Project 1"}`,
      },
      {
        key: "/special-project-1/exam-csb01",
        label: "ยื่นสอบหัวข้อ",
      },
      {
        key: "/special-project-1/exam-csb02",
        label: "ยื่นสอบก้าวหน้า",
      },
    ],
  },
  {
    key: "/special-project-2",
    // icon: React.createElement(FormOutlined),
    label: "Special Project 2",
    children: [
      {
        key: "/special-project-2/provider",
        label: "ตรวจสอบคุณสมบัติ",
      },
      {
        key: "/special-project-2/exam-csb03",
        label: "ยื่นสอบทดสอบระบบ",
      },
      {
        key: "/special-project-2/exam-csb04",
        label: "ยื่นสอบป้องกัน",
      },
    ],
  },
  {
    key: "/project-status",
    // icon: React.createElement(LaptopOutlined),
    label: "ตรวจสอบสถานะโครงงาน",
  },
];
const getMenuItemTeacher = (level) => {
  const menuItemsTeacher = [
    {
      key: "/",
      // icon: React.createElement(LaptopOutlined),
      label: "หน้าหลัก",
    },
    {
      key: "/approve",
      // icon: React.createElement(FormOutlined),
      label: "อนุมัติการยื่นสอบ",
      children: [
        {
          key: "/approve/approve-csb02",
          label: "อนุมัติการสอบก้าวหน้า",
        },
        {
          key: "/approve/approve-csb03",
          label: "อนุมัติการยื่นทดสอบโครงงาน",
        },
        {
          key: "/approve/approve-csb04",
          label: "อนุมัติการสอบป้องกัน",
        },
      ],
    },
    {
      key: "/input-score",
      // icon: React.createElement(FormOutlined),
      label: "ประเมินคะแนน",
      children: [
        {
          key: "/input-score/inputscore-csb01",
          label: "ประเมินหัวข้อ",
        },
        {
          key: "/input-score/inputscore-csb02",
          label: "ประเมินก้าวหน้า",
        },
        {
          key: "/input-score/inputscore-csb04",
          label: "ประเมินป้องกัน",
        },
      ],
    },
  ];

  const chairmanMenu = {
    key: "/chairman-score",
    // icon: React.createElement(FormOutlined),
    label: "อนุมัติคะแนนสอบ(ประธานกรรมการ)",
    children: [
      {
        key: "/chairman-score/chairman-score-csb01",
        label: "อนุมัติคะแนนสอบหัวข้อโดยประธานกรรมการสอบ",
      },
      {
        key: "/chairman-score/chairman-score-csb02",
        label: "อนุมัติคะแนนสอบก้าวหน้าโดยประธานกรรมการสอบ",
      },
      {
        key: "/chairman-score/chairman-score-csb04",
        label: "อนุมัติคะแนนสอบป้องกันโดยประธานกรรมการสอบ",
      },
    ],
  };
  if (level === "chairman") {
    menuItemsTeacher.push(chairmanMenu);
  }

  // const headMenu = {
  //   key: "/department-score",
  //   // icon: React.createElement(FormOutlined),
  //   label: "อนุมัติคะแนนสอบ(หัวหน้าภาควิชา)",
  //   children: [
  //     {
  //       key: "/department-score/department-score-csb01",
  //       label: "อนุมัติคะแนนสอบหัวข้อหน้าโดยหัวหน้าภาควิชา",
  //     },
  //     {
  //       key: "/department-score/department-score-csb02",
  //       label: "อนุมัติคะแนนสอบก้าวหน้าโดยหัวหน้าภาควิชา",
  //     },
  //     {
  //       key: "/department-score/department-score-csb04",
  //       label: "อนุมัติคะแนนสอบป้องกันโดยหัวหน้าภาควิชา",
  //     },
  //   ],
  // };
  // if (level === "head") {
  //   menuItemsTeacher.push(headMenu);
  // }

  if (level === "all") {
    menuItemsTeacher.push(chairmanMenu);
    // menuItemsTeacher.push(headMenu);
  }

  return menuItemsTeacher;
};

const menuItemsAdmin = [
  {
    key: "/",
    // icon: React.createElement(HomeOutlined),
    label: "หน้าหลัก",
  },

  {
    key: "/checkstatus",
    // icon: React.createElement(UserAddOutlined),
    label: "เช็คสถานะนักศึกษา",
  },

  

  {
    key: "/exam-management",
    // icon: React.createElement(FormOutlined),
    label: "จัดการเวลาสอบ",
  },
  {
    key: "/room-management",
    // icon: React.createElement(LaptopOutlined),
    label: "สร้างห้องสอบ",
    // children: [
    //   {
    //     key: "/room-management/add-room",
    //     label: "เพิ่มห้องสอบ",
    //   },
    //   {
    //     key: "/room-management/edit-room",
    //     label: "แก้ไขห้องสอบ",
    //   }
    // ]
  },
  {
    key: "/member-spacial-project",
    // icon: React.createElement(UserOutlined),
    label: "รายชื่อนักศึกษา",
    children: [
      {
        key: "/member-spacial-project/sp-1",
        label: "Special Project 1",
      },
      {
        key: "/member-spacial-project/sp-2",
        label: "Special Project 2",
      },
    ],
  },
  {
    key: "/sumary-room",
    // icon: React.createElement(LaptopOutlined),
    label: "สรุปห้องสอบ",
  },
  // {
  //   key: "/add-member-spacial-project",
  //   icon: React.createElement(UserOutlined),
  //   label: "เพิ่มรายชื่อนักศึกษา",
  // },
  {
    key: "/add-lecture",
    // icon: React.createElement(UserAddOutlined),
    label: "เพิ่มอาจารย์ที่ปรึกษา",
  },
  {
    key: "/view-csb03",
    // icon: React.createElement(UserAddOutlined),
    label: "ยื่นทดสอบระบบ",
  },
  {
    key: "/check-approve",
    // icon: React.createElement(UserOutlined),
    label: "เช็คสถานะการยื่นขอสอบ",
    children: [
      {
        key: "/check-approve/csb01",
        label: "ยื่นสอบหัวข้อ",
      },
      {
        key: "/check-approve/csb02",
        label: "ยื่นสอบก้าวหน้า",
      },
      {
        key: "/check-approve/csb03",
        label: "ยื่นสอบป้องกัน",
      },
    ],
  },




  // {
  //   key: "/create-project-for-student",
  //   // icon: React.createElement(UserOutlined),
  //   label: "สร้างโปรเจกต์ให้นักศึกษา",
  // },
  // {
  //   key: "/appointment-department",
  //   // icon: React.createElement(UserOutlined),
  //   label: "แต่งตั้งหัวหน้าภาค",
  // },
];
const SiderBar = ({ children, role, username, level, logout }) => {
  const [selectedKey, setSelectedKey] = useState("/");
  const navigate = useNavigate();
  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    navigate(e.key);
  };

  return (
    <Layout>
      <Header className="header bg-white h-[100px] shadow-md flex justify-between">
        <img
          src={kmutnb}
          alt="logo"
          className="w-[200px] h-auto items-center"
        />
        <span style={{ fontSize: "20px" }}>
          Special Project Examination Management System for CSB Program
        </span>
        <span>
          {username ? (
            <div className="flex items-center space-x-4">
              <h1>{username}</h1>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="logout-button"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to={"/login"}>Log in</Link>
          )}
        </span>
      </Header>

      <Layout>
        <Sider className="sider bg-white">
          <h1 style={{ marginLeft: "20px" }}>
            {role === "student"
              ? "นักศึกษา"
              : role === "teacher"
              ? "อาจารย์"
              : role === "admin"
              ? "เจ้าหน้าที่"
              : ""}
          </h1>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            // defaultOpenKeys={["sub1"]}
            items={
              role === "student"
                ? menuItemsStudent
                : role === "teacher"
                ? getMenuItemTeacher(level)
                : role === "admin"
                ? menuItemsAdmin
                : [menuItemsStudent[0]]
            }
            onClick={handleMenuClick}
          />
        </Sider>

        <Layout style={{ padding: "0 24px 24px" }}>
          {/* <Breadcrumb
            className="breadcrumb"
            items={[{ title: pageName }, { title: pageSub ?? "" }]}
          /> */}
          
          <Content
            className="content"
            style={{
              borderRadius: "10px",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default SiderBar;
