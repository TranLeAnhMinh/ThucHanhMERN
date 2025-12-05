const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Student = require("./models/Student");
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// kết nối mongodb
mongoose
  .connect("mongodb://localhost:27017/student_db")
  .then(() => console.log("Đã kết nối MongoDB thành công"))
  .catch((err) => console.error("Lỗi kết nối MongoDB:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Backend + MongoDB đang chạy...");
});

//API gọi student Bài 1
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//API tạo student mới Bài 2
app.post("/api/students", async (req, res) => {
  try {
    const newStudent = await Student.create(req.body); // tạo học sinh mới
    res.status(201).json(newStudent);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

//API gọi cụ thể 1 student Bài 3
app.get("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//API sửa thông tin 1 student Bài 3
app.put("/api/students/:id", async (req, res) => {
  try {
    const updatedStu = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedStu) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(updatedStu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
//API xóa học sinh (Bài 4)
app.delete("/api/students/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Student.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Đã xóa học sinh", id: deleted._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Chạy server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
