import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface EmberParticle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const BOOT_LINES = [
  "> INITIALIZING KALAKARS SYSTEM...",
  "> LOADING CHARACTER DATA... [████████] 100%",
  "> CALIBRATING ARCANE MATRICES... DONE",
  "> SUMMONING QUEST LOG... DONE",
  "> LOADING SKILL TREE... DONE",
  "> ESTABLISHING PARTY LINK... DONE",
  "> ALL SYSTEMS OPERATIONAL",
  "> WELCOME, ADVENTURER.",
];

const QUESTS = [
  {
    id: "001",
    title: "The Phantom Repository",
    desc: "A cursed codebase lost to the void of legacy systems. Venture into the unknown and restore what was broken.",
    difficulty: 3,
    status: "COMPLETED" as const,
    rewards: ["+500 XP", "RARE ITEM", "GOLD REWARD"],
  },
  {
    id: "002",
    title: "Siege of the Null Pointer",
    desc: "An ancient runtime error has awakened, threatening to consume the entire stack. Defeat it before production falls.",
    difficulty: 4,
    status: "LEGENDARY" as const,
    rewards: ["+1200 XP", "LEGENDARY ARTIFACT", "ETERNAL GLORY"],
  },
  {
    id: "003",
    title: "Chronicles of the Lost API",
    desc: "The API docs were never written. A brave adventurer must reverse-engineer the forgotten endpoints.",
    difficulty: 3,
    status: "IN PROGRESS" as const,
    rewards: ["+750 XP", "UNCOMMON SCROLL"],
  },
  {
    id: "004",
    title: "The Dark Forest of Dependencies",
    desc: "Venture into a node_modules folder older than time itself. Only the wise survive the dependency conflicts.",
    difficulty: 5,
    status: "IN PROGRESS" as const,
    rewards: ["+900 XP", "RARE TOME", "SANITY POTION"],
  },
  {
    id: "005",
    title: "Vault of the Encrypted Secrets",
    desc: "The production secrets were committed to git. A race against time to rotate keys before the breach spreads.",
    difficulty: 2,
    status: "COMPLETED" as const,
    rewards: ["+300 XP", "COMMON BADGE"],
  },
  {
    id: "006",
    title: "Rise of the Infinite Loop",
    desc: "A monstrous while(true) has consumed the server. Slay the beast before memory runs dry.",
    difficulty: 4,
    status: "LEGENDARY" as const,
    rewards: ["+1000 XP", "EPIC WEAPON", "HALL OF FAME"],
  },
];

const SKILLS = [
  {
    stat: "STR",
    label: "Strength",
    sublabel: "Languages",
    skills: [
      { name: "JavaScript", level: 9, rarity: "Legendary" as const },
      { name: "Python", level: 8, rarity: "Rare" as const },
      { name: "C++", level: 7, rarity: "Rare" as const },
      { name: "Java", level: 6, rarity: "Common" as const },
    ],
  },
  {
    stat: "INT",
    label: "Intelligence",
    sublabel: "Frameworks",
    skills: [
      { name: "React", level: 8, rarity: "Rare" as const },
      { name: "TailwindCSS", level: 8, rarity: "Rare" as const },
      { name: "Node.js", level: 7, rarity: "Rare" as const },
      { name: "Express", level: 6, rarity: "Common" as const },
    ],
  },
  {
    stat: "DEX",
    label: "Dexterity",
    sublabel: "Tools",
    skills: [
      { name: "Git", level: 9, rarity: "Legendary" as const },
      { name: "VS Code", level: 9, rarity: "Legendary" as const },
      { name: "Linux", level: 7, rarity: "Rare" as const },
      { name: "Docker", level: 6, rarity: "Common" as const },
    ],
  },
  {
    stat: "WIS",
    label: "Wisdom",
    sublabel: "Databases",
    skills: [
      { name: "MongoDB", level: 7, rarity: "Rare" as const },
      { name: "PostgreSQL", level: 6, rarity: "Common" as const },
      { name: "Firebase", level: 6, rarity: "Common" as const },
    ],
  },
];

// ─── Ember Particles ─────────────────────────────────────────────────────────

