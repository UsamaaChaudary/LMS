import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Line, Pie, Doughnut, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  RadialLinearScale,
} from "chart.js";
import axios from "axios";
import "./StudentDashboard.css";
import assignmentLogo from "../assets/icons/assignment-logo.png";
import bookLogo from "../assets/icons/book-logo.png";
import canteenLogo from "../assets/icons/order-food-logo.png";
import checkedLogo from "../assets/icons/checked.png";
import resultLogo from "../assets/icons/result-logo.png";
import logOutLogo from "../assets/icons/loggout.png";
import submitFee from "../assets/icons/fee-logo.png";
import coursesLogo from "../assets/icons/courses-logo.png";
import profileIcon from "../assets/icons/student-profile-icon.png";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Tooltip,
  Legend
);

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [monthlyAttendanceData, setMonthlyAttendanceData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [chartType, setChartType] = useState("bar"); 
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [chartAnimation, setChartAnimation] = useState(0);
  const chartRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileIconRef = useRef(null);

  const chartTypes = [
    { type: "bar", name: "Bar Chart", icon: "📊" },
    { type: "line", name: "Line Chart", icon: "📈" },
    { type: "pie", name: "Pie Chart", icon: "🥧" },
    { type: "doughnut", name: "Doughnut Chart", icon: "🍩" },
    { type: "polarArea", name: "Polar Area Chart", icon: "🎯" },
  ];

  useEffect(() => {
    fetchMonthlyAttendance();
  }, []);

  useEffect(() => {
 
    if (selectedMonth && monthlyAttendanceData[selectedMonth]) {
      setChartAnimation(1);
    }
  }, [selectedMonth, monthlyAttendanceData]);

  const fetchMonthlyAttendance = async () => {
    setIsLoading(true);
    try {
      const userData = await localStorage.getItem("user");
      const parsedUser = JSON.parse(userData);
      const userId = parsedUser?.id;

      const response = await axios.get(
        `http://localhost:5000/api/attendance/${userId}`
      );
      console.log("Raw attendance data:", response.data);

      const monthlyData = {};

      response.data.forEach((record) => {
        const monthYear = record.monthYear;
        const courseName = record.course;

        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = {};
        }

        if (!monthlyData[monthYear][courseName]) {
          monthlyData[monthYear][courseName] = {
            present: 0,
            total: 0,
          };
        }

        monthlyData[monthYear][courseName].total = record.totalDays;
        monthlyData[monthYear][courseName].present = record.presentDays;
      });

      console.log("Monthly grouped data:", monthlyData);

      // Convert to chart data format
      const formattedMonthlyData = {};

      Object.keys(monthlyData).forEach((monthYear) => {
        const courses = Object.keys(monthlyData[monthYear]);

        // Format course names to first letter of each word
        const formattedCourses = courses.map((course) => {
          const abbreviatedCourse = course
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase())
            .join("");
          return {
            course,
            abbreviatedCourse,
            percentage: Math.round(
              (monthlyData[monthYear][course].present /
                monthlyData[monthYear][course].total) *
                100
            ),
          };
        });

        // Get month and year from the first record with this monthYear
        const record = response.data.find((r) => r.monthYear === monthYear);
        const month = record.month;
        const year = record.year;

        // Generate random colors for pie and doughnut charts
        const backgroundColors = [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(199, 199, 199, 0.6)",
          "rgba(83, 102, 255, 0.6)",
          "rgba(255, 99, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ];

        const borderColors = backgroundColors.map((color) =>
          color.replace("0.6", "1")
        );

        formattedMonthlyData[monthYear] = {
          labels: formattedCourses.map((data) => data.abbreviatedCourse),
          datasets: [
            {
              data: formattedCourses.map((data) => data.percentage),
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1,
            },
          ],
          monthName: getMonthName(month),
          year: year,
        };
      });

      console.log("Final formatted data:", formattedMonthlyData);

      setMonthlyAttendanceData(formattedMonthlyData);

      // Set the most recent month as selected
      const months = Object.keys(formattedMonthlyData);
      if (months.length > 0) {
        setSelectedMonth(months[months.length - 1]);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMonthName = (monthNumber) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  
    return months[monthNumber - 1] || "Unknown";
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleChartType = () => {
    const currentIndex = chartTypes.findIndex(
      (type) => type.type === chartType
    );
    const nextIndex = (currentIndex + 1) % chartTypes.length;
    setChartType(chartTypes[nextIndex].type);
  };

  const renderMonthSelector = () => {
    const months = Object.keys(monthlyAttendanceData);

    if (months.length === 0) {
      return (
        <div className="month-selector">
          <p className="month-selector-label">No attendance data available</p>
        </div>
      );
    }

    return (
      <div className="month-selector">
        <p className="month-selector-label">Select Month:</p>
        <div className="month-buttons-container">
          {months.map((month) => {
            // Ensure we have valid month data
            const monthData = monthlyAttendanceData[month];
            const monthName = monthData?.monthName || "Unknown";
            const year = monthData?.year || "";

            return (
              <button
                key={month}
                className={`month-button ${
                  selectedMonth === month ? "selected-month-button" : ""
                }`}
                onClick={() => setSelectedMonth(month)}
              >
                {monthName} {year}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
    plugins: {
      legend: {
        display:
          chartType === "pie" ||
          chartType === "doughnut" ||
          chartType === "polarArea",
        position: "right",
        labels: {
          color: "#fff",
          font: {
            size: 12,
          },
          generateLabels: function (chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                return {
                  text: `${label}: ${Math.round(value)}%`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: 1,
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        padding: 10,
        cornerRadius: 5,
        callbacks: {
          label: function (context) {
            return `Attendance: ${Math.round(context.raw)}%`;
          },
        },
      },
    },
    scales:
      chartType !== "pie" &&
      chartType !== "doughnut" &&
      chartType !== "polarArea"
        ? {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `${Math.round(value)}%`,
                font: {
                  size: 12,
                  weight: "500",
                },
                color: "#fff",
              },
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
              title: {
                display: true,
                text: "Percentage",
                color: "#fff",
                font: {
                  size: 14,
                  weight: "600",
                },
              },
            },
            x: {
              ticks: {
                font: {
                  size: 12,
                  weight: "500",
                },
                color: "#fff",
              },
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
              title: {
                display: true,
                text: "Courses",
                color: "#fff",
                font: {
                  size: 14,
                  weight: "600",
                },
              },
            },
          }
        : undefined,
    elements: {
      bar: {
        borderRadius: 6,
        borderSkipped: false,
      },
      line: {
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: "#fff",
        pointBorderColor: "rgba(75, 192, 192, 1)",
      },
      arc: {
        borderWidth: 2,
      },
    },
  };

  // Get the current chart type display name and icon
  const currentChartType = chartTypes.find((type) => type.type === chartType);

  // Add this function to render percentage labels for doughnut and pie charts
  const renderPercentageLabels = () => {
    if (
      chartType !== "doughnut" &&
      chartType !== "pie" &&
      chartType !== "polarArea"
    )
      return null;

    if (!selectedMonth || !monthlyAttendanceData[selectedMonth]) return null;

    const data = monthlyAttendanceData[selectedMonth];

    return (
      <div className="percentage-labels">
        {data.labels.map((label, index) => {
          const value = data.datasets[0].data[index];
          const percentage = Math.round(value);

          return (
            <div key={index} className="percentage-label">
              <span
                className="percentage-dot"
                style={{
                  backgroundColor: data.datasets[0].backgroundColor[index],
                }}
              ></span>
              <span className="percentage-text">
                {label}: {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        profileIconRef.current && !profileIconRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="dashboardSidebar">

        <div className="sidebarLink" onClick={() => navigate("/upload-assignment")}>
          <img
            src={assignmentLogo}
            alt="assignment logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Assignment Upload</div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/request-book")}>
          <img
            src={bookLogo}
            alt="book logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Request Book</div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/order-food")}>
          <img
            src={canteenLogo}
            alt="canteen logo"
            style={{ width: "50px", height: "30px", marginLeft: -10 }}
          />
          <div className="sidebarText" style={{ marginLeft: -10 }}>Order Food</div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/my-approvals")}>
          <img
            src={checkedLogo}
            alt="checked logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">My Approvals</div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/results")}>
          <img
            src={resultLogo}
            alt="result logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Result</div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/submit-fee")}>
          <img
            src={submitFee}
            alt="fee submit logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Fee Submit</div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/courses")}>
          <img
            src={coursesLogo}
            alt="courses logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Courses</div>
        </div>

        <div className="sidebarLink" onClick={handleLogout}>
          <img
            src={logOutLogo}
            alt="logout logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Logout</div>
        </div>
      </div>

      <div className="dashboard-container">
        <nav className="studentdashboard-nav">
          <div className="student-nav-logo">
            <h2 className="canteen-heading">Student Dashboard</h2>
          </div>
          <div className="profile-dropdown-container" style={{ marginRight: "10px", marginTop: "10px" }}>
            <div
              className="profile-icon"
              onClick={handleDropdownToggle}
              ref={profileIconRef}
            >
              <img src={profileIcon} alt="Profile Icon" />
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu" ref={dropdownRef}>
                <button onClick={() => navigate("/upload-assignment")}>Upload Assignment</button>
                <button onClick={() => navigate("/request-book")}>Request Book</button>
                <button onClick={() => navigate("/order-food")}>Order Food</button>
                <button onClick={() => navigate("/my-approvals")}>My Approvals</button>
                <button onClick={() => navigate("/results")}>Results</button>
                <button onClick={() => navigate("/courses")}>Courses</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </nav>

        <div className="chart-container">
          <div className="chart-header">
            <h3>Attendance Overview</h3>
            <button className="chart-toggle" onClick={toggleChartType}>
              <span className="chart-toggle-icon">
                {currentChartType?.icon || "📊"}
              </span>
              <span className="chart-toggle-text">
                Switch to{" "}
                {
                  chartTypes[
                    (chartTypes.findIndex((type) => type.type === chartType) +
                      1) %
                      chartTypes.length
                  ].name
                }
              </span>
            </button>
          </div>

          {renderMonthSelector()}

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading attendance data...</p>
            </div>
          ) : selectedMonth && monthlyAttendanceData[selectedMonth] ? (
            <div
              className={`chart-wrapper ${
                chartAnimation ? "chart-animated" : ""
              }`}
              ref={chartRef}
            >
              <div className="chart-background">
                {chartType === "bar" && (
                  <Bar
                    data={monthlyAttendanceData[selectedMonth]}
                    options={chartOptions}
                  />
                )}
                {chartType === "line" && (
                  <Line
                    data={monthlyAttendanceData[selectedMonth]}
                    options={chartOptions}
                  />
                )}
                {chartType === "pie" && (
                  <Pie
                    data={monthlyAttendanceData[selectedMonth]}
                    options={chartOptions}
                  />
                )}
                {chartType === "doughnut" && (
                  <Doughnut
                    data={monthlyAttendanceData[selectedMonth]}
                    options={chartOptions}
                  />
                )}
                {chartType === "polarArea" && (
                  <PolarArea
                    data={monthlyAttendanceData[selectedMonth]}
                    options={chartOptions}
                  />
                )}
              </div>
              {renderPercentageLabels()}
            </div>
          ) : (
            <div className="error-container">
              <p className="error-text">No attendance data available</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
