import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";
import Sidebar from "../layout/Sidebar";
import user_img from "../assets/images/user.png";
import blog_img from "../assets/images/blog.png";
import event_img from "../assets/images/event.png";
import webinar_img from "../assets/images/puppy.png";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [blogsCount, setBlogsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [webinarCount, setWebinarCount] = useState(0);
  const [location, setLocation] = useState({ country: "", city: "" });
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(true);

  const updateTime = () => setCurrentTime(new Date().toLocaleTimeString());

  const data = [
    { name: "Users", value: userCount },
    { name: "Blogs", value: blogsCount },
    { name: "Events", value: eventsCount },
    { name: "Adoptions", value: webinarCount },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const barData = [
    { name: "Users", count: userCount },
    { name: "Blogs", count: blogsCount },
    { name: "Events", count: eventsCount },
    { name: "Adoptioons", count: webinarCount },
  ];

  const fetchLocation = async () => {
    try {
      const response = await fetch(
        "https://ipinfo.io/json?token=f48a68ebe13b9a"
      );
      const data = await response.json();
      setLocation({ country: data.country, city: data.city });
    } catch (error) {
      console.error("Failed to fetch location:", error);
      setLocation({ country: "Unknown", city: "Unknown" });
    }
  };

  const fetchDashboardData = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setLoading(false);
      return;
    }

    try {
      const [userRes, usersRes, blogsRes, eventsRes, webinarRes] =
        await Promise.all([
          api.get("/api/user/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/user/all-users/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/blogs/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/events/event/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/adoption/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      setUser(userRes.data);
      setUserCount(usersRes.data.length);
      setBlogsCount(blogsRes.data.length);
      setEventsCount(eventsRes.data.length);
      setWebinarCount(webinarRes.data.length);
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Access token expired, refreshing...");
        await handleTokenRefresh();
      } else {
        console.error("Failed to fetch dashboard data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTokenRefresh = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
      console.error("No refresh token found, redirecting...");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      console.log("Token refreshed successfully");
      await fetchDashboardData();
    } catch (error) {
      console.error("Failed to refresh token:", error);
      window.location.href = "/login";
    }
  };

  const handleRowClick = (name) => {
    navigate(`/${name}`);
  };

  useEffect(() => {
    const timer = setInterval(updateTime, 1000);
    fetchLocation();
    fetchDashboardData();
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar user={user} />
      <div
        className="main-content flex-grow-1 ms-2"
        style={{ marginLeft: "280px", padding: "20px" }}
      >
        <div className="d-flex justify-content-between align-items-center mt-5">
          <h1 className="fw-semibold">Hello, {user?.first_name}</h1>
        </div>
        <p className="text-secondary">
          Your go-to system for creating, editing, and managing content
          seamlessly.
        </p>
        <hr className="mt-4 mb-3" />

        <div className="row justify-content-between">
          <DashboardCard
            title="Users"
            count={userCount}
            image={user_img}
            onClick={handleRowClick}
          />
          <DashboardCard
            title="Blogs"
            count={blogsCount}
            image={blog_img}
            onClick={handleRowClick}
          />
          <DashboardCard
            title="Events"
            count={eventsCount}
            image={event_img}
            onClick={handleRowClick}
          />
          <DashboardCard
            title="Adoption"
            count={webinarCount}
            image={webinar_img}
            onClick={handleRowClick}
          />
        </div>
        <div className="row mt-5">
          <div className="col-lg-6 bg-dark">
            <h4 className="text-light text-center mt-5 mb-5">
              Revenue Analysis
            </h4>
            <div className="mt-5">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#f5d107" barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="col-lg-6 bg-dark">
            <h4 className="text-light text-center mt-5 mb-5">Order Analysis</h4>

            <div className="mt-5">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DashboardCard = ({ title, count, image, onClick }) => (
  <div className="col-3">
    <div
      className="card bg-dark"
      style={{ maxWidth: "250px", margin: "10px", cursor: "pointer" }}
      onClick={() => onClick(title)}
    >
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h6 className="card-title text-secondary fs-6 fw-light">{title}</h6>
          <h6 className="card-text fw-semibold text-light fs-2">{count}</h6>
        </div>
        <img
          src={image}
          alt={title}
          className="rounded-circle"
          style={{ width: "50px", height: "50px" }}
        />
      </div>
    </div>
  </div>
);

export default Dashboard;
