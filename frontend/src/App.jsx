import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stuClass, setStuClass] = useState("");

  const [message, setMessage] = useState("");
  const [type, setType] = useState(""); // success | error

  const [editingId, setEditingId] = useState(null); // lưu id đang sửa

  // Bài 5: state tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  // Bài 6: state sắp xếp
  const [sortAsc, setSortAsc] = useState(true); // true: A->Z, false: Z->A

  // Lấy danh sách học sinh (Bài 1)
  const fetchStudents = () => {
    axios
      .get("http://localhost:5000/api/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Lỗi khi fetch:", err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Thêm học sinh (Bài 2)
  const handleAddStudent = (e) => {
    e.preventDefault();

    if (Number(age) <= 0) {
      setType("error");
      setMessage("Tuổi phải là số dương!");
      return;
    }

    const newStu = {
      name,
      age: Number(age),
      class: stuClass,
    };

    axios
      .post("http://localhost:5000/api/students", newStu)
      .then((res) => {
        setStudents((prev) => [...prev, res.data]);

        setName("");
        setAge("");
        setStuClass("");

        setType("success");
        setMessage("Thêm học sinh thành công!");

        setTimeout(() => setMessage(""), 2500);
      })
      .catch(() => {
        setType("error");
        setMessage("Thêm thất bại!");
      });
  };

  // Khi bấm sửa học sinh (Bài 3)
  const handleEditClick = (st) => {
    setEditingId(st._id);
    setName(st.name);
    setAge(st.age);
    setStuClass(st.class);
  };

  // Cập nhật học sinh (Bài 3)
  const handleUpdateStudent = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:5000/api/students/${editingId}`, {
        name,
        age: Number(age),
        class: stuClass,
      })
      .then(() => {
        fetchStudents();

        setEditingId(null);
        setName("");
        setAge("");
        setStuClass("");

        setType("success");
        setMessage("Cập nhật thành công!");

        setTimeout(() => setMessage(""), 2500);
      })
      .catch(() => {
        setType("error");
        setMessage("Cập nhật thất bại!");
      });
  };

  // Xóa học sinh (Bài 4)
  const handleDeleteStudent = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa học sinh này?")) return;

    axios
      .delete(`http://localhost:5000/api/students/${id}`)
      .then(() => {
        setStudents((prev) => prev.filter((s) => s._id !== id));

        if (editingId === id) {
          setEditingId(null);
          setName("");
          setAge("");
          setStuClass("");
        }

        setType("success");
        setMessage("Đã xóa học sinh");
        setTimeout(() => setMessage(""), 2500);
      })
      .catch(() => {
        setType("error");
        setMessage("Xóa học sinh thất bại!");
        setTimeout(() => setMessage(""), 2500);
      });
  };

  // Bài 5: lọc theo tên (tìm kiếm)
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Bài 6: sắp xếp theo tên
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const getLastName = (fullName) => {
    const parts = fullName.trim().toLowerCase().split(" ");
    return parts[parts.length - 1]; // lấy từ cuối
  };

  const nameA = getLastName(a.name);
  const nameB = getLastName(b.name);

  if (nameA < nameB) return sortAsc ? -1 : 1;
  if (nameA > nameB) return sortAsc ? 1 : -1;
  return 0;
  });

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-primary">Danh sách học sinh</h1>

      {/* form thêm học sinh */}
      <form
        className="row g-3 align-items-center mb-4"
        onSubmit={editingId ? handleUpdateStudent : handleAddStudent}
      >
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Họ tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Tuổi"
            value={age}
            min={1}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>

        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Lớp"
            value={stuClass}
            onChange={(e) => setStuClass(e.target.value)}
            required
          />
        </div>

        <div className="col-md-2 d-grid">
          <button
            className={`btn ${editingId ? "btn-warning" : "btn-primary"}`}
            type="submit"
          >
            {editingId ? "Cập nhật" : "Thêm học sinh"}
          </button>
        </div>
      </form>

      {/* thông báo */}
      {message && (
        <div
          className={`alert ${
            type === "success" ? "alert-success" : "alert-danger"
          }`}
        >
          {message}
        </div>
      )}

      {/* Bài 5: ô tìm kiếm */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Bài 6: nút sắp xếp */}
        <div className="col-md-4">
          <button
            className="btn btn-secondary"
            onClick={() => setSortAsc((prev) => !prev)}
          >
            Sắp xếp theo tên: {sortAsc ? "A → Z" : "Z → A"}
          </button>
        </div>
      </div>

      {/* bảng */}
      <table className="table table-bordered table-hover mt-3 text-center">
        <thead className="table-dark">
          <tr>
            <th>Họ tên</th>
            <th>Tuổi</th>
            <th>Lớp</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((st) => (
            <tr key={st._id}>
              <td>{st.name}</td>
              <td>{st.age}</td>
              <td>{st.class}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEditClick(st)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteStudent(st._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sortedStudents.length === 0 && (
        <p className="text-muted">Không có học sinh nào phù hợp</p>
      )}
    </div>
  );
}

export default App;
