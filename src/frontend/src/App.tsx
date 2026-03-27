import { AnimatePresence, motion, useInView, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// ─── Types ───────────────────────────────────────────────────────────────────────────
interface Skill {
  label: string;
  emoji: string;
  category: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────────────
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

const CATEGORY_ACCENT: Record<string, string> = {
  Languages: "rgba(0,212,255,0.18)",
  Web: "rgba(10,132,255,0.18)",
  Databases: "rgba(191,90,242,0.18)",
  "Cloud & DevOps": "rgba(0,212,255,0.13)",
  "ML & AI": "rgba(255,100,180,0.15)",
  "CS Fundamentals": "rgba(100,220,150,0.15)",
};

const CATEGORY_BORDER: Record<string, string> = {
  Languages: "rgba(0,212,255,0.3)",
  Web: "rgba(10,132,255,0.3)",
  Databases: "rgba(191,90,242,0.3)",
  "Cloud & DevOps": "rgba(0,212,255,0.25)",
  "ML & AI": "rgba(255,100,180,0.28)",
  "CS Fundamentals": "rgba(100,220,150,0.28)",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────────
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
}

// ─── Aurora Canvas (Full-Page Animated Background) ──────────────────────────────
function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    // Floating particles
    const particles: {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initParticles = () => {
      particles.length = 0;
      const count = Math.floor((canvas.width * canvas.height) / 5500);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.4 + 0.2,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.08,
          alpha: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const draw = () => {
      t += 0.003;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Deep space base
      ctx.fillStyle = "#06080E";
      ctx.fillRect(0, 0, w, h);

      // Aurora orb 1 — cyan/teal
      const g1 = ctx.createRadialGradient(
        w * (0.2 + 0.1 * Math.sin(t * 0.7)),
        h * (0.25 + 0.08 * Math.cos(t * 0.5)),
        0,
        w * (0.2 + 0.1 * Math.sin(t * 0.7)),
        h * (0.25 + 0.08 * Math.cos(t * 0.5)),
        w * 0.45,
      );
      g1.addColorStop(0, "rgba(0,200,255,0.13)");
      g1.addColorStop(0.5, "rgba(0,150,220,0.06)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      // Aurora orb 2 — electric blue
      const g2 = ctx.createRadialGradient(
        w * (0.75 + 0.08 * Math.cos(t * 0.6)),
        h * (0.35 + 0.1 * Math.sin(t * 0.8)),
        0,
        w * (0.75 + 0.08 * Math.cos(t * 0.6)),
        h * (0.35 + 0.1 * Math.sin(t * 0.8)),
        w * 0.5,
      );
      g2.addColorStop(0, "rgba(10,100,255,0.1)");
      g2.addColorStop(0.5, "rgba(30,60,180,0.05)");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // Aurora orb 3 — soft purple
      const g3 = ctx.createRadialGradient(
        w * (0.5 + 0.12 * Math.sin(t * 0.4 + 1)),
        h * (0.65 + 0.08 * Math.cos(t * 0.55)),
        0,
        w * (0.5 + 0.12 * Math.sin(t * 0.4 + 1)),
        h * (0.65 + 0.08 * Math.cos(t * 0.55)),
        w * 0.42,
      );
      g3.addColorStop(0, "rgba(150,60,255,0.09)");
      g3.addColorStop(0.5, "rgba(100,40,200,0.04)");
      g3.addColorStop(1, "transparent");
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, w, h);

      // Aurora streak — horizontal glow band
      const bandY = h * (0.28 + 0.05 * Math.sin(t * 0.35));
      const band = ctx.createLinearGradient(
        0,
        bandY - h * 0.15,
        0,
        bandY + h * 0.15,
      );
      band.addColorStop(0, "transparent");
      band.addColorStop(0.5, "rgba(0,200,255,0.028)");
      band.addColorStop(1, "transparent");
      ctx.fillStyle = band;
      ctx.fillRect(0, bandY - h * 0.15, w, h * 0.3);

      // Stars / particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        // Twinkle
        const twinkle = p.alpha * (0.7 + 0.3 * Math.sin(t * 3 + p.x));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,220,255,${twinkle})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    initParticles();
    draw();

    window.addEventListener("resize", () => {
      resize();
      initParticles();
    });
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="aurora-canvas" />;
}

// ─── Magic Orb Scroll Indicator ─────────────────────────────────────────────
const RUNES = ["᛭", "ᚱ", "ᚨ", "ᛟ"];

function MagicOrbScrollIndicator() {
  const [hovered, setHovered] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [floatOffset, setFloatOffset] = useState(0);
  const [runeAngle, setRuneAngle] = useState(0);
  const springTop = useSpring(90, { stiffness: 80, damping: 20 });
  const [displayTop, setDisplayTop] = useState(90);
  const [displayProgress, setDisplayProgress] = useState(0);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const floatStartRef = useRef<number | null>(null);
  const runeRafRef = useRef<number | null>(null);
  const runeStartRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      const progress =
        scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
      springTop.set(90 + progress * (window.innerHeight - 40 - 90));
      setDisplayProgress(progress);
      setIsScrolling(true);
      setFloatOffset(0);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => setIsScrolling(false), 800);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, [springTop]);

  useEffect(() => {
    const unsubTop = springTop.on("change", (v) => setDisplayTop(v));
    return () => {
      unsubTop();
    };
  }, [springTop]);

  useEffect(() => {
    if (isScrolling) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      floatStartRef.current = null;
      setFloatOffset(0);
      return;
    }
    const animate = (timestamp: number) => {
      if (floatStartRef.current === null) floatStartRef.current = timestamp;
      const elapsed = timestamp - floatStartRef.current;
      setFloatOffset(Math.sin((elapsed / 3125) * Math.PI * 2) * 5);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isScrolling]);

  // Slow rune orbit animation
  useEffect(() => {
    const animateRunes = (timestamp: number) => {
      if (runeStartRef.current === null) runeStartRef.current = timestamp;
      const elapsed = timestamp - runeStartRef.current;
      setRuneAngle((elapsed / 1000) * 20); // 20 deg/sec
      runeRafRef.current = requestAnimationFrame(animateRunes);
    };
    runeRafRef.current = requestAnimationFrame(animateRunes);
    return () => {
      if (runeRafRef.current !== null) cancelAnimationFrame(runeRafRef.current);
    };
  }, []);

  const fillPercent = displayProgress * 100;

  return (
    <div
      data-ocid="orb.scroll_indicator"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        right: "16px",
        top: `${displayTop + floatOffset}px`,
        transform: "translateY(-50%)",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        pointerEvents: "auto",
        width: "80px",
        height: "80px",
        justifyContent: "center",
      }}
    >
      {/* Pulse ring */}
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          border: "1px solid rgba(255,184,0,0.2)",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      />

      {/* Orbiting runes */}
      {RUNES.map((rune, i) => {
        const baseAngle = i * 90;
        const angle = baseAngle + runeAngle + displayProgress * 360;
        const rad = (angle * Math.PI) / 180;
        const radius = 38;
        const x = 40 + Math.cos(rad) * radius - 5;
        const y = 40 + Math.sin(rad) * radius - 5;
        return (
          <span
            key={rune}
            style={{
              position: "absolute",
              left: `${x}px`,
              top: `${y}px`,
              fontSize: "10px",
              color: "#FFB800",
              textShadow: "0 0 8px #FFB800",
              userSelect: "none",
              pointerEvents: "none",
              lineHeight: 1,
            }}
          >
            {rune}
          </span>
        );
      })}

      {/* Orb shell */}
      <div
        style={{
          position: "relative",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 60% 35%, rgba(180,120,255,0.15), transparent 70%)",
          boxShadow:
            "0 0 8px #FFB800, 0 0 20px rgba(123,47,190,0.6), 0 0 40px rgba(123,47,190,0.3)",
          border: "1px solid rgba(255,184,0,0.3)",
          overflow: "hidden",
        }}
      >
        {/* Energy fill */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 50% 80%, rgba(255,184,0,0.9), rgba(123,47,190,0.8) 70%)",
            clipPath: `inset(${100 - fillPercent}% 0 0 0 round 50%)`,
            transition: "clip-path 0.3s ease-out",
          }}
        />

        {/* Inner glass highlight */}
        <div
          style={{
            position: "absolute",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle at 40% 35%, rgba(255,255,255,0.18), transparent 65%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Tooltip */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "absolute",
          top: "-18px",
          fontSize: "8px",
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#FFB800",
          textShadow: "0 0 6px #FFB800",
          userSelect: "none",
          fontFamily: "JetBrainsMono, monospace",
        }}
      >
        SCROLL
      </motion.span>
    </div>
  );
}

