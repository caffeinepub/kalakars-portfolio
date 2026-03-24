import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Skill {
  label: string;
  emoji: string;
  category: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const SKILLS: Skill[] = [
  // Languages
  { label: "Python", emoji: "🐍", category: "Languages" },
  { label: "C++", emoji: "⚙️", category: "Languages" },
  { label: "Java", emoji: "☕", category: "Languages" },
  { label: "JavaScript", emoji: "🟨", category: "Languages" },
  { label: "TypeScript", emoji: "🔷", category: "Languages" },
  { label: "Go", emoji: "🐹", category: "Languages" },
  { label: "Rust", emoji: "🦀", category: "Languages" },
  // Web
  { label: "React", emoji: "⚛️", category: "Web" },
  { label: "Node.js", emoji: "🟢", category: "Web" },
  { label: "HTML/CSS", emoji: "🎨", category: "Web" },
  { label: "Next.js", emoji: "▲", category: "Web" },
  { label: "Express", emoji: "🚀", category: "Web" },
  // Databases
  { label: "PostgreSQL", emoji: "🐘", category: "Databases" },
  { label: "MongoDB", emoji: "🍃", category: "Databases" },
  { label: "Redis", emoji: "🔴", category: "Databases" },
  { label: "MySQL", emoji: "🗄️", category: "Databases" },
  // Cloud / DevOps
  { label: "AWS", emoji: "☁️", category: "Cloud & DevOps" },
  { label: "Docker", emoji: "🐳", category: "Cloud & DevOps" },
  { label: "Kubernetes", emoji: "⎈", category: "Cloud & DevOps" },
  { label: "Git", emoji: "🌿", category: "Cloud & DevOps" },
  { label: "Linux", emoji: "🐧", category: "Cloud & DevOps" },
  { label: "CI/CD", emoji: "🔄", category: "Cloud & DevOps" },
  // ML / AI
  { label: "TensorFlow", emoji: "🧠", category: "ML & AI" },
  { label: "PyTorch", emoji: "🔥", category: "ML & AI" },
  { label: "Scikit-learn", emoji: "📊", category: "ML & AI" },
  { label: "NumPy", emoji: "🔢", category: "ML & AI" },
  { label: "Pandas", emoji: "🐼", category: "ML & AI" },
  // CS Fundamentals
  { label: "DSA", emoji: "🌲", category: "CS Fundamentals" },
  { label: "OS", emoji: "💻", category: "CS Fundamentals" },
  { label: "DBMS", emoji: "📦", category: "CS Fundamentals" },
  { label: "Computer Networks", emoji: "🌐", category: "CS Fundamentals" },
  { label: "System Design", emoji: "🏗️", category: "CS Fundamentals" },
  { label: "Algorithms", emoji: "♟️", category: "CS Fundamentals" },
];

const SKILL_CATEGORIES = Array.from(new Set(SKILLS.map((s) => s.category)));

// ─── Starfield Canvas ─────────────────────────────────────────────────────────

function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const stars: {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
    }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      resize();
      stars.length = 0;
      const count = Math.floor((canvas.width * canvas.height) / 6000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.2 + 0.3,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          alpha: Math.random() * 0.6 + 0.2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };

    init();
    draw();

    const ro = new ResizeObserver(init);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="starfield"
      className="absolute inset-0 w-full h-full"
    />
  );
}

// ─── Section wrapper with scroll reveal ──────────────────────────────────────

