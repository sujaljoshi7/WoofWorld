import axios from "axios";
import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import api from "../../api";
import Sidebar from "../../layout/Sidebar";
import Pagination from "../../components/Pagination";
import { handleTokenRefresh } from "../../hooks/tokenRefresh";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { exportToCSV } from "../../utils/export";

const BASE_URL = import.meta.env.VITE_API_URL;

function ViewAdoptions() {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [allAdoptions, setAllAdoptions] = useState([]);
  const [isLoadingAdoptions, setIsLoadingAdoptions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [homePageToggle, setHomePageToggle] = useState();
  const itemsPerPage = 5;

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (allAdoptions) {
      const filtered = allAdoptions.filter((item) =>
        `${item.name} ${item.status} ${item.created_by}`
          .toLowerCase()
          .includes(value)
      );
      setFilteredData(filtered);
    }
  };

  const date_format = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const fetchAdoptions = async () => {
    setIsLoadingAdoptions(true);
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setIsLoadingAdoptions(false);
      return;
    }
    try {
      const adoptionsRes = api.get("/api/adoption/");
      const [adoptions] = await Promise.all([adoptionsRes]);
      setAllAdoptions(adoptions.data);
      setFilteredData(adoptions.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Access token expired, refreshing...");
        const refreshed = await handleTokenRefresh();
        if (refreshed) {
          return fetchAdoptions();
        }
      } else {
        console.error("Failed to fetch adoption data:", error);
      }
    } finally {
      setIsLoadingAdoptions(false);
    }
  };

  useEffect(() => {
    if (message) {
      const toastElement = document.getElementById("liveToast");
      if (toastElement) {
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
      }
    }

    fetchAdoptions();
    const interval = setInterval(() => {
      fetchAdoptions();
    }, 60000);

    return () => clearInterval(interval);
  }, [message]);

  const handleDeactivate = async (adoption_id) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setIsLoadingAdoptions(false);
      return;
    }
    try {
      const response = await api.patch(
        `api/adoption/dog/${adoption_id}/deactivate/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      fetchAdoptions();
    } catch (error) {
      setError(
        error.response.data.message || "Error deactivating adoption listing"
      );
    }
  };

  const handleActivate = async (adoption_id) => {
    try {
      const response = await api.patch(
        `api/adoption/dog/${adoption_id}/activate/`
      );
      setMessage(response.data.message);
      fetchAdoptions();
    } catch (error) {
      setError(
        error.response.data.message || "Error activating adoption listing"
      );
      console.log(error);
    }
  };

  const handleToggleStatus = async (id, newStatus, name, updatedStatus) => {
    updatedStatus = 0;
    if (newStatus) {
      updatedStatus = 1;
    }
    const formData = new FormData();
    formData.append("show_on_homepage", newStatus);
    try {
      await api.patch(`/api/adoptions/adoption/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchAdoptions();
      if (newStatus) {
        setMessage(name + " is live on featured section!");
      } else {
        setMessage(name + " will no longer be displayed on featured section!");
      }
    } catch (error) {
      console.error("Failed to update adoption listing:", error);
    }
  };

  const handleExport = () => {
    const formattedData = filteredData.map((item) => ({
      id: item.id,
      image: item.image,
      pet_name: item.name,
      description: item.description,
      status: item.status,
      breed: item.breed ? `${item.breed.name}` : "",
      age: item.age,
      show_on_homepage: item.show_on_homepage,
      created_by: item.created_by
        ? `${item.created_by.first_name} ${item.created_by.last_name} [${item.created_by.email}]`
        : "",
    }));
    exportToCSV(
      formattedData,
      [
        "ID",
        "Image",
        "Pet Name",
        "Description",
        "Age",
        "Breed",
        "Status",
        "Featured",
        "Created By",
      ],
      [
        "id",
        "image",
        "pet_name",
        "description",
        "age",
        "breed",
        "status",
        "show_on_homepage",
        "created_by",
      ],
      "adoptions.csv"
    );
  };

  const handleRowClick = (adoption_id) => {
    navigate(`/adoption/${encodeURIComponent(adoption_id)}`);
  };

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar user={user} />
      <div
        className="main-content flex-grow-1"
        style={{
          marginLeft: "280px",
          padding: "2rem",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h1 className="h3 mb-0">Adoption Listings</h1>
          <div className="d-flex gap-2 mt-3 mt-md-0">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/adoption/add")}
            >
              Add New Adoption
            </button>
            <button className="btn btn-success" onClick={handleExport}>
              Export to CSV
            </button>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search adoptions..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Pet Name</th>
                    <th>Breed</th>
                    <th>Age</th>
                    <th>Status</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((adoption) => (
                    <tr
                      key={adoption.id}
                      onClick={() => handleRowClick(adoption.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <img
                          src={adoption.image}
                          alt={adoption.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      </td>
                      <td>{adoption.name}</td>
                      <td>{adoption.breed?.name || "N/A"}</td>
                      <td>{adoption.age}</td>
                      <td>
                        <span
                          className={`badge ${
                            adoption.status ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {adoption.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        {adoption.created_by
                          ? `${adoption.created_by.first_name} ${adoption.created_by.last_name}`
                          : "N/A"}
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            className={`btn btn-sm ${
                              adoption.status ? "btn-danger" : "btn-success"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              adoption.status
                                ? handleDeactivate(adoption.id)
                                : handleActivate(adoption.id);
                            }}
                          >
                            {adoption.status ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Pagination
            pageCount={pageCount}
            onPageChange={handlePageClick}
            currentPage={currentPage}
          />
        </div>

        <div
          className="toast-container position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 11 }}
        >
          <div
            id="liveToast"
            className="toast"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header">
              <strong className="me-auto">Notification</strong>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
              ></button>
            </div>
            <div className="toast-body">{message}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewAdoptions;
