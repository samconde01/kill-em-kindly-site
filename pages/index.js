// KILL 'EM KINDLY — Landing Page (single-file preview)
// Pip-Boy UI reskin, single-page build (no client-side routing)

import React from "react";
import { motion } from "framer-motion";


export default function Home() {
  // You can keep your pledgeAmount / tShirtSize stuff if needed
  return <App hasClientToken={false} />;
}



// --- Helpers ---------------------------------------------------------------
function nearestTier(amount, tiers) {
  return tiers.reduce((best, t) => {
    const d = Math.abs(t.cost - amount);
    const bd = Math.abs(best.cost - amount);
    return d < bd ? t : best;
  }, tiers[0]);
}



// --- Data ------------------------------------------------------------------
const TIER_DEFS = [
  { cost: 20,  name: 'LIFEGIVER',           rewards: 'Digital Wallpaper Pack (3 phone & 3 desktop) & Soundtrack Downloads' },
  { cost: 35,  name: 'CAP COLLECTOR',       rewards: 'Slaughter Project Nuka Sodapop Patch & Early Access to Behind the Scenes footage' },
  { cost: 55,  name: 'NUKA CAP COLLECTOR',  rewards: 'Slaughter Project Nuka Quantum Sodapop Patch & past rewards' },
  { cost: 75,  name: 'ARMORER',             rewards: 'T-Shirt and past rewards' },
  { cost: 100, name: 'FOUR LEAF CLOVER',    rewards: 'Live Online Advance Screening and Q&A, and past rewards' },
  { cost: 500, name: 'LOCAL LEADER',        rewards: 'Credit as Executive Backer, Private Q&A call with Production Team' },
  { cost: 1000,name: 'STRONG BACK',         rewards: 'Prop Package, and past rewards' },
  { cost: 5000,name: 'OVERSEER',            rewards: 'Invite on Set, Producer Credit, and past rewards' },
];

// Cast with bios + image paths (revised bios)
const CAST = [
  {
    name: 'Sam Conde',
    key: 'sam-conde',
    img: '/images/sam-conde.jpg',
    bio: 'With a diverse background in on-camera work spanning short films, commercial content, and digital media, Sam excels at it all. While new to narrative acting, her ease in front of the lens and instinct for storytelling make her a standout presence. "Kill \'em Kindly" is a thrilling step into a lead role that channels her experience, passion, and sharp creative eye.'
  },
  {
    name: 'James Choi',
    key: 'james-choi',
    img: '/images/james-choi.jpg',
    bio: 'With over 30 film credits across indie features, shorts, and genre projects, this Korean American actor brings both range and presence to the screen. Trained in method and Meisner techniques, his performances balance intensity with nuance—whether he’s playing a conflicted lead or a ruthless antagonist. His background includes military tactical training, CQB, and weapons handling, making him a natural fit for action-heavy roles. Fluent in English, Korean, and Chinese, he brings an international versatility and grounded authenticity to every role he takes on.'
  },
  {
    name: 'Cole Thornton',
    key: 'cole-thornton',
    img: '/images/cole-thornton.jpg',
    bio: 'Cole is an actor and model whose work often places him in high-intensity, action-driven roles. Best known for his performances in Stalker: Shadow of the Zone and Ten of Swords, Thornton has consistently brought a physical, commanding presence to screen. Recently, he has been exploring layered characters and more dramatic storytelling through collaborative projects. With a background that combines discipline, physicality, and a sharp instinct for performance, Thornton is carving a path as a versatile actor ready to tackle both action and character-driven roles.'
  },
  {
    name: 'Austin Rearden',
    key: 'austin-rearden',
    img: '/images/austin-rearden.jpg',
    bio: 'Austin has been a Voice Actor for the last 11 years, appearing most notably in large scale fan films such as SCP: Overlord, SCP: Dollhouse as well as dozens of digital short films, Machinima, animated series, indie games and advertising. Austin recently debuted in his first live action film: STALKER: Shadow of the Zone, which led to a continued interest in pursuing live action acting. He plans to continue to work in the industry and participate in large scale projects while continuing voice over work.'
  },
  {
    name: 'Eric Cummins',
    key: 'eric-cummins',
    img: '/images/eric-cummins.jpg',
    bio: 'New to acting, Eric brings his true personality with a fun sense of whimsy to the production. Traveling the country to network and build his brand has helped him develop exceptional character and on-camera presence.'
  },
  {
    name: 'Scott Crabb',
    key: 'scott-crabb',
    img: '/images/scott-crabb.jpg',
    bio: 'Michael Scott Crabb, known professionally as Scott Crabb, is most recognized for his work in STALKER: Shadow of the Zone, for which his portrayal of the character, "Monk" received a nomination for best supporting actor at the 2024 Tampa Bay Underground Film Festival. Scott also played the role of “Topper’s Dad” in two episodes of the Netflix series Outer Banks, Season 3. Prior to stepping into the world of acting, Scott had a storied 25-year international career as a special agent with the U.S. government. Scott\'s unique background brings a deep sense of authenticity and intensity to his performances.'
  },
];

const MINI_TIMELINE = [
  { label: 'Pre-production', note: 'October & November 2025' },
  { label: 'Filming', note: 'December 2025' },
  { label: 'Post', note: 'January & February 2026' },
  { label: 'Release', note: 'March 2026' },
];

