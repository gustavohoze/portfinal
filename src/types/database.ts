export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          category: "app" | "web" | null;
          check_app_url: string | null;
          type: "solo" | "team";
          thumbnail_url: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: any;
        Update: any;
      };
      project_challenges: {
        Row: {
          project_id: string;
          overview: string;
          timeline_days: number;
          contribution: string | null;
          role_summary: string | null;
        };
      };
      project_contributors: {
        Row: {
          id: string;
          project_id: string | null;
          name: string;
          role: string;
        };
      };
      project_deck_images: {
        Row: {
          id: string;
          project_id: string | null;
          image_url: string;
          order_index: number;
        };
      };
      project_impacts: {
        Row: {
          project_id: string;
          results: string;
          impact_image_url: string | null;
        };
      };
      project_problems: {
        Row: {
          project_id: string;
          user_needs: string;
          constraints: string;
          internal_factor: string;
          external_factor: string;
          problem_statement: string;
        };
      };
      project_solutions: {
        Row: {
          project_id: string;
          description: string | null;
        };
      };
      solution_deliverables: {
        Row: {
          id: string;
          project_id: string | null;
          item: string;
          order_index: number;
        };
      };
      solution_images: {
        Row: {
          id: string;
          project_id: string | null;
          image_url: string;
          order_index: number;
        };
      };
      solution_key_decisions: {
        Row: {
          id: string;
          project_id: string | null;
          item: string;
          order_index: number;
        };
      };
      solution_process: {
        Row: {
          id: string;
          project_id: string | null;
          item: string;
          order_index: number;
        };
      };
    };
  };
}

export type Project = Database["public"]["Tables"]["projects"]["Row"];

export type ProjectDetail = Project & {
  challenge: Database["public"]["Tables"]["project_challenges"]["Row"] | null;
  problem: Database["public"]["Tables"]["project_problems"]["Row"] | null;
  solution: Database["public"]["Tables"]["project_solutions"]["Row"] | null;
  impact: Database["public"]["Tables"]["project_impacts"]["Row"] | null;
  contributors: Database["public"]["Tables"]["project_contributors"]["Row"][];
  deck_images: Database["public"]["Tables"]["project_deck_images"]["Row"][];
  solution_deliverables: Database["public"]["Tables"]["solution_deliverables"]["Row"][];
  solution_images: Database["public"]["Tables"]["solution_images"]["Row"][];
  solution_key_decisions: Database["public"]["Tables"]["solution_key_decisions"]["Row"][];
  solution_process: Database["public"]["Tables"]["solution_process"]["Row"][];
};

export type ProjectChallenge = Database["public"]["Tables"]["project_challenges"]["Row"];
export type ProjectContributor = Database["public"]["Tables"]["project_contributors"]["Row"];
export type ProjectDeckImage = Database["public"]["Tables"]["project_deck_images"]["Row"];
export type ProjectImpact = Database["public"]["Tables"]["project_impacts"]["Row"];
export type ProjectProblem = Database["public"]["Tables"]["project_problems"]["Row"];
export type ProjectSolution = Database["public"]["Tables"]["project_solutions"]["Row"];
export type SolutionDeliverable = Database["public"]["Tables"]["solution_deliverables"]["Row"];
export type SolutionImage = Database["public"]["Tables"]["solution_images"]["Row"];
export type SolutionKeyDecision = Database["public"]["Tables"]["solution_key_decisions"]["Row"];
export type SolutionProcess = Database["public"]["Tables"]["solution_process"]["Row"];
