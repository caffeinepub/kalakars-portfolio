import { AnimatePresence, motion, useInView, useSpring } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
  { label: "Python", emoji: "🐍", category: "Languages" },
  { label: "C++", emoji: "⚙️", category: "Languages" },
  { label: "Java", emoji: "☕", category: "Languages" },
  { label: "JavaScript", emoji: "🟨", category: "Languages" },
  { label: "TypeScript", emoji: "🔷", category: "Languages" },
  { label: "Go", emoji: "🐹", category: "Languages" },
  { label: "Rust", emoji: "🦀", category: "Languages" },
  { label: "React", emoji: "⚛️", category: "Web" },
  { label: "Node.js", emoji: "🟢", category: "Web" },
  { label: "HTML/CSS", emoji: "🎨", category: "Web" },
  { label: "Next.js", emoji: "▲", category: "Web" },
  { label: "Express", emoji: "🚀", category: "Web" },
  { label: "PostgreSQL", emoji: "🐘", category: "Databases" },
  { label: "MongoDB", emoji: "🍃", category: "Databases" },
  { label: "Redis", emoji: "🔴", category: "Databases" },
  { label: "MySQL", emoji: "🗄️", category: "Databases" },
  { label: "AWS", emoji: "☁️", category: "Cloud & DevOps" },
  { label: "Docker", emoji: "🐳", category: "Cloud & DevOps" },
  { label: "Kubernetes", emoji: "⎈", category: "Cloud & DevOps" },
  { label: "Git", emoji: "🌿", category: "Cloud & DevOps" },
  { label: "Linux", emoji: "🐧", category: "Cloud & DevOps" },
  { label: "CI/CD", emoji: "🔄", category: "Cloud & DevOps" },
  { label: "TensorFlow", emoji: "🧠", category: "ML & AI" },
  { label: "PyTorch", emoji: "🔥", category: "ML & AI" },
  { label: "Scikit-learn", emoji: "📊", category: "ML & AI" },
  { label: "NumPy", emoji: "🔢", category: "ML & AI" },
  { label: "Pandas", emoji: "🐼", category: "ML & AI" },
  { label: "DSA", emoji: "🌲", category: "CS Fundamentals" },
  { label: "OS", emoji: "💻", category: "CS Fundamentals" },
  { label: "DBMS", emoji: "📦", category: "CS Fundamentals" },
  { label: "Computer Networks", emoji: "🌐", category: "CS Fundamentals" },
  { label: "System Design", emoji: "🏗️", category: "CS Fundamentals" },
  { label: "Algorithms", emoji: "♟️", category: "CS Fundamentals" },
];

const SKILL_CATEGORIES = Array.from(new Set(SKILLS.map((s) => s.category)));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
}

// ─── Rubik's Cube Scroll Indicator ───────────────────────────────────────────

const CUBELET_COLORS = [
  "#e53e3e",
  "#0A84FF",
  "#BF5AF2",
  "#ed8936",
  "#f6e05e",
  "#48bb78",
  "#f0f0f0",
];