// --- Updates & Sponsors ----------------------------------------------------
const UPDATES = [
  {
    id: '2025-11-17-gunnar',
    title: 'Gunnar Optiks is officially on board.',
    date: 'November 5, 2025',
    body: `The Vault 33 frames have become canon for this project — a perfect fit for the tone, the world, and the vault-dweller’s journey. You’ll see them throughout the film and behind the scenes.`,
    image: '/images/updates/gunnar-vault33.png'
  },

  {
    id: '2025-11-18-evike',
    title: 'Evike has stepped into the wastes with us.',
    date: 'November 18, 2025',
    body: `Their gear becomes part of the Oklahoma wasteland: worn, weathered, and woven into the struggle of anyone trying to survive the Plains Commonwealth. You’ll see their presence both in the film and behind the scenes as we build this story piece by piece.`,
    image: '/images/updates/evike-announcement.jpg'
  },

  {
  id: '2025-11-18-fanzilla',
  title: 'Fanzilla Jackets enters the wasteland.',
  date: 'November 19, 2025',
  body: `A custom Fanzilla leather jacket will be worn by our lead character, stitched and built for the harsh world of the Plains Commonwealth. Their craftsmanship adds real-world weight and lore accuracy to every frame.`,
  image: '/images/updates/fanzilla-announcement.png'
},
  {
  id: '2025-11-23-goontape',
  title: 'GØØNTAPE marches into the Plains Commonwealth.',
  date: 'November 23, 2025',
  body: `GØØNTAPE’s raid-ready grip tape becomes part of the vault-dweller’s kit! Built to steady weapons, fight moisture, and survive the chaos of close quarters in the Oklahoma wastes. You’ll see their product in the film and behind the scenes.`,
  image: '/images/updates/goontape-announcement.png'
}


];


const SPONSORS = [
  {
    name: 'Gunnar Optiks',
    logo: '/images/logos/gunnar-optiks.png',
    url: 'https://gunnar.com'
  },
  {
    name: 'Evike.com',
    logo: '/images/logos/evike.png',
    url: 'https://www.evike.com'
  },

  {
  name: 'Fanzilla Jackets',
  logo: '/images/logos/fanzilla.png',
  url: 'https://fanzillajackets.com'
},
  {
  name: 'GØØNTAPE',
  logo: '/images/logos/goontape.png',
  url: 'https://goontape.com'
}


];




// --- Legal Text (single source of truth) ----------------------------------
const PRIVACY_TEXT = 'Privacy Policy\n\nEffective Date: October 2025\n\nThis Privacy Policy explains how we collect, use, and protect information from contributors and visitors on this crowdfunding page for our short film project. By contributing to this campaign, you agree to the terms below.\n\n1. Information We Collect\nWe may collect the following information when you contribute or interact with our page:\n\nName and email address\nShipping address (for physical perk fulfillment)\nPayment information (processed securely through our payment partners — we do not store credit card numbers)\nOptional info provided by you (e.g., T-shirt size, social handles, special instructions)\nWe also receive basic technical data automatically (e.g., IP address, browser type, time of visit) to maintain site security and performance.\n\n2. How We Use Your Information\nWe use your information strictly for:\nProcessing and confirming your contributions\nFulfilling and shipping perks\nSending project updates, shipping notifications, and key announcements\nResponding to refund or support inquiries\n\nWe do not sell or rent your information to third parties.\n\n3. How We Share Your Information\nWe may share your information with:\nPayment processors (to handle your transaction securely)\nShipping carriers (to deliver physical perks)\nProject team members (to fulfill perks or communicate with backers)\nWe require all partners to handle your information securely and use it only for the stated purpose.\n\n4. Data Retention\nWe retain contributor information only as long as needed for:\nFulfillment and communication\nLegal, accounting, or tax obligations\nMaintaining campaign records\nYou may request deletion of your personal information after fulfillment by emailing sconde@samcondedigital.com\n\n5. Your Rights\nYou have the right to:\nAccess the personal information we hold about you\nRequest corrections or deletion\nOpt out of non-essential emails (such as promotional updates)\n\n6. Data Security\nWe take reasonable administrative and technical measures to protect your personal information from unauthorized access, loss, or misuse.\n\n7. International Backers\nIf you contribute from outside the U.S., your information will be transferred and processed in the U.S. By contributing, you consent to this transfer.\n\n8. Policy Updates\nWe may update this Privacy Policy from time to time. The effective date at the top of this page reflects the latest version.\n\n9. Contact\nIf you have questions or requests regarding your personal information, contact:\nsconde@samcondedigital.com';

const REFUNDS_TEXT = 'Refunds & Responsibility Policy\nEffective date: October 2025\n\nNature of Contributions\nAll payments are contributions to support production of the short film.\n\nPerks/rewards are good-faith thank-yous, not retail purchases. Delivery timelines may shift due to production realities.\n\nDonations & Rewards\nBy making a contribution to this campaign, you acknowledge that your payment is a donation to support the production of the project. While we will make every reasonable effort to deliver rewards associated with your donation after the project is completed, fulfillment is not guaranteed and may be delayed, modified, or canceled due to factors outside of our control (including production constraints, vendor issues, or force majeure). Your donation does not grant ownership, equity, or any right to receive a specific product or service.\n\nRefunds\nNo refunds will be issued once a contribution is processed.\nExceptions (extenuating circumstances only): If you believe your case qualifies (e.g., duplicate charge, obvious processing error, verified non-delivery after project wrap), email sconde@samcondedigital.com within 14 days of the issue. We\'ll review and respond in writing.\n\nOur Responsibilities\nUse funds solely for the project (e.g., travel, lodging, food, locations, costuming, set design, logistics, contingency).\nMake commercially reasonable efforts to deliver listed perks and communicate schedule changes.\nPost periodic updates on progress, setbacks, and delivery windows.\nProtect contributor data and use it only for fulfillment and project communications. See our Privacy Notice for details.\n\nContributor Responsibilities\nProvide accurate shipping info, email, and sizes (if applicable) at checkout; update us promptly if anything changes.\nMonitor project updates and email notifications for fulfillment steps.\nCover any applicable taxes, customs, or import fees in your country/region.\nUnderstand that production schedules can change due to weather, location access, safety, or force majeure.\n\nPerk Fulfillment\nPhysical items ship to the address you provide; digital items deliver to your email.\nIf a listed perk becomes impracticable (e.g., vendor discontinuation), we may substitute an item of equal or greater value or adjust delivery timing.\nUnclaimed or undeliverable perks after 60 days of our delivery notice may be forfeited.\n\nChargebacks & Disputes\nPlease contact us first at sconde@samcondedigital.com so we can resolve issues quickly. Filing a chargeback without contacting us may delay resolution.\n\nContact\nQuestions, extenuating-circumstance refunds, or address changes: sconde@samcondedigital.com';

