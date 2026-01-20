# Scheduling / To-Do List App with CI/CD for DevOps
## App Name Ideas
- TimeKeeper
- TaskTide

# Task delegation
Team lead - KYAL
Backend Features KYAL & ALICIA
Frontend & UI Integration KYAL & ALICIA
Test Cases & Automation KADEN (using Git Actions)
CI/CD (Jenkins Automation) HAAD (using Jenkins)
Containerisation & Orchestration INDRA & KEIFER (using Docker swarm)

## Application Overview
This is a scheduling application designed to help users manage tasks efficiently. It is developed using Express.js and EJS templates, and demonstrates the use of CI/CD practices in DevOps workflows.

## Features
- Image Carosell in homepage index.ejs (ADDED..kind of only one image) #Kyal
- Task creation, editing, and deletion (ADDED) #KYAL
- Priority markers (High / Medium / Low) with sorting (ADDED) #KYAL
- Calendar view for task scheduling (ADDED) #KYAL
- Daily task view (tasks due today)#Alicia
- Task search functionality (ADDED) #KYAL
- Task filter function (ADDED) #KYAL
- Nav Bar (ADDED) #KYAL
- Overdue tasks section #KYAL
- Alarm / reminder for overdue or incomplete tasks #Alicia
- Mark completed tasks as completed with a tick (ADDED) #Alicia

- A making account feature? (optional)
- Reoccuring tasks markers (optional)
- Adding comments when adding tasks, being able to view the comments when you click on the task (optional)
- An extra filer by school,work etc (optional)
- Task streaks or points system (optional)
- Progress bar for the day (optional)
- Account personalisation (Colour Theme etc) or pfp if i add accounts function
- Dark Mode (optional)

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


### NOTE : PUT NAME FOR PARTS WE DID EACH and aldo write task delegation here
