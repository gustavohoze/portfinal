# Portfolio Database Schema & Query Requirements

This document outlines the data structure for the portfolio website based on the `database.sql` schema, and specifically details the types of data that need to be queried to populate the frontend components.

## 1. Core Models

### `projects`
The central table for all case studies.
- `id` (uuid)
- `title` (text) — The name of the project
- `slug` (text) — Used for URL routing (e.g., `/work/binsight`)
- `type` (text) — Categorization, strictly either `'solo'` or `'team'`
- `thumbnail_url` (text) — Displayed on the main Work dashboard

---

## 2. Project Detail Relations (1-to-1)
These tables expand on a specific project using `project_id` as the primary key. When fetching a specific project, you will need to join these rows.

### `project_challenges`
- `overview` (text)
- `timeline_days` (integer)
- `contribution` (text)
- `role_summary` (text)

### `project_problems`
- `user_needs` (text)
- `constraints` (text)
- `internal_factor` (text)
- `external_factor` (text)
- `problem_statement` (text)

### `project_solutions`
- `description` (text) — High-level summary of the solution

### `project_impacts`
- `results` (text)
- `impact_image_url` (text) — Optional hero image for the results section

---

## 3. Project Detail Collections (1-to-Many)
These tables store lists of items belonging to a project. When queried, they MUST be sorted by `order_index` to ensure the portfolio displays them in the correct sequence.

### `project_contributors`
- `name` (text)
- `role` (text)

### `solution_deliverables`
- `item` (text)

### `solution_key_decisions`
- `item` (text)

### `solution_process`
- `item` (text)

### `solution_images`
- `image_url` (text) — Feature images demonstrating the solution/UI

### `project_deck_images`
- `image_url` (text) — Carousel/deck images at the bottom of the case study

---

## Required Application Queries

### 1. Fetch All Projects (For the `/work` Dashboard)
**Data Needed:** 
- `id`, `title`, `slug`, `type`, `thumbnail_url`
**Purpose:** Renders the 2-column project grid. Requires filtering capabilities based on `type` (Web/App, Solo/Team).

### 2. Fetch Deep Project Details (For the `/work/[slug]` Page)
**Data Needed:** 
A single joined query (or multiple parallel queries) fetching:
- The base `project` matching the URL `slug`
- The 1-to-1 relations: `project_challenges`, `project_problems`, `project_solutions`, `project_impacts`
- The 1-to-Many collections (ordered by `order_index` ASC):
  - `project_contributors`
  - `solution_deliverables`
  - `solution_key_decisions`
  - `solution_process`
  - `solution_images`
  - `project_deck_images`

**Purpose:** Fully populates the exhaustive case study page without requiring secondary loading states.