// ─── Section reveal ──────────────────────────────────────────────────────────────────
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
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Section Label Badge ────────────────────────────────────────────────────────────
function SectionBadge({
  label,
  color = "#00D4FF",
}: { label: string; color?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] font-mono"
      style={{
        background: `${color}18`,
        border: `1px solid ${color}35`,
        color,
        boxShadow: `0 0 12px ${color}25`,
      }}
    >
      <span
        className="w-1 h-1 rounded-full animate-pulse"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}

// ─── Glass Tile ──────────────────────────────────────────────────────────────────────
function BentoTile({
  children,
  className = "",
  hover = true,
  accentColor = "rgba(0,212,255,0.25)",
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  accentColor?: string;
}) {
  return (
    <motion.div
      className={`glass-tile neon-border rounded-3xl p-6 relative overflow-hidden ${className}`}
      whileHover={
        hover
          ? {
              scale: 1.012,
              boxShadow: `0 12px 48px rgba(0,0,0,0.5), 0 0 40px ${accentColor}`,
            }
          : {}
      }
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {/* top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px rounded-t-3xl"
        style={{
          background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
        }}
      />
      {children}
    </motion.div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────────────────
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
          boxShadow: scrolled
            ? "0 0 30px rgba(0,212,255,0.08), 0 8px 32px rgba(0,0,0,0.4)"
            : "none",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col flex-shrink-0 leading-none">
          <span
            className="text-base font-black tracking-[0.2em] text-white uppercase font-display"
            style={{ letterSpacing: "0.22em" }}
          >
            KALAKARS
          </span>
          {greeting && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              className="text-[9px] font-mono uppercase tracking-widest mt-0.5"
              style={{ color: "rgba(0,212,255,0.55)" }}
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
              className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200 cursor-pointer rounded-full hover:bg-white/5"
              style={{ color: "rgba(180,190,210,0.7)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#00D4FF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(180,190,210,0.7)";
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <motion.a
          href="#contact"
          data-ocid="nav.contact.button"
          className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] text-white cursor-pointer flex-shrink-0 font-display"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,212,255,0.85), rgba(10,132,255,0.85))",
            boxShadow: "0 0 16px rgba(0,212,255,0.25)",
          }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 28px rgba(0,212,255,0.45)",
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        >
          Get In Touch
        </motion.a>

        <button
          type="button"
          className="md:hidden ml-auto p-1.5 cursor-pointer"
          style={{ color: "rgba(0,212,255,0.7)" }}
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
                className="px-4 py-2.5 text-sm font-semibold uppercase tracking-widest hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                style={{ color: "rgba(180,190,210,0.8)" }}
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
              className="mt-2 px-4 py-2.5 text-sm font-bold uppercase tracking-widest text-white rounded-xl text-center cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,212,255,0.85), rgba(10,132,255,0.85))",
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

// ─── Hero ─────────────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Scanline overlay on hero only */}
      <div className="absolute inset-0 scanlines z-10 opacity-40" />
      <div className="absolute inset-0 vignette z-10" />

      {/* Decorative horizontal lines */}
      <div
        className="absolute left-0 right-0 z-10"
        style={{
          top: "38%",
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(0,212,255,0.08), rgba(0,212,255,0.06), transparent)",
        }}
      />
      <div
        className="absolute left-0 right-0 z-10"
        style={{
          top: "62%",
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(10,132,255,0.06), transparent)",
        }}
      />

      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-5"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.22em] font-mono"
              style={{
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.22)",
                color: "#00D4FF",
                boxShadow:
                  "0 0 20px rgba(0,212,255,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "#00D4FF", boxShadow: "0 0 6px #00D4FF" }}
              />
              CS Engineering Portfolio
            </span>
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-black uppercase leading-none"
            style={{
              fontSize: "clamp(4rem, 14vw, 10rem)",
              letterSpacing: "-0.03em",
              // Outline/stroke text effect
              WebkitTextStroke: "1px rgba(255,255,255,0.85)",
              WebkitTextFillColor: "transparent",
              filter:
                "drop-shadow(0 0 32px rgba(0,212,255,0.22)) drop-shadow(0 0 60px rgba(10,132,255,0.12))",
            }}
          >
            KALAKARS
          </motion.h1>

          {/* Sub-title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="font-display font-bold leading-tight"
            style={{
              fontSize: "clamp(1.6rem, 4.5vw, 2.8rem)",
              background:
                "linear-gradient(135deg, #00D4FF 0%, #0A84FF 50%, #BF5AF2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 24px rgba(0,212,255,0.3))",
            }}
          >
            The Monster Trio.
          </motion.h2>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-base md:text-lg max-w-md leading-relaxed tracking-wide font-mono"
            style={{ color: "rgba(160,175,200,0.75)" }}
          >
            <span style={{ color: "rgba(0,212,255,0.5)" }}>$ </span>
            Building tomorrow's tech, one commit at a time.
            <span className="animate-blink" style={{ color: "#00D4FF" }}>
              _
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-3"
          >
            <motion.a
              href="#projects"
              data-ocid="hero.explore_projects.button"
              className="px-8 py-3.5 rounded-full font-display font-bold text-sm uppercase tracking-[0.15em] text-white cursor-pointer relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #00D4FF, #0A84FF)",
                boxShadow:
                  "0 0 24px rgba(0,212,255,0.35), 0 4px 20px rgba(0,0,0,0.3)",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 0 40px rgba(0,212,255,0.55), 0 8px 32px rgba(0,0,0,0.4)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              Explore Projects
            </motion.a>

            <motion.a
              href="/resume"
              data-ocid="hero.view_resume.link"
              className="px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] cursor-pointer rounded-full transition-colors font-display"
              style={{
                color: "rgba(0,212,255,0.6)",
                border: "1px solid rgba(0,212,255,0.2)",
                background: "rgba(0,212,255,0.04)",
              }}
              whileHover={{
                color: "#00D4FF",
                borderColor: "rgba(0,212,255,0.4)",
                boxShadow: "0 0 20px rgba(0,212,255,0.15)",
              }}
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
          className="text-[9px] uppercase tracking-[0.22em] font-mono"
          style={{ color: "rgba(0,212,255,0.4)" }}
        >
          Scroll
        </span>
        <motion.div
          className="w-px h-8 origin-top"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,212,255,0.6), transparent)",
          }}
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY }}
        />
      </motion.div>
    </section>
  );
}

// ─── Project Card ────────────────────────────────────────────────────────────────────
const PROJECT_ACCENTS = [
  { from: "#00D4FF", to: "#0A84FF" },
  { from: "#0A84FF", to: "#BF5AF2" },
  { from: "#BF5AF2", to: "#00D4FF" },
  { from: "#00D4FF", to: "#BF5AF2" },
];

function ProjectCard({ index }: { index: number }) {
  const accent = PROJECT_ACCENTS[index % PROJECT_ACCENTS.length];
  return (
    <motion.div
      className="glass-tile neon-border rounded-3xl overflow-hidden cursor-pointer"
      whileHover={{
        scale: 1.02,
        boxShadow: `0 16px 56px rgba(0,0,0,0.5), 0 0 40px ${accent.from}28`,
      }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      data-ocid={`projects.item.${index}`}
    >
      {/* Top accent line */}
      <div
        className="h-px w-full"
        style={{
          background: `linear-gradient(to right, ${accent.from}, ${accent.to})`,
          opacity: 0.7,
        }}
      />

      <div
        className="w-full h-44 relative"
        style={{
          background: `linear-gradient(135deg, ${accent.from}10, ${accent.to}18)`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
            style={{
              background: `${accent.from}18`,
              border: `1px solid ${accent.from}30`,
              boxShadow: `0 0 24px ${accent.from}20`,
            }}
          >
            <span className="text-2xl">🚀</span>
          </div>
        </div>
        {/* Grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${accent.from}10 1px, transparent 1px), linear-gradient(90deg, ${accent.from}10 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
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
              background: `${accent.from}12`,
              border: `1px solid ${accent.from}25`,
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
                background: `${accent.from}15`,
                border: `1px solid ${accent.from}22`,
              }}
            />
          ))}
        </div>
        <p
          className="text-[10px] uppercase tracking-[0.18em] font-mono"
          style={{ color: `${accent.from}60` }}
        >
          Project {index} — Coming Soon
        </p>
      </div>
    </motion.div>
  );
}

// ─── Team Members ─────────────────────────────────────────────────────────────────
const TRIO_MEMBERS = [
  {
    id: "member-1",
    name: "YashSaan10",
    alias: "The Cat",
    bio: "Moves silently, codes precisely.",
    color: "#00D4FF",
  },
  {
    id: "member-2",
    name: "Deev",
    alias: "The Strongest",
    bio: "Built different, codes harder.",
    color: "#0A84FF",
  },
  {
    id: "member-3",
    name: "Saad",
    alias: "The Architect",
    bio: "Thinks three steps ahead, ships ten.",
    color: "#BF5AF2",
  },
];

function TeamCard({
  member,
  index,
}: { member: (typeof TRIO_MEMBERS)[number]; index: number }) {
  return (
    <motion.div
      className="glass-tile neon-border rounded-3xl p-6 relative overflow-hidden flex flex-col items-center text-center gap-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        scale: 1.03,
        boxShadow: `0 16px 48px rgba(0,0,0,0.5), 0 0 32px ${member.color}28`,
      }}
      data-ocid={`team.member.${index + 1}`}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${member.color}60, transparent)`,
        }}
      />

      {/* Avatar ring */}
      <div className="relative">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: `${member.color}14`,
            border: `1.5px solid ${member.color}35`,
            boxShadow: `0 0 20px ${member.color}20`,
          }}
        >
          <span
            className="text-2xl font-display font-black"
            style={{ color: member.color }}
          >
            {member.name[0]}
          </span>
        </div>
        <div
          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
          style={{
            background: member.color,
            boxShadow: `0 0 8px ${member.color}`,
          }}
        >
          <span style={{ fontSize: "8px" }}>⚡</span>
        </div>
      </div>

      <div>
        <div className="text-base font-display font-bold text-white">
          {member.name}
        </div>
        <div
          className="text-[10px] font-mono uppercase tracking-[0.18em] mt-0.5"
          style={{ color: member.color }}
        >
          {member.alias}
        </div>
      </div>

      <p
        className="text-xs leading-relaxed"
        style={{ color: "rgba(160,175,200,0.65)" }}
      >
        {member.bio}
      </p>
    </motion.div>
  );
}

