import React, { useState } from "react";
import ResultPage from "./ResultPage";
import Plot from "react-plotly.js";
import Papa from "papaparse";

import {
  Button,
  Container,
  TextField,
  Card,
  Typography,
  AppBar,
  Toolbar
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "./styles.css";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(5)
  },
  card: {
    padding: theme.spacing(3),
    animation: "$fadeIn 0.5s"
  },
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  header: {
    marginBottom: theme.spacing(3)
  },
  inputGroup: {
    marginBottom: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.spacing(2),
    flexDirection: "column",
    width: "100%"
  },
  inputPair: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2)
  },
  input: {
    marginRight: theme.spacing(3),
    marginBottom: theme.spacing(3),
    minWidth: 180
  },
  fileInput: {
    display: "none"
  },
  fileLabel: {
    display: "inline-block",
    padding: theme.spacing(1, 2),
    marginBottom: theme.spacing(4),
    cursor: "pointer",
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#",
    color: theme.palette.primary.dark,
    fontFamily: "Open Sans, sans-serif",
    transition: "background-color 0.2s, color 0.2s",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.light
    }
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing(2),
    gap: theme.spacing(2)
  },
  appBar: {
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
}));

const Prototype = () => {
  const classes = useStyles();
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [, setCsvFile] = useState(null);
  const [maxX, setMaxX] = useState("");
  const [minX, setMinX] = useState("");
  const [maxY, setMaxY] = useState("");
  const [minY, setMinY] = useState("");
  const [maxZ, setMaxZ] = useState("");
  const [minZ, setMinZ] = useState("");

  const [csvData, setCsvData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        const data = result.data;
        setCsvData(data);

        const chartLabels = data.map((entry) => entry.KP);
        const chartData = data.map((entry) => entry.X);

        setChartData({
          x: chartLabels,
          y: chartData,
          type: "scatter",
          mode: "lines+markers",
          line: { color: "rgba(75, 192, 192, 1)" }
        });
      }
    });
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const contents = event.target.result;
        const lines = contents.split("\n");
        if (lines.length > 1) {
          const dataRows = lines.slice(1);
          let xValues = [];
          let yValues = [];
          let zValues = [];

          dataRows.forEach((row) => {
            const columns = row.split(",");
            if (columns.length >= 4) {
              const x = parseFloat(columns[1]);
              const y = parseFloat(columns[2]);
              const z = parseFloat(columns[3]);
              xValues.push(x);
              yValues.push(y);
              zValues.push(z);
            }
          });

          const maxXValue = Math.max(...xValues);
          const minXValue = Math.min(...xValues);
          const maxYValue = Math.max(...yValues);
          const minYValue = Math.min(...yValues);
          const maxZValue = Math.max(...zValues);
          const minZValue = Math.min(...zValues);

          setMaxX(maxXValue);
          setMinX(minXValue);
          setMaxY(maxYValue);
          setMinY(minYValue);
          setMaxZ(maxZValue);
          setMinZ(minZValue);
        }
      };
      reader.readAsText(file);
      setCsvFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const formData = {
    projectName,
    maxX,
    minX,
    maxY,
    minY,
    maxZ,
    minZ
  };

  return (
    <div>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6">XYZ Engine</Typography>
        </Toolbar>
      </AppBar>
      <Container className={classes.container}>
        <Card className={`${classes.card} animated fadeIn`}>
          {step === 1 && (
            <div>
              <Typography variant="h6" className={classes.header}>
                Step 1: Basic Information
              </Typography>
              <TextField
                label="Project Name"
                variant="outlined"
                fullWidth
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={classes.inputGroup}
              />

              <div className={classes.buttonGroup}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setStep(2)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="animated fadeIn">
              <Typography variant="h6" className={classes.header}>
                Step 2: CSV File Upload and Min-Max Values
              </Typography>
              <Typography variant="body1" className={classes.header}>
                Project Name: {projectName}
              </Typography>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className={classes.fileInput}
                id="csvFileInput"
              />
              <label htmlFor="csvFileInput" className={classes.fileLabel}>
                Choose CSV File
              </label>

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "45px"
                }}
              >
                {chartData && (
                  <Plot
                    data={[chartData]}
                    layout={{
                      width: "100%",
                      height: "60vh",
                      xaxis: { title: "KP" },
                      yaxis: { title: "X" }
                    }}
                    style={{ margin: "auto" }}
                  />
                )}
              </div>

              <div className={classes.inputGroup}>
                <div className={classes.inputPair}>
                  <TextField
                    label="Max X"
                    variant="outlined"
                    value={maxX}
                    onChange={(e) => setMaxX(e.target.value)}
                    className={classes.input}
                    fullWidth
                  />
                  <TextField
                    label="Min X"
                    variant="outlined"
                    value={minX}
                    onChange={(e) => setMinX(e.target.value)}
                    className={classes.input}
                    fullWidth
                  />
                </div>
                <div className={classes.inputPair}>
                  <TextField
                    label="Max Y"
                    variant="outlined"
                    value={maxY}
                    onChange={(e) => setMaxY(e.target.value)}
                    className={classes.input}
                  />
                  <TextField
                    label="Min Y"
                    variant="outlined"
                    value={minY}
                    onChange={(e) => setMinY(e.target.value)}
                    className={classes.input}
                  />
                </div>
                <div className={classes.inputPair}>
                  <TextField
                    label="Max Z"
                    variant="outlined"
                    value={maxZ}
                    onChange={(e) => setMaxZ(e.target.value)}
                    className={classes.input}
                  />
                  <TextField
                    label="Min Z"
                    variant="outlined"
                    value={minZ}
                    onChange={(e) => setMinZ(e.target.value)}
                    className={classes.input}
                  />
                </div>
              </div>
              <div className={classes.buttonGroup}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  {step === 2 ? "View Table" : ""}
                </Button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="animated fadeIn">
              <ResultPage formData={formData} />
            </div>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default Prototype;
