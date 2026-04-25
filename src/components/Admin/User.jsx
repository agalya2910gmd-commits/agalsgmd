// src/components/Admin/UsersManagement.jsx
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Button,
  Badge,
  Alert,
  Dropdown,
  Pagination,
} from "react-bootstrap";
import {
  Search,
  UserCheck,
  UserX,
  Trash2,
  Users,
  Calendar,
  Shield,
  Activity,
  Filter,
  ChevronDown,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Star,
} from "lucide-react";

const UsersManagement = ({ users, setUsers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 9;

  const showNotification = (message, variant = "success") => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const toggleUserStatus = async (userId) => {
    const user = users.find((u) => u.id === userId);
    const newStatus = user.status === "active" ? "blocked" : "active";
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, role: user.role })
      });

      if (!response.ok) throw new Error("Failed to update status");

      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, status: newStatus } : u,
        ),
      );
      showNotification(
        `${user.name} has been ${newStatus === "active" ? "unblocked" : "blocked"} successfully!`,
        "info",
      );
    } catch (err) {
      console.error(err);
      showNotification("Failed to update user status", "danger");
    }
  };

  const deleteUser = async (userId) => {
    const user = users.find((u) => u.id === userId);
    if (
      window.confirm(
        `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      )
    ) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/users/${userId}?role=${user.role}`, {
          method: "DELETE"
        });

        if (!response.ok) throw new Error("Failed to delete user");

        setUsers(users.filter((u) => u.id !== userId));
        showNotification(`${user.name} has been deleted successfully!`, "danger");
      } catch (err) {
        console.error(err);
        showNotification("Failed to delete user", "danger");
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "admin":
        return "danger";
      case "seller":
        return "success";
      case "moderator":
        return "warning";
      default:
        return "info";
    }
  };

  const getStatusBadgeVariant = (status) => {
    return status === "active" ? "success" : "secondary";
  };

  const activeUsersCount = users.filter((u) => u.status === "active").length;
  const blockedUsersCount = users.filter((u) => u.status === "blocked").length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div style={{ backgroundColor: "#EAEDED", minHeight: "100vh" }}>
      {/* Amazon-style Header */}
      <div
        style={{
          backgroundColor: "#232F3E",
          color: "white",
          padding: "20px 0",
        }}
      >
        <Container fluid className="px-4 px-lg-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="h3 mb-1 fw-bold" style={{ fontWeight: "500" }}>
                <Users className="me-2" size={28} />
                User Management
              </h1>
              <p className="mb-0 opacity-75 small">
                Manage and monitor system users
              </p>
            </div>
            <div className="d-flex gap-3">
              <div
                className="text-center px-3 py-2"
                style={{ backgroundColor: "#37475A", borderRadius: "8px" }}
              >
                <div className="h5 mb-0 fw-bold">{activeUsersCount}</div>
                <small className="opacity-75">Active Users</small>
              </div>
              <div
                className="text-center px-3 py-2"
                style={{ backgroundColor: "#37475A", borderRadius: "8px" }}
              >
                <div className="h5 mb-0 fw-bold">{blockedUsersCount}</div>
                <small className="opacity-75">Blocked</small>
              </div>
              <div
                className="text-center px-3 py-2"
                style={{ backgroundColor: "#37475A", borderRadius: "8px" }}
              >
                <div className="h5 mb-0 fw-bold">{adminCount}</div>
                <small className="opacity-75">Admins</small>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container fluid className="px-4 px-lg-5 py-4">
        {/* Alert Notification */}
        {showAlert && (
          <Alert
            variant={alertVariant}
            onClose={() => setShowAlert(false)}
            dismissible
            className="mb-4"
            style={{ borderRadius: "8px", border: "none" }}
          >
            {alertMessage}
          </Alert>
        )}

        {/* Amazon-style Search and Filter Bar */}
        <Card
          className="mb-4"
          style={{
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <Card.Body className="p-3">
            <Row className="g-2 align-items-center">
              <Col md={5}>
                <InputGroup style={{ borderRadius: "8px", overflow: "hidden" }}>
                  <InputGroup.Text
                    style={{ backgroundColor: "white", borderRight: "none" }}
                  >
                    <Search size={20} style={{ color: "#666" }} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search users by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ borderLeft: "none", boxShadow: "none" }}
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  style={{ borderRadius: "8px", backgroundColor: "white" }}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="seller">Seller</option>
                  <option value="moderator">Moderator</option>
                  <option value="user">User</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{ borderRadius: "8px", backgroundColor: "white" }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </Form.Select>
              </Col>
              <Col md={1}>
                <div className="text-muted text-nowrap">
                  <small>{filteredUsers.length} results</small>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Users Grid - Amazon Product Grid Style */}
        {currentUsers.length === 0 ? (
          <Card
            className="text-center py-5"
            style={{ borderRadius: "8px", border: "none" }}
          >
            <Card.Body>
              <Users size={64} className="text-muted mb-3" />
              <h5 className="text-muted">No users found</h5>
              <p className="text-muted">
                Try adjusting your search or filter criteria
              </p>
            </Card.Body>
          </Card>
        ) : (
          <>
            <Row xs={1} md={2} lg={3} className="g-4">
              {currentUsers.map((user) => (
                <Col key={user.id}>
                  <Card
                    className="h-100 border-0"
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 8px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 1px 3px rgba(0,0,0,0.1)";
                    }}
                  >
                    <Card.Body className="p-4">
                      {/* User Avatar */}
                      <div className="text-center mb-3">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                          style={{
                            width: "100px",
                            height: "100px",
                            background: `linear-gradient(135deg, ${user.role === "admin" ? "#FF9900" : user.role === "seller" ? "#10b981" : user.role === "moderator" ? "#FFA41C" : "#146EB4"}, ${user.role === "admin" ? "#CC7A00" : user.role === "seller" ? "#059669" : user.role === "moderator" ? "#CC8400" : "#0F5FA3"})`,
                            color: "white",
                            fontSize: "40px",
                            fontWeight: "bold",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <h6 className="fw-bold mb-1">{user.name}</h6>
                        <p className="small text-muted mb-2">{user.email}</p>
                        <div className="d-flex justify-content-center gap-2 mb-3 flex-wrap">
                          <Badge
                            bg={getRoleBadgeVariant(user.role)}
                            className="px-2 py-1"
                            style={{ fontSize: "11px", borderRadius: "4px" }}
                          >
                            <Shield size={10} className="me-1" />
                            {user.role}
                          </Badge>
                          <Badge
                            bg={getStatusBadgeVariant(user.status)}
                            className="px-2 py-1"
                            style={{ fontSize: "11px", borderRadius: "4px" }}
                          >
                            <Activity size={10} className="me-1" />
                            {user.status}
                          </Badge>
                        </div>
                      </div>

                      {/* User Details */}
                      <div className="border-top pt-3 mt-2">
                        <div className="small text-muted mb-2">
                          <Calendar size={12} className="me-1" />
                          Joined:{" "}
                          {new Date(user.joinDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        {user.lastActive && (
                          <div className="small text-muted">
                            <Activity size={12} className="me-1" />
                            Last active:{" "}
                            {new Date(user.lastActive).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </Card.Body>

                    {/* Amazon-style Action Buttons */}
                    <Card.Footer className="bg-white border-0 p-3 pt-0">
                      <div className="d-flex gap-2">
                        <Button
                          variant={
                            user.status === "active"
                              ? "outline-danger"
                              : "outline-success"
                          }
                          size="sm"
                          className="flex-grow-1"
                          style={{
                            borderRadius: "20px",
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.status === "active" ? (
                            <>
                              <UserX size={14} className="me-1" />
                              Block User
                            </>
                          ) : (
                            <>
                              <UserCheck size={14} className="me-1" />
                              Unblock User
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          style={{ borderRadius: "20px", aspectRatio: "1" }}
                          onClick={() => deleteUser(user.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Amazon-style Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-5">
                <Pagination style={{ gap: "5px" }}>
                  <Pagination.Prev
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    style={{ borderRadius: "8px" }}
                  />
                  {[...Array(totalPages)].map((_, idx) => (
                    <Pagination.Item
                      key={idx + 1}
                      active={idx + 1 === currentPage}
                      onClick={() => setCurrentPage(idx + 1)}
                      style={{
                        borderRadius: "8px",
                        backgroundColor:
                          idx + 1 === currentPage ? "#FF9900" : "white",
                        border: `1.5px solid ${idx + 1 === currentPage ? "#FF9900" : "#ddd"}`,
                      }}
                    >
                      {idx + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    style={{ borderRadius: "8px" }}
                  />
                </Pagination>
              </div>
            )}
          </>
        )}
      </Container>

      <style jsx global>{`
        .form-select:focus,
        .form-control:focus {
          border-color: #ff9900;
          box-shadow: 0 0 0 2px rgba(255, 153, 0, 0.2);
        }
        .btn-primary {
          background-color: #ff9900;
          border-color: #ff9900;
        }
        .btn-primary:hover {
          background-color: #cc7a00;
          border-color: #cc7a00;
        }
        .btn-outline-primary {
          color: #ff9900;
          border-color: #ff9900;
        }
        .btn-outline-primary:hover {
          background-color: #ff9900;
          border-color: #ff9900;
        }
        .page-item.active .page-link {
          background-color: #ff9900;
          border-color: #ff9900;
        }
        .page-link {
          color: #ff9900;
        }
        .page-link:hover {
          color: #cc7a00;
        }
        .badge.bg-info {
          background-color: #146eb4 !important;
        }
        .badge.bg-warning {
          background-color: #ffa41c !important;
          color: #000;
        }
      `}</style>
    </div>
  );
};

export default UsersManagement;