// ─── Skill Tile Expanded Portal ───────────────────────────────────────────────────────
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
          background: "rgba(0,0,0,0.6)",
          zIndex: 9998,
          backdropFilter: "blur(6px)",
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
            background: "rgba(6,8,14,0.97)",
            border: "1px solid rgba(0,212,255,0.3)",
            backdropFilter: "blur(24px)",
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.7), 0 0 40px rgba(0,212,255,0.1)",
          }}
        >
          <motion.div layout className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl leading-none">{skill.emoji}</span>
              <span className="text-sm font-display font-bold tracking-wide text-white">
                {skill.label}
              </span>
            </div>
            <motion.button
              type="button"
              onClick={onCollapse}
              data-ocid="skills.close_button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "rgba(0,212,255,0.1)",
                border: "1px solid rgba(0,212,255,0.25)",
                color: "#00D4FF",
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
                "linear-gradient(to right, rgba(0,212,255,0.3), rgba(10,132,255,0.2), transparent)",
              marginBottom: "16px",
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.3 }}
          >
            <div
              style={{
                width: "100%",
                background: "rgba(0,212,255,0.04)",
                border: "1px solid rgba(0,212,255,0.12)",
                borderRadius: "12px",
                padding: "10px 14px",
                color: "rgba(0,212,255,0.35)",
                fontSize: "13px",
                lineHeight: 1.6,
                minHeight: "96px",
                fontFamily: "JetBrainsMono, monospace",
                userSelect: "none",
              }}
            >
              {/* Notes coming soon... */}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

