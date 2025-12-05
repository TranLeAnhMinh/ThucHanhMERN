import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stuClass, setStuClass] = useState("");

  const [message, setMessage] = useState("");

  // Lấy dữ liệu học sinh hiện tại
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/students/${id}`)
      .then((res) => {
        setName(res.data.name);
        setAge(res.data.age);
        setStuClass(res.data.class);
      })
      .catch(() => alert("Không tìm thấy học sinh"));
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:5000/api/students/${id}`, {
        name,
        age: Number(age),
        class: stuClass,
      })
      .then(() => {
        setMessage("Cập nhật thành công!");
        setTimeout(() => navigate("/"), 1500);
      })
      .catch(() => alert("Cập nhật thất bại"));
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-warning">Chỉnh sửa học sinh</h2>

      <form onSubmit={handleUpdate} className="row g-3">
        <div className="col-md-4">
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Họ tên"
            required
          />
        </div>

        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            value={age}
            min={1}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Tuổi"
            required
          />
        </div>

        <div className="col-md-3">
          <input
            className="form-control"
            value={stuClass}
            onChange={(e) => setStuClass(e.target.value)}
            placeholder="Lớp"
            required
          />
        </div>

        <div className="col-md-2 d-grid">
          <button className="btn btn-warning">Cập nhật</button>
        </div>
      </form>

      {message && (
        <div className="alert alert-success mt-3">{message}</div>
      )}
    </div>
  );
}

export default EditStudent;
