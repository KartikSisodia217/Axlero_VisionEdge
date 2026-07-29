import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
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
      alert("User already exists.");
    }
  };

  const updateUser = async () => {
    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/users/${editingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          is_active: true,
        }),
      }
    );

    if (response.ok) {
      setEditingId(null);
      setIsEditing(false);
      setFullName("");
      setEmail("");
      fetchUsers();
    } else {
      alert("Update failed.");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/users/${id}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      fetchUsers();
    }
  };

  return (
    <div className="container">
      <h1>VisionEdge User Management</h1>

      <input
        className="search-box"
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="form-row">
        <input
          className="form-control"
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          className="form-control"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="add-btn"
          onClick={isEditing ? updateUser : createUser}
        >
          {isEditing ? "Update User" : "Add User"}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users
            .filter((user) =>
              user.full_name.toLowerCase().includes(search.toLowerCase())
            )
            .map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>

                <td>{user.full_name}</td>

                <td>{user.email}</td>

                <td>
                  <span
                    className={
                      user.is_active
                        ? "status-active"
                        : "status-inactive"
                    }
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingId(user.id);
                      setFullName(user.full_name);
                      setEmail(user.email);
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;