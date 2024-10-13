import React, { useState, useEffect } from 'react';
import { Layout, Typography, Table } from 'antd';
import api from '../../../utils/form/api';

const { Title } = Typography;
const { Content } = Layout;

export default function ProjectStatus() {
    const initialData = [
        { id: 1, name: 'ตรวจสอบคุณสมบัติการยื่นสอบโครงงานพิเศษ 1', status: '', remark: ''},
        { id: 2, name: 'การสอบหัวข้อ', status: '', remark: '' },
        { id: 3, name: 'การสอบก้าวหน้า', status: '', remark: '' },
        { id: 4, name: 'ตรวจสอบคุณสมบัติการยื่นสอบโครงงานพิเศษ 2', status: '', remark: '',},
        { id: 5, name: 'การยื่นทดสอบโครงงาน', status: '', remark: '', },
        { id: 6, name: 'การสอบป้องกัน', status: '', remark: '' },
    ];

    const [checkAllStatus, setCheckAllStatus] = useState(initialData);

    useEffect(() => {
        api.getAllProject()
            .then((res) => {
                console.log("Response from API:", res.data.body);
                if (res.data.body.length > 0) {
                    const projectData = res.data.body[0];
                    console.log("Project Data:", projectData);
                    const updatedStatus = initialData.map(item => ({
                        ...item,
                        status: projectData[item.id - 1]?.status || '',
                        remark: projectData[item.id - 1]?.remark || '',
                        projectStatus: projectData[item.id - 1]?.projectStatus || 0,
                    }));
                    setCheckAllStatus(updatedStatus);
                }
            })
            .catch(err => {
                console.error("Error fetching project data:", err);
            });
    }, []); 

    const columns = [
        {
            title: 'ลำดับที่',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'รายการ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            key: 'status',
            render: status => status, // Render status directly as text
        },
        {
            title: 'หมายเหตุ',
            dataIndex: 'remark',
            key: 'remark',
            render: remark => remark, // Render remark directly as text
        },
        {
            title: 'สถานะโครงการ',
            dataIndex: 'projectStatus',
            key: 'projectStatus',
            render: projectStatus => projectStatus, // Render projectStatus directly as text
        },
    ];

    return (
        <Content>
            <Title level={2} style={{ textAlign: 'center' }}>ตรวจสอบสถานะต่างๆ</Title>
            <Table
                dataSource={checkAllStatus}
                columns={columns}
                rowKey="id"
                pagination={false}
            />
        </Content>
    );
}
