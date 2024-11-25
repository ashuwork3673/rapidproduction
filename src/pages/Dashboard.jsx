import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import "chart.js/auto";
import "../app/globals.css";
import "../styles/dashboard.css";
import dayjs from "dayjs";
import Sidebar from "@/Component/Sidebar";

// Dynamic import of charts with SSR disabled
const BarChart = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Bar),
  { ssr: false }
);
const PieChart = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Pie),
  { ssr: false }
);

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/form");
        if (!res.headers.get("content-type")?.includes("application/json")) {
          throw new Error("Invalid JSON response");
        }
        const data = await res.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching form data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const years = Array.from(
    new Set(formData.map((form) => dayjs(form.pickup_date).year()))
  );

  const filteredData = formData.filter((form) => {
    const formMonth = dayjs(form.pickup_date).month();
    const formYear = dayjs(form.pickup_date).year();

    const monthMatches =
      selectedMonth === "All" || formMonth === parseInt(selectedMonth);
    const yearMatches =
      selectedYear === "All" || formYear === parseInt(selectedYear);

    return monthMatches && yearMatches;
  });

  const makeModelData = (() => {
    const groupedData = filteredData.reduce((acc, form) => {
      const key = `${form.make} ${form.model}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const sortedData = Object.entries(groupedData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    const labels = sortedData.map(([key]) => key);
    const data = sortedData.map(([, value]) => value);

    const colors = labels.map(() => {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgba(${r}, ${g}, ${b}, 0.6)`;
    });

    return {
      labels,
      datasets: [
        {
          label: "Shipments",
          data,
          backgroundColor: colors,
        },
      ],
    };
  })();

  const transportMethodData = (() => {
    const labels = [
      ...new Set(filteredData.map((form) => form.transport_method)),
    ];
    const data = labels.map(
      (method) =>
        filteredData.filter((form) => form.transport_method === method).length
    );
    const colors = labels.map(() => {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgba(${r}, ${g}, ${b}, 0.6)`;
    });

    return {
      labels,
      datasets: [
        {
          label: "Transport Method",
          data,
          backgroundColor: colors,
        },
      ],
    };
  })();

  const vehicleTypeData = {
    labels: ["Running", "Not Running"],
    datasets: [
      {
        label: "Vehicle Type",
        data: [
          filteredData.filter((form) => form.vehicle_type === "Running").length,
          filteredData.filter((form) => form.vehicle_type === "Not Running")
            .length,
        ],
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(255, 159, 64, 0.6)"],
      },
    ],
  };

  const routeData = (() => {
    const groupedData = filteredData.reduce((acc, form) => {
      const shipFrom = form.ship_form
        ? form.ship_form.replace(", USA", "").trim()
        : "Unknown";
      const shipTo = form.ship_to
        ? form.ship_to.replace(", USA", "").trim()
        : "Unknown";

      const key = `${shipFrom} → ${shipTo}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const sortedData = Object.entries(groupedData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    const labels = sortedData.map(([key]) => key);
    const data = sortedData.map(([, value]) => value);

    const colors = labels.map(() => {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgba(${r}, ${g}, ${b}, 0.6)`;
    });

    return {
      labels,
      datasets: [
        {
          label: "Routes",
          data,
          backgroundColor: colors,
        },
      ],
    };
  })();

  if (isLoading) return <div>Loading...</div>;

  return (
    
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      <Sidebar />
      {/* Sidebar */}

      {/* Main content */}
      <div className="flex-1 p-4 sm:p-6 mt-14">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          Dashboard Analytics
        </h1>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row sm:space-x-4">
          <div>
            <label className="text-lg font-semibold mr-2">Select Month:</label>
            <select
              className="border border-gray-300 rounded p-2 w-full sm:w-auto"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="All">All</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {dayjs().month(i).format("MMMM")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-lg font-semibold mr-2">Select Year:</label>
            <select
              className="border border-gray-300 rounded p-2 w-full sm:w-auto"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="All">All</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Graphs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div className="bg-white shadow-lg p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">
              Car Shipments by Make and Model
            </h2>
            {filteredData.length > 0 && <BarChart data={makeModelData} />}
          </div>

          <div className="bg-white shadow-lg p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">
              Transport Method Distribution
            </h2>
            {filteredData.length > 0 && <PieChart data={transportMethodData} />}
          </div>

          <div className="bg-white shadow-lg p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">
              Vehicle Type: Running vs. Not Running
            </h2>
            {filteredData.length > 0 && <PieChart data={vehicleTypeData} />}
          </div>

          <div className="bg-white shadow-lg p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Top Routes</h2>
            {filteredData.length > 0 && <BarChart data={routeData} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
