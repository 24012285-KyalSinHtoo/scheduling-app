//Kaden

const request = require("supertest");

describe("C270 Task App – Automated Tests", () => {
  // Utility: reload app to reset in-memory tasks
  const loadFreshApp = () => {
    jest.resetModules();
    const app = require("../app");
    return app;
  };


  // PAGE LOAD TESTS — Kaden
  //Kaden – Load Add Task page
  test("GET /add should load Add Task page", async () => {
    const app = loadFreshApp();
    const res = await request(app).get("/add");
    expect(res.statusCode).toBe(200);
  });

  //Kaden – Load Edit Task page
  test("GET /edit/1 should load Edit Task page", async () => {
    const app = loadFreshApp();
    const res = await request(app).get("/edit/1");
    expect(res.statusCode).toBe(200);
  });

  //Kaden – Load Task List page
  test("GET /tasks should load Task List page", async () => {
    const app = loadFreshApp();
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
  });

  //Kaden – Load Calendar View page
  test("GET /calendar should load Calendar View page", async () => {
    const app = loadFreshApp();
    const res = await request(app).get("/calendar");
    expect(res.statusCode).toBe(200);
  });

  
  // CRUD FUNCTIONALITY — Kaden
  //Kaden – Create task (POST)
  test("POST /add should create a new task and redirect", async () => {
    const app = loadFreshApp();

    const res = await request(app)
      .post("/add")
      .type("form")
      .send({
        name: "Test Task",
        priority: "High",
        due: "2026-01-20",
      });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/");
  });

  //Kaden – Delete task (GET)
  test("GET /delete/:id should delete task and redirect", async () => {
    const app = loadFreshApp();

    // Create a task first (default tasks are id 1 & 2, so this becomes id 3)
    await request(app)
      .post("/add")
      .type("form")
      .send({
        name: "Delete Me",
        priority: "Low",
        due: "2026-01-22",
      });

    const res = await request(app).get("/delete/3");

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/");
  });

  //Kaden – Update task (POST)
  test("POST /edit/1 should update a task and redirect", async () => {
    const app = loadFreshApp();

    const res = await request(app)
      .post("/edit/1")
      .type("form")
      .send({
        name: "Updated Task Name",
        priority: "Medium",
        due: "2026-01-25",
      });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/");
  });

    //Kaden – Toggle task completion
  test("GET /complete/1 should toggle completion and redirect", async () => {
    const app = loadFreshApp();
    const res = await request(app).get("/complete/1");

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/");
  });


    //Kaden – Search bar functionality
  test("GET /?search=gro should filter tasks by name", async () => {
    const app = loadFreshApp();
    const res = await request(app).get("/?search=gro");

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Buy groceries");
  });
  


  
  // EXTRA FUNCTIONALITY — Kyal
  //Kyal – Invalid route handling
  test("GET /this-route-does-not-exist should return 404", async () => {
    const app = loadFreshApp();
    const res = await request(app).get("/this-route-does-not-exist");

    expect(res.statusCode).toBe(404);
  });

  //Kyal – Priority sorting (High should appear before Low in the table)
  test("GET / should display High-priority tasks before Low-priority tasks", async () => {
    const app = loadFreshApp();

    // Add a Low-priority task so the test is meaningful
    await request(app)
      .post("/add")
      .type("form")
      .send({
        name: "Low Task Z",
        priority: "Low",
        due: "2026-01-30",
      });

    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);

    // Compare task NAME positions (more reliable than searching the word 'High'/'Low')
    const highTaskIndex = res.text.indexOf("Buy groceries"); // default High task
    const lowTaskIndex = res.text.indexOf("Low Task Z");     // newly added Low task

    expect(highTaskIndex).not.toBe(-1);
    expect(lowTaskIndex).not.toBe(-1);
    expect(highTaskIndex).toBeLessThan(lowTaskIndex);
  });
});
