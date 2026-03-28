"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import ProjectCard from "@/components/work/ProjectCard";
import { Database } from "@/types/database";
import styles from "./ProjectDashboard.module.css";

type Project = Database["public"]["Tables"]["projects"]["Row"];

interface Props {
  initialProjects: Project[];
}

export default function ProjectDashboard({ initialProjects }: Props) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<"all" | "web" | "app">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredProjects = initialProjects
    .filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());


      // Prefer explicit category from DB; keep heuristic fallback for older rows.
      const normalizedCategory = p.category?.toLowerCase();
      const isApp =
        normalizedCategory === "app" ||
        (!normalizedCategory &&
          (p.title.toLowerCase().includes("app") || p.slug.toLowerCase().includes("app")));
      const isWeb = !isApp;

      let matchesFilter = true;
      if (filterCategory === "web") matchesFilter = isWeb;
      if (filterCategory === "app") matchesFilter = isApp;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const aUrl = a.check_app_url?.toLowerCase() ?? "";
      const bUrl = b.check_app_url?.toLowerCase() ?? "";
      const aIsRelease = aUrl.includes("appstore") || aUrl.includes("apps.apple.com");
      const bIsRelease = bUrl.includes("appstore") || bUrl.includes("apps.apple.com");

      if (aIsRelease === bIsRelease) return 0;
      return aIsRelease ? -1 : 1;
    });

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterCategory]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('[data-reveal]');
    
    // Reset cards to hidden state before animating (handles filter changes smoothly)
    gsap.set(cards, { opacity: 0, y: 32 });
    
    // Stagger entrance
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: "power3.out",
    });
  }, [paginatedProjects, currentPage]);

  return (
    <div className={styles.page}>
      <div className="container">
        
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.headline}>Work</h1>
          <p className={styles.sub}>
            A selection of projects — design, engineering, and everything in between.
          </p>
        </header>

        {/* Sticky Toolbar */}
        <div className={styles.toolbarWrapper}>
          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="Search projects..." 
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className={styles.segment}>
              {(["all", "web", "app"] as const).map((type) => (
                <button
                  key={type}
                  className={`${styles.segmentBtn} ${filterCategory === type ? styles.active : ""}`}
                  onClick={() => setFilterCategory(type)}
                >
                  <span className={styles.segmentText}>{type}</span>
                  {filterCategory === type && <span className={styles.segmentBg} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filteredProjects.length === 0 ? (
          <p className={styles.empty}>No projects match your search.</p>
        ) : (
          <>
            <div ref={gridRef} className={styles.grid}>
              {paginatedProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Prev
                </button>
                <div className={styles.pageNumbers}>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      className={`${styles.pageNum} ${currentPage === i + 1 ? styles.activePage : ""}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  className={styles.pageBtn}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
