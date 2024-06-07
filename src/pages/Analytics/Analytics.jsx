import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Chart from "react-apexcharts";
import { useNavigate, useParams } from "react-router-dom";
import { HomeOutlined, LogoutOutlined } from "@mui/icons-material";

function Analytics() {
  const { id } = useParams();

  const [sampleData, setsampleData] = useState([]);

  const fetchData = async () => {
    const jwtToken = localStorage.getItem("token");
    const response = await fetch(`${import.meta.env.VITE_API_URL}/url/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setsampleData(data.analytics);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const prepareAccessHistoryChartData = (data) => {
    const accessCounts = {};
  
    data.forEach((entry) => {
      const timestamp = new Date(entry.timestamp);
      const hour = new Date(
        timestamp.getFullYear(),
        timestamp.getMonth(),
        timestamp.getDate(),
        timestamp.getHours()
      );
  
      if (!accessCounts[hour]) {
        accessCounts[hour] = 0;
      }
  
      accessCounts[hour] += 1;
    });
  
    let seriesData = Object.keys(accessCounts).map((timestamp) => ({
      x: new Date(timestamp),
      y: accessCounts[timestamp],
    }));
  
    // Sort series data by timestamp
    seriesData = seriesData.sort((a, b) => new Date(a.x) - new Date(b.x));
  
    // Calculate the maximum y value
    const maxY = Math.max(...seriesData.map(d => d.y));
    // Set the y-axis max to be slightly higher than the maximum y value
    const yAxisMax = Math.ceil(maxY * 1.1);
  
    return {
      series: [
        {
          name: "users",
          data: seriesData,
        },
      ],
      options: {
        chart: {
          type: "line",
          height: 350,
        },
        xaxis: {
          type: "datetime",
          labels: {
            format: "dd MMM HH:mm",
          },
        },
        yaxis: {
          labels: {
            formatter: (value) => Math.floor(value), // Ensure labels are whole numbers
          },
          tickAmount: yAxisMax,
          max: yAxisMax // Ensure the y-axis max value is slightly higher than the maximum data value
        },
        title: {
          text: "Access History",
        },
      },
    };
  };
  
  const prepareUserDistributionChartData = (data) => {
    const deviceCounts = { Mobile: 0, Desktop: 0, Unique: new Set() };
  
    data.forEach((entry) => {
      deviceCounts[entry.deviceType] += 1;
      deviceCounts.Unique.add(entry.ipaddress);
    });
  
    const seriesData = [
      { x: "Mobile", y: deviceCounts.Mobile },
      { x: "Desktop", y: deviceCounts.Desktop },
      { x: "Unique Users", y: deviceCounts.Unique.size },
    ];
  
    // Calculate the maximum y value
    const maxY = Math.max(...seriesData.map(d => d.y));
    // Set the y-axis max to be slightly higher than the maximum y value
    const yAxisMax = Math.ceil(maxY * 1.1);
  
    return {
      series: [
        {
          name: "User Count",
          data: seriesData,
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 350,
        },
        xaxis: {
          type: "category",
        },
        yaxis: {
          labels: {
            formatter: (value) => Math.floor(value), // Ensure labels are whole numbers
          },
          tickAmount: yAxisMax,
          max: yAxisMax // Ensure the y-axis max value is slightly higher than the maximum data value
        },
        title: {
          text: "User Distribution",
        },
      },
    };
  };
  
  const accessHistoryData = prepareAccessHistoryChartData(sampleData);


  const userDistributionData = prepareUserDistributionChartData(sampleData);
  function formatTimestamp(timestamp) {
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

    const dateObj = new Date(timestamp);
    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight
    const formattedTime =
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0") +
      " " +
      ampm;

    return `${day} ${month} ${year} @ ${formattedTime}`;
  }

  const navigate = useNavigate();

  const back = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 5, marginBottom: 5 }}>
      <Box
        display={"flex"}
        marginBottom={5}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <IconButton onClick={() => back()} color="primary" size="small">
          <HomeOutlined />
        </IconButton>
        <Typography variant="h3">Analytics</Typography>
        <div></div>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Chart
              options={accessHistoryData.options}
              series={accessHistoryData.series}
              type="line"
              height={350}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Chart
              options={userDistributionData.options}
              series={userDistributionData.series}
              type="bar"
              height={350}
            />
          </Paper>
        </Grid>
      </Grid>
      <TableContainer
        component={Paper}
        sx={{ marginTop: 2, borderRadius: 2, overflowX: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: "nowrap" }}>
                <Typography fontWeight={700}>Sno.</Typography>
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>
                <Typography fontWeight={700}>IP Address</Typography>
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>
                <Typography fontWeight={700}>Timestamp</Typography>
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>
                <Typography fontWeight={700}>Device Type</Typography>
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>
                <Typography fontWeight={700}>Source</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleData.map((log, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{log.ipaddress}</TableCell>
                <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                <TableCell>{log.deviceType}</TableCell>
                <TableCell>{log.referer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Analytics;