// Deterministic pseudo-random number generator seeded by index
function seededRand(seed: number) {
  let s = (seed * 1664525 + 1013904223) & 0x7fffffff;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function buildCubelets() {
  const cubelets: {
    id: number;
    layer: number;
    layerIndex: number;
    color: string;
    targetX: number;
    targetY: number;
    targetZ: number;
    flyFromX: number;
    flyFromY: number;
    flyFromZ: number;
  }[] = [];

  const cellSize = 8;
  // layer 0 = bottom (y=1 visually since we flip), layer 1 = middle, layer 2 = top
  const ys = [1, 0, -1]; // bottom layer renders at +y (lower on screen)
  let id = 0;

  for (let li = 0; li < 3; li++) {
    const yVal = ys[li];
    let layerIndex = 0;
    for (const zVal of [-1, 0, 1]) {
      for (const xVal of [-1, 0, 1]) {
        const rand = seededRand(id * 7919 + 13);
        const colorIdx = Math.floor(rand() * CUBELET_COLORS.length);
        const angle = rand() * Math.PI * 2;
        const dist = 28 + rand() * 44;
        const elevAngle = (rand() - 0.5) * Math.PI;
        cubelets.push({
          id: id++,
          layer: li,
          layerIndex: layerIndex++,
          color: CUBELET_COLORS[colorIdx],
          targetX: xVal * cellSize,
          targetY: yVal * cellSize,
          targetZ: zVal * cellSize,
          flyFromX: Math.cos(angle) * Math.cos(elevAngle) * dist,
          flyFromY: Math.sin(elevAngle) * dist,
          flyFromZ: Math.sin(angle) * Math.cos(elevAngle) * dist,
        });
      }
    }
  }
  return cubelets;
}

const CUBELETS = buildCubelets();

// 9 cubelets per layer, assembled 10 at a time → 1 group (all fit in a single group)
const GROUPS_PER_LAYER = 1;

function RubiksCubeScrollIndicator() {
  const [hovered, setHovered] = useState(false);
  const springTop = useSpring(90, { stiffness: 80, damping: 20 });
  const [displayTop, setDisplayTop] = useState(90);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      const progress =
        scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
      springTop.set(90 + progress * (window.innerHeight - 40 - 90));
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [springTop]);

  useEffect(() => {
    const unsub = springTop.on("change", (v) => setDisplayTop(v));
    return () => unsub();
  }, [springTop]);

  // Compute per-cubelet transform based on scroll progress.
  // Cubelets are grouped in tens (10 at once). Each layer gets 1/3 of the scroll
  // range, split evenly across GROUPS_PER_LAYER groups so the last group always
  // finishes exactly at scrollProgress = 1.
  const cubeletStyles = useMemo(() => {
    return CUBELETS.map((c) => {
      const layerStart = c.layer / 3;
      const layerRange = 1 / 3;
      // group index: 10 cubelets share the same group
      const group = Math.floor(c.layerIndex / 10);
      const slotSize = layerRange / GROUPS_PER_LAYER;
      const windowStart = layerStart + group * slotSize;
      const windowEnd = windowStart + slotSize;
      const raw = (scrollProgress - windowStart) / (windowEnd - windowStart);
      const t = Math.max(0, Math.min(1, raw));
      // Smooth-step easing
      const eased = t * t * (3 - 2 * t);

      const cx = c.targetX + c.flyFromX * (1 - eased);
      const cy = c.targetY + c.flyFromY * (1 - eased);
      const cz = c.targetZ + c.flyFromZ * (1 - eased);

      return {
        transform: `translate3d(${cx}px,${cy}px,${cz}px)`,
        opacity: eased,
      };
    });
  }, [scrollProgress]);

  return (
    <div
      data-ocid="cube.scroll_indicator"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        right: "16px",
        top: `${displayTop}px`,
        transform: "translateY(-50%)",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          width: "24px",
          height: "24px",
          perspective: "120px",
          filter:
            "drop-shadow(0 4px 12px rgba(10,132,255,0.35)) drop-shadow(0 0 6px rgba(139,92,246,0.2))",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            position: "relative",
            transformStyle: "preserve-3d",
            // Slight tilt so the 3D assembly looks good
            transform: "rotateX(20deg) rotateY(35deg)",
          }}
        >
          {CUBELETS.map((c, i) => (
            <div
              key={c.id}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-3.5px",
                marginLeft: "-3.5px",
                width: "7px",
                height: "7px",
                borderRadius: "1px",
                background: c.color,
                boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.45)",
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
                ...cubeletStyles[i],
              }}
            />
          ))}
        </div>
      </div>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{
          fontSize: "8px",
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "rgba(163,168,179,0.7)",
          userSelect: "none",
        }}
      >
        scroll
      </motion.span>
    </div>
  );
}

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
  const inView = useInView(ref, { once: false, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={
        inView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 40, scale: 0.97 }
      }
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
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

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
        <div className="flex flex-col flex-shrink-0 leading-none">
          <span className="text-base font-black tracking-[0.18em] text-white uppercase">
            KALAKARS
          </span>
          {greeting && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              className="text-[10px] font-medium uppercase tracking-widest mt-0.5"
              style={{ color: "#A3A8B3" }}
            >
              {greeting}
            </motion.span>
          )}
        </div>

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
      <div className="absolute inset-0 vignette z-10" />

      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-4"
        >
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

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-base md:text-lg max-w-md leading-relaxed tracking-wide"
            style={{ color: "#A3A8B3" }}
          >
            Building tomorrow's tech, one commit at a time.
          </motion.p>

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
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(10,132,255,0.3), rgba(139,92,246,0.3), transparent)",
          }}
        />
      </div>

      <div className="p-5 space-y-3">
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

