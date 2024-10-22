import React, { useEffect, useState } from "react";

import { Table, Modal, notification } from "antd";
import { Button, Input, Form, Select } from "antd";
import { AiOutlinePlus } from "react-icons/ai";
import api from "../../../utils/form/api";
import { AiOutlineDelete } from "react-icons/ai";
import "../../../theme/css/tables.css";
import "../../../theme/css/buttons.css";
import "../../../theme/css/texts.css";

const Whitelist = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  const handleDeleteUser = async (user) => {
    try {
      const token = localStorage.getItem("jwtToken");
      await api.deleteWhitelist(user, token);
      notification.success({
        message: "ลบผู้ใช้สำเร็จ",
      });
      fetchUsers();
    } catch (err) {
      notification.error({
        message: "ลบผู้ใช้ไม่สำเร็จ",
      });
    }
  };

  const columns = [
    {
      title: "ชื่อผู้ใช้",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "ตำแหน่ง",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "การกระทำ",
      dataIndex: "Action",
      key: "Action",
      render: (_, record) => {
        return (
          <Button
            type="primary"
            danger
            icon={<AiOutlineDelete />}
            onClick={() => {
              handleDeleteUser(record);
            }}
            className="mr-2"
          >
            ลบผู้ใช้งาน
          </Button>
        );
      },
    },
  ];

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const { data } = await api.getWhitelist(token);
      setUsers(data.data);
    } catch (err) {
      notification.error({
        message: "เกิดข้อผิดพลาด",
      });
    }
  };

  const onReset = () => {
    form.resetFields();
  };


  const handleAddUser = async (username, role) => {
    try {
      const token = localStorage.getItem("jwtToken");
      await api.addWhitelist(
        {
          username: username,
          role: role,
        },
        token
      );
      notification.success({
        message: "เพิ่มผู้ใช้สำเร็จ",
      });
      onReset();
      fetchUsers();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (data) => {
    try {
      const { username, role } = data;
      handleAddUser(username, role);
    } catch (err) {
      notification.error({
        message: "เพิ่มผู้ใช้ไม่สำเร็จ",
      });
    } finally {
      handleCancel();
    }
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
      <Modal
        title="เพิ่มผู้ใช้"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[]}
      >
        <Form onFinish={handleSubmit} form={form}>
          <Form.Item
            label="ตำแหน่ง"
            name="role"
            rules={[
              {
                required: true,
                message: "กรุณาระบุตำแหน่ง",
              },
            ]}
          >
            <Select title="เลือกตำแหน่ง" className="w-[200px] ">
              <Select.Option value="teacher">อาจารย์</Select.Option>
              <Select.Option value="admin">เจ้าหน้าที่</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "กรุณากรอก Username",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <div>
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              className="mr-2"
            >
              ยืนยัน
            </Button>
            <Button onClick={handleCancel}>ยกเลิก</Button>
          </div>
        </Form>
      </Modal>
      <div className="text-xl font-bold mb-2" style={{textAlign: "center"}}>จัดการผู้ใช้</div>
      <Button
        type="primary"
        icon={<AiOutlinePlus />}
        onClick={() => setIsModalOpen(true)}
        className="mr-2"
        style={{marginBottom: '10px'}}
      >
        เพิ่มผู้ใช้
      </Button>

      <Table
        className="custom-table"
        locale={{
          emptyText: "ไม่มีข้อมูล",
        }}
        dataSource={users}
        columns={columns}
        // className="mt-2"
        components={components}
      />
    </div>
  );
};

export default Whitelist;
