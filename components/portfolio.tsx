"use client";

import { useEffect, useRef, useState } from "react";
import {
  achievements,
  experiences,
  profile,
  projects,
  skillGroups,
  type Project,
} from "../data/portfolio";
import FluidCanvas from "./fluid-canvas";

function Orb() {
  const orb = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const update = (event: PointerEvent) => {
      if (!orb.current) return;

      const x = (event.clientX / window.innerWidth - 0.5) * 44;
      const y = (event.clientY / window.innerHeight - 0.5) * 38;

      orb.current.style.setProperty("--orb-x", `${x}px`);
      orb.current.style.setProperty("--orb-y", `${y}px`);
    };

    window.addEventListener("pointermove", update, { passive: true });

    return () => window.removeEventListener("pointermove", update);
  }, []);

  return (
    <div className="orb-stage" aria-hidden="true">
      <div ref={orb} className="orb">
        <i />
        <b />
        <em />
        <span />
      </div>
    </div>
  );
}

function ProjectVisual({ project }: { project: Project }) {
  return (
    <div
      className={`project-visual ${project.tone}`}
      aria-hidden="true"
    >
      <div className="visual-grid" />

      <div className="visual-window">
        <div className="window-top">
          <span />
          <span />
          <span />
          <code>{project.id.toUpperCase()} / INTERFACE</code>
        </div>

        <div className="window-body">
          <div className="side-lines" />

          <div className="radar">
            <i />
            <i />
            <i />
            <b />
          </div>

          <div className="graph">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
  const [active, setActive] = useState("home");
  const [visibleSkills, setVisibleSkills] = useState<number[]>([]);

  useEffect(() => {
    const sections = [
      ...document.querySelectorAll<HTMLElement>("section[id]"),
    ];

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (entry) =>
            entry.isIntersecting && setActive(entry.target.id)
        ),
      {
        rootMargin: "-42% 0px -52%",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
      }
    };

    window.addEventListener("keydown", close);

    return () => window.removeEventListener("keydown", close);
  }, []);

  useEffect(() => {
    const reveals = Array.from(
      document.querySelectorAll<HTMLElement>(".scroll-reveal")
    );

    const skillCards = Array.from(
      document.querySelectorAll<HTMLElement>(".skill-card")
    );

    const projectCards = Array.from(
      document.querySelectorAll<HTMLElement>(".project-card")
    );

    skillCards.forEach((el, index) => {
      el.style.setProperty(
        "--item-index",
        String(index % 5)
      );
    });

    projectCards.forEach((el, index) => {
      el.style.setProperty(
        "--item-index",
        String(index % 5)
      );
    });

    /*
     * SECTION REVEAL
     */
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    reveals.forEach((element) => {
      revealObserver.observe(element);
    });

    /*
     * SKILL CARD REVEAL
     *
     * Visibility is controlled through React state so that
     * clicking/expanding a card cannot remove .in-view.
     */
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const index = skillCards.indexOf(
            entry.target as HTMLElement
          );

          if (index !== -1) {
            setVisibleSkills((current) =>
              current.includes(index)
                ? current
                : [...current, index]
            );
          }

          skillObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0,
        rootMargin: "0px 0px 15% 0px",
      }
    );

    skillCards.forEach((element) => {
      skillObserver.observe(element);
    });

    /*
     * PROJECT CARD REVEAL
     */
    const projectObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("in-view");
          projectObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0,
        rootMargin: "0px 0px 15% 0px",
      }
    );

    projectCards.forEach((element) => {
      projectObserver.observe(element);
    });

    /*
     * INITIAL VISIBILITY CHECK
     *
     * Handles elements that are already near the viewport
     * before IntersectionObserver fires.
     */
    const revealAlreadyVisible = () => {
      const viewportHeight = window.innerHeight;

      reveals.forEach((element) => {
        const rect = element.getBoundingClientRect();

        if (
          rect.top < viewportHeight * 0.92 &&
          rect.bottom > 0
        ) {
          element.classList.add("is-revealed");
          revealObserver.unobserve(element);
        }
      });

      skillCards.forEach((element, index) => {
        const rect = element.getBoundingClientRect();

        if (
          rect.top < viewportHeight * 0.95 &&
          rect.bottom > 0
        ) {
          setVisibleSkills((current) =>
            current.includes(index)
              ? current
              : [...current, index]
          );

          skillObserver.unobserve(element);
        }
      });

      projectCards.forEach((element) => {
        const rect = element.getBoundingClientRect();

        if (
          rect.top < viewportHeight * 0.95 &&
          rect.bottom > 0
        ) {
          element.classList.add("in-view");
          projectObserver.unobserve(element);
        }
      });
    };

    const initialCheck = window.setTimeout(() => {
      revealAlreadyVisible();
    }, 120);

    /*
     * SCROLL / RESIZE FALLBACK
     */
    let ticking = false;

    const handleViewportChange = () => {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        revealAlreadyVisible();
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleViewportChange, {
      passive: true,
    });

    window.addEventListener("resize", handleViewportChange, {
      passive: true,
    });

    return () => {
      revealObserver.disconnect();
      skillObserver.disconnect();
      projectObserver.disconnect();

      window.removeEventListener(
        "scroll",
        handleViewportChange
      );

      window.removeEventListener(
        "resize",
        handleViewportChange
      );

      window.clearTimeout(initialCheck);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (media.matches) return;
    if (document.querySelector(".cursor-ring")) return;

    const ring = document.createElement("div");
    const dot = document.createElement("div");

    ring.className = "cursor-ring";
    dot.className = "cursor-dot";

    ring.setAttribute("aria-hidden", "true");
    dot.setAttribute("aria-hidden", "true");

    document.body.appendChild(ring);
    document.body.appendChild(dot);

    document.documentElement.classList.add("custom-cursor");

    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;

    let dx = rx;
    let dy = ry;

    let raf = 0;

    const interactiveSelector =
      'a, button, [role="button"], .skill-card, .project-card, .timeline-item, input, textarea, select, label';

    const onMove = (e: PointerEvent) => {
      dx = e.clientX;
      dy = e.clientY;

      dot.style.transform =
        `translate3d(${dx}px, ${dy}px, 0)`;

      const target = e.target as HTMLElement | null;
      const interactive =
        target?.closest(interactiveSelector);

      ring.classList.toggle(
        "is-hover",
        !!interactive
      );
    };

    const tick = () => {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;

      ring.style.transform =
        `translate3d(${rx}px, ${ry}px, 0)`;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, {
      passive: true,
    });

    const onDown = () =>
      ring.classList.add("is-down");

    const onUp = () =>
      ring.classList.remove("is-down");

    window.addEventListener("pointerdown", onDown, {
      passive: true,
    });

    window.addEventListener("pointerup", onUp, {
      passive: true,
    });

    return () => {
      cancelAnimationFrame(raf);

      window.removeEventListener(
        "pointermove",
        onMove
      );

      window.removeEventListener(
        "pointerdown",
        onDown
      );

      window.removeEventListener(
        "pointerup",
        onUp
      );

      document.documentElement.classList.remove(
        "custom-cursor"
      );

      if (ring.parentNode) {
        ring.parentNode.removeChild(ring);
      }

      if (dot.parentNode) {
        dot.parentNode.removeChild(dot);
      }
    };
  }, []);

  return (
    <>
      <FluidCanvas />

      <div
        className="atmosphere"
        aria-hidden="true"
      />

      <header className="nav shell">
        <a className="brand" href="#home">
          RG<span>.</span>
        </a>

        <nav aria-label="Primary navigation">
          {[
            "home",
            "about",
            "education",
            "work",
            "experience",
            "contact",
          ].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className={
                active === item
                  ? "is-active"
                  : ""
              }
            >
              {item}
            </a>
          ))}
        </nav>

        <a
          className="system-status"
          href="#contact"
        >
          <i />
          AVAILABLE
        </a>
      </header>

      <main className="shell">
        <section id="home" className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              {profile.role}
              <span>{"//"}</span>
              AI INTEGRATION
            </p>

            <h1>
              {profile.headline
                .split("\n")
                .map((line, index) => (
                  <span
                    key={line}
                    className={
                      index === 1
                        ? "accent-word"
                        : ""
                    }
                  >
                    {line}
                  </span>
                ))}
            </h1>

            <p className="hero-summary">
              {profile.summary}
            </p>

            <div className="hero-actions">
              <a
                href="#work"
                className="button primary"
              >
                EXPLORE WORK <b>→</b>
              </a>

              <a
                href={`mailto:${profile.email}`}
                className="button ghost"
              >
                START A CONVERSATION
              </a>
            </div>
          </div>

          <Orb />

          <a
            className="scroll-cue"
            href="#about"
          >
            SCROLL TO EXPLORE <span>↓</span>
          </a>
        </section>

        <section
          id="about"
          className="about section-grid scroll-reveal"
        >
          <div className="section-intro">
            <p className="eyebrow">
              01 // IDENTIFY
            </p>

            <h2>
              The mind behind the machine.
            </h2>
          </div>

          <div className="about-body">
            <p className="lead">
              I translate complex logic into
              useful, reliable software—building
              from the API layer to interfaces
              people can trust.
            </p>

            <p>
              {profile.summary} My work spans
              AI-assisted products, real-time
              computer vision, and the backend
              systems that make experiences
              deployable.
            </p>

            <div className="principles">
              <article>
                <span>⌘</span>

                <h3>System thinking</h3>

                <p>
                  Well-structured APIs, sound
                  data models, and clear
                  interfaces that hold up under
                  real use.
                </p>
              </article>

              <article>
                <span>◌</span>

                <h3>Applied intelligence</h3>

                <p>
                  AI and computer vision applied
                  where they create practical,
                  understandable value.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section
          id="education"
          className="education scroll-reveal"
        >
          <div className="section-heading">
            <p className="eyebrow">
              02 // ACADEMIC RECORD
            </p>

            <h2>Educational journey</h2>
          </div>

          <div className="section-grid">
            <div className="section-intro">
              <p className="eyebrow">
                ABES INSTITUTE OF TECHNOLOGY
              </p>

              <h2>
                Building the foundation behind the systems.
              </h2>
            </div>

            <div className="about-body">
              <p className="lead">
                B.Tech in Computer Science and Engineering
              </p>

              <p>
                July 2022 - Present{" "}
                <span aria-hidden="true">•</span>{" "}
                Ghaziabad
              </p>

              <div className="achievement-row">
                <span>
                  FINAL CGPA <strong>8.30</strong>
                </span>

                <span>8 SEMESTERS</span>

                <span>
                  PEAK SGPA <strong>9.25</strong>
                </span>
              </div>
            </div>
          </div>

          <div
            className="principles education-semesters"
            aria-label="Semester performance"
          >
            {[
              ["1st Semester", "8.23"],
              ["2nd Semester", "8.86"],
              ["3rd Semester", "7.96"],
              ["4th Semester", "8.17"],
              ["5th Semester", "8.17"],
              ["6th Semester", "7.76"],
              ["7th Semester", "8.32"],
              ["8th Semester", "9.25"],
            ].map(([semester, sgpa], index) => (
              <article
                key={semester}
                className="scroll-reveal"
                style={{
                  transitionDelay: `${Math.min(index, 7) * 55}ms`,
                }}
              >
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3>{semester}</h3>

                <p>
                  SGPA <strong>{sgpa}</strong>
                </p>
              </article>
            ))}
          </div>

          <div className="section-grid education-school">
            <div className="section-intro">
              <p className="eyebrow">
                SCHOOLING
              </p>

              <h2>Angels Public School</h2>
            </div>

            <div className="about-body">
              <div className="principles">
                <article
                  className="scroll-reveal"
                  style={{ transitionDelay: "80ms" }}
                >
                  <p className="eyebrow">
                    2022 <span>{"//"}</span> DELHI
                  </p>

                  <h3>
                    Intermediate (12th Class - PCM)
                  </h3>

                  <p className="lead">
                    Percentage: 86.4%
                  </p>
                </article>

                <article
                  className="scroll-reveal"
                  style={{ transitionDelay: "160ms" }}
                >
                  <p className="eyebrow">
                    2020 <span>{"//"}</span> DELHI
                  </p>

                  <h3>
                    Senior Secondary (10th Class - PCM)
                  </h3>

                  <p className="lead">
                    Percentage: 80%
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section
          id="skills"
          className="skills scroll-reveal"
        >
          <div className="section-heading">
            <p className="eyebrow">
              03 // CAPABILITY MATRIX
            </p>

            <h2>Technical stack</h2>
          </div>

          <div className="skill-grid">
            {skillGroups.map((group, index) => {
              const isExpanded =
                selectedSkill === index;

              const isVisible =
                visibleSkills.includes(index);

              return (
                <button
                  className={`skill-card ${
                    isVisible
                      ? "in-view"
                      : ""
                  } ${
                    isExpanded
                      ? "is-expanded"
                      : ""
                  }`}
                  key={group.title}
                  onClick={() =>
                    setSelectedSkill(
                      isExpanded
                        ? null
                        : index
                    )
                  }
                  aria-expanded={isExpanded}
                >
                  <div>
                    <h3>{group.title}</h3>
                    <span>{group.index}</span>
                  </div>

                  <p className="skill-level">
                    {group.level}
                    <b>+</b>
                  </p>

                  <ul>
                    {group.skills.map(
                      (skill) => (
                        <li key={skill}>
                          {skill}
                        </li>
                      )
                    )}
                  </ul>

                  <div className="skill-detail flex flex-col gap-4">
                    <p>
                      {group.summary}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <div>
                        <strong className="mt-1">
                          USED IN
                        </strong>
                      </div>

                      <div>
                        {group.projects.map(
                          (project) => (
                            <span key={project}>
                              {project}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section
          id="work"
          className="work scroll-reveal"
        >
          <div className="section-heading">
            <p className="eyebrow">
              04 // DEPLOYMENTS
            </p>

            <h2>Featured systems</h2>
          </div>

          <div className="project-list">
            {projects.map((project) => (
              <article
                className="project-card"
                key={project.id}
              >
                <ProjectVisual
                  project={project}
                />

                <div className="project-content">
                  <div className="project-meta">
                    <span>
                      {project.period}
                    </span>

                    <strong
                      className={project.tone}
                    >
                      {project.status}
                    </strong>
                  </div>

                  <h3>{project.title}</h3>

                  <p>
                    {project.description}
                  </p>

                  <button
                    className="text-button"
                    onClick={() =>
                      setSelected(project)
                    }
                  >
                    VIEW SCHEMATICS{" "}
                    <b>↗</b>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="experience"
          className="experience scroll-reveal"
        >
          <div className="section-heading">
            <p className="eyebrow">
              05 // TRAJECTORY
            </p>

            <h2>Career evolution</h2>
          </div>

          <div className="timeline">
            {experiences.map(
              (item, index) => (
                <article
                  className="timeline-item"
                  key={item.organization}
                >
                  <div className="timeline-marker" />

                  <div
                    className={
                      index % 2
                        ? "timeline-copy right"
                        : "timeline-copy"
                    }
                  >
                    <p>{item.period}</p>

                    <h3>{item.role}</h3>

                    <h4>
                      {item.organization}
                    </h4>

                    <span>
                      {item.description}
                    </span>
                  </div>
                </article>
              )
            )}
          </div>

          <div className="achievement-row">
            {achievements.map(
              (achievement) => (
                <span key={achievement}>
                  {achievement}
                </span>
              )
            )}
          </div>
        </section>

        <section
          id="contact"
          className="contact scroll-reveal"
        >
          <p className="eyebrow">
            06 // ESTABLISH CONNECTION
          </p>

          <h2>
            Have an idea
            <br />
            <span>worth building?</span>
          </h2>

          <p>
            Open to collaborating on thoughtful
            products, scalable systems, and
            applied AI experiences.
          </p>

          <a
            className="button primary contact-button"
            href={`mailto:${profile.email}`}
          >
            INITIATE CONTACT <b>↗</b>
          </a>

          <div className="contact-details">
            <a
              href={`mailto:${profile.email}`}
            >
              {profile.email}
            </a>

            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              GITHUB
            </a>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LINKEDIN
            </a>

            <span>
              {profile.location}
            </span>
          </div>
        </section>
      </main>

      <footer>
        <a className="brand" href="#home">
          RG<span>.</span>
        </a>

        <p>
          © 2026 RISHIKESH GUPTA — ENGINEERED
          WITH INTENT
        </p>
      </footer>

      {selected && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() =>
            setSelected(null)
          }
        >
          <section
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <button
              className="modal-close"
              onClick={() =>
                setSelected(null)
              }
              aria-label="Close project detail"
            >
              ×
            </button>

            <p className="eyebrow">
              {selected.period}
              <span>{"//"}</span>
              {selected.status}
            </p>

            <h2 id="modal-title">
              {selected.title}
            </h2>

            <p className="modal-description">
              {selected.description}
            </p>

            <div className="modal-columns">
              <div>
                <h3>Capabilities</h3>

                <ul>
                  {selected.features.map(
                    (feature) => (
                      <li key={feature}>
                        {feature}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h3>Stack</h3>

                <div className="modal-tags">
                  {selected.technologies.map(
                    (technology) => (
                      <span key={technology}>
                        {technology}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="modal-links">
              {selected.github && (
                <a
                  className="button ghost"
                  href={selected.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  VIEW CODE ↗
                </a>
              )}

              {selected.live && (
                <a
                  className="button primary"
                  href={selected.live}
                  target="_blank"
                  rel="noreferrer"
                >
                  LIVE PROJECT ↗
                </a>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
