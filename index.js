const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8082;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const TODOIST_API_TOKEN = process.env.TODOIST_API_TOKEN;

if (!TODOIST_API_TOKEN) {
  console.error(
    "FATAL ERROR: TODOIST_API_TOKEN environment variable is not set.",
  );
  process.exit(1);
}

app.get("/api/priority", async (req, res) => {
  try {
    const { project_id } = req.query;
    if (!project_id)
      return res
        .status(400)
        .json({ message: "Error: proect_id query parameter is required." });

    const targetApiUrl = `https://api.todoist.com/api/v1/tasks?project_id=${project_id}`;

    const apiHeaders = {
      Authorization: `Bearer ${TODOIST_API_TOKEN}`,
    };

    console.log(`Forwarding request to: ${targetApiUrl}`);

    const apiResponse = await axios.get(targetApiUrl, { headers: apiHeaders });

    const tasks = apiResponse.data.results;

    if (!Array.isArray(tasks)) {
      console.error("Api did not return an array. Response:", tasks);
      throw new Error("Unexpected response format from Todoist API.");
    }

    tasks.sort((a, b) => b.priority - a.priority);
    res.set({
      "Widget-Title": "Todoist",
      "Widget-Content-Type": "html",
    });
    res.render("tasks", { tasks: tasks });
  } catch (error) {
    console.error("Error proxying the request:", error.message);
    if (error.response) {
      console.error("Error Data:", error.response.data);
      console.error("Error Status:", error.response.status);
    }

    res.status(error.response?.status || 500).json({
      message: "Failed to proxy request to Todoist API",
      error: error.message,
    });
  }
});

app.get("/api/date", async (req, res) => {
  try {
    const { project_id } = req.query;
    if (!project_id)
      return res
        .status(400)
        .json({ message: "Error: proect_id query parameter is required." });

    const targetApiUrl = `https://api.todoist.com/api/v1/tasks?project_id=${project_id}`;

    const apiHeaders = {
      Authorization: `Bearer ${TODOIST_API_TOKEN}`,
    };

    console.log(`Forwarding request to: ${targetApiUrl}`);

    const apiResponse = await axios.get(targetApiUrl, { headers: apiHeaders });

    const tasks = apiResponse.data.results;

    if (!Array.isArray(tasks)) {
      console.error("Api did not return an array. Response:", tasks);
      throw new Error("Unexpected response format from Todoist API.");
    }

    tasks.sort((a, b) => {
      if (!a.due) return 1;
      if (!b.due) return -1;

      const dateA = new Date(a.due.datetime || a.due.date);
      const dateB = new Date(b.due.datetime || b.due.date);

      return dateA - dateB;
    });

    res.set({
      "Widget-Title": "Todoist",
      "Widget-Content-Type": "html",
    });
    res.render("tasks", { tasks: tasks });
  } catch (error) {
    console.error("Error proxying the request:", error.message);
    if (error.response) {
      console.error("Error Data:", error.response.data);
      console.error("Error Status:", error.response.status);
    }

    res.status(error.response?.status || 500).json({
      message: "Failed to proxy request to Todoist API",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send(
    "API Todoist Server is running. Try accessing /api/priority or /api/date",
  );
});

app.post("/api/tasks/:id/close", async (req, res) => {
  try {
    const taskId = req.params.id;

    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required." });
    }

    const targetApiUrl = `https://api.todoist.com/api/v1/tasks/${taskId}/close`;
    const apiHeaders = { Authorization: `Bearer ${TODOIST_API_TOKEN}` };

    console.log(`Closing task ${taskId}...`);

    await axios.post(targetApiUrl, null, { headers: apiHeaders });
    res.status(200).json({ message: "Task closed successfully." });
  } catch (error) {
    console.error("Error closing task:", error.message);
    res
      .status(error.response?.status || 500)
      .json({ message: "Failed to close task." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
