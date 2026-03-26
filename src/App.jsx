import { useState, useEffect, useRef } from "react";

const COLORS = {
  dark: "#1a1a1a",
  darkAlt: "#242424",
  charcoal: "#2d2d2d",
  slate: "#3a3a3a",
  medium: "#6b6b6b",
  light: "#a0a0a0",
  offWhite: "#e8e4df",
  cream: "#f5f2ed",
  white: "#ffffff",
  amber: "#c8943e",
  amberLight: "#d4a853",
  amberDark: "#a87830",
  amberGlow: "rgba(200,148,62,0.15)",
  concrete: "#b8b0a4",
  steel: "#8a9199",
};

const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};


const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return width;
};

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const FadeIn = ({ children, delay = 0, direction = "up", className = "" }) => {
  const [ref, inView] = useInView(0.1);
  const transforms = { up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(40px)", right: "translateX(-40px)", none: "none" };
  return (
    <div ref={ref} className={className} style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : transforms[direction], transition: `opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s` }}>
      {children}
    </div>
  );
};

const SectionLabel = ({ children, light = false }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
    <div style={{ width: "32px", height: "2px", background: COLORS.amber }} />
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 500, letterSpacing: "3px", textTransform: "uppercase", color: light ? COLORS.light : COLORS.amber }}>{children}</span>
  </div>
);

const StatBlock = ({ number, label, suffix = "" }) => {
  const [ref, inView] = useInView(0.2);
  return (
    <div ref={ref} style={{ textAlign: "center", padding: "24px" }}>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: COLORS.amber, lineHeight: 1, opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}>
        {number}<span style={{ fontSize: "0.5em", color: COLORS.amberLight }}>{suffix}</span>
      </div>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.light, marginTop: "8px" }}>{label}</div>
    </div>
  );
};