function EmberParticles({
  count = 25,
  dim = false,
}: { count?: number; dim?: boolean }) {
  const [embers] = useState<EmberParticle[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 10,
      drift: (Math.random() - 0.5) * 60,
    })),
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {embers.map((e) => (
        <div
          key={e.id}
          className="absolute rounded-full"
          style={{
            left: `${e.x}%`,
            bottom: "-4px",
            width: `${e.size}px`,
            height: `${e.size}px`,
            background: "radial-gradient(circle, #FFB800, #CC2936)",
            opacity: dim ? 0.3 : 0.7,
            animation: `ember-rise ${e.duration}s ${e.delay}s linear infinite`,
            transform: `translateX(${e.drift}px)`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Magic Orb ───────────────────────────────────────────────────────────────

function MagicOrb() {
  const { scrollYProgress } = useScroll();
  const [scrollPct, setScrollPct] = useState(0);
  const [isIdle, setIsIdle] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      setScrollPct(v);
      setIsIdle(false);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setIsIdle(true), 1500);
    });
    return () => {
      unsub();
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [scrollYProgress]);

  const topPct = useTransform(scrollYProgress, [0, 1], ["8%", "88%"]);

  const RUNES = ["ᚠ", "ᚢ", "ᚦ", "ᚨ"];
  const fillHeight = `${scrollPct * 100}%`;

  return (
    <motion.div
      className="fixed right-4 z-50 flex items-center justify-center"
      style={{ top: topPct }}
      animate={isIdle ? { y: [0, -8, 0] } : { y: 0 }}
      transition={
        isIdle
          ? {
              duration: 3.125,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }
          : { duration: 0.2 }
      }
    >
      {/* Orb container */}
      <div className="relative w-12 h-12">
        {/* Outer ring pulse */}
        <div
          className="absolute inset-[-4px] rounded-full border border-yellow-400/30"
          style={{
            boxShadow: `0 0 ${8 + scrollPct * 20}px rgba(255,184,0,0.4)`,
            animation: "pulse-gold 2s ease-in-out infinite",
          }}
        />

        {/* Orbiting runes */}
        {RUNES.map((rune, i) => (
          <div
            key={rune}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              animation: `orb-orbit ${4 + i * 0.5}s linear infinite`,
              animationDelay: `${i * 1}s`,
            }}
          >
            <span
              className="text-[8px] font-mono absolute"
              style={{
                color: "#FFB800",
                textShadow: "0 0 6px rgba(255,184,0,0.8)",
                transform: `rotate(${i * 90}deg) translateX(26px)`,
              }}
            >
              {rune}
            </span>
          </div>
        ))}

        {/* Orb body */}
        <div
          className="relative w-full h-full rounded-full overflow-hidden"
          style={{
            background: "#12121A",
            border: "1.5px solid #FFB800",
            boxShadow: `0 0 ${16 + scrollPct * 20}px rgba(255,184,0,0.5)`,
          }}
        >
          {/* Fill */}
          <div
            className="absolute bottom-0 left-0 right-0 transition-all duration-300"
            style={{
              height: fillHeight,
              background: "linear-gradient(to top, #FFB800, #7B2FBE)",
              opacity: 0.85,
            }}
          />
          {/* Inner glow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.15), transparent 70%)",
            }}
          />
          {/* Scroll % text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-[7px] font-mono font-bold"
              style={{ color: "#F0E6D3", textShadow: "0 0 4px #000" }}
            >
              {Math.round(scrollPct * 100)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Splash Screen ────────────────────────────────────────────────────────────

function SplashScreen({ onEnter }: { onEnter: () => void }) {
  const [phase, setPhase] = useState<"title" | "boot" | "exit">("title");
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [bootDone, setBootDone] = useState(false);

  const startBoot = useCallback(() => {
    setPhase("boot");
    let idx = 0;
    const addLine = () => {
      if (idx < BOOT_LINES.length) {
        setBootLines((prev) => [...prev, BOOT_LINES[idx]]);
        idx++;
        setTimeout(addLine, 220);
      } else {
        setTimeout(() => setBootDone(true), 400);
        setTimeout(() => {
          setPhase("exit");
          onEnter();
        }, 1600);
      }
    };
    setTimeout(addLine, 300);
  }, [onEnter]);

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "#0A0A0F" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <EmberParticles count={30} />

          <AnimatePresence mode="wait">
            {phase === "title" && (
              <motion.div
                key="title-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 text-center px-6"
              >
                {/* CSE label */}
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="font-mono text-xs tracking-[0.4em] mb-6"
                  style={{ color: "#FFB800" }}
                >
                  CSE PORTFOLIO
                </motion.p>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.7,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-display font-bold"
                  style={{
                    fontSize: "clamp(5rem, 12vw, 10rem)",
                    color: "#FFB800",
                    textShadow:
                      "0 0 30px rgba(255,184,0,0.8), 0 0 60px rgba(255,184,0,0.4), 0 0 100px rgba(255,184,0,0.2)",
                    lineHeight: 1,
                    letterSpacing: "0.05em",
                  }}
                >
                  KALAKARS
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.7 }}
                  className="font-display italic mt-4 text-lg md:text-2xl"
                  style={{
                    color: "#F0E6D3",
                    textShadow: "0 0 20px rgba(240,230,211,0.3)",
                  }}
                >
                  A Legend Forged in Code
                </motion.p>

                {/* Divider */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 1.9, duration: 0.6 }}
                  className="flex items-center gap-3 my-8 justify-center"
                >
                  <div
                    className="h-px w-32"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, #FFB800)",
                    }}
                  />
                  <span
                    className="text-gold text-sm"
                    style={{ color: "#FFB800" }}
                  >
                    ◆
                  </span>
                  <div
                    className="h-px w-32"
                    style={{
                      background:
                        "linear-gradient(90deg, #FFB800, transparent)",
                    }}
                  />
                </motion.div>

                {/* Press Start */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2, duration: 0.6 }}
                  onClick={startBoot}
                  data-ocid="splash.primary_button"
                  className="font-mono text-sm md:text-base tracking-[0.3em] px-8 py-3 transition-all duration-300 cursor-pointer"
                  style={{
                    color: "#FFB800",
                    border: "1.5px solid #FFB800",
                    boxShadow: "0 0 20px rgba(255,184,0,0.2)",
                    background: "transparent",
                    animation: "pulse-gold 2s ease-in-out infinite",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,184,0,0.1)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 0 40px rgba(255,184,0,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 0 20px rgba(255,184,0,0.2)";
                  }}
                >
                  [ PRESS START ]
                </motion.button>
              </motion.div>
            )}

            {phase === "boot" && (
              <motion.div
                key="boot-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 w-full max-w-2xl px-8 py-12 font-mono text-sm md:text-base"
                style={{ color: "#FFB800" }}
              >
                {bootLines.map((line) => (
                  <motion.div
                    key={line}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mb-2 leading-relaxed"
                    style={{
                      color: line.includes("WELCOME")
                        ? "#F0E6D3"
                        : line.includes("OPERATIONAL")
                          ? "#4ade80"
                          : "#FFB800",
                    }}
                  >
                    {line}
                  </motion.div>
                ))}
                {!bootDone && (
                  <span
                    className="inline-block w-2 h-4 ml-1"
                    style={{
                      background: "#FFB800",
                      animation: "blink 1s step-end infinite",
                    }}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── HUD Navbar ───────────────────────────────────────────────────────────────

function HUDNavbar() {
  const navLinks = [
    { label: "CHAPTER I · ORIGIN", href: "#origin" },
    { label: "CHAPTER II · QUESTS", href: "#projects" },
    { label: "CHAPTER III · SKILLS", href: "#skills" },
    { label: "CHAPTER IV · PARTY", href: "#team" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        background: "rgba(10,10,15,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,184,0,0.3)",
        boxShadow: "0 1px 20px rgba(255,184,0,0.1)",
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Logo */}
        <a
          href="#origin"
          className="font-mono text-sm font-bold tracking-widest flex items-center gap-2"
          style={{ color: "#FFB800" }}
          data-ocid="nav.link"
        >
          ⚔ KALAKARS
        </a>

        {/* Center: Nav links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-ocid="nav.link"
              className="font-mono text-[10px] tracking-widest transition-all duration-200 hover:text-yellow-300"
              style={{ color: "#8B7355" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#FFB800";
                (e.currentTarget as HTMLAnchorElement).style.textShadow =
                  "0 0 10px rgba(255,184,0,0.6)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#8B7355";
                (e.currentTarget as HTMLAnchorElement).style.textShadow =
                  "none";
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: LVL badge */}
        <div
          className="font-mono text-xs px-3 py-1 tracking-widest"
          style={{
            color: "#FFB800",
            border: "1px solid rgba(255,184,0,0.4)",
            boxShadow: "0 0 10px rgba(255,184,0,0.15)",
          }}
        >
          LVL 99
        </div>
      </nav>
    </header>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      id="origin"
      className="relative min-h-screen flex items-center justify-center pt-14 overflow-hidden"
    >
      <EmberParticles count={20} dim />
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,184,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,184,0,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-mono text-xs tracking-[0.4em] mb-4"
          style={{ color: "#8B7355" }}
        >
          CHAPTER I · ORIGIN
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold mb-6"
          style={{
            fontSize: "clamp(3rem, 7vw, 6rem)",
            color: "#FFB800",
            textShadow:
              "0 0 30px rgba(255,184,0,0.6), 0 0 60px rgba(255,184,0,0.3)",
            lineHeight: 1.1,
          }}
        >
          THE LEGEND BEGINS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
          style={{ color: "#8B7355" }}
        >
          Born from the crucible of code, the Kalakars forge their destiny
          through every commit, every deployment, every debugged nightmare. This
          is their chronicle.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#projects"
            data-ocid="hero.primary_button"
            className="font-mono text-sm tracking-widest px-8 py-3 transition-all duration-300 cursor-pointer"
            style={{
              color: "#0A0A0F",
              background: "#FFB800",
              boxShadow: "0 0 20px rgba(255,184,0,0.4)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 0 40px rgba(255,184,0,0.7)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 0 20px rgba(255,184,0,0.4)";
            }}
          >
            EXPLORE QUESTS
          </a>
          <a
            href="/resume"
            data-ocid="hero.secondary_button"
            className="font-mono text-sm tracking-widest px-8 py-3 transition-all duration-300 cursor-pointer"
            style={{
              color: "#FFB800",
              border: "1.5px solid rgba(255,184,0,0.5)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "rgba(255,184,0,0.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "transparent";
            }}
          >
            VIEW RESUME →
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Quest Card ───────────────────────────────────────────────────────────────

type QuestStatus = "COMPLETED" | "IN PROGRESS" | "LEGENDARY";

function QuestCard({
  quest,
  index,
}: { quest: (typeof QUESTS)[0]; index: number }) {
  const statusColor: Record<QuestStatus, string> = {
    COMPLETED: "#4ade80",
    "IN PROGRESS": "#FFB800",
    LEGENDARY: "#7B2FBE",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      data-ocid={`quests.item.${index + 1}`}
      className="relative p-6 transition-all duration-300 cursor-default group"
      style={{
        background: "#12121A",
        border: "1px solid rgba(255,184,0,0.2)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(255,184,0,0.6)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 0 20px rgba(255,184,0,0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(255,184,0,0.2)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Quest number */}
      <div
        className="font-mono text-[10px] tracking-widest mb-3"
        style={{ color: "#8B7355" }}
      >
        QUEST #{quest.id}
      </div>

      {/* Title */}
      <h3
        className="font-display font-bold text-lg mb-2"
        style={{ color: "#FFB800" }}
      >
        {quest.title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed mb-4" style={{ color: "#8B7355" }}>
        {quest.desc}
      </p>

      {/* Difficulty */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="font-mono text-[10px] tracking-widest"
          style={{ color: "#8B7355" }}
        >
          DIFFICULTY
        </span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                color: star <= quest.difficulty ? "#FFB800" : "#2a2a35",
                fontSize: "12px",
              }}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Status badge */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="font-mono text-[10px] tracking-widest px-2 py-1"
          style={{
            color: statusColor[quest.status],
            border: `1px solid ${statusColor[quest.status]}`,
            boxShadow: `0 0 8px ${statusColor[quest.status]}40`,
          }}
        >
          {quest.status}
        </span>
      </div>

      {/* Rewards */}
      <div className="flex flex-wrap gap-2">
        {quest.rewards.map((r) => (
          <span
            key={r}
            className="font-mono text-[9px] tracking-wider px-2 py-1"
            style={{
              color: "#8B7355",
              background: "rgba(139,115,85,0.1)",
              border: "1px solid rgba(139,115,85,0.2)",
            }}
          >
            {r}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Quest Log Section ────────────────────────────────────────────────────────

function QuestLogSection() {
  return (
    <section id="projects" className="relative py-24 px-6">
      <div className="section-divider mb-16" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.4em] mb-3"
            style={{ color: "#8B7355" }}
          >
            CHAPTER II
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display font-bold"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              color: "#FFB800",
              textShadow: "0 0 30px rgba(255,184,0,0.4)",
            }}
          >
            QUEST LOG
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUESTS.map((quest, i) => (
            <QuestCard key={quest.id} quest={quest} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Skill Row ────────────────────────────────────────────────────────────────

type Rarity = "Legendary" | "Rare" | "Common";

function SkillRow({
  skill,
}: { skill: { name: string; level: number; rarity: Rarity } }) {
  const rarityConfig: Record<
    Rarity,
    { color: string; glow: string; label: string }
  > = {
    Legendary: {
      color: "#FFB800",
      glow: "0 0 10px rgba(255,184,0,0.5)",
      label: "LEGENDARY",
    },
    Rare: {
      color: "#60a5fa",
      glow: "0 0 10px rgba(96,165,250,0.5)",
      label: "RARE",
    },
    Common: { color: "#6b7280", glow: "none", label: "COMMON" },
  };
  const rc = rarityConfig[skill.rarity];

  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className="w-24 font-mono text-xs truncate"
        style={{ color: "#F0E6D3" }}
      >
        {skill.name}
      </div>
      <div
        className="flex-1 h-1.5 rounded-full"
        style={{ background: "#1a1a24" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${(skill.level / 10) * 100}%`,
            background: `linear-gradient(90deg, ${rc.color}, ${skill.rarity === "Legendary" ? "#7B2FBE" : rc.color})`,
            boxShadow: rc.glow,
          }}
        />
      </div>
      <div
        className="font-mono text-[9px] w-6 text-center"
        style={{ color: rc.color }}
      >
        Lv.{skill.level}
      </div>
      <div
        className="font-mono text-[9px] px-1.5 py-0.5"
        style={{
          color: rc.color,
          border: `1px solid ${rc.color}40`,
          boxShadow: rc.glow,
        }}
      >
        {rc.label}
      </div>
    </div>
  );
}

// ─── Skills Section ───────────────────────────────────────────────────────────

function SkillsSection() {
  return (
    <section id="skills" className="relative py-24 px-6">
      <div className="section-divider mb-16" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.4em] mb-3"
            style={{ color: "#8B7355" }}
          >
            CHAPTER III
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display font-bold"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              color: "#FFB800",
              textShadow: "0 0 30px rgba(255,184,0,0.4)",
            }}
          >
            CHARACTER STATS
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SKILLS.map((group, gi) => (
            <motion.div
              key={group.stat}
              initial={{ opacity: 0, x: gi % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.1, duration: 0.5 }}
              className="p-6"
              style={{
                background: "#12121A",
                border: "1px solid rgba(255,184,0,0.15)",
              }}
            >
              {/* Stat header */}
              <div className="flex items-baseline gap-3 mb-5">
                <span
                  className="font-mono font-bold text-xl"
                  style={{
                    color: "#FFB800",
                    textShadow: "0 0 15px rgba(255,184,0,0.5)",
                  }}
                >
                  {group.stat}
                </span>
                <span
                  className="font-display text-lg"
                  style={{ color: "#F0E6D3" }}
                >
                  {group.label}
                </span>
                <span
                  className="font-mono text-xs"
                  style={{ color: "#8B7355" }}
                >
                  · {group.sublabel}
                </span>
              </div>
              <div className="space-y-1">
                {group.skills.map((s) => (
                  <SkillRow key={s.name} skill={s} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Character Card ───────────────────────────────────────────────────────────

function CharacterCard({ index }: { index: number }) {
  const romanNumerals = ["I", "II", "III"];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      data-ocid={`party.item.${index + 1}`}
      className="p-6 text-center"
      style={{
        background: "#12121A",
        border: "1px solid rgba(255,184,0,0.2)",
        boxShadow: "inset 0 0 40px rgba(123,47,190,0.05)",
      }}
    >
      {/* Portrait */}
      <div
        className="relative mx-auto mb-5 flex items-center justify-center"
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: "2px solid rgba(255,184,0,0.3)",
          boxShadow: "0 0 20px rgba(123,47,190,0.3)",
          background: "rgba(123,47,190,0.1)",
        }}
      >
        <span style={{ fontSize: 32 }}>⚔</span>
        {/* Outer ring */}
        <div
          className="absolute inset-[-8px] rounded-full"
          style={{ border: "1px solid rgba(255,184,0,0.1)" }}
        />
      </div>

      {/* Character slot label */}
      <div
        className="font-mono text-[10px] tracking-widest mb-2"
        style={{ color: "#8B7355" }}
      >
        CHARACTER {romanNumerals[index]}
      </div>
      <h3
        className="font-display font-bold text-lg mb-1"
        style={{ color: "#F0E6D3" }}
      >
        CHARACTER SLOT [LOCKED]
      </h3>
      <div className="font-mono text-xs mb-4" style={{ color: "#8B7355" }}>
        ??? CLASS · LVL ??
      </div>

      {/* Divider */}
      <div
        className="h-px mb-4"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,184,0,0.3), transparent)",
        }}
      />

      {/* Lore */}
      <p className="text-sm italic mb-5" style={{ color: "#8B7355" }}>
        Bio not yet revealed...
      </p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {["STR", "INT", "DEX", "CHA"].map((stat) => (
          <div key={stat} className="text-center">
            <div
              className="font-mono text-[9px] mb-1"
              style={{ color: "#8B7355" }}
            >
              {stat}
            </div>
            <div
              className="font-mono font-bold text-sm"
              style={{ color: "#F0E6D3" }}
            >
              ??
            </div>
          </div>
        ))}
      </div>

      {/* Special ability */}
      <div
        className="font-mono text-[10px] tracking-widest py-2 px-3"
        style={{
          color: "#7B2FBE",
          border: "1px solid rgba(123,47,190,0.3)",
          boxShadow: "0 0 10px rgba(123,47,190,0.1)",
        }}
      >
        SPECIAL ABILITY: UNKNOWN
      </div>
    </motion.div>
  );
}

// ─── Party Roster Section ─────────────────────────────────────────────────────

function PartyRosterSection() {
  return (
    <section id="team" className="relative py-24 px-6">
      <div className="section-divider mb-16" />
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.4em] mb-3"
            style={{ color: "#8B7355" }}
          >
            CHAPTER IV
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display font-bold"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              color: "#FFB800",
              textShadow: "0 0 30px rgba(255,184,0,0.4)",
            }}
          >
            PARTY ROSTER
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-mono text-xs tracking-widest mt-3"
            style={{ color: "#8B7355" }}
          >
            THE MONSTER TRIO
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <CharacterCard key={`char-${i}`} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;
  return (
    <footer className="relative py-12 px-6 text-center">
      <div className="section-divider mb-8" />
      <p
        className="font-mono text-xs tracking-widest"
        style={{ color: "#8B7355" }}
      >
        ◆ KALAKARS · {year} · ALL RIGHTS RESERVED ◆
      </p>
      <p className="font-mono text-xs mt-3" style={{ color: "#8B7355" }}>
        © {year}. Built with ♥ using{" "}
        <a
          href={utmLink}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#FFB800" }}
        >
          caffeine.ai
        </a>
      </p>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0F" }}>
      <SplashScreen onEnter={() => setGameStarted(true)} />

      {gameStarted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <HUDNavbar />
          <MagicOrb />
          <main>
            <HeroSection />
            <QuestLogSection />
            <SkillsSection />
            <PartyRosterSection />
          </main>
          <Footer />
        </motion.div>
      )}
    </div>
  );
}
