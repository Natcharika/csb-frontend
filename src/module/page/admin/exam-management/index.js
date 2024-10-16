import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Switch, Modal, Row, Col,notification } from 'antd';
import api from '../../../utils/form/api';

const ManageExam = () => {
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [anouncement, setAnouncement] = useState('');

    

    useEffect(() => {
        const savedOpen1 = localStorage.getItem('open1') === 'true';
        const savedOpen2 = localStorage.getItem('open2') === 'true';
        const savedOpen3 = localStorage.getItem('open3') === 'true';
        const savedOpen4 = localStorage.getItem('open4') === 'true';

        setOpen1(savedOpen1);
        setOpen2(savedOpen2);
        setOpen3(savedOpen3);
        setOpen4(savedOpen4);
    }, []);

    useEffect(() => {
        localStorage.setItem('open1', open1);
        localStorage.setItem('open2', open2);
        localStorage.setItem('open3', open3);
        localStorage.setItem('open4', open4);
    }, [open1, open2, open3, open4]);

    
    useEffect(() => {
        const fetchanouncement = async () => {
            try {
                const anouncement = await api.anouncement(); 
                if (anouncement.data && anouncement.data.body && anouncement.data.body.length > 0) {
                    console.log("Fetched anouncement Data:", anouncement.data.body);
                    setAnouncement(anouncement.data.body);
                } else {
                    // Handle the case where body is empty or undefined
                    console.log("No announcement data found.");
                    setAnouncement([]); // Set to empty array or handle as needed
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                notification.error({
                    message: 'Error fetching data',
                    description: 'Unable to load project and CSB02 data.',
                });
            }
        };
    
        fetchanouncement();
    }, []);
    

  const handleConfirm = async () => {
    const examData = {
        Exam_o_CSB01: open1 ? 'เปิด' : 'ปิด',
        Exam_o_CSB02: open2 ? 'เปิด' : 'ปิด',
        Exam_o_CSB03: open3 ? 'เปิด' : 'ปิด',
        Exam_o_CSB04: open4 ? 'เปิด' : 'ปิด',
    };

    try {
        const response = await api.anouncement(examData); // Use the POST method
        setDialogMessage(response.data.message); // Set success message
        setDialogOpen(true); // Open the dialog
    } catch (error) {
        console.error('Error updating exam status:', error);
        setDialogMessage('Failed to update exam status.'); // Set error message
        setDialogOpen(true); // Open the dialog
    }
};


    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <Card>
            <Row justify="center">
                <Col span={12}>
                    <Typography.Title level={2} style={{ textAlign: 'center' }}>
                        จัดการการยื่นสอบ
                    </Typography.Title>

                    <Typography.Paragraph>
                        <Switch
                            checked={open1}
                            onChange={() => setOpen1(!open1)}
                            style={{ marginRight: '10px' }}
                        />
                        การสอบหัวข้อ
                    </Typography.Paragraph>

                    <Typography.Paragraph>
                        <Switch
                            checked={open2}
                            onChange={() => setOpen2(!open2)}
                            style={{ marginRight: '10px' }}
                        />
                        การสอบก้าวหน้า
                    </Typography.Paragraph>

                    <Typography.Paragraph>
                        <Switch
                            checked={open3}
                            onChange={() => setOpen3(!open3)}
                            style={{ marginRight: '10px' }}
                        />
                        การทดสอบโครงงาน
                    </Typography.Paragraph>

                    <Typography.Paragraph>
                        <Switch
                            checked={open4}
                            onChange={() => setOpen4(!open4)}
                            style={{ marginRight: '10px' }}
                        />
                        การสอบป้องกัน
                    </Typography.Paragraph>

                    <Button type="primary" onClick={handleConfirm} style={{ marginTop: '20px' }}>
                        Confirm
                    </Button>

                    <Modal
                        title="Exam Status Notification"
                        visible={dialogOpen}
                        onCancel={handleCloseDialog}
                        onOk={handleCloseDialog}
                    >
                        <Typography.Paragraph>
                            {dialogMessage}
                        </Typography.Paragraph>
                    </Modal>
                </Col>
            </Row>
        </Card>
    );
};

export default ManageExam;