function RevealSection({
  children,
  className = "",
  delay = 0,
}: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Bento Tile ───────────────────────────────────────────────────────────────

function BentoTile({
  children,
  className = "",
  hover = true,
}: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <motion.div
      className={`glass-tile glow-border rounded-3xl p-6 relative overflow-hidden ${className}`}
      whileHover={
        hover
          ? {
              scale: 1.015,
              boxShadow:
                "0 8px 40px rgba(10,132,255,0.12), 0 0 60px rgba(139,92,246,0.08)",
            }
          : {}
      }
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {children}
    </motion.div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <motion.nav
        className="glass-nav rounded-full px-5 py-3 flex items-center gap-4 w-full max-w-3xl"
        animate={{
          backgroundColor: scrolled
            ? "rgba(15,17,21,0.85)"
            : "rgba(26,28,34,0.70)",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo */}
        <span className="text-base font-black tracking-[0.18em] text-white uppercase flex-shrink-0">
          KALAKARS
        </span>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              data-ocid={`nav.${link.label.toLowerCase()}.link`}
              className="px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-[#A3A8B3] hover:text-white transition-colors duration-200 cursor-pointer rounded-full hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <motion.a
          href="#contact"
          data-ocid="nav.contact.button"
          className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest text-white cursor-pointer flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(10,132,255,0.9), rgba(139,92,246,0.9))",
          }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 20px rgba(10,132,255,0.4)",
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        >
          Get In Touch
        </motion.a>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden ml-auto p-1.5 text-[#A3A8B3] hover:text-white cursor-pointer"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          data-ocid="nav.menu.toggle"
        >
          <div className="space-y-1.5">
            <span
              className={`block w-5 h-0.5 bg-current transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-current transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>
      </motion.nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="glass-nav absolute top-full mt-2 left-4 right-4 rounded-2xl p-4 flex flex-col gap-1"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-medium uppercase tracking-widest text-[#A3A8B3] hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                window.location.href = "#contact";
              }}
              className="mt-2 px-4 py-2.5 text-sm font-semibold uppercase tracking-widest text-white rounded-xl text-center cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, rgba(10,132,255,0.9), rgba(139,92,246,0.9))",
              }}
            >
              Get In Touch
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #1a1f2e 0%, #0F1115 70%)",
      }}
    >
      <StarfieldCanvas />
      {/* Vignette */}
      <div className="absolute inset-0 vignette z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-4"
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border"
            style={{
              background: "rgba(10,132,255,0.1)",
              borderColor: "rgba(10,132,255,0.3)",
              color: "#0A84FF",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A84FF] animate-pulse" />
            CS Engineering Portfolio
          </motion.span>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-black uppercase tracking-tight leading-none text-white"
            style={{
              fontSize: "clamp(4rem, 14vw, 9rem)",
              letterSpacing: "-0.02em",
            }}
          >
            KALAKARS
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="font-bold leading-tight"
            style={{
              fontSize: "clamp(1.8rem, 5vw, 3.2rem)",
              background: "linear-gradient(135deg, #0A84FF, #8B5CF6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            The Monster Trio.
          </motion.h2>

          {/* Microcopy */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-base md:text-lg max-w-md leading-relaxed tracking-wide"
            style={{ color: "#A3A8B3" }}
          >
            Building tomorrow's tech, one commit at a time.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-4"
          >
            <motion.a
              href="#projects"
              data-ocid="hero.explore_projects.button"
              className="px-8 py-3.5 rounded-full font-semibold text-sm uppercase tracking-widest text-white cursor-pointer relative overflow-hidden"
              style={{
                background: "transparent",
                border: "1.5px solid transparent",
                backgroundImage:
                  "linear-gradient(#0F1115, #0F1115), linear-gradient(135deg, #0A84FF, #8B5CF6)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
                boxShadow:
                  "0 0 24px rgba(10,132,255,0.2), 0 0 48px rgba(139,92,246,0.1)",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 0 32px rgba(10,132,255,0.35), 0 0 60px rgba(139,92,246,0.2)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              Explore Projects
            </motion.a>

            <motion.a
              href="/resume"
              data-ocid="hero.view_resume.link"
              className="px-6 py-3 text-sm font-medium uppercase tracking-widest cursor-pointer rounded-full hover:bg-white/5 transition-colors"
              style={{ color: "#A3A8B3" }}
              whileHover={{ color: "#ffffff" }}
            >
              View Resume →
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: "#A3A8B3" }}
        >
          Scroll
        </span>
        <motion.div
          className="w-px h-8 origin-top"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,132,255,0.8), transparent)",
          }}
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY }}
        />
      </motion.div>
    </section>
  );
}

// ─── Projects Section ─────────────────────────────────────────────────────────

function ProjectCard({ index }: { index: number }) {
  return (
    <motion.div
      className="glass-tile glow-border rounded-3xl overflow-hidden cursor-pointer"
      whileHover={{
        scale: 1.02,
        boxShadow:
          "0 12px 48px rgba(10,132,255,0.14), 0 0 80px rgba(139,92,246,0.08)",
      }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      data-ocid={`projects.item.${index}`}
    >
      {/* Thumbnail placeholder */}
      <div
        className="w-full h-40 relative"
        style={{
          background:
            "linear-gradient(135deg, rgba(10,132,255,0.08), rgba(139,92,246,0.12))",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(10,132,255,0.15)",
              border: "1px solid rgba(10,132,255,0.2)",
            }}
          >
            <span className="text-xl">🚀</span>
          </div>
        </div>
        {/* Decorative lines */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(10,132,255,0.3), rgba(139,92,246,0.3), transparent)",
          }}
        />
      </div>

      <div className="p-5 space-y-3">
        {/* Title placeholder */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1">
            <div
              className="h-4 rounded-full w-3/5"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
            <div
              className="h-3 rounded-full w-4/5"
              style={{ background: "rgba(255,255,255,0.05)" }}
            />
            <div
              className="h-3 rounded-full w-2/5"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
          </div>
          <div
            className="w-8 h-8 rounded-full flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
        </div>

        {/* Tag placeholders */}
        <div className="flex gap-2 flex-wrap">
          {[40, 32, 48].map((w) => (
            <div
              key={w}
              className="h-5 rounded-full"
              style={{
                width: `${w}px`,
                background: "rgba(10,132,255,0.12)",
                border: "1px solid rgba(10,132,255,0.15)",
              }}
            />
          ))}
        </div>

        {/* Future project label */}
        <p
          className="text-xs uppercase tracking-widest"
          style={{ color: "rgba(163,168,179,0.5)" }}
        >
          Project {index} — Coming Soon
        </p>
      </div>
    </motion.div>
  );
}

// ─── Meet the Trio ────────────────────────────────────────────────────────────

const TRIO_MEMBERS: { id: string; name: string | null; bio: string | null }[] =
  [
    {
      id: "member-1",
      name: "YashSaan10",
      bio: "Alias: The Cat — Moves silently, codes precisely.",
    },
    {
      id: "member-2",
      name: "Deev",
      bio: "Alias: The Strongest — Built different, codes harder.",
    },
    {
      id: "member-3",
      name: "Saad",
      bio: "Alias: The Architect — Thinks three steps ahead, ships ten steps ahead.",
    },
  ];

// ─── Skills Section ───────────────────────────────────────────────────────────

function SkillTile({ skill, index }: { skill: Skill; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85, y: 16 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{
        duration: 0.4,
        delay: index * 0.03,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="skill-tile flex flex-col items-center gap-1.5 px-3 py-3 rounded-2xl cursor-default"
      style={{
        background: "rgba(26,28,34,0.8)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      whileHover={{
        scale: 1.06,
        y: -3,
        boxShadow: "0 8px 24px rgba(10,132,255,0.18)",
        borderColor: "rgba(10,132,255,0.3)",
        transition: { type: "spring", stiffness: 500, damping: 22 },
      }}
    >
      <span className="text-xl leading-none">{skill.emoji}</span>
      <span
        className="text-xs font-medium text-center leading-tight"
        style={{ color: "#A3A8B3" }}
      >
        {skill.label}
      </span>
    </motion.div>
  );
}

function SkillsSection() {
  return (
    <section id="skills" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <RevealSection>
          <BentoTile hover={false}>
            <div className="mb-8">
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#0A84FF" }}
              >
                Expertise
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">
                Technical Skills
              </h2>
              <p className="mt-2 text-sm" style={{ color: "#A3A8B3" }}>
                Full-spectrum CS curriculum mastery.
              </p>
            </div>

            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat} className="mb-8 last:mb-0">
                <h3
                  className="text-xs font-semibold uppercase tracking-widest mb-4 pb-2"
                  style={{
                    color: "rgba(163,168,179,0.7)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {cat}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {SKILLS.filter((s) => s.category === cat).map((skill, i) => (
                    <SkillTile key={skill.label} skill={skill} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </BentoTile>
        </RevealSection>
      </div>
    </section>
  );
}

// ─── Contact Footer ───────────────────────────────────────────────────────────

const CONTACT_LINKS = [
  {
    label: "GitHub",
    emoji: "🐙",
    href: "#",
    placeholder: "github.com/kalakars",
  },
  {
    label: "LinkedIn",
    emoji: "💼",
    href: "#",
    placeholder: "linkedin.com/in/kalakars",
  },
  { label: "Email", emoji: "✉️", href: "#", placeholder: "hello@kalakars.dev" },
  { label: "Twitter / X", emoji: "𝕏", href: "#", placeholder: "@kalakars" },
];

function ContactFooter() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <RevealSection>
          <BentoTile hover={false} className="mb-8">
            <div className="mb-8 text-center">
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#8B5CF6" }}
              >
                Get In Touch
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">
                Contact
              </h2>
              <p className="mt-2 text-sm" style={{ color: "#A3A8B3" }}>
                Links coming soon — stay tuned.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CONTACT_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  data-ocid={`contact.${link.label.toLowerCase().replace(/ \/ /g, "_").replace(/\s/g, "_")}.link`}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl cursor-pointer group"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  whileHover={{
                    scale: 1.04,
                    borderColor: "rgba(10,132,255,0.3)",
                    background: "rgba(10,132,255,0.06)",
                    boxShadow: "0 8px 24px rgba(10,132,255,0.12)",
                    transition: { type: "spring", stiffness: 400, damping: 24 },
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <span className="text-2xl">{link.emoji}</span>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-white">
                      {link.label}
                    </div>
                    <div
                      className="text-xs mt-0.5 font-mono"
                      style={{ color: "rgba(163,168,179,0.4)" }}
                    >
                      {link.placeholder}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </BentoTile>
        </RevealSection>

        {/* Footer bottom */}
        <div
          className="pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm font-black tracking-[0.2em] uppercase text-white">
              KALAKARS
            </span>

            <div className="flex gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs uppercase tracking-widest transition-colors cursor-pointer hover:text-white"
                  style={{ color: "#A3A8B3" }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div
            className="mt-6 pt-4 text-center text-xs"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.04)",
              color: "rgba(163,168,179,0.4)",
            }}
          >
            © {year}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#A3A8B3] transition-colors"
            >
              Built with ❤️ using caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="min-h-screen font-inter" style={{ background: "#0F1115" }}>
      <Navbar />
      <main>
        <Hero />
        <div className="max-w-5xl mx-auto px-4">
          {/* Row 1: Projects + Trio side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 py-8">
            {/* Projects column */}
            <RevealSection>
              <div>
                <div className="mb-6">
                  <span
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "#0A84FF" }}
                  >
                    Our Work
                  </span>
                  <h2 className="text-2xl font-bold mt-1 text-white">
                    Projects
                  </h2>
                  <p className="mt-1 text-xs" style={{ color: "#A3A8B3" }}>
                    Coming soon — stay tuned.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map((i) => (
                    <RevealSection key={i} delay={i * 0.08}>
                      <ProjectCard index={i} />
                    </RevealSection>
                  ))}
                </div>
              </div>
            </RevealSection>

            {/* Trio column */}
            <RevealSection delay={0.15}>
              <div>
                <div className="mb-6">
                  <span
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "#8B5CF6" }}
                  >
                    The Team
                  </span>
                  <h2 className="text-2xl font-bold mt-1 text-white">
                    Meet the Trio
                  </h2>
                  <p className="mt-1 text-xs" style={{ color: "#A3A8B3" }}>
                    Three engineers. One mission.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  {TRIO_MEMBERS.map((member, idx) => (
                    <RevealSection key={member.id} delay={(idx + 1) * 0.1}>
                      <BentoTile>
                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-lg relative"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(10,132,255,0.15), rgba(139,92,246,0.25))",
                              border: "1.5px solid rgba(255,255,255,0.08)",
                            }}
                          >
                            👤
                          </div>
                          <div className="flex-1 space-y-2">
                            {member.name ? (
                              <>
                                <p className="text-sm font-semibold text-white leading-none">
                                  {member.name}
                                </p>
                                <p
                                  className="text-xs"
                                  style={{ color: "#A3A8B3" }}
                                >
                                  {member.bio}
                                </p>
                              </>
                            ) : (
                              <>
                                <div
                                  className="h-3.5 rounded-full w-2/3"
                                  style={{
                                    background: "rgba(255,255,255,0.1)",
                                  }}
                                />
                                <div
                                  className="h-2.5 rounded-full w-1/2"
                                  style={{
                                    background: "rgba(255,255,255,0.06)",
                                  }}
                                />
                              </>
                            )}
                          </div>
                        </div>
                      </BentoTile>
                    </RevealSection>
                  ))}
                </div>
              </div>
            </RevealSection>
          </div>
        </div>

        {/* Row 2: Skills full-width */}
        <SkillsSection />

        {/* Contact / Footer */}
        <ContactFooter />
      </main>
    </div>
  );
}