// ─── Skill Tile Expanded Portal ───────────────────────────────────────────────

function SkillExpandedPortal({
  skill,
  onCollapse,
}: { skill: Skill; onCollapse: () => void }) {
  return createPortal(
    <AnimatePresence>
      <motion.div
        key="skill-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onCollapse}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          zIndex: 9998,
          backdropFilter: "blur(4px)",
        }}
        data-ocid="skills.modal"
      />

      <motion.div
        key={`skill-expanded-${skill.label}`}
        layoutId={`skill-tile-${skill.label}`}
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      >
        <motion.div
          style={{
            pointerEvents: "auto",
            minWidth: "280px",
            maxWidth: "340px",
            width: "90vw",
            borderRadius: "24px",
            padding: "20px",
            background: "rgba(14,16,22,0.97)",
            border: "1px solid rgba(10,132,255,0.28)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(10,132,255,0.08), 0 0 40px rgba(10,132,255,0.12)",
          }}
        >
          <motion.div layout className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl leading-none">{skill.emoji}</span>
              <span
                className="text-sm font-semibold tracking-wide"
                style={{ color: "#e2e6f0" }}
              >
                {skill.label}
              </span>
            </div>
            <motion.button
              type="button"
              onClick={onCollapse}
              data-ocid="skills.close_button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: "16px",
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              ×
            </motion.button>
          </motion.div>

          <motion.div
            layout
            style={{
              height: "1px",
              background:
                "linear-gradient(to right, rgba(10,132,255,0.2), rgba(139,92,246,0.2), transparent)",
              marginBottom: "16px",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.3, ease: "easeOut" }}
          >
            <div
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "10px 14px",
                color: "rgba(163,168,179,0.5)",
                fontSize: "13px",
                lineHeight: 1.6,
                minHeight: "96px",
                fontFamily: "inherit",
                userSelect: "none",
              }}
            >
              Notes coming soon...
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

// ─── Skills Section ───────────────────────────────────────────────────────────

function SkillTile({
  skill,
  index,
  isExpanded,
  onExpand,
}: { skill: Skill; index: number; isExpanded: boolean; onExpand: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      layoutId={`skill-tile-${skill.label}`}
      initial={{ opacity: 0, scale: 0.85, y: 16 }}
      animate={
        isExpanded
          ? { opacity: 0, scale: 0.95, y: 0 }
          : inView
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 0, scale: 0.85, y: 16 }
      }
      transition={{
        layout: { type: "spring", stiffness: 380, damping: 30 },
        opacity: { duration: 0.3, delay: isExpanded ? 0 : index * 0.03 },
        scale: {
          duration: 0.4,
          delay: isExpanded ? 0 : index * 0.03,
          ease: [0.22, 1, 0.36, 1],
        },
        y: {
          duration: 0.4,
          delay: isExpanded ? 0 : index * 0.03,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      onClick={onExpand}
      className="skill-tile flex flex-col items-center gap-1.5 px-3 py-3 rounded-2xl cursor-pointer"
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
      whileTap={{ scale: 0.96 }}
      data-ocid={`skills.item.${index + 1}`}
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
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const expandedSkillData = expandedSkill
    ? (SKILLS.find((s) => s.label === expandedSkill) ?? null)
    : null;

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
                Full-spectrum CS curriculum mastery. Tap any skill to learn
                more.
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
                    <SkillTile
                      key={skill.label}
                      skill={skill}
                      index={i}
                      isExpanded={expandedSkill === skill.label}
                      onExpand={() => setExpandedSkill(skill.label)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </BentoTile>
        </RevealSection>
      </div>

      <AnimatePresence>
        {expandedSkillData && (
          <SkillExpandedPortal
            key={expandedSkillData.label}
            skill={expandedSkillData}
            onCollapse={() => setExpandedSkill(null)}
          />
        )}
      </AnimatePresence>
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
      <RubiksCubeScrollIndicator />
      <main>
        <Hero />
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 py-8">
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

        <SkillsSection />
        <ContactFooter />
      </main>
    </div>
  );
}
