import React from "react";
import { Typography, Card } from "antd";
import student from "../../public/image/student.gif";
import teacher from "../../public/image/teacher.png";
import staff from "../../public/image/staff.png";

const { Title, Paragraph } = Typography;

const Home = (props) => {
  const { role } = props;

  // Function to render content based on the role
  const renderContent = () => {
    switch (role) {
      case "student":
        return {
          title: "ยินดีต้อนรับ นักศึกษาโครงการพิเศษสองภาษา",
          image: student,
          altText: "student logo",
        };
      case "teacher":
        return {
          title: "ยินดีต้อนรับอาจารย์ทุกท่าน",
          image: teacher,
          altText: "teacher logo",
        };
      default:
        return {
          title: "ยินดีต้อนรับเจ้าหน้าที่ทุกท่าน",
          image: staff,
          altText: "staff logo",
        };
    }
  };

  const { title, image, altText } = renderContent();

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <Title level={1} style={styles.title}>
          {title}
        </Title>
        <img src={image} alt={altText} style={styles.image} />
      </Card>

      <div style={styles.footer}>
          <Paragraph style={styles.credit}>ผู้จัดทำ: ทีมพัฒนาระบบ</Paragraph>
        </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    backgroundColor: "#ffffff",
    maxWidth: "1000px",
    width: "100%",
    position: "relative", // Set relative positioning for the card
  },
  title: {
    color: "#1890ff",
    marginBottom: "20px",
    textAlign: "center",
  },
  image: {
    width: "100%",
    maxWidth: "800px",
    borderRadius: "8px",
    display: "block",
    margin: "0 auto",
  },
  footer: {
    position: "absolute", // Position the footer
    bottom: "20px", // Distance from the bottom
    right: "20px", // Distance from the right
    textAlign: "right", // Align text to the right
    color: "#888", // Slightly lighter color for the credit
    fontSize: "14px", // Smaller font size
  },
  credit: {
    margin: 0, // Remove default margin
  },
};

export default Home;
