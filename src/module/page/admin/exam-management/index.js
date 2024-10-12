import React from "react";
import { useState } from "react";
import { DatePicker, Space } from "antd";
import { Form, Select, Button, Col } from "antd";
import api from "../../../utils/form/api";

export default function ExamManage() {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const { RangePicker } = DatePicker;
  const { Option } = Select;
  const [form] = Form.useForm();

  const onOk = (value) => {
    console.log("onOk: ", value);
  };

  const checkFormValidity = (changedValues, allValues) => {
    const allFieldsFilled = allValues.examName && allValues.examDate;
    setIsSubmitDisabled(!allFieldsFilled);
  };

  const handleSubmit = (values) => {
    let body = {
      examName: values.examName,
      examStartDate: values.examDate[0].format("YYYY-MM-DD HH:mm"),
      examEndDate: values.examDate[1].format("YYYY-MM-DD HH:mm"),
    };
    api
      .createAnouncement(body)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={checkFormValidity}
        onFinish={handleSubmit}
      >
        <Col span={8}>
          <Form.Item
            label="ชื่อการสอบ (Exam Name)"
            name="examName"
            rules={[{ required: true, message: "กรุณาเลือกชื่อการสอบ" }]}
          >
            <Select placeholder="เลือกชื่อการสอบ">
              <Option value="CSB01">สอบหัวข้อ</Option>
              <Option value="CSB02">สอบก้าวหน้า</Option>
              <Option value="CSB03">สอบป้องกัน</Option>
            </Select>
          </Form.Item>
        </Col>

        <Space direction="vertical" size={12}>
          <Form.Item
            label="วันที่เริ่ม-สิ้นสุด (Exam Date)"
            name="examDate"
            rules={[{ required: true, message: "กรุณาเลือกเวลาสอบ" }]}
          >
            <RangePicker
              showTime={{
                format: "HH:mm",
              }}
              format="YYYY-MM-DD HH:mm"
              onChange={(value, dateString) => {
                console.log("Selected Time: ", value);
                console.log("Formatted Selected Time: ", dateString);
              }}
              onOk={onOk}
              placeholder={["วันที่เริ่มต้น", "วันที่สิ้นสุด"]}
            />
          </Form.Item>
        </Space>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isSubmitDisabled}>
            ตกลง
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
