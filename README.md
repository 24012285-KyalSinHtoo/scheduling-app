# Scheduling / To-Do List App with CI/CD for DevOps
## App Name Ideas
- TimeKeeper
- TaskTide

## Application Overview
This is a scheduling application designed to help users manage tasks efficiently. It is developed using Express.js and EJS templates, and demonstrates the use of CI/CD practices in DevOps workflows.

## Core Features
- Task creation, editing, and deletion
- Priority markers (High / Medium / Low) with sorting
- Alarm / reminder for overdue or incomplete tasks (Not yet)
- Calendar view for task scheduling (optional extension)
- Daily task view (tasks due today)
- Task search functionality
- Task filter function

## CI/CD Overview
- **Tools Used:** GitHub Actions, Jenkins (optional), Docker, Kubernetes / Docker Swarm, GitHub Copilot
- **Pipeline Flow:**
  1. Developer pushes code to GitHub
  2. CI pipeline is triggered
  3. Dependencies are installed
  4. Automated tests are executed
  5. Build is created only if all tests pass
  6. Docker image is generated
  7. Application is deployed using orchestration

## AI-Augmented Tool Usage
- GitHub Copilot assists with:
  - Suggesting test cases
  - Generating boilerplate code
  - Reducing syntax and logic errors
- Accelerates development and supports continuous integration

## Scalability, Availability, and Security
- **Scalability:** Multiple Docker containers; orchestration handles load
- **Availability:** Failed containers automatically restarted
- **Security:** Only tested code is merged; branch protection enabled; credentials stored securely

## Team Roles & Skills
- **Backend Developer:** Implements task logic and alarm functionality
- **Frontend Developer:** Designs task views, priority indicators, and calendar UI


## Strategy
- Features divided based on expertise
- All code changes must pass CI checks before merging
- Regular pull request reviews ensure code quality
- Encourages collaboration, accountability, and reduces merge conflicts

## Project Files
### `views/` Folder
Contains EJS templates for rendering pages:

- **`index.ejs`** – Main dashboard showing task list with edit/delete links
- **`addTask.ejs`** – Form to add a new task
- **`editTask.ejs`** – Form to edit an existing task
- **`taskList.ejs`** – Optional page listing all tasks
- **(Optional)** `partials/` – Could contain shared header/footer templates

### `public/` Folder (optional)
- Place for static files such as CSS, client-side JS, and images