// ─── NAVIGATION ───
const Navigation = ({ activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const w = useWindowWidth();
  const isMobile = w < 900;

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const navItems = ["Services", "Process", "Expertise", "Projects", "About", "Contact"];
  const handleNav = (id) => { scrollTo(id.toLowerCase()); setMenuOpen(false); };

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, padding: scrolled ? "12px 0" : "20px 0", background: scrolled || menuOpen ? "rgba(26,26,26,0.97)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? `1px solid ${COLORS.charcoal}` : "none", transition: "all 0.4s ease" }}>
      <div style={{ maxWidth: "1320px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", cursor: "pointer", flexShrink: 0 }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img src={`data:image/png;base64,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`} alt="Alpha Construction KC" style={{ width: "36px", height: "36px", objectFit: "contain" }} />
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "10px", color: COLORS.white, letterSpacing: "1.5px", lineHeight: 1.2, textAlign: "center" }}>ALPHA CONSTRUCTION KC</div>
        </div>

        {isMobile ? (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex", flexDirection: "column", gap: "5px" }}>
            <span style={{ display: "block", width: "24px", height: "2px", background: COLORS.white, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ display: "block", width: "24px", height: "2px", background: COLORS.white, transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: "24px", height: "2px", background: COLORS.white, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        ) : (
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            {navItems.map((item) => (
              <button key={item} onClick={() => handleNav(item)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase", color: activeSection === item.toLowerCase() ? COLORS.amber : COLORS.light, transition: "color 0.3s", padding: "8px 0", borderBottom: activeSection === item.toLowerCase() ? `2px solid ${COLORS.amber}` : "2px solid transparent", whiteSpace: "nowrap" }}>{item}</button>
            ))}
            <a href="https://app.alphaconstructionkc.com" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase", color: COLORS.amber, textDecoration: "none", padding: "8px 0", borderBottom: "2px solid transparent", whiteSpace: "nowrap" }}>Platform</a>
            <button onClick={() => scrollTo("contact")} style={{ background: COLORS.amber, border: "none", color: COLORS.dark, fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "11px", letterSpacing: "0.5px", textTransform: "uppercase", padding: "10px 16px", cursor: "pointer", transition: "all 0.3s", whiteSpace: "nowrap" }}>Get Estimate</button>
          </div>
        )}
      </div>

      {isMobile && menuOpen && (
        <div style={{ padding: "20px", borderTop: `1px solid ${COLORS.slate}33`, marginTop: "12px" }}>
          {navItems.map((item) => (
            <button key={item} onClick={() => handleNav(item)} style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: "16px", fontWeight: 500, color: activeSection === item.toLowerCase() ? COLORS.amber : COLORS.light, padding: "14px 0", borderBottom: `1px solid ${COLORS.slate}22` }}>
              {item}
            </button>
          ))}
          <a href="https://app.alphaconstructionkc.com" target="_blank" rel="noopener noreferrer" style={{ display: "block", fontFamily: "'Outfit', sans-serif", fontSize: "16px", fontWeight: 500, color: COLORS.amber, textDecoration: "none", padding: "14px 0", borderBottom: `1px solid ${COLORS.slate}22` }}>Platform</a>
          <button onClick={() => { scrollTo("contact"); setMenuOpen(false); }} style={{ width: "100%", marginTop: "20px", background: COLORS.amber, border: "none", color: COLORS.dark, fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase", padding: "14px", cursor: "pointer" }}>Get Estimate</button>
        </div>
      )}
    </nav>
  );
};

// ─── HERO ───
const Hero = () => {
  const w = useWindowWidth();
  const isMobile = w < 768;
  return (
  <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", background: COLORS.dark, overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `linear-gradient(${COLORS.white} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.white} 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />
    <div style={{ position: "absolute", top: 0, right: 0, width: "55%", height: "100%", background: `linear-gradient(160deg, transparent 0%, ${COLORS.darkAlt} 40%, ${COLORS.charcoal} 100%)`, clipPath: "polygon(25% 0, 100% 0, 100% 100%, 0% 100%)", opacity: 0.6 }} />
    <div style={{ position: "absolute", top: "15%", right: "10%", width: "1px", height: "70%", background: `linear-gradient(to bottom, transparent, ${COLORS.amber}, transparent)`, opacity: 0.3 }} />

    {/* MBE Badge */}
    <div style={{ position: "absolute", top: isMobile ? "80px" : "100px", right: isMobile ? "16px" : "40px", zIndex: 3, display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end", maxWidth: "340px" }}>
      {["MBE", "DBE", "SLBE", "Section 3"].map((cert, i) => (
        <FadeIn key={i} delay={0.8 + i * 0.1}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "1.5px", padding: "6px 14px", border: `1px solid ${COLORS.amber}66`, color: COLORS.amber, background: "rgba(200,148,62,0.08)", backdropFilter: "blur(10px)" }}>{cert} CERTIFIED</span>
        </FadeIn>
      ))}
    </div>

    <div style={{ position: "relative", zIndex: 2, maxWidth: "1320px", margin: "0 auto", padding: isMobile ? "100px 20px 60px" : "120px 40px 80px", width: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "40px" : "80px", alignItems: "center" }}>
        <div>
          <FadeIn delay={0.1}>
            <SectionLabel light>Kansas City's Certified MBE Concrete Contractor</SectionLabel>
          </FadeIn>
          <FadeIn delay={0.25}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.8rem, 5.5vw, 4.5rem)", color: COLORS.white, lineHeight: 1.08, margin: "0 0 24px", fontWeight: 400 }}>
              Built on <span style={{ color: COLORS.amber, fontStyle: "italic" }}>Concrete</span><br />
              Expertise
            </h1>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "18px", lineHeight: 1.8, color: COLORS.light, maxWidth: "480px", margin: "0 0 40px", fontWeight: 300 }}>
              Kansas City's certified MBE commercial concrete contractor — foundations, slabs, flatwork, and curb & gutter for general contractors who demand quality, reliability, and a crew that shows up ready to pour.
            </p>
          </FadeIn>
          <FadeIn delay={0.55}>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <button style={{ background: COLORS.amber, border: "none", color: COLORS.dark, fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", padding: "18px 40px", cursor: "pointer", transition: "all 0.3s" }} onClick={() => scrollTo("contact")}>Request a Bid</button>
              <button style={{ background: "transparent", border: `1px solid ${COLORS.slate}`, color: COLORS.offWhite, fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", padding: "17px 36px", cursor: "pointer", transition: "all 0.3s" }} onClick={() => scrollTo("projects")}>View Our Work</button>
            </div>
          </FadeIn>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>
          {[
            { icon: "◆", title: "Foundations & Footings", desc: "Structural foundations, grade beams, and footings for commercial and industrial buildings" },
            { icon: "▲", title: "Slabs-on-Grade", desc: "Building slabs, warehouse floors, and structural slabs engineered for load and performance" },
            { icon: "■", title: "Flatwork & Sidewalks", desc: "Sidewalks, patios, ADA-compliant pathways, and decorative stamped concrete" },
            { icon: "●", title: "Curb & Gutter", desc: "Curb, gutter, and site paving for commercial developments, municipal, and public projects" },
          ].map((card, i) => (
            <FadeIn key={i} delay={0.3 + i * 0.12}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${COLORS.slate}33`, padding: "28px 24px", transition: "all 0.4s", cursor: "default", backdropFilter: "blur(10px)" }}
                onMouseEnter={e => { e.currentTarget.style.background = COLORS.amberGlow; e.currentTarget.style.borderColor = COLORS.amber + "44"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = COLORS.slate + "33"; }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "24px", color: COLORS.amber, marginBottom: "12px" }}>{card.icon}</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "14px", color: COLORS.white, marginBottom: "8px", letterSpacing: "0.5px" }}>{card.title}</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300, fontSize: "13px", color: COLORS.light, lineHeight: 1.6 }}>{card.desc}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      <FadeIn delay={0.7}>
        <div style={{ marginTop: "80px", display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", borderTop: `1px solid ${COLORS.slate}33`, paddingTop: "40px" }}>
          <StatBlock number="8" suffix="+" label="Years in Kansas City" />
          <StatBlock number="5.4" suffix="M+" label="Revenue To Date" />
          <StatBlock number="75" suffix="+" label="Projects Completed" />
          <StatBlock number="4" label="Certified Diversities" />
        </div>
      </FadeIn>
    </div>
  </section>
  );
}

// ─── SERVICES ───
const Services = () => {
  const w = useWindowWidth();
  const isMobile = w < 768;
  const [active, setActive] = useState(0);
  const services = [
    {
      title: "Foundations & Structural Concrete",
      subtitle: "Our Core",
      items: ["Spread & Continuous Footings", "Grade Beams & Pier Caps", "Structural Building Slabs", "Foundation Walls", "Slab-on-Grade (Conventional & Fiber)", "Concrete Repair & Patch Work"],
      detail: "Foundations are the most critical concrete placement on any project — there's zero margin for error. Alpha's crews have poured structural concrete for commercial buildings, industrial facilities, and retail centers across the KC metro. We coordinate closely with your project engineer on rebar placement, embed locations, and pour sequencing to keep your build on track from the ground up.",
      specs: ["OSHA 10 Certified Crews", "Licensed in MO & KS", "Bonded to $3M", "MBE/DBE Certified"]
    },
    {
      title: "Slabs-on-Grade & Building Floors",
      subtitle: "Flat & True",
      items: ["Warehouse & Industrial Slabs", "Retail & Commercial Building Slabs", "Fiber-Reinforced Slabs", "Interior Slab Repair & Replacement", "Saw Cutting & Joint Layout", "Vapor Barrier Coordination"],
      detail: "A building slab has to be flat, on-grade, and finished properly — our crews deliver that consistently. Whether it's a 60,000 SF warehouse floor or a 5,000 SF retail pad, we handle forming, placement, finishing, and curing with attention to the tolerances your project demands. We've completed slabs for projects ranging from $35K patch jobs to $460K+ full-site packages.",
      specs: ["FF/FL Tested", "ACI 302 Practices", "Laser Screed Capable", "Same-Day Finishing"]
    },
    {
      title: "Flatwork, Sidewalks & Paving",
      subtitle: "Curb Appeal",
      items: ["Commercial Sidewalks & Pathways", "ADA-Compliant Ramps & Detectable Warnings", "Decorative & Stamped Concrete", "Concrete Paving & Parking Areas", "Remove & Replace (R&R)", "Municipal & Public Right-of-Way"],
      detail: "From brand-new commercial sidewalks to municipal street improvements, our flatwork crews handle the visible concrete that people walk on, drive on, and judge your project by. We've completed public sidewalk and drainage projects for municipalities like the City of Concordia, as well as private R&R work for commercial properties throughout the metro.",
      specs: ["ADA Compliant", "City/Municipal Experience", "Stamped & Decorative", "Public Bid Qualified"]
    },
    {
      title: "Curb, Gutter & Site Concrete",
      subtitle: "Complete Site",
      items: ["Standard & Rolled Curb & Gutter", "Barrier Curb & Mountable Curb", "Storm Drainage Structures", "Catch Basins & Inlet Work", "Gravel Parking & Access Roads", "Complete Site Concrete Packages"],
      detail: "Curb and gutter ties a project's site work together — parking lots, drainage, access roads, and pedestrian flow all depend on it being done right. We regularly scope C&G as part of larger site packages, bundled with sidewalk, flatwork, and parking lot work. General contractors appreciate working with one concrete sub who handles the full site scope rather than piecing it together.",
      specs: ["Full Site Packages", "Drainage Integration", "Machine-Formed C&G", "DOT Specs Available"]
    }
  ];

  return (
    <section id="services" style={{ background: COLORS.cream, padding: "clamp(80px, 10vw, 140px) 0" }}>
      <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 40px" }}>
        <FadeIn>
          <SectionLabel>What We Pour</SectionLabel>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", color: COLORS.dark, margin: "0 0 60px", lineHeight: 1.15 }}>Commercial Concrete<br />Services, <span style={{ color: COLORS.amberDark, fontStyle: "italic" }}>Self-Performed</span></h2>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "300px 1fr", gap: "0" }}>
          <div style={{ borderRight: `1px solid ${COLORS.concrete}44` }}>
            {services.map((s, i) => (
              <button key={i} onClick={() => setActive(i)} style={{ display: "block", width: "100%", textAlign: "left", padding: "24px 32px 24px 0", background: "none", border: "none", borderLeft: active === i ? `3px solid ${COLORS.amber}` : "3px solid transparent", cursor: "pointer", transition: "all 0.3s", paddingLeft: "24px" }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: active === i ? 600 : 400, fontSize: "16px", color: active === i ? COLORS.dark : COLORS.medium, transition: "all 0.3s" }}>{s.title}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: active === i ? COLORS.amber : COLORS.concrete, marginTop: "4px", textTransform: "uppercase" }}>{s.subtitle}</div>
              </button>
            ))}
          </div>

          <div style={{ padding: isMobile ? "24px 0 0" : "24px 0 24px 60px" }}>
            <FadeIn key={active}>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "28px", color: COLORS.dark, margin: "0 0 20px" }}>{services[active].title}</h3>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "16px", lineHeight: 1.85, color: COLORS.medium, margin: "0 0 32px", maxWidth: "640px", fontWeight: 300 }}>{services[active].detail}</p>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "12px", marginBottom: "36px" }}>
                {services[active].items.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0" }}>
                    <div style={{ width: "6px", height: "6px", background: COLORS.amber, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", color: COLORS.dark, fontWeight: 400 }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {services[active].specs.map((spec, i) => (
                  <span key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", padding: "8px 16px", border: `1px solid ${COLORS.amber}44`, color: COLORS.amberDark, background: COLORS.amberGlow }}>
                    {spec}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── MBE ADVANTAGE ───
const MBEAdvantage = () => {
  const w = useWindowWidth();
  const isMobile = w < 768;
  return (
  <section style={{ background: COLORS.dark, padding: "80px 0", borderTop: `1px solid ${COLORS.slate}22`, borderBottom: `1px solid ${COLORS.slate}22` }}>
    <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 40px" }}>
      <FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.5fr", gap: isMobile ? "40px" : "60px", alignItems: "center" }}>
          <div>
            <SectionLabel light>Certified Diversity</SectionLabel>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: COLORS.white, margin: "0 0 20px", lineHeight: 1.2 }}>Your MBE/DBE<br /><span style={{ color: COLORS.amber, fontStyle: "italic" }}>Participation Partner</span></h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "16px", lineHeight: 1.85, color: COLORS.light, fontWeight: 300 }}>
              Alpha Construction KC holds four active diversity certifications through the City of Kansas City, Missouri. When your project requires MBE, DBE, SLBE, or Section 3 participation, we bring both the credentials and the concrete expertise to help you meet goals without compromising quality or schedule.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: "16px" }}>
            {[
              { abbr: "MBE", full: "Minority Business Enterprise", note: "City of KCMO Certified" },
              { abbr: "DBE", full: "Disadvantaged Business Enterprise", note: "Federal & State Programs" },
              { abbr: "SLBE", full: "Small Local Business Enterprise", note: "KC Metro Area" },
              { abbr: "Sec. 3", full: "HUD Section 3", note: "Federal Housing Projects" },
            ].map((cert, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{ padding: "28px 20px", border: `1px solid ${COLORS.amber}33`, background: "rgba(200,148,62,0.05)", textAlign: "center", transition: "all 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.amber; e.currentTarget.style.background = COLORS.amberGlow; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.amber + "33"; e.currentTarget.style.background = "rgba(200,148,62,0.05)"; }}>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "28px", color: COLORS.amber, marginBottom: "10px" }}>{cert.abbr}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", color: COLORS.white, fontWeight: 500, marginBottom: "6px", lineHeight: 1.3 }}>{cert.full}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: COLORS.light, letterSpacing: "1px" }}>{cert.note}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  </section>
  );
}

// ─── PROCESS ───
const Process = () => {
  const w = useWindowWidth();
  const isMobile = w < 768;
  const steps = [
    { phase: "01", title: "Bid & Pre-Construction", duration: "Days 1–5", items: ["Scope review from plans & specs", "Site visit and conditions assessment", "Concrete quantity takeoff", "Subcontractor pricing (if needed)", "Bid submission or negotiated pricing"] },
    { phase: "02", title: "Award & Coordination", duration: "Days 5–14", items: ["Subcontract execution", "Schedule coordination with GC", "Material & batch plant coordination", "Layout & forming plan", "Safety & logistics planning"] },
    { phase: "03", title: "Mobilization & Placement", duration: "Active Work", items: ["Forming & steel placement", "Pre-pour inspections & checks", "Concrete placement & finishing", "Curing & protection protocols", "Daily communication with GC superintendent"] },
    { phase: "04", title: "Punch & Closeout", duration: "Final Phase", items: ["Punch list walkthrough", "Repair & touch-up work", "Final cleaning & demobilization", "Lien waiver & documentation", "Warranty support"] },
  ];

  return (
    <section id="process" style={{ background: COLORS.dark, padding: "clamp(80px, 10vw, 140px) 0", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", width: "1px", height: "100%", background: `linear-gradient(to bottom, transparent, ${COLORS.slate}33, transparent)` }} />
      <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 40px" }}>
        <FadeIn>
          <SectionLabel light>How We Work</SectionLabel>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", color: COLORS.white, margin: "0 0 20px", lineHeight: 1.15 }}>From Bid Day to<br /><span style={{ color: COLORS.amber, fontStyle: "italic" }}>Final Walkthrough</span></h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "17px", lineHeight: 1.8, color: COLORS.light, maxWidth: "560px", margin: "0 0 80px", fontWeight: 300 }}>
            GCs work with us because we communicate, show up on schedule, and close out clean. Here's how a typical project flows from the day we get your invitation to bid.
          </p>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : w < 1100 ? "1fr 1fr" : "repeat(4, 1fr)", gap: "24px" }}>
          {steps.map((step, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div style={{ borderTop: `2px solid ${COLORS.amber}`, paddingTop: "32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
                  <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "36px", color: COLORS.amber }}>{step.phase}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: COLORS.light, textTransform: "uppercase" }}>{step.duration}</span>
                </div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "17px", color: COLORS.white, margin: "0 0 20px" }}>{step.title}</h3>
                {step.items.map((item, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
                    <div style={{ width: "4px", height: "4px", background: COLORS.amber, marginTop: "8px", flexShrink: 0, opacity: 0.6 }} />
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: COLORS.light, lineHeight: 1.6, fontWeight: 300 }}>{item}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── CONCRETE EXPERTISE ───
const Expertise = () => {
  const w = useWindowWidth();
  const isMobile = w < 768;
  const [activeMix, setActiveMix] = useState(0);
  const mixes = [
    { name: "Standard Structural", psi: "3,000 – 4,000", slump: '4" – 6"', uses: "Footings, grade beams, standard slabs-on-grade, foundation walls", cure: "7 days wet cure", notes: "The workhorse of commercial construction. Mix design is coordinated with the project's structural engineer and batch plant to ensure proper air entrainment for Kansas City's freeze-thaw cycles — typically targeting 5–7% air content." },
    { name: "High-Strength", psi: "5,000 – 8,000", slump: '4" – 5"', uses: "Structural slabs, transfer beams, heavily loaded footings, parking structures", cure: "14 days wet cure", notes: "Higher cement content and optimized aggregate gradation deliver the compressive strength needed for heavy-load commercial applications. Proper placement and vibration are critical — our crews are experienced with the tighter working times these mixes demand." },
    { name: "Fiber-Reinforced", psi: "3,500 – 5,000", slump: '5" – 7"', uses: "Warehouse floors, industrial slabs, sidewalks, secondary reinforcement applications", cure: "7 days wet cure", notes: "Synthetic or steel fiber reinforcement reduces cracking, improves impact resistance, and can reduce or eliminate the need for conventional welded wire in many slab applications. Common in warehouse and industrial floor projects where joint spacing and crack control matter." },
    { name: "Decorative & Stamped", psi: "3,500 – 4,500", slump: "Varies by finish", uses: "Sidewalks, entryways, patios, architectural flatwork, retail storefronts", cure: "Application-specific", notes: "When the concrete is the finished surface, appearance matters as much as strength. We work with integral color systems, stamp patterns, and specialized finishing to deliver flatwork that's both durable and visually impressive." },
  ];

  return (
    <section id="expertise" style={{ background: COLORS.cream, padding: "clamp(80px, 10vw, 140px) 0" }}>
      <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 40px" }}>
        <FadeIn>
          <SectionLabel>Deep Knowledge</SectionLabel>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", color: COLORS.dark, margin: "0 0 16px", lineHeight: 1.15 }}>Concrete Science,<br /><span style={{ color: COLORS.amberDark, fontStyle: "italic" }}>Field Proven</span></h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "17px", lineHeight: 1.8, color: COLORS.medium, maxWidth: "620px", margin: "0 0 60px", fontWeight: 300 }}>
            Understanding concrete at the material level is what separates competent placement from exceptional work. Here's the depth of knowledge behind every pour we make.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.concrete}33`, marginBottom: "60px" }}>
            <div style={{ padding: "32px 36px 0", borderBottom: `1px solid ${COLORS.concrete}22` }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: COLORS.amber, textTransform: "uppercase", marginBottom: "16px" }}>Mix Design Explorer</div>
              <div style={{ display: "flex", gap: "0" }}>
                {mixes.map((m, i) => (
                  <button key={i} onClick={() => setActiveMix(i)} style={{ padding: "12px 24px 16px", background: "none", border: "none", borderBottom: activeMix === i ? `2px solid ${COLORS.amber}` : "2px solid transparent", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: "14px", fontWeight: activeMix === i ? 600 : 400, color: activeMix === i ? COLORS.dark : COLORS.medium, transition: "all 0.3s", whiteSpace: "nowrap" }}>{m.name}</button>
                ))}
              </div>
            </div>
            <div style={{ padding: "36px", display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "48px" }}>
              <div>
                <div style={{ marginBottom: "28px" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: COLORS.concrete, textTransform: "uppercase", marginBottom: "6px" }}>Compressive Strength</div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "32px", color: COLORS.dark }}>{mixes[activeMix].psi} <span style={{ fontSize: "16px", color: COLORS.medium }}>PSI</span></div>
                </div>
                <div style={{ display: "grid", gap: "20px" }}>
                  {[["Slump Range", mixes[activeMix].slump], ["Cure Protocol", mixes[activeMix].cure]].map(([label, val], i) => (
                    <div key={i}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: COLORS.concrete, textTransform: "uppercase", marginBottom: "4px" }}>{label}</div>
                      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "15px", color: COLORS.dark }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "15px", lineHeight: 1.85, color: COLORS.medium, marginBottom: "20px", fontWeight: 300 }}>{mixes[activeMix].notes}</div>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: COLORS.concrete, textTransform: "uppercase", marginBottom: "8px" }}>Common Applications</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", color: COLORS.dark, lineHeight: 1.7 }}>{mixes[activeMix].uses}</div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : w < 1100 ? "1fr 1fr" : "repeat(3, 1fr)", gap: "24px" }}>
          {[
            { title: "KC Freeze-Thaw Protocol", content: "Kansas City sees 60+ freeze-thaw cycles annually. That means air entrainment (5–7%), proper curing, and cold-weather protocols aren't optional — they're essential. We monitor ambient and concrete temperatures during cold-weather pours and use insulating blankets to ensure proper hydration." },
            { title: "Joints & Crack Control", content: "Contraction joints, construction joints, isolation joints — each serves a purpose in managing the natural shrinkage of curing concrete. We follow ACI 302 guidelines for joint spacing, use proper saw-cut timing, and install sealants and dowels where the spec requires it." },
            { title: "Quality Control & Testing", content: "Every pour includes slump tests, air content readings, and temperature monitoring at the truck. Third-party testing labs break cylinders at 7 and 28 days to verify compressive strength. We maintain batch tickets and QC documentation for full traceability on every placement." },
            { title: "Forming & Layout", content: "Accurate forming is the invisible skill behind good concrete. Proper grades, straight edges, and tight tolerances start with a crew that understands layout, string lines, and laser levels. We verify grades and dimensions before every pour so there are no surprises after the trucks arrive." },
            { title: "Finishing & Curing", content: "The difference between a good slab and a great one comes down to finishing technique and cure protocol. Our finishers know how to read bleed water, time their trowel passes, and apply curing compound at the right window — skills that take years to develop and can't be rushed." },
            { title: "Reinforcement Coordination", content: "Whether it's conventional rebar, welded wire fabric, or synthetic fiber, every reinforcement method has a purpose and a proper installation procedure. We coordinate with the project engineer on bar sizes, spacing, cover requirements, and chair layout before any concrete hits the forms." },
          ].map((card, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div style={{ padding: "32px", border: `1px solid ${COLORS.concrete}33`, background: COLORS.white, height: "100%", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.amber + "66"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.concrete + "33"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ width: "32px", height: "2px", background: COLORS.amber, marginBottom: "20px" }} />
                <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "16px", color: COLORS.dark, margin: "0 0 12px" }}>{card.title}</h4>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13.5px", lineHeight: 1.8, color: COLORS.medium, margin: 0, fontWeight: 300 }}>{card.content}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── PROJECTS ───
const Projects = () => {
  const w = useWindowWidth();
  const isMobile = w < 768;
  const projects = [
    { name: "LP Mart — Lee's Summit", gc: "MAC Construction", type: "Commercial", scope: "Full site concrete package including building slab, parking lot, curb & gutter, and sidewalks for a new commercial retail development.", value: "$463K", duration: "Multi-phase" },
    { name: "Forest Hill Village — New Building", gc: "Paric, LLC", type: "Mixed-Use", scope: "New building slab, interior slab patch and repair, sidewalks, and curb & gutter for a village-style commercial development.", value: "$249K", duration: "Multi-scope" },
    { name: "Stericycle Facility Addition", gc: "Direct", type: "Industrial", scope: "Structural concrete and flatwork for an industrial facility expansion — foundations, slabs, and site concrete.", value: "$237K", duration: "Single phase" },
    { name: "Main Street Improvements — Concordia", gc: "City of Concordia", type: "Municipal", scope: "Public improvement project including city sidewalk replacement, drainage infrastructure, and gravel parking lot construction.", value: "$123K", duration: "Public bid" },
    { name: "Butler Electric Supply", gc: "Direct", type: "Commercial R&R", scope: "Sidewalk and partial parking lot remove-and-replace for an existing commercial property — demo, forming, and new placement.", value: "$35.5K", duration: "Quick turn" },
  ];

  return (
    <section id="projects" style={{ background: COLORS.dark, padding: "clamp(80px, 10vw, 140px) 0" }}>
      <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 40px" }}>
        <FadeIn>
          <SectionLabel light>Recent Work</SectionLabel>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", color: COLORS.white, margin: "0 0 16px", lineHeight: 1.15 }}>Completed Projects</h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "16px", color: COLORS.light, margin: "0 0 60px", fontWeight: 300, maxWidth: "560px", lineHeight: 1.8 }}>
            From $35K sidewalk replacements to an $850K historic renovation — we bring the same level of attention and professionalism to every job.
          </p>
        </FadeIn>

        <div style={{ display: "grid", gap: "2px" }}>
          {projects.map((p, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div style={{ background: COLORS.darkAlt, padding: isMobile ? "24px 20px" : "36px 44px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr auto", gap: isMobile ? "16px" : "40px", alignItems: "center", transition: "all 0.4s", cursor: "pointer", borderLeft: `3px solid transparent` }}
                onMouseEnter={e => { e.currentTarget.style.borderLeftColor = COLORS.amber; e.currentTarget.style.background = COLORS.charcoal; }}
                onMouseLeave={e => { e.currentTarget.style.borderLeftColor = "transparent"; e.currentTarget.style.background = COLORS.darkAlt; }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px", flexWrap: "wrap" }}>
                    <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "20px", color: COLORS.white, margin: 0 }}>{p.name}</h3>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", padding: "4px 12px", border: `1px solid ${COLORS.amber}44`, color: COLORS.amber }}>{p.type}</span>
                  </div>
                  {p.gc !== "Direct" && (
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: COLORS.light, marginBottom: "10px" }}>GC: {p.gc}</div>
                  )}
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", lineHeight: 1.75, color: COLORS.light, margin: 0, maxWidth: "640px", fontWeight: 300 }}>{p.scope}</p>
                </div>
                <div style={{ display: "flex", gap: "32px", textAlign: "right" }}>
                  <div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "22px", color: COLORS.amber }}>{p.value}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "2px", color: COLORS.light, textTransform: "uppercase" }}>Contract</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "15px", color: COLORS.white, fontWeight: 500 }}>{p.duration}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "2px", color: COLORS.light, textTransform: "uppercase" }}>Delivery</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.5}>
          <div style={{ marginTop: "40px", padding: "32px 40px", border: `1px solid ${COLORS.amber}33`, background: "rgba(200,148,62,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "16px", color: COLORS.white, fontWeight: 500 }}>Combined + Active Project Value: <span style={{ color: COLORS.amber, fontFamily: "'DM Serif Display', serif", fontSize: "22px" }}>$3.5M+</span></div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: COLORS.light, fontWeight: 300, marginTop: "4px" }}>Working with regional GCs, direct owners, and municipalities across the KC metro</div>
            </div>
            <button style={{ background: COLORS.amber, border: "none", color: COLORS.dark, fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", padding: "14px 32px", cursor: "pointer", whiteSpace: "nowrap" }} onClick={() => scrollTo("contact")}>Invite Us to Bid</button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

// ─── ABOUT ───
const About = () => {
  const w = useWindowWidth();
  const isMobile = w < 768;
  return (
  <section id="about" style={{ background: COLORS.cream, padding: "clamp(80px, 10vw, 140px) 0" }}>
    <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 40px" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "40px" : "80px", alignItems: "start" }}>
        <div>
          <FadeIn>
            <SectionLabel>Why Alpha</SectionLabel>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: COLORS.dark, margin: "0 0 24px", lineHeight: 1.15 }}>Small Crew.<br /><span style={{ color: COLORS.amberDark, fontStyle: "italic" }}>Big Standards.</span></h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "17px", lineHeight: 1.9, color: COLORS.medium, margin: "0 0 36px", fontWeight: 300 }}>
              Alpha Construction KC is a lean, owner-operated concrete subcontractor built on the principle that a smaller crew with higher standards beats a big operation cutting corners. Every job gets direct oversight from ownership — not a layers-deep management chain. When you call Alpha, you're talking to the person who's going to be on your jobsite.
            </p>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "17px", lineHeight: 1.9, color: COLORS.medium, margin: "0 0 40px", fontWeight: 300 }}>
              We've built relationships with general contractors across the KC metro by doing three things consistently: showing up when we say we will, pouring to spec every time, and communicating proactively when conditions change. GCs don't want to babysit their concrete sub — and with Alpha, they don't have to.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "20px" }}>
              {[
                ["Bonded & Insured", "Up to $3M single project bonding capacity"],
                ["Owner-Operated", "Direct ownership oversight on every project"],
                ["MBE/DBE/SLBE/Sec. 3", "Four active diversity certifications — KCMO"],
                ["Licensed GC", "General contractor licensed in Missouri & Kansas"],
              ].map(([title, desc], i) => (
                <div key={i} style={{ padding: "20px", background: COLORS.white, border: `1px solid ${COLORS.concrete}22` }}>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "14px", color: COLORS.dark, marginBottom: "6px" }}>{title}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: COLORS.medium, lineHeight: 1.6, fontWeight: 300 }}>{desc}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.15}>
          <div style={{ background: COLORS.dark, padding: "48px 44px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: COLORS.amber, textTransform: "uppercase", marginBottom: "32px" }}>Qualifications</div>
            {[
              "Licensed General Contractor — Missouri & Kansas",
              "OSHA 10-Hour Certified Field Crews",
              "MBE Certified — City of Kansas City, MO",
              "DBE Certified — Disadvantaged Business Enterprise",
              "SLBE Certified — Small Local Business Enterprise",
              "HUD Section 3 Business Concern",
              "Bonded to $3M — Single Project",
              "Commercial General Liability & Workers' Comp",
            ].map((cert, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 0", borderBottom: i < 7 ? `1px solid ${COLORS.slate}22` : "none" }}>
                <div style={{ width: "8px", height: "8px", border: `1.5px solid ${COLORS.amber}`, transform: "rotate(45deg)", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", color: COLORS.offWhite, fontWeight: 300 }}>{cert}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
  );
}

// ─── CONTACT ───
const Contact = () => {
  const w = useWindowWidth();
  const isMobile = w < 768;
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", details: "" });
  const [submitted, setSubmitted] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = () => {
    const sub = encodeURIComponent(`Bid Request from ${form.name}${form.company ? " — " + form.company : ""}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nCompany: ${form.company}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nProject Details:\n${form.details}`
    );
    window.location.href = `mailto:info@alphaconstructionkc.com?subject=${sub}&body=${body}`;
    setSubmitted(true);
  };

  return (
  <section id="contact" style={{ background: COLORS.dark, padding: "clamp(80px, 10vw, 120px) 0" }}>
    <div style={{ maxWidth: "1320px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "40px" : "80px" }}>
        <FadeIn>
          <SectionLabel light>Let's Build</SectionLabel>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: COLORS.white, margin: "0 0 24px", lineHeight: 1.15 }}>Request a <span style={{ color: COLORS.amber, fontStyle: "italic" }}>Bid</span></h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "17px", lineHeight: 1.8, color: COLORS.light, maxWidth: "480px", margin: "0 0 48px", fontWeight: 300 }}>
            Whether you're a GC looking for a reliable concrete sub, an owner with a direct project, or a municipality needing qualified MBE participation — we'd like to hear about your project. Send us plans or just start a conversation.
          </p>

          <div style={{ display: "grid", gap: "28px" }}>
            {[
              ["Phone", "(816) 357-9446", "Call or text — we respond quickly"],
              ["Email", "info@alphaconstructionkc.com", "Send plans, ITBs, or general inquiries"],
              ["Service Area", "Greater Kansas City Metro", "Missouri & Kansas — both sides of the state line"],
            ].map(([label, value, note], i) => (
              <div key={i} style={{ display: "flex", gap: "16px" }}>
                <div style={{ width: "40px", height: "40px", border: `1px solid ${COLORS.amber}44`, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.amber, fontFamily: "'DM Serif Display', serif", fontSize: "16px", flexShrink: 0 }}>{label[0]}</div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "15px", color: COLORS.white }}>{value}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: COLORS.light, fontWeight: 300 }}>{note}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div style={{ background: COLORS.darkAlt, padding: "40px", border: `1px solid ${COLORS.slate}33` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: COLORS.amber, textTransform: "uppercase", marginBottom: "28px" }}>Request a Bid or Estimate</div>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "28px", color: COLORS.amber, marginBottom: "16px" }}>✓</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "16px", color: COLORS.white, fontWeight: 500 }}>Message sent!</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", color: COLORS.light, marginTop: "8px", fontWeight: 300 }}>We'll be in touch shortly.</div>
              </div>
            ) : (
              <>
                {[
                  { label: "Your Name", key: "name", type: "text" },
                  { label: "Company / GC", key: "company", type: "text" },
                  { label: "Email", key: "email", type: "email" },
                  { label: "Phone", key: "phone", type: "tel" },
                ].map((field) => (
                  <div key={field.key} style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 500, color: COLORS.light, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>{field.label}</label>
                    <input type={field.type} value={form[field.key]} onChange={set(field.key)} style={{ width: "100%", padding: "14px 16px", background: COLORS.charcoal, border: `1px solid ${COLORS.slate}44`, color: COLORS.white, fontFamily: "'Outfit', sans-serif", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.3s" }}
                      onFocus={e => e.target.style.borderColor = COLORS.amber}
                      onBlur={e => e.target.style.borderColor = COLORS.slate + "44"} />
                  </div>
                ))}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 500, color: COLORS.light, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Project Details / Scope</label>
                  <textarea rows={4} value={form.details} onChange={set("details")} placeholder="Project name, location, scope of concrete work, timeline, and whether plans are available..." style={{ width: "100%", padding: "14px 16px", background: COLORS.charcoal, border: `1px solid ${COLORS.slate}44`, color: COLORS.white, fontFamily: "'Outfit', sans-serif", fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box", transition: "border-color 0.3s" }}
                    onFocus={e => e.target.style.borderColor = COLORS.amber}
                    onBlur={e => e.target.style.borderColor = COLORS.slate + "44"} />
                </div>
                <button onClick={handleSubmit} style={{ width: "100%", padding: "16px", background: COLORS.amber, border: "none", color: COLORS.dark, fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s" }}
                  onMouseEnter={e => e.target.style.background = COLORS.amberLight}
                  onMouseLeave={e => e.target.style.background = COLORS.amber}>
                  Submit Bid Request
                </button>
              </>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
  );
};


// ─── FOOTER ───
const LOGO_BLUE_B64 = "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";
const LOGO_WHITE_B64 = "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";

const Footer = () => {
  const w = useWindowWidth();
  const isMobile = w < 768;
  return (
  <footer style={{ background: COLORS.dark, borderTop: `1px solid ${COLORS.slate}22`, padding: "60px 0 40px" }}>
    <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 40px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
        <div>
          <img src={`data:image/png;base64,${LOGO_WHITE_B64}`} alt="Alpha Construction KC" style={{ height: "80px", objectFit: "contain", marginBottom: "16px" }} />
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: COLORS.light, fontWeight: 300 }}>Kansas City's Certified MBE Concrete Contractor</div>
        </div>
        <div style={{ display: "flex", gap: isMobile ? "32px" : "60px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: COLORS.amber, textTransform: "uppercase", marginBottom: "16px" }}>Contact</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: COLORS.light, fontWeight: 300, lineHeight: 2 }}>
              <div>(816) 357-9446</div>
              <div>info@alphaconstructionkc.com</div>
              <div>Kansas City Metro</div>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: COLORS.amber, textTransform: "uppercase", marginBottom: "16px" }}>Links</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {["Services", "Projects", "About", "Contact"].map((link, i) => (
                <a key={i} href={`#${link.toLowerCase()}`} style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: COLORS.light, textDecoration: "none", fontWeight: 300, transition: "color 0.3s" }}
                  onMouseEnter={e => e.target.style.color = COLORS.amber}
                  onMouseLeave={e => e.target.style.color = COLORS.light}>{link}</a>
              ))}
              <a href="https://app.alphaconstructionkc.com" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: COLORS.amber, textDecoration: "none", fontWeight: 500 }}>Platform</a>
            </div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${COLORS.slate}22`, paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", color: COLORS.medium }}>© 2025 Alpha Construction KC. All rights reserved. Licensed in Missouri & Kansas.</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "1.5px", color: COLORS.medium }}>MBE · DBE · SLBE · SECTION 3</div>
      </div>
    </div>
  </footer>
  );
}

// ─── MAIN APP ───
export default function AlphaConstructionKC() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = ["services", "process", "expertise", "projects", "about", "contact"];
    const handleScroll = () => {
      const reversed = [...sections].reverse();
      for (const id of reversed) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 300) { setActiveSection(id); return; }
      }
      setActiveSection("");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ background: COLORS.dark, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${COLORS.amber}44; color: ${COLORS.dark}; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${COLORS.dark}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.slate}; }
        ::-webkit-scrollbar-thumb:hover { background: ${COLORS.amber}; }
        input::placeholder, textarea::placeholder { color: ${COLORS.slate}; }
      `}</style>
      <Navigation activeSection={activeSection} />
      <Hero />
      <Services />
      <MBEAdvantage />
      <Process />
      <Expertise />
      <Projects />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
