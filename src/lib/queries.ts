import { createClient } from "@/lib/supabase/server";
import type { Project, ProjectDetail } from "@/types/database";

const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith("http") &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getAllProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return data ?? [];
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !project) return null;

  const [
    { data: challenge },
    { data: problem },
    { data: solution },
    { data: impact },
    { data: contributors },
    { data: deck_images },
    { data: solution_deliverables },
    { data: solution_images },
    { data: solution_key_decisions },
    { data: solution_process },
  ] = await Promise.all([
    supabase.from("project_challenges").select("*").eq("project_id", project.id).single(),
    supabase.from("project_problems").select("*").eq("project_id", project.id).single(),
    supabase.from("project_solutions").select("*").eq("project_id", project.id).single(),
    supabase.from("project_impacts").select("*").eq("project_id", project.id).single(),
    supabase.from("project_contributors").select("*").eq("project_id", project.id),
    supabase
      .from("project_deck_images")
      .select("*")
      .eq("project_id", project.id)
      .order("order_index"),
    supabase
      .from("solution_deliverables")
      .select("*")
      .eq("project_id", project.id)
      .order("order_index"),
    supabase
      .from("solution_images")
      .select("*")
      .eq("project_id", project.id)
      .order("order_index"),
    supabase
      .from("solution_key_decisions")
      .select("*")
      .eq("project_id", project.id)
      .order("order_index"),
    supabase
      .from("solution_process")
      .select("*")
      .eq("project_id", project.id)
      .order("order_index"),
  ]);

  return {
    ...project,
    challenge: challenge ?? null,
    problem: problem ?? null,
    solution: solution ?? null,
    impact: impact ?? null,
    contributors: contributors ?? [],
    deck_images: deck_images ?? [],
    solution_deliverables: solution_deliverables ?? [],
    solution_images: solution_images ?? [],
    solution_key_decisions: solution_key_decisions ?? [],
    solution_process: solution_process ?? [],
  };
}

// This must use the bare supabase-js client (no cookies) because
// generateStaticParams runs at BUILD TIME with no HTTP request context.
export async function getAllProjectSlugs(): Promise<string[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url?.startsWith("http") || !key) return [];

  const { createClient: createStaticClient } = await import("@supabase/supabase-js");
  const supabase = createStaticClient(url, key);
  const { data } = await supabase.from("projects").select("slug");
  return data?.map((p: { slug: string }) => p.slug) ?? [];
}

export async function getAdjacentProjects(slug: string): Promise<{
  prev: Pick<Project, "slug" | "title" | "thumbnail_url"> | null;
  next: Pick<Project, "slug" | "title" | "thumbnail_url"> | null;
}> {
  if (!isSupabaseConfigured) return { prev: null, next: null };
  const supabase = await createClient();

  const { data } = await supabase
    .from("projects")
    .select("slug, title, thumbnail_url")
    .order("created_at", { ascending: false });

  if (!data || data.length === 0) return { prev: null, next: null };

  const idx = data.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };

  return {
    prev: idx > 0 ? data[idx - 1] : null,
    next: idx < data.length - 1 ? data[idx + 1] : null,
  };
}
