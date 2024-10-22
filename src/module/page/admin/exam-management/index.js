import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Typography,
  Switch,
  Modal,
  Row,
  Col,
  notification,
} from "antd";
import api from "../../../utils/form/api";

const ManageExam = () => {
  const [examPeriod, setExamPeriod] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchExamPeriod = async () => {
    try {
      const response = await api.getExamPeriod();

      if (
        response.data &&
        response.data.body &&
        response.data.body.length > 0
      ) {
        setExamPeriod(response.data.body);
      } else {
        setExamPeriod([]); // Set to empty array or handle as needed
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      notification.error({
        message: "Error fetching data",
        description: "Unable to load project and CSB02 data.",
      });
    }
  };

  useEffect(() => {
    fetchExamPeriod();
  }, []);

  const handleCheckStatus = async (examPeriodId, examPeriodStatus) => {
    try {
      const data = {
        examPeriodId,
        examPeriodStatus,
      };
      const token = localStorage.getItem("jwtToken");
      const response = await api.patchExamPeriod(data, token);

      if (response.status === 200) {
        notification.success({
          message: "Success",
          description: response.data.message,
        });
      } else {
        notification.error({
          message: "Error",
          description: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error updating exam status:", error);
      notification.error({
        message: "Error",
        description: "Unable to update exam status.",
      });
    }
  };

  return (
    <Card>
      <Row justify="center">
        <Col span={12}>
          <Typography.Title level={2} style={{ textAlign: "center" }}>
            จัดการการยื่นสอบ
          </Typography.Title>

          {examPeriod.map((item, index) => (
            <Typography.Paragraph>
              <Switch
                defaultChecked={item.examStatus}
                //  onChange={() => setOpen2(!open2)}
                onChange={(e) => {
                  handleCheckStatus(item._id, e);
                }}
                style={{ marginRight: "10px" }}
              />
              {item.examName}
            </Typography.Paragraph>
          ))}
        </Col>
      </Row>
    </Card>
  );
};

export default ManageExam;
