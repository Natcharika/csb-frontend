import React, { useState, useEffect } from "react";
import { Button, Table, Input, Modal, Typography, Select, Card, InputNumber, Form, message, notification } from "antd";
import api from '../../../../utils/form/api';

const { TextArea } = Input;

function InputScoreCSB02() {
    const [scores, setScores] = useState({});
    const [totalScore, setTotalScore] = useState(0);
    const [comment, setComment] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [evaluatedRows, setEvaluatedRows] = useState({});
    const [successfulEvaluations, setSuccessfulEvaluations] = useState(new Set());
    const [loading, setLoading] = useState(true); // State for loading status

    // Criteria data
    const criteriaData = [
        { key: "1", criteria: "วัตถุประสงค์และขอบเขตโครงงาน", maxScore: 10 },
        { key: "2", criteria: "ความเข้าใจระบบงานเดิม/ทฤษฎีหรืองานวิจัย ที่นำมาใช้พัฒนาโครงงาน", maxScore: 20 },
        { key: "3", criteria: "การศึกษาความต้องการของระบบ และการออกแบบ", maxScore: 20 },
        { key: "4", criteria: "การนำเสนอโครงงาน", maxScore: 20 },
        { key: "5", criteria: "รูปแบบรายงาน", maxScore: 10 },
        { key: "6", criteria: "แนวทางการดำเนินงาน", maxScore: 10 },
    ];

    useEffect(() => {
        const fetchProjectsAndRooms = async () => {
            try {
                const resProjects = await api.getAllProject(); // Fetch projects
                console.log("Response from API (Projects):", resProjects.data.body);
                if (resProjects.data.body.length > 0) {
                    setProjects(resProjects.data.body); // Set the projects directly
                }

                const resRooms = await api.getRoomPage(); // Fetch rooms
                console.log("Response from API (Rooms):", resRooms.data.body);
                // Handle rooms data as necessary; you might want to set it in state if needed
                // setRooms(resRooms.data.body); // Uncomment if you have a state for rooms

            } catch (err) {
                console.log(err);
                notification.error({
                    message: 'Error Fetching Data',
                    description: 'Unable to fetch project or room data. Please try again later.',
                    placement: 'topRight',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProjectsAndRooms();
    }, []);

    // Get unique dates for evaluation
    const availableDates = [...new Set(projects.map(project => project.dateExam))];

    const handleDateChange = (value) => {
        setSelectedDate(value);
        const filtered = projects.filter(project => project.dateExam === value);
        setFilteredProjects(filtered);
    };

    const handleLinkClick = (index) => {
        setSelectedProject(filteredProjects[index]);
        setModalVisible(true);
    };

    const handleClose = () => {
        setModalVisible(false);
    };

    const handleScoreChange = (value, key) => {
        setScores((prevScores) => ({
            ...prevScores,
            [key]: value,
        }));
    };

    useEffect(() => {
        const total = criteriaData.reduce((sum, item) => {
            return sum + (scores[item.key] || 0);
        }, 0);
        setTotalScore(total);
    }, [scores]);

    const onSubmit = () => {
        const result = {
            totalScore,
            comment,
        };
        console.log("Result submitted: ", result);

        setScores({});
        setComment("");
        setModalVisible(false);
        message.success("บันทึกคะแนนสำเร็จ");

        if (selectedProject) {
            setSuccessfulEvaluations((prev) => new Set(prev).add(selectedProject.P_id));
            setEvaluatedRows((prev) => ({ ...prev, [selectedProject.P_id]: 'evaluated' })); 
        }
    };

    const handleDisableEvaluation = (projectId) => {
        setEvaluatedRows((prev) => ({ ...prev, [projectId]: 'notEvaluated' }));
    };

    const columns = [
        {
            title: "เกณฑ์พิจารณา",
            dataIndex: "criteria",
            key: "criteria",
        },
        {
            title: "คะแนนเต็ม",
            dataIndex: "maxScore",
            key: "maxScore",
        },
        {
            title: "คะแนนที่ได้",
            key: "score",
            render: (text, record) => (
                record.key === "total" ? (
                    <strong>{totalScore}</strong>
                ) : (
                    <InputNumber
                        min={0}
                        max={record.maxScore}
                        value={scores[record.key] || 0}
                        onChange={(value) => handleScoreChange(value, record.key)}
                    />
                )
            ),
        },
    ];

    const totalScoreRow = {
        key: "total",
        criteria: <strong>คะแนนรวม</strong>,
        maxScore: criteriaData.reduce((total, item) => total + item.maxScore, 0),
        score: totalScore,
    };

    const tableData = [...criteriaData, totalScoreRow];

    const hasEvaluatedProjects = () => {
        return filteredProjects.some(project => evaluatedRows[project.P_id] === 'evaluated');
    };

    const isScoreComplete = () => {
        return criteriaData.every(item => scores[item.key] !== undefined && scores[item.key] !== null);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '60%', textAlign: 'center' }}>
                <Typography.Title level={2}>ประเมินการโครงงานพิเศษ 1 (สอบก้าวหน้า)</Typography.Title>
                <Typography.Text>เลือกวันที่ที่จะทำการประเมิน:</Typography.Text>
                <Select
                    style={{ width: '100%' }}
                    placeholder="เลือกวันที่"
                    onChange={handleDateChange}
                    options={availableDates.map(date => ({ value: date, label: date }))}
                />
                <div style={{ marginTop: 20 }} />

                {selectedDate && filteredProjects.length > 0 ? (
                    <div>
                        <Button
                            onClick={() => filteredProjects.forEach(project => handleDisableEvaluation(project.P_id))}
                            style={{
                                backgroundColor: hasEvaluatedProjects() ? 'gray' : 'red',
                                borderColor: hasEvaluatedProjects() ? 'gray' : 'red',
                                color: 'white',
                                marginBottom: '10px',
                            }}
                            disabled={hasEvaluatedProjects()}
                        >
                            ไม่ประเมินทั้งหมด
                        </Button>
                        <Table
                            dataSource={filteredProjects}
                            columns={[ 
                                {
                                    title: 'ลำดับที่',
                                    dataIndex: 'P_id',
                                    key: 'P_id',
                                },
                                {
                                    title: 'ชื่อโครงงาน',
                                    dataIndex: 'projectName',
                                    key: 'projectName',
                                },
                                {
                                    title: 'ประเมิน',
                                    key: 'evaluate',
                                    render: (_, record) => {
                                        const evaluationStatus = evaluatedRows[record.P_id];

                                        if (evaluationStatus === 'evaluated') {
                                            return <span style={{ color: 'green' }}>ประเมินสำเร็จ</span>;
                                        }

                                        if (evaluationStatus === 'notEvaluated') {
                                            return <span style={{ color: 'red' }}>ไม่ประเมิน</span>;
                                        }

                                        return (
                                            <>
                                                <Button
                                                    onClick={() => handleLinkClick(filteredProjects.indexOf(record))}
                                                    type="primary"
                                                >
                                                    ประเมิน
                                                </Button>
                                                <Button
                                                    onClick={() => handleDisableEvaluation(record.P_id)}
                                                    style={{ marginLeft: 8, backgroundColor: 'red', borderColor: 'red', color: 'white' }}
                                                >
                                                    ไม่ประเมิน
                                                </Button>
                                            </>
                                        );
                                    },
                                },
                            ]}
                            pagination={false}
                            bordered
                        />
                    </div>
                ) : (
                    <Typography.Text>
                        {selectedDate ? null : 'กรุณาเลือกวันที่เพื่อแสดงโครงงานที่สามารถประเมินได้ !!'}
                    </Typography.Text>
                )}

                <Modal
                    title="กรอกคะแนน"
                    visible={modalVisible}
                    onCancel={handleClose}
                    footer={null}
                    width={1000}
                >
                    <Card>
                        <p><strong>ชื่อโครงงาน : </strong> {selectedProject?.projectName}</p>
                        <p><strong>นักศึกษาคนที่ 1 : </strong> {selectedProject?.P_S1}</p>
                        <p><strong>นักศึกษาคนที่ 2 : </strong> {selectedProject?.P_S2}</p>
                        <p><strong>วันที่ประเมิน : </strong> {selectedProject?.evaluationDate}</p>
                    </Card>
                    <Table dataSource={tableData} columns={columns} pagination={false} />
                    <Form layout="vertical" style={{ marginTop: 16 }}>
                        <Form.Item label="ความคิดเห็น">
                            <TextArea
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                onClick={onSubmit}
                                disabled={!isScoreComplete() || loading}
                            >
                                บันทึกคะแนน
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
}

export default InputScoreCSB02;