// ─── Skill Tile ───────────────────────────────────────────────────────────────────────
function SkillTile({
  skill,
  index,
  isExpanded,
  onExpand,
  category,
}: {
  skill: Skill;
  index: number;
  isExpanded: boolean;
  onExpand: () => void;
  category: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });
  const accent = CATEGORY_ACCENT[category] || "rgba(0,212,255,0.15)";
  const border = CATEGORY_BORDER[category] || "rgba(0,212,255,0.25)";

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
      className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-2xl cursor-pointer"
      style={{ background: accent, border: `1px solid ${border}` }}
      whileHover={{
        scale: 1.08,
        y: -3,
        boxShadow: `0 8px 24px ${accent}`,
        transition: { type: "spring", stiffness: 500, damping: 22 },
      }}
      whileTap={{ scale: 0.96 }}
      data-ocid={`skills.item.${index + 1}`}
    >
      <span className="text-xl leading-none">{skill.emoji}</span>
      <span
        className="text-[10px] font-semibold text-center leading-tight font-mono"
        style={{ color: "rgba(200,215,235,0.8)" }}
      >
        {skill.label}
      </span>
    </motion.div>
  );
}

// ─── Skills Section ──────────────────────────────────────────────────────────────────
function SkillsSection() {
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const expandedSkillData = expandedSkill
    ? (SKILLS.find((s) => s.label === expandedSkill) ?? null)
    : null;

  return (
    <section id="skills" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <RevealSection>
          <BentoTile hover={false} accentColor="rgba(0,212,255,0.3)">
            <div className="mb-8">
              <SectionBadge label="Expertise" color="#00D4FF" />
              <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 text-white">
                Technical Skills
              </h2>
              <p
                className="mt-2 text-sm"
                style={{ color: "rgba(160,175,200,0.65)" }}
              >
                Full-spectrum CS mastery. Tap any skill to explore.
              </p>
            </div>

            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat} className="mb-8 last:mb-0">
                <h3
                  className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-4 pb-2"
                  style={{
                    color: CATEGORY_BORDER[cat] || "rgba(0,212,255,0.6)",
                    borderBottom: `1px solid ${CATEGORY_ACCENT[cat] || "rgba(0,212,255,0.1)"}`,
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
                      category={cat}
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

// ─── Contact Footer ────────────────────────────────────────────────────────────────
const CONTACT_LINKS = [
  {
    label: "GitHub",
    icon: "💙",
    href: "#",
    placeholder: "github.com/kalakars",
    color: "#00D4FF",
  },
  {
    label: "LinkedIn",
    icon: "💼",
    href: "#",
    placeholder: "linkedin.com/in/kalakars",
    color: "#0A84FF",
  },
  {
    label: "Email",
    icon: "✉️",
    href: "#",
    placeholder: "hello@kalakars.dev",
    color: "#BF5AF2",
  },
  {
    label: "Twitter / X",
    icon: "𝕏",
    href: "#",
    placeholder: "@kalakars",
    color: "#00D4FF",
  },
];

function ContactFooter() {
  const year = new Date().getFullYear();
  return (
    <footer id="contact" className="pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <RevealSection>
          <BentoTile
            hover={false}
            accentColor="rgba(191,90,242,0.3)"
            className="mb-8"
          >
            <div className="mb-8 text-center">
              <SectionBadge label="Get In Touch" color="#BF5AF2" />
              <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 text-white">
                Contact
              </h2>
              <p
                className="mt-2 text-sm"
                style={{ color: "rgba(160,175,200,0.55)" }}
              >
                Links coming soon — stay tuned.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CONTACT_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  data-ocid={`contact.${link.label.toLowerCase().replace(/ \/ /g, "_").replace(/\s/g, "_")}.link`}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl cursor-pointer"
                  style={{
                    background: `${link.color}08`,
                    border: `1px solid ${link.color}18`,
                  }}
                  whileHover={{
                    scale: 1.04,
                    borderColor: `${link.color}45`,
                    background: `${link.color}12`,
                    boxShadow: `0 8px 28px ${link.color}18`,
                    transition: { type: "spring", stiffness: 400, damping: 24 },
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <span className="text-2xl">{link.icon}</span>
                  <div className="text-center">
                    <div className="text-sm font-display font-bold text-white">
                      {link.label}
                    </div>
                    <div
                      className="text-[10px] mt-0.5 font-mono"
                      style={{ color: `${link.color}60` }}
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
          style={{ borderTop: "1px solid rgba(0,212,255,0.08)" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span
              className="text-sm font-display font-black tracking-[0.22em] uppercase"
              style={{
                WebkitTextStroke: "0.5px rgba(0,212,255,0.6)",
                WebkitTextFillColor: "transparent",
              }}
            >
              KALAKARS
            </span>
            <div className="flex gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[10px] uppercase tracking-[0.16em] transition-colors cursor-pointer font-mono hover:text-white"
                  style={{ color: "rgba(100,120,150,0.7)" }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div
            className="mt-6 pt-4 text-center text-xs font-mono"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.04)",
              color: "rgba(100,120,150,0.5)",
            }}
          >
            © {year}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/50 transition-colors"
            >
              Built with ❤️ using caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "#06080E" }}>
      {/* Full-page aurora canvas */}
      <AuroraCanvas />
      {/* Subtle grid overlay */}
      <div className="grid-overlay" />

      <Navbar />
      <MagicOrbScrollIndicator />

      <main className="relative z-10">
        <Hero />

        {/* Projects */}
        <div id="projects" className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-8">
            <RevealSection>
              <div>
                <div className="mb-6">
                  <SectionBadge label="Our Work" color="#00D4FF" />
                  <h2 className="text-2xl font-display font-bold mt-3 text-white">
                    Projects
                  </h2>
                  <p
                    className="mt-1 text-xs font-mono"
                    style={{ color: "rgba(0,212,255,0.45)" }}
                  >
                    {/* Coming soon — stay tuned. */}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-5">
                  {[1, 2].map((i) => (
                    <ProjectCard key={i} index={i} />
                  ))}
                </div>
              </div>
            </RevealSection>

            <RevealSection delay={0.1}>
              <div className="flex flex-col gap-5">
                {/* Team tile */}
                <BentoTile hover={false} accentColor="rgba(10,132,255,0.3)">
                  <div className="mb-5">
                    <SectionBadge label="The Team" color="#0A84FF" />
                    <h2 className="text-xl font-display font-bold mt-3 text-white">
                      The Monster Trio
                    </h2>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "rgba(160,175,200,0.55)" }}
                    >
                      Three minds. One stack.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {TRIO_MEMBERS.map((member, i) => (
                      <TeamCard key={member.id} member={member} index={i} />
                    ))}
                  </div>
                </BentoTile>

                {/* More project cards */}
                {[3, 4].map((i) => (
                  <ProjectCard key={i} index={i} />
                ))}
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
