import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const fetchUsers = () => {
    fetch("http://127.0.0.1:8000/api/v1/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: fullName,
        email: email,
      }),
    });

    if (response.ok) {
      setFullName("");
      setEmail("");
      fetchUsers();
    } else {
      alert("User already exists or invalid data.");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>VisionEdge Users</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <button
          onClick={createUser}
          style={{ marginLeft: "10px" }}
        >
          Add User
        </button>
      </div>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>{user.is_active ? "Active" : "Inactive"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;