// --- Crowdfunding (live or mock) ---------------------------------
const FUNDING_GOAL = 15000; // USD
function formatUSD(n){
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

// --- Exported Root ---------------------------------------------------------
export function App({ hasClientToken = false }){
  const [showPrivacy, setShowPrivacy] = React.useState(false);
  const [showRefunds, setShowRefunds] = React.useState(false);

  // Intercept /refunds and /privacy links and open modals instead
  React.useEffect(() => {
    function onClick(e){
      const a = e.target.closest && e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (href === '/refunds'){ e.preventDefault(); setShowRefunds(true); }
      if (href === '/privacy'){ e.preventDefault(); setShowPrivacy(true); }
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div className="pipboy">
      <GlobalStyles />
      <HomePage hasClientToken={hasClientToken} />
      <RefundsModal open={showRefunds} onClose={()=>setShowRefunds(false)} text={REFUNDS_TEXT} />
      <PrivacyModal open={showPrivacy} onClose={()=>setShowPrivacy(false)} text={PRIVACY_TEXT} />
    </div>
  );
}

// --- Global Styles & Header/Footer ----------------------------------------
function GlobalStyles(){
  return (
    <style>{`
      :root {
        --pb-bg: #041b11; --pb-bg-2: #072417; --pb-grid: rgba(110,255,141,.06);
        --pb-text: #9efc6a; --pb-dim: #73c96a; --pb-bright: #b9ff9c; --pb-accent:#4df08a;
        --pb-border: rgba(158,252,106,.35); --pb-border-strong: rgba(158,252,106,.6);
        --pb-shadow: 0 0 0 1px var(--pb-border), 0 0 24px rgba(110,255,141,.12) inset;
      }
      html, body, .pipboy { height:100%; background:var(--pb-bg); color:var(--pb-text); }
      .pipboy { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace; }
      .pb-container { max-width: 1120px; margin: 0 auto; padding: 0 1.25rem; }
      .pb-header { position: sticky; top: 0; z-index: 40; backdrop-filter: blur(6px); background: linear-gradient(180deg, rgba(4,27,17,.85), rgba(4,27,17,.6)); border-bottom: 1px solid var(--pb-border); }
      .pb-chip { display:inline-block; padding:4px 8px; border:1px solid var(--pb-border); background:var(--pb-bg-2); color:var(--pb-dim); border-radius:6px; }
      .pb-panel { border:1px solid var(--pb-border); background:var(--pb-bg-2); border-radius:14px; box-shadow: var(--pb-shadow); }
      .pb-btn { border:1px solid var(--pb-border-strong); background: radial-gradient(120% 120% at 50% 0%, rgba(77,240,138,.18), rgba(77,240,138,.05)); color: var(--pb-bright); font-weight:800; letter-spacing:.02em; text-shadow: 0 0 6px rgba(185,255,156,.35); }
      .pb-btn:hover { filter: brightness(1.1); }
      .pb-btn-ghost { border:1px solid var(--pb-border); background:transparent; color:var(--pb-text); }
      .pb-input { width:100%; padding:.6rem .8rem; background:#04170f; border:1px solid var(--pb-border); color:#fff; border-radius:10px; outline:none; caret-color:var(--pb-accent); }
      .pb-input:focus { box-shadow:0 0 0 2px rgba(77,240,138,.25); border-color:var(--pb-border-strong); }
      .pb-error { color:#ff6b6b; }
      .pb-grid-overlay { position:absolute; inset:0; pointer-events:none; background-image: linear-gradient(var(--pb-grid) 1px, transparent 1px), linear-gradient(90deg, var(--pb-grid) 1px, transparent 1px); background-size:48px 48px; }
      .pb-scanlines { position:fixed; inset:0; pointer-events:none; background:repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 2px, transparent 2px, transparent 4px); mix-blend-mode:multiply; opacity:.6; }
      .pb-glow { text-shadow: 0 0 8px rgba(110,255,141,.35); }
      .highlight-paypal { outline: 2px solid var(--pb-accent); outline-offset: 6px; transition: outline .3s ease; }
      .cast-grid { display:grid; grid-template-columns: 1fr; gap:12px; }
      .cast-headshot { width:112px; height:112px; border-radius:12px; border:1px solid var(--pb-border); object-fit:cover; filter:grayscale(20%) contrast(1.1); }

      /* Updates & Sponsors */
      .updates-grid { display:grid; grid-template-columns: 1fr; gap:12px; }
      .update-img { width:100%; height:220px; object-fit:cover; border:1px solid var(--pb-border); border-radius:10px; }
      .sponsors-grid { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:12px; }
      .sponsor-card { padding:18px; display:flex; align-items:center; justify-content:center; min-height:96px; }
      .sponsor-logo { max-width: 180px; max-height: 48px; width:auto; height:auto; object-fit:contain; filter: grayscale(15%) contrast(1.1); }

      @media (min-width: 720px) {
        .cast-grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap:14px; }
        .cast-headshot { width:160px; height:160px; }

        /* Responsive rules for updates/sponsors on larger screens */
        .updates-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
        .sponsors-grid { grid-template-columns: repeat(4, minmax(0,1fr)); }
      }
    `}</style>
  );
}

function Header(){
  return (
    <header className="pb-header">
      <div className="pb-container" style={{ height: 64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <img
            src="/images/hero-banner.png"
            alt="Kill 'Em Kindly"
            style={{
              height: '48px',
              width: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 0 6px rgba(185,255,156,.35))'
            }}
          />
        </div>
        <nav style={{ display:'flex', gap:12 }}>
          <a href="#details" className="pb-btn" style={{ padding:'8px 12px', borderRadius:10 }}>About</a>
          <a href="#rewards" className="pb-btn" style={{ padding:'8px 12px', borderRadius:10 }}>Rewards</a>
          <a href="#pledge" className="pb-btn" style={{ padding:'8px 12px', borderRadius:10 }}>Pledge</a>
        </nav>
      </div>
    </header>
  );
}

function Footer(){
  return (
    <footer style={{ borderTop:'1px solid var(--pb-border)' }}>
      <div className="pb-container" style={{ padding:'24px 0', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:16, fontSize:14, color:'var(--pb-dim)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ height: 22, width: 22, borderRadius: 6, background: 'linear-gradient(135deg,#2df57e,#52ffa3)' }} />
          <span>© {new Date().getFullYear()} Kill 'em Kindly</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:18 }}>
          <a style={{ color:'var(--pb-dim)' }} href="#">Contact</a>
          <a style={{ color:'var(--pb-dim)' }} href="/refunds">Refunds & Responsibility</a>
          <a style={{ color:'var(--pb-dim)' }} href="/privacy">Privacy</a>
        </div>
      </div>
    </footer>
  );
}

// --- Page ---------------------------------------------------------
function HomePage({ hasClientToken }){
  const tiers = TIER_DEFS;
  const [amount, setAmount] = React.useState(20);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [selectedTier, setSelectedTier] = React.useState(null);
  const [noReward, setNoReward] = React.useState(false);
  const [suggestedTier, setSuggestedTier] = React.useState(null);
  const pledgeRef = React.useRef(null);
  
  // --- PayPal sizing / validation (must live in HomePage)
const [tShirtSize, setTShirtSize] = React.useState('');
const needsShirtSize = Number(amount) >= 75;
React.useEffect(() => { if (!needsShirtSize) setTShirtSize(''); }, [needsShirtSize]);
const canCheckout = Number(amount) > 0 && (!needsShirtSize || !!tShirtSize);
const sizeOptions = ['XS','S','M','L','XL','2XL','3XL'];

  // --- Donation metadata we collect client-side
const [email, setEmail] = React.useState('');
const [addr, setAddr] = React.useState({
  line1: '', line2: '', city: '', state: '', postal: '', country: 'US'
});
const needsShipping = Number(amount) >= 35; // $35+ requires shipping address

function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  const [firstName, setFirstName] = React.useState('');
const [anon, setAnon] = React.useState(false);
  
// Generate a unique ID on the client only (avoid SSR errors)
const [customId, setCustomId] = React.useState('');
React.useEffect(() => {
  try {
    // modern browsers
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      setCustomId(crypto.randomUUID());
    } else {
      // fallback
      setCustomId(Math.random().toString(36).slice(2));
    }
  } catch {
    setCustomId(Math.random().toString(36).slice(2));
  }
}, []);


 // Tracker – read from our own API (no cache) and ignore stale responses
const [donors, setDonors] = React.useState([]);
const lastRevRef = React.useRef(0);

React.useEffect(() => {
  let alive = true;

  async function load() {
    try {
      const r = await fetch(`/api/tracker/list?t=${Date.now()}`, { cache: 'no-store' });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || 'Tracker list failed');

      const rev = Number(data.rev || 0);
      if (alive && rev >= lastRevRef.current) {
        lastRevRef.current = rev;
        setDonors(Array.isArray(data.donors) ? data.donors : []);
      }
    } catch (e) {
      console.error('Failed to load donors', e);
    }
  }

  // initial load + refresh every 20s
  load();
  const interval = setInterval(load, 20000);

  return () => {
    alive = false;
    clearInterval(interval);
  };
}, []);



const [showAllDonors, setShowAllDonors] = React.useState(false);
const totalRaised = React.useMemo(() => donors.reduce((s,d)=> s + (d.amount || 0), 0), [donors]);
const backers = donors.length;
const progress = Math.min(totalRaised / FUNDING_GOAL, 1); // <-- add this back
const visibleDonors = showAllDonors ? donors : donors.slice(0, 6);


  function chooseTier(t){
    setSelectedTier({ cost: t.cost, name: t.name });
    setAmount(t.cost);
    setNoReward(false);
    setErrorMsg("");
    setTimeout(() => { pledgeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 0);
  }

  React.useEffect(() => {
    if (!amount && amount !== 0) { setSuggestedTier(null); return; }
    const nearest = nearestTier(amount, tiers);
    if (!selectedTier || nearest.cost !== selectedTier.cost) setSuggestedTier(nearest); else setSuggestedTier(null);
  }, [amount, selectedTier, tiers]);

  // ---- One-time image existence check (remove after confirming) ----
React.useEffect(() => {
  const testUrls = [
    '/images/logos/gunnar-optiks.png',
    '/images/updates/gunnar-vault33.png',
  ];
  testUrls.forEach(u => {
    const img = new Image();
    img.onload = () => console.log('OK image:', u);
    img.onerror = () => console.warn('MISSING image:', u);
    img.src = `${u}?v=2`; // cache-bust
  });
}, []);


  return (
    <>
      <div className="pb-scanlines" />
      <Header />

      {/* Hero */}
      <section className="relative" style={{ overflow:'hidden' }}>
        <div className="pb-grid-overlay" />
        <div className="pb-container" style={{ padding:'72px 0 32px' }}>
          <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="pb-glow" style={{ fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 800, letterSpacing:'-.02em' }}>Kill 'em Kindly</motion.h1>
          <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.1,duration:.6}} style={{ marginTop: 12, maxWidth: 720, color: 'var(--pb-dim)' }}>
            In this fan film a collision of western style and post-apocalyptic ruin come together to tell the story of a woman searching for her family. Along the way a deadly alter ego born from an experiment gone wrong… or maybe exactly right, may just save her life.
          </motion.p>
          <div style={{ marginTop: 24, display:'flex', gap:12, flexWrap:'wrap' }}>
            <a href="#pledge" className="pb-btn" style={{ padding:'12px 18px', borderRadius:14 }}>Pledge Now</a>
            <button className="pb-btn pb-btn-ghost" style={{ padding:'12px 18px', borderRadius:14 }} onClick={() => document.getElementById('details')?.scrollIntoView({behavior:'smooth'})}>Learn More</button>
          </div>

          {/* Video */}
          <div className="pb-panel" style={{ marginTop:16, padding:12 }}>
            <div style={{ aspectRatio:'16/9', border:'1px solid var(--pb-border)', borderRadius:12, overflow:'hidden' }}>
              <iframe
                src="https://www.youtube.com/embed/uQTAh-MuzgA?si=P5IG0i0hmeDRny8G"
                title="Kill 'Em Kindly Crowdfunding Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ width:'100%', height:'100%', display:'block' }}
              />
            </div>
          </div>

          {/* Tracker & Donor List */}
          <div className="pb-panel" style={{ marginTop:16, padding:16 }}>
            {/* Progress */}
        <div className="pb-panel" style={{ padding:12 }}>
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
    <div className="pb-glow" style={{ fontWeight:700 }}>Funding Progress</div>
    <span className="pb-chip">Ends 11/30</span>
  </div>
</div>
<div style={{ marginTop:10, height:14, border:'1px solid var(--pb-border-strong)', borderRadius:10, overflow:'hidden', background:'rgba(77,240,138,.06)' }}>
  <div style={{ width:`${progress*100}%`, height:'100%', background:'linear-gradient(90deg, rgba(77,240,138,.45), rgba(77,240,138,.15))' }} />
</div>

            <div style={{ marginTop:10, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, fontSize:14 }}>
              <div className="pb-panel" style={{ padding:10, textAlign:'center' }}>
                <div className="pb-glow" style={{ fontWeight:700 }}>{formatUSD(totalRaised)}</div>
                <div style={{ color:'var(--pb-dim)', fontSize:12 }}>Raised</div>
              </div>
              <div className="pb-panel" style={{ padding:10, textAlign:'center' }}>
                <div className="pb-glow" style={{ fontWeight:700 }}>{formatUSD(FUNDING_GOAL)}</div>
                <div style={{ color:'var(--pb-dim)', fontSize:12 }}>Goal</div>
              </div>
              <div className="pb-panel" style={{ padding:10, textAlign:'center' }}>
                <div className="pb-glow" style={{ fontWeight:700 }}>{backers}</div>
                <div style={{ color:'var(--pb-dim)', fontSize:12 }}>Backers</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:12, marginTop:12 }}>
              <a href="#pledge" className="pb-btn" style={{ padding:'10px 14px', borderRadius:12 }}>Back this project</a>
              <button className="pb-btn pb-btn-ghost" style={{ padding:'10px 14px', borderRadius:12 }} onClick={()=>document.getElementById('rewards')?.scrollIntoView({behavior:'smooth'})}>View rewards</button>
            </div>

            {/* Donor list */}
            <div className="pb-panel" style={{ padding:12, marginTop:12 }}>
              <div className="pb-glow" style={{ fontWeight:700, marginBottom:8 }}>Recent Supporters</div>
              <div style={{ display:'grid', gap:8 }}>
                {visibleDonors.map((d, i) => (
                  <div key={`${d.name || 'Anon'}-${i}`} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', border:'1px solid var(--pb-border)', borderRadius:10, padding:'8px 10px', background:'var(--pb-bg-2)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:8, height:8, borderRadius:99, background:'rgba(77,240,138,.6)' }} />
                      <span>{d.name || 'Anonymous'}</span>
                    </div>
                    <div className="pb-glow" style={{ fontWeight:600 }}>{formatUSD(d.amount || 0)}</div>
                  </div>
                ))}
              </div>
              {donors.length > 6 && (
                <button className="pb-btn" style={{ marginTop:10, padding:'8px 12px', borderRadius:10 }} onClick={()=>setShowAllDonors(v=>!v)}>
                  {showAllDonors ? 'Hide list' : `View more (${donors.length - 6} more)`}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About / Details Section */}
      <section id="details" className="pb-container" style={{ padding:'24px 0' }}>
        <div className="pb-panel" style={{ padding:20 }}>
          <h3 className="pb-glow" style={{ fontSize:18, fontWeight:600 }}>About the Project</h3>
          <p style={{ color:'var(--pb-dim)', marginTop:6 }}>
            Kill Em Kindly is a short fan film based on the Fallout universe. This not-for-profit project is solely a passion project developed by dedicated storytellers. Taking place over 200 years after the nuclear disaster of October 23, 2077, this unique short explores parts of the Fallout universe that have never been built off of before. Please support us with donation or by sharing the page to help us bring this exciting story to life.
          </p>

          {/* Budget Breakdown */}
          <div style={{ marginTop:16 }}>
            <div className="pb-glow" style={{ fontWeight:600, marginBottom:6 }}>Budget Breakdown</div>
            <div className="pb-panel" style={{ padding:12 }}>
              <div><strong>Production Operations (66%)</strong></div>
              <ul style={{ marginTop:6, paddingLeft:18, color:'var(--pb-dim)' }}>
                <li>Travel – 24%</li>
                <li>Lodging – 20%</li>
                <li>Logistics – 22%</li>
              </ul>
              <div style={{ marginTop:10 }}><strong>Creative & Design (18%)</strong></div>
              <ul style={{ marginTop:6, paddingLeft:18, color:'var(--pb-dim)' }}>
                <li>Costuming – 11%</li>
                <li>Set Design – 7%</li>
              </ul>
              <div style={{ marginTop:10 }}><strong>On-Set Essentials (17%)</strong></div>
              <ul style={{ marginTop:6, paddingLeft:18, color:'var(--pb-dim)' }}>
                <li>Food – 13%</li>
                <li>Location – 4%</li>
              </ul>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ marginTop:16 }}>
            <div className="pb-glow" style={{ fontWeight:600, marginBottom:6 }}>Timeline</div>
            <div style={{ display:'grid', gap:8 }}>
              {MINI_TIMELINE.map((m, i) => (
                <div key={`${m.label}-${i}`} className="pb-panel" style={{ padding:10 }}>
                  <strong>{m.label}</strong> — <span style={{ color:'var(--pb-dim)' }}>{m.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
{/* Updates (under Timeline) */}
<section className="pb-container" style={{ padding:'16px 0' }}>
  <h3 className="pb-glow" style={{ fontSize:18, fontWeight:600 }}>Updates</h3>
  <div className="updates-grid" style={{ marginTop:12 }}>
    {UPDATES.map((u) => (
      <article key={u.id} className="pb-panel" style={{ padding:12 }}>
        {u.image && (
          <img
            src={`${u.image}?v=2`}
            alt={u.title}
            className="update-img"
            onError={(e) => {
              console.warn('Update image failed to load:', u.image);
              e.currentTarget.style.display = 'none';
              const fb = e.currentTarget.nextElementSibling;
              if (fb) fb.style.display = 'block';
            }}
          />
        )}
        <div style={{ display:'none', color:'var(--pb-dim)', fontSize:14 }}>(Image coming soon)</div>

        <div style={{ marginTop:10 }}>
          <div className="pb-glow" style={{ fontWeight:700 }}>{u.title}</div>
          <div style={{ color:'var(--pb-dim)', fontSize:12, marginTop:4 }}>{u.date}</div>
          <p style={{ color:'var(--pb-dim)', marginTop:8 }}>{u.body}</p>
        </div>
      </article>
    ))}
  </div>
</section>


    {/* Rewards & Pledge Section */}
<section id="rewards" className="pb-container" style={{ padding:'48px 0' }}>
  <h3 className="pb-glow" style={{ fontSize:18, fontWeight:600 }}>Donate Now</h3>

  {/* Pledge Box */}
  <div className="pb-panel" style={{ marginTop:16, padding:16 }} id="pledge" ref={pledgeRef}>
    <label style={{ fontSize:12, color:'var(--pb-dim)' }}>Enter your pledge amount</label>
    <div style={{ marginTop:8, display:'flex', gap:8, alignItems:'center' }}>
      <span style={{ color:'var(--pb-dim)' }}>$</span>
      <input
        type="number"
        min={1}
        value={amount}
        onChange={(e)=>{ setAmount(Number(e.target.value)); setNoReward(false); }}
        className="pb-input"
      />
    </div>

    {needsShirtSize && (
      <div style={{ marginTop: 12 }}>
        <label htmlFor="tshirt-size" style={{ display:'block', fontSize:14, fontWeight:600 }}>
          T-Shirt Size (required for $75+)
        </label>
        <select
          id="tshirt-size"
          value={tShirtSize}
          onChange={(e) => setTShirtSize(e.target.value)}
          className="pb-input"
          style={{ marginTop: 6 }}
        >
          <option value="" disabled>Select a size…</option>
          {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <p style={{ marginTop:6, fontSize:12, color:'var(--pb-dim)' }}>Sizes: XS–3XL • Unisex fit</p>
      </div>
    )}

    {amount > 0 && amount < 20 && !noReward && (
      <div style={{ marginTop:8, fontSize:13 }} className="pb-error">
        Pledges under $20 require either selecting the $20 tier or checking 'Donate without claiming a reward.'
      </div>
    )}

    {!noReward && suggestedTier && (
      <div style={{ marginTop:8, fontSize:13, color:'var(--pb-dim)' }}>
        Suggested tier: <strong>{suggestedTier.name}</strong> (${suggestedTier.cost}).
        <button onClick={() => chooseTier(suggestedTier)} className="pb-btn" style={{ marginLeft:8, padding:'6px 10px', borderRadius:8 }}>Select</button>
      </div>
    )}

    <label style={{ display:'flex', alignItems:'center', gap:8, marginTop:10, fontSize:13, color:'var(--pb-dim)' }}>
      <input
        type="checkbox"
        checked={noReward}
        onChange={(e)=>{ setNoReward(e.target.checked); if (e.target.checked) setSelectedTier(null); }}
      />
      Donate without claiming a reward
    </label>

    {/* Email */}
    <div style={{ marginTop:12 }}>
      <label style={{ display:'block', fontSize:14, fontWeight:600 }}>Email (required)</label>
      <input
        type="email"
        className="pb-input"
        placeholder="you@example.com"
        value={email}
        onChange={e=>setEmail(e.target.value)}
        style={{ marginTop:6 }}
        required
      />
      <p style={{ marginTop:6, fontSize:12, color:'var(--pb-dim)' }}>We’ll send updates and digital rewards here.</p>
    </div>

    {/* Address (for $35+) */}
    {needsShipping && (
      <div style={{ marginTop:12 }}>
        <label style={{ display:'block', fontSize:14, fontWeight:600 }}>Shipping address (required for $35+)</label>
        <input className="pb-input" placeholder="Street address" value={addr.line1} onChange={e=>setAddr({...addr, line1:e.target.value})} style={{ marginTop:6 }} />
        <input className="pb-input" placeholder="Apt, suite, etc. (optional)" value={addr.line2} onChange={e=>setAddr({...addr, line2:e.target.value})} style={{ marginTop:8 }} />
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:8, marginTop:8 }}>
          <input className="pb-input" placeholder="City" value={addr.city} onChange={e=>setAddr({...addr, city:e.target.value})} />
          <input className="pb-input" placeholder="State" value={addr.state} onChange={e=>setAddr({...addr, state:e.target.value})} />
          <input className="pb-input" placeholder="ZIP" value={addr.postal} onChange={e=>setAddr({...addr, postal:e.target.value})} />
        </div>
        <input className="pb-input" placeholder="Country (US, CA, ...)" value={addr.country} onChange={e=>setAddr({...addr, country:e.target.value})} style={{ marginTop:8 }} />
        <p style={{ marginTop:6, fontSize:12, color:'var(--pb-dim)' }}>
  We only ship physical perks to this address. <em>*Physical rewards can only be shipped to the U.S. at this time.</em>
</p>

      </div>
    )}
{/* Donor display preferences */}
<div style={{ marginTop:12 }}>
  <label style={{ display:'block', fontSize:14, fontWeight:600 }}>
    First name (for the public tracker)
  </label>
  <input
    type="text"
    className="pb-input"
    placeholder="Jane"
    value={firstName}
    onChange={e => setFirstName(e.target.value)}
    style={{ marginTop:6 }}
  />

  <label style={{ display:'flex', alignItems:'center', gap:8, marginTop:10, fontSize:13, color:'var(--pb-dim)' }}>
    <input
      type="checkbox"
      checked={anon}
      onChange={e => setAnon(e.target.checked)}
    />
    Make my donation anonymous
  </label>
  <p style={{ marginTop:6, fontSize:12, color:'var(--pb-dim)' }}>
    If checked, your name will appear as “Anonymous” on the public tracker.
  </p>
</div>

    {/* Donate via PayPal (hosted full-page) */}
  <form
  action="https://www.paypal.com/donate"
  method="post"
  target="_blank"
  style={{ marginTop: 12 }}
  onSubmit={async (e) => {
    if (!(Number(amount) > 0)) { e.preventDefault(); alert('Please enter a donation amount first.'); return; }
    if (!isValidEmail(email)) { e.preventDefault(); alert('Please enter a valid email.'); return; }
    if (Number(amount) >= 75 && !tShirtSize) { e.preventDefault(); alert('Please select a T-Shirt size for $75+ donations.'); return; }
    if (needsShipping) {
      const { line1, city, state, postal, country } = addr;
      if (!line1 || !city || !state || !postal || !country) {
        e.preventDefault(); alert('Please complete your shipping address for $35+ tiers.'); return;
      }
    }
    if (!customId) { e.preventDefault(); alert('One sec—initializing checkout. Try again.'); return; }

    try {
      await fetch('/api/pledge-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: customId,
          amount: Number(amount),
          tShirtSize: tShirtSize || null,
          email,
          address: needsShipping ? addr : null,
          tier: selectedTier?.name || null,
          noReward,
          // donor display prefs
          firstName: firstName || null,
          anon: Boolean(anon),
        }),
      });
    } catch (err) {
      console.error('pledge-intent failed', err);
    }
  }}
>
  {/* Hosted button + passthrough fields */}
  <input type="hidden" name="hosted_button_id" value="VPRLL2BPRULJ8" />
  <input type="hidden" name="amount" value={Number(amount) || ''} />
  <input type="hidden" name="currency_code" value="USD" />
  <input type="hidden" name="custom" value={customId} />
  <input type="hidden" name="notify_url" value="https://killemkindly.info/api/paypal/ipn" />
  <input type="hidden" name="return" value="https://killemkindly.info/thanks" />
  <input type="hidden" name="cancel_return" value="https://killemkindly.info/cancelled" />

  <button
    type="submit"
    className="pb-btn"
    style={{ display:'inline-block', padding:'12px 18px', borderRadius:14 }}
    disabled={
      !customId ||
      !(Number(amount) > 0) ||
      !isValidEmail(email) ||
      (Number(amount) >= 75 && !tShirtSize) ||
      (needsShipping && (!addr.line1 || !addr.city || !addr.state || !addr.postal || !addr.country))
    }
    title="Donate with PayPal"
  >
    Donate with PayPal
  </button>

  <p style={{ marginTop:8, fontSize:12, color:'var(--pb-dim)' }}>
    You’ll be taken to a secure PayPal page to complete your donation.
  </p>
</form>

    {/* Selected tier + errors + policy */}
    {selectedTier && !noReward && (
      <div style={{ marginTop:8, fontSize:13, color:'var(--pb-bright)' }}>
        Selected Tier: <strong>{selectedTier.name}</strong> (${selectedTier.cost})
      </div>
    )}

    {errorMsg && (<div style={{ marginTop:8, fontSize:13 }} className="pb-error">{errorMsg}</div>)}

    <p style={{ marginTop:4, fontSize:11, color:'var(--pb-dim)' }}>
      By pledging you agree to our <a href="/refunds" style={{ color:'var(--pb-bright)' }}>Refunds & Responsibility</a> and <a href="/privacy" style={{ color:'var(--pb-bright)' }}>Privacy Policy</a>.
    </p>
  </div> {/* closes the Pledge Box panel */}

  {/* Rewards Banner */}
  <div className="pb-panel" style={{ padding:0, overflow:'hidden', marginTop:24 }}>
    <div style={{ aspectRatio:'21/5', width:'100%', display:'flex', alignItems:'center', justifyContent:'center', borderBottom:'1px solid var(--pb-border)', color:'var(--pb-dim)' }}>
      <img
        src="/images/rewards-banner2.jpg"
        alt="Rewards Banner"
        style={{ width:'100%', height:'100%', objectFit:'cover', filter:'grayscale(40%) contrast(1.2) brightness(0.8)' }}
      />
    </div>
  </div>

  {/* Reward Tiers (click to select) */}
  <div style={{ marginTop: 24, display: 'grid', gap: 12 }}>
    {tiers.map((t, idx) => (
      <div
        key={`${t.name}-${t.cost}-${idx}`}
        className="pb-panel"
        style={{
          padding: 16,
          cursor: 'pointer',
          boxShadow:
            selectedTier?.cost === t.cost
              ? '0 0 0 2px var(--pb-border-strong), inset 0 0 24px rgba(110,255,141,0.15)'
              : undefined
        }}
        onClick={() => chooseTier(t)}
      >
        <div className="pb-glow" style={{ fontWeight: 600 }}>
          {t.name} — ${t.cost}
        </div>
        <div style={{ color: 'var(--pb-dim)', marginTop: 6 }}>{t.rewards}</div>
      </div>
    ))}
  </div>
</section>



      {/* Cast & Producers */}
      <section className="pb-container" style={{ padding:'24px 0' }}>
        {/* Cast */}
        <div>
          <div className="pb-glow" style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>Cast</div>
          <div className="cast-grid">
            {CAST.map((person) => (
              <div key={person.key} className="cast-card pb-panel" style={{ padding:12 }}>
                <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', columnGap:12, alignItems:'center' }}>
                  <img
  src={person.img}
  alt={person.name}
  className="cast-headshot"
  onError={(e)=>{ e.currentTarget.style.display = 'none'; }}
/>
                  <div>
                    <div className="pb-glow" style={{ fontWeight:700 }}>{person.name}</div>
                    <details>
                      <summary style={{ cursor:'pointer', color:'var(--pb-dim)', marginTop:4 }}>View Bio</summary>
                      <p style={{ color:'var(--pb-dim)', marginTop:8 }}>{person.bio}</p>
                    </details>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Producers */}
        <div style={{ marginTop:24 }}>
          <div className="pb-glow" style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>Producers</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:12 }}>
            {[
              { label: 'SC Digital' },
              { label: 'Direct Action Media' },
              { label: 'Slaughter Project' },
               { label: 'GØØNTAPE' },
            ].map((p) => (
              <div
                key={p.label}
                className="pb-panel"
                style={{ padding:20, display:'flex', alignItems:'center', justifyContent:'center', minHeight:96, textAlign:'center' }}
              >
                <span
                  className="pb-glow"
                  style={{ fontWeight:800, fontSize:18, letterSpacing:'0.05em', color:'var(--pb-bright)', textShadow:'0 0 12px rgba(185,255,156,0.65)' }}
                >
                  {p.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* Sponsors */}
<section className="pb-container" style={{ padding:'24px 0' }}>
  <div className="pb-glow" style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>Sponsors</div>

  <div className="pb-panel" style={{ padding:16 }}>
    <div className="sponsors-grid">
      {SPONSORS.map((s, i) => (
        <a
          key={`${s.name}-${i}`}
          className="pb-panel sponsor-card"
          href={s.url || '#'}
          target={s.url ? '_blank' : undefined}
          rel={s.url ? 'noopener noreferrer' : undefined}
          style={{ textDecoration:'none' }}
        >
          <div className="sponsor-card-inner" style={{display:'grid', placeItems:'center', width:'100%'}}>
            <img
              src={`${s.logo}?v=1`}           // cache-bust
              alt={s.name}
              className="sponsor-logo"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fb = e.currentTarget.nextElementSibling;
                if (fb) fb.style.display = 'block';
              }}
            />
            <span className="sponsor-fallback" style={{display:'none', color:'var(--pb-dim)', fontSize:14}}>
              {s.name}
            </span>
          </div>
        </a>
      ))}
    </div>
  </div>
</section>


      {/* FAQ */}
      <section id="faq" className="pb-container" style={{ padding: '48px 0 72px' }}>
        <h2 className="pb-glow" style={{ fontSize: 22 }}>FAQ</h2>
        <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
          {[
            {
              q: "Is this affiliated with the creators of the original IP?",
              a: "No. Kill 'em Kindly is an entirely independent fan project. We aren’t affiliated with or endorsed by the original rights holders. We’re passionate fans drawing on the familiar lore, aesthetics, and staples that audiences love—but we’re also venturing into brand-new territory. Our goal is to honor what came before while telling stories that have never been told within this universe."
            },
           {
  q: "When does the crowdfunding end?",
  a: "Our crowdfunding campaign now ends November 30, 2025. There’s still time to back the project, unlock rewards, and help us reach our funding goals."
},
           {
  q: "What do I get for pledging?",
  a: "Every supporter unlocks access to exclusive updates through this site. To redeem a reward tier please ensure you type the proper amount into your donation selection. Rewards are based off of final donation amounts from one single donation. Donations are not stacked. If you'd like to alter your donation in any way please reach out to sconde@samcondedigital.com"
},
            {
              q: "How long is the film?",
              a: "We’re targeting a short film runtime of approximately 15–20 minutes. That length gives us enough space to explore new characters and storylines while keeping the production tightly focused, cinematic, and achievable within our budget."
            },
            {
  q: "What happens if rewards can’t be fulfilled or there are delays?",
  a: "All contributions are donations to support the project. We will make every reasonable effort to fulfill rewards after completion, but rewards are not guaranteed and may be delayed, modified, or canceled due to production or unforeseen circumstances."
},
          ].map((item, idx) => (
            <FaqItem key={idx} idx={idx} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

// --- Small components ------------------------------------------------------
function FaqItem({ idx, q, a }){
  const [open, setOpen] = React.useState(false);
  return (
    <div className="pb-panel" style={{ padding:0 }}>
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="pb-glow" style={{ width:'100%', textAlign:'left', padding:'14px 16px', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'space-between', border:'none', background:'transparent', color:'var(--pb-text)', cursor:'pointer' }}>
        <span>{q}</span>
        <span style={{ color:'var(--pb-dim)' }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{ color:'var(--pb-dim)', padding:'0 16px 14px' }}>{a}</div>
      )}
    </div>
  );
}

function RefundsModal({ open, onClose, text }){
  React.useEffect(() => {
    function onKey(e){ if (e.key === 'Escape') onClose(); }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="refunds-title" style={{ position:'fixed', inset:0, zIndex:1000, display:'grid', placeItems:'center', background:'rgba(0,0,0,.5)' }} onClick={(e)=>{ if (e.target === e.currentTarget) onClose(); }}>
      <div className="pb-panel" style={{ width:'min(880px, 92vw)', maxHeight:'80vh', overflow:'hidden', boxShadow:'var(--pb-shadow)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', borderBottom:'1px solid var(--pb-border)' }}>
          <div id="refunds-title" className="pb-glow" style={{ fontWeight:800 }}>Refunds & Responsibility</div>
          <button className="pb-btn pb-btn-ghost" style={{ padding:'6px 10px', borderRadius:8 }} onClick={onClose} aria-label="Close policy">Close</button>
        </div>
        <div style={{ padding:'14px', maxHeight:'calc(80vh - 56px)', overflow:'auto', color:'var(--pb-dim)', whiteSpace:'pre-wrap', lineHeight:1.55 }}>
          {text}
        </div>
      </div>
    </div>
  );
}

function PrivacyModal({ open, onClose, text }){
  React.useEffect(() => {
    function onKey(e){ if (e.key === 'Escape') onClose(); }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="privacy-title" style={{ position:'fixed', inset:0, zIndex:1000, display:'grid', placeItems:'center', background:'rgba(0,0,0,.5)' }} onClick={(e)=>{ if (e.target === e.currentTarget) onClose(); }}>
      <div className="pb-panel" style={{ width:'min(880px, 92vw)', maxHeight:'80vh', overflow:'hidden', boxShadow:'var(--pb-shadow)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', borderBottom:'1px solid var(--pb-border)' }}>
          <div id="privacy-title" className="pb-glow" style={{ fontWeight:800 }}>Privacy Policy</div>
          <button className="pb-btn pb-btn-ghost" style={{ padding:'6px 10px', borderRadius:8 }} onClick={onClose} aria-label="Close privacy">Close</button>
        </div>
        <div style={{ padding:'14px', maxHeight:'calc(80vh - 56px)', overflow:'auto', color:'var(--pb-dim)', whiteSpace:'pre-wrap', lineHeight:1.55 }}>
          {text}
        </div>
      </div>
    </div>
  );
}
