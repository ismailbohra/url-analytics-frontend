import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  Tooltip,
} from "@mui/material";
import {
  Analytics,
  CopyAll,
  Delete,
  LogoutOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Home = ({ setOpen, setMsg }) => {
  const [longUrl, setLongUrl] = useState("");
  const [purpose, setPurpose] = useState("");
  const [alias, setAlias] = useState("");
  const [urls, setUrls] = useState([]);

  const fetchUrls = async () => {
    const jwtToken = localStorage.getItem("token");
    const response = await fetch(`${import.meta.env.VITE_API_URL}/url/all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setUrls(data.url);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    const jwtToken = localStorage.getItem("token");
    if (!jwtToken) {
      navigate("/login");
    }
    fetchUrls();
  }, []);

  const generateShortUrl = async () => {
    if (longUrl && purpose && alias) {
      const jwtToken = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ url: longUrl, purpose, alias }),
      });
      if (response.ok) {
        fetchUrls();
        setMsg("Created Successfully");
        setOpen(true);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("URL copied to clipboard");
    });
  };

  const deleteRow = async (id) => {
    const jwtToken = localStorage.getItem("token");
    const response = await fetch(`${import.meta.env.VITE_API_URL}/url/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    if (response.ok) {
      fetchUrls();
      setMsg("Deleted Successfully");
      setOpen(true);
    }
  };
  const handleAnalytics = (id) => navigate(`/analytics/${id}`);
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background:
          "linear-gradient(45deg, #003366, #004080, #0059b3, #0073e6)",
        paddingInline: 2,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          padding: 3,
          boxShadow: 3,
        }}
      >
        <Box sx={{ marginBottom: 4 }}>
          <Box
            display={"flex"}
            alignItems={"center"}
            marginBottom={4}
            justifyContent={"space-between"}
          >
            <IconButton onClick={() => logout()} color="primary" size="small">
              <LogoutOutlined sx={{ transform: "rotate(180deg)" }} />
            </IconButton>
            <Typography variant="h4" margin={0} component="h1" gutterBottom>
              Create URL
            </Typography>
            <div></div>
          </Box>
          <Grid container spacing={2} component="form">
            <Grid item xs={12}>
              <TextField
                type="url"
                size="small"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="Place Your URL here"
                label="Long URL"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                size="small"
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Purpose"
                label="Purpose"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                size="small"
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Alias"
                label="Alias"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={generateShortUrl}
              >
                Generate
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Container maxWidth="md" sx={{ padding: `0 !important` }}>
        <TableContainer
          component={Paper}
          sx={{ marginTop: 2, borderRadius: 2, overflowX: "auto" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Typography fontWeight={700}>URL</Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" , textAlign:"center"}}>
                  <Typography fontWeight={700}>Purpose</Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" , textAlign:"center"}}>
                  <Typography fontWeight={700}>Total Clicks</Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" , textAlign:"center"}}>
                  <Typography fontWeight={700}>Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {urls.map((url, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Typography>{url.alias}</Typography>
                    <Box display={"flex"} alignItems={"center"}>
                      <Tooltip title={url.shortUrl}>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`${import.meta.env.VITE_API_URL}/${
                            url.shortId
                          }`}
                          style={{
                            display: "inline-block",
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {`${import.meta.env.VITE_API_URL}/${url.shortId}`}
                        </a>
                      </Tooltip>
                      <IconButton
                        onClick={() =>
                          copyToClipboard(
                            `${import.meta.env.VITE_API_URL}/${url.shortId}`
                          )
                        }
                        color="primary"
                        size="small"
                      >
                        <CopyAll />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" , textAlign:"center"}}>
                    {url.purpose}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" , textAlign:"center"}}>
                    {url.history.length}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" , textAlign:"center"}}>
                    <IconButton
                      onClick={() => deleteRow(url._id)}
                      color="secondary"
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      onClick={() => handleAnalytics(url._id)}
                      color="warning"
                    >
                      <Analytics />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default Home;
