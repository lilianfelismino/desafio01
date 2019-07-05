const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let numReq = 0;

function checkProjectExists(req, res, next) {
  const { id } = req.params.id;
  const project = projects.find(p => p.id === id);
  if (!project) {
    return res.status(400).json({ error: "Project does not exist." });
  }
  return next();
}

function logNumReq(req, res, next) {
  numReq++;
  console.log(`NumReq = ${numReq}`);
  return next();
}

server.get("/projects", logNumReq, (req, res) => {
  return res.json(projects);
});

server.post("/projects", logNumReq, (req, res) => {
  const { id, title } = req.body;
  const project = { id, title, tasks: [] };
  projects.push(project);
  return res.json(project);
});

server.put("/projects/:id", logNumReq, checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);
  project.title = title;
  return res.json(project);
});

server.delete("/projects/:id", logNumReq, checkProjectExists, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(p => p.id === id);

  projects.splice(index, 1);

  return res.send();
});

server.post(
  "/projects/:id/tasks",
  logNumReq,
  checkProjectExists,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const project = projects.find(p => p.id === id);
    const task = project.tasks;

    task.push(title);

    return res.json(project);
  }
);

server.listen(3000);
