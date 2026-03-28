-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.project_challenges (
  project_id uuid NOT NULL,
  overview text NOT NULL,
  timeline_days integer NOT NULL,
  contribution text,
  role_summary text,
  CONSTRAINT project_challenges_pkey PRIMARY KEY (project_id),
  CONSTRAINT project_challenges_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.project_contributors (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  project_id uuid,
  name text NOT NULL,
  role text NOT NULL,
  CONSTRAINT project_contributors_pkey PRIMARY KEY (id),
  CONSTRAINT project_contributors_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.project_deck_images (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  project_id uuid,
  image_url text NOT NULL,
  order_index integer NOT NULL,
  CONSTRAINT project_deck_images_pkey PRIMARY KEY (id),
  CONSTRAINT project_deck_images_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.project_impacts (
  project_id uuid NOT NULL,
  results text NOT NULL,
  impact_image_url text,
  CONSTRAINT project_impacts_pkey PRIMARY KEY (project_id),
  CONSTRAINT project_impacts_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.project_problems (
  project_id uuid NOT NULL,
  user_needs text NOT NULL,
  constraints text NOT NULL,
  internal_factor text NOT NULL,
  external_factor text NOT NULL,
  problem_statement text NOT NULL,
  CONSTRAINT project_problems_pkey PRIMARY KEY (project_id),
  CONSTRAINT project_problems_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.project_solutions (
  project_id uuid NOT NULL,
  description text,
  CONSTRAINT project_solutions_pkey PRIMARY KEY (project_id),
  CONSTRAINT project_solutions_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text CHECK (category = ANY (ARRAY['app'::text, 'web'::text])),
  check_app_url text,
  type text NOT NULL CHECK (type = ANY (ARRAY['solo'::text, 'team'::text])),
  thumbnail_url text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);
CREATE TABLE public.solution_deliverables (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  project_id uuid,
  item text NOT NULL,
  order_index integer NOT NULL,
  CONSTRAINT solution_deliverables_pkey PRIMARY KEY (id),
  CONSTRAINT solution_deliverables_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.solution_images (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  project_id uuid,
  image_url text NOT NULL,
  order_index integer NOT NULL,
  CONSTRAINT solution_images_pkey PRIMARY KEY (id),
  CONSTRAINT solution_images_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.solution_key_decisions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  project_id uuid,
  item text NOT NULL,
  order_index integer NOT NULL,
  CONSTRAINT solution_key_decisions_pkey PRIMARY KEY (id),
  CONSTRAINT solution_key_decisions_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.solution_process (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  project_id uuid,
  item text NOT NULL,
  order_index integer NOT NULL,
  CONSTRAINT solution_process_pkey PRIMARY KEY (id),
  CONSTRAINT solution_process_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
-- Seeding Data for BinSight Project
DO $$
DECLARE
    v_project_id uuid := gen_random_uuid();
BEGIN
    -- 1. Project
    INSERT INTO public.projects (id, title, slug, category, check_app_url, type, thumbnail_url)
    VALUES (
        v_project_id,
        'BinSight',
        'binsight',
      'app',
      NULL,
        'team',
        '/images/binsight-thumbnail.jpg'
    );

    -- 2. Project Challenges
    INSERT INTO public.project_challenges (project_id, overview, timeline_days, contribution, role_summary)
    VALUES (
        v_project_id,
        'BinSight is an iOS image classification app that uses CreateML to identify types of waste and suggest the correct disposal method. Built for commuters, it solves the problem of limited time and knowledge when sorting trash, making proper waste disposal fast and effortless.',
        14,
        'As the project manager, I created and maintained the project backlog, ensured timely task completion, documented each step of the process thoroughly, and most importantly, ensured all project requirements were successfully met.',
        'Project Manager'
    );

    -- 3. Project Problems
    INSERT INTO public.project_problems (project_id, user_needs, constraints, internal_factor, external_factor, problem_statement)
    VALUES (
        v_project_id,
        'An app that can identify their trash category',
        'Low knowledge and effort of Indonesian society and time pressure during commute',
        'Lack of knowledge specifically on tech and machine learning topics',
        'Inconsistent and unclear bin labelling and similar app that offer the same services',
        '“I find it incredibly frustrating how much knowledge and effort it takes to sort my trash properly, often feeling like I’m failing to do my part to “reduce, reuse, recycle””'
    );

    -- 4. Project Solutions
    INSERT INTO public.project_solutions (project_id, description)
    VALUES (
        v_project_id,
        'iOS image classification app using CreateML to identify waste types and suggest the proper disposal method.'
    );

    -- 5. Project Impacts
    INSERT INTO public.project_impacts (project_id, results, impact_image_url)
    VALUES (
        v_project_id,
        'Achieved 94% precision and recall, and an F1 score of 0.93, validating the model''s high reliability. Designed a user interface that reached a 100% acceptance rate in post-test surveys during usability testing with target users.',
        NULL
    );

    -- 6. Project Contributors
    INSERT INTO public.project_contributors (project_id, name, role) VALUES
    (v_project_id, 'Gustavo', 'Project Manager'),
    (v_project_id, 'Jessica', 'UI/UX Designer'),
    (v_project_id, 'Abim', 'iOS Developer'),
    (v_project_id, 'Zikar', 'iOS Developer'),
    (v_project_id, 'Imo', 'iOS Developer');

    -- 7. Solution Process
    INSERT INTO public.solution_process (project_id, item, order_index) VALUES
    (v_project_id, 'Team Ideation', 1),
    (v_project_id, 'Research', 2),
    (v_project_id, 'User Interview', 3),
    (v_project_id, 'User-centered Design', 4),
    (v_project_id, 'Iterative Testing', 5);

    -- 8. Solution Key Decisions
    INSERT INTO public.solution_key_decisions (project_id, item, order_index) VALUES
    (v_project_id, 'Implementation of image segmentation', 1),
    (v_project_id, 'Implementation of dataset merging and augmentation', 2),
    (v_project_id, 'Redesign the ineffective page (redundant)', 3);

    -- 9. Solution Deliverables
    INSERT INTO public.solution_deliverables (project_id, item, order_index) VALUES
    (v_project_id, 'User Persona', 1),
    (v_project_id, 'User Flow', 2),
    (v_project_id, 'Low Fidelity Wireframe', 3),
    (v_project_id, 'High Fidelity Mockup', 4),
    (v_project_id, 'Interview Analysis Report', 5),
    (v_project_id, 'Dataset Analysis', 6);

END $$;
