import { useState, useEffect, createContext, useContext, useCallback } from "react";

const T = {
  bg:"#0F1419",white:"#FFFFFF",muted:"#A0AEC0",green:"#2ECC71",
  red:"#E74C3C",orange:"#F39C12",ff:"'Segoe UI', -apple-system, sans-serif"
};

const Spin = () => <span style={{display:"inline-block",width:14,height:14,border:"2px solid #A0AEC0",borderTop:"2px solid #2ECC71",borderRadius:"50%",animation:"spin .8s linear infinite"}} />;

const flex = (dir="row",just="center",align="center",gap=0) => ({
  display:"flex",flexDirection:dir,justifyContent:just,alignItems:align,gap:gap
});

const card = ({padding=16,marginBottom=0,background=T.bg}) => ({
  padding,marginBottom,background,borderRadius:8,border:`1px solid rgba(255,255,255,.08)`
});

const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

const LEVELS = {
  free:   { name:"Free",   color:"#7F8C8D", icon:"👤", price:0,    commission:{l1:0,  l2:0, l3:0} },
  bronze: { name:"Bronze", color:"#CD7F32", icon:"🥉", price:2000,  commission:{l1:10, l2:4, l3:1} },
  silver: { name:"Silver", color:"#BDC3C7", icon:"🥈", price:6000,  commission:{l1:15, l2:6, l3:2} },
  gold:   { name:"Gold",   color:"#F1C40F", icon:"🥇", price:18000, commission:{l1:20, l2:8, l3:3} },
  elite:  { name:"Elite",  color:"#85C1E9", icon:"💎", price:54000, commission:{l1:30, l2:10,l3:4} },
};

const LEVEL_ORDER = ["free","bronze","silver","gold","elite"];

const ACCESS = {
  free:   { canBuy:false, hasReferral:false, canWithdraw:false },
  bronze: { canBuy:true,  hasReferral:true,  canWithdraw:true  },
  silver: { canBuy:true,  hasReferral:true,  canWithdraw:true  },
  gold:   { canBuy:true,  hasReferral:true,  canWithdraw:true  },
  elite:  { canBuy:true,  hasReferral:true,  canWithdraw:true  },
};

const Divider = ({mt=0,mb=0}) => <div style={{height:1,background:"rgba(255,255,255,.08)",marginTop:mt,marginBottom:mb}} />;

const useAuth0 = () => {
  const getStored = () => {
    try {
      const stored = localStorage.getItem("authUser");
      return stored ? JSON.parse(stored) : null;
    } catch(e) { return null; }
  };
  const [auth,setAuth] = useState(getStored);
  return {
    user: auth,
    setUser: (u) => { setAuth(u); localStorage.setItem("authUser", JSON.stringify(u)); },
    logout: () => { setAuth(null); localStorage.removeItem("authUser"); }
  };
};

const scr = {minHeight:"100vh",background:T.bg,fontFamily:T.ff,color:T.white,display:"flex",flexDirection:"column",alignItems:"center",overflowX:"hidden"};
const cont = {width:"100%",maxWidth:480,padding:"0 16px",margin:"0 auto"};
const lbl = {fontSize:11,color:T.muted,marginBottom:6,display:"block",fontWeight:600,letterSpacing:".5px",textTransform:"uppercase"};
const inp = {width:"100%",padding:"12px 14px",background:"rgba(255,255,255,.05)",border:`1px solid rgba(255,255,255,.1)`,borderRadius:6,color:T.white,fontSize:14,fontFamily:T.ff,boxSizing:"border-box",marginBottom:12};
const btnG = () => ({width:"100%",padding:"14px 16px",background:T.green,color:T.bg,border:"none",borderRadius:6,fontSize:14,fontWeight:600,cursor:"pointer",marginBottom:12,transition:"all .2s"});
const btnS = () => ({width:"100%",padding:"12px 16px",background:"rgba(255,255,255,.08)",color:T.white,border:`1px solid rgba(255,255,255,.1)`,borderRadius:6,fontSize:13,cursor:"pointer",marginBottom:8,transition:"all .2s"});

function App() {
  const {user,setUser,logout} = useAuth0();
  const getInitialScreen = () => {
    try {
      const stored = localStorage.getItem("authUser");
      return stored ? "dashboard" : "splash";
    } catch(e) { return "splash"; }
  };
  const [screen,setScreen] = useState(getInitialScreen);
  const [loading,setLoading] = useState(false);
  const [formData,setFormData] = useState({});
  const [show,setShow] = useState({});

  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:T.ff,color:T.white}}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .fade { animation: fadeIn 0.8s ease-in; }
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: ${T.bg}; color: ${T.white}; font-family: ${T.ff}; }
        input:focus, textarea:focus { outline: none; border-color: ${T.green} !important; background: rgba(255,255,255,.08) !important; }
        button:hover { opacity: 0.9; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
      {screen === "splash" && <SplashScreen next={() => setScreen("onboarding")} />}
      {screen === "onboarding" && <OnboardingScreen next={() => setScreen("login")} />}
      {screen === "login" && <LoginScreen next={(u) => { setUser(u); setScreen("dashboard"); }} toReg={() => setScreen("register")} />}
      {screen === "register" && <RegisterScreen next={(u) => { setUser(u); setScreen("dashboard"); }} toLogin={() => setScreen("login")} />}
      {screen === "dashboard" && <DashboardScreen user={user} setScreen={setScreen} logout={() => { logout(); setScreen("splash"); }} />}
      {screen === "products" && <ProductsScreen user={user} setScreen={setScreen} />}
      {screen === "referral" && <ReferralScreen user={user} setScreen={setScreen} />}
      {screen === "profile" && <ProfileScreen user={user} setUser={setUser} setScreen={setScreen} logout={() => { logout(); setScreen("splash"); }} />}
      {screen === "earnings" && <EarningsScreen user={user} setScreen={setScreen} />}
    </div>
  );
}

function SplashScreen({next}) {
  return (
    <div style={scr}>
      <div style={{...cont,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"100vh"}}>
        <div className="fade" style={{textAlign:"center"}}>
          <img src="/logo.png" alt="IncomeHub NG" style={{width:130,height:130,borderRadius:"50%",marginBottom:20,objectFit:"contain"}} onError={(e)=>{e.target.style.display="none";}} />
          <h1 style={{fontSize:28,fontWeight:700,margin:"0 0 12px",color:T.white}}>IncomeHub NG</h1>
          <p style={{fontSize:13,color:T.muted,marginBottom:32}}>Multiple Streams. One Platform.</p>
          <button onClick={next} style={{...btnG(),width:"100%"}}>Get Started</button>
        </div>
      </div>
    </div>
  );
}

function OnboardingScreen({next}) {
  const slides = [
    {emoji:"📚",title:"Learn While You Earn",body:"Access exclusive masterclasses, eBooks, and toolkits. Higher levels unlock premium content."},
    {emoji:"🤝",title:"Refer. Build. Multiply.",body:"Get your referral link from Bronze level. Earn commissions 3 levels deep — up to 30% with Elite."},
    {emoji:"🔐",title:"Secure & Transparent",body:"Your earnings are tracked in real-time. Withdraw anytime to your bank account."},
  ];
  const [idx,setIdx] = useState(0);

  return (
    <div style={scr}>
      <div style={{...cont,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"100vh"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontSize:56,marginBottom:20}}>{slides[idx].emoji}</div>
          <h2 style={{fontSize:20,fontWeight:600,margin:"0 0 12px",color:T.white}}>{slides[idx].title}</h2>
          <p style={{fontSize:13,color:T.muted,margin:0}}>{slides[idx].body}</p>
        </div>
        <div style={{...flex("row","center","center",8),marginBottom:20}}>
          {slides.map((_,i) => <div key={i} style={{width:8,height:8,borderRadius:"50%",background:i===idx?T.green:"rgba(255,255,255,.2)"}} />)}
        </div>
        <button onClick={() => idx < slides.length-1 ? setIdx(idx+1) : next()} style={{...btnG(),width:"100%"}}>
          {idx === slides.length-1 ? "Start Earning" : "Next"}
        </button>
      </div>
    </div>
  );
}

function LoginScreen({next,toReg}) {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  const login = async () => {
    if(!email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true);
    try {
      const res = await fetch("https://incomehub-backend-production.up.railway.app/api/auth/login", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
      });
      const data = await res.json();
      if(data.success) {
        next(data.user);
      } else {
        setError(data.message || "Login failed");
      }
    } catch(e) {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={scr}>
      <div style={{...cont,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"100vh"}}>
        <div style={{width:"100%"}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <img src="/logo.png" alt="IncomeHub NG" style={{width:80,height:80,borderRadius:"50%",objectFit:"contain"}} onError={(e)=>{e.target.style.display="none";}} />
          </div>
          <h1 style={{fontSize:24,fontWeight:700,margin:"0 0 4px",color:T.white}}>Welcome Back</h1>
          <p style={{fontSize:12,color:T.muted,margin:"0 0 24px"}}>Log in to your IncomeHub account</p>
          
          {error && <div style={{...card({padding:12,marginBottom:16,background:"rgba(231,76,60,.1)"}),fontSize:12,color:T.red}}>{error}</div>}
          
          <label style={lbl}>Email Address</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inp} />
          
          <label style={lbl}>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={inp} />
          
          <button onClick={login} disabled={loading} style={{...btnG(),opacity:loading?0.6:1}}>
            {loading ? <span style={{...flex("row","center","center",8)}}><Spin /> Logging in...</span> : "Log In"}
          </button>
          
          <button onClick={toReg} style={{...btnS()}}>Create New Account</button>
        </div>
      </div>
    </div>
  );
}

function RegisterScreen({next,toLogin}) {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPwd,setConfirmPwd] = useState("");
  const [name,setName] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  const register = async () => {
    if(!email || !password || !confirmPwd || !name) { setError("Please fill in all fields"); return; }
    if(password !== confirmPwd) { setError("Passwords do not match"); return; }
    if(password.length < 8) { setError("Password must be at least 8 characters"); return; }
    
    setLoading(true);
    try {
      const res = await fetch("https://incomehub-backend-production.up.railway.app/api/auth/register", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password,name})
      });
      const data = await res.json();
      if(data.success) {
        next(data.user);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch(e) {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={scr}>
      <div style={{...cont,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"100vh"}}>
        <div style={{width:"100%"}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <img src="/logo.png" alt="IncomeHub NG" style={{width:80,height:80,borderRadius:"50%",objectFit:"contain"}} onError={(e)=>{e.target.style.display="none";}} />
          </div>
          <h1 style={{fontSize:24,fontWeight:700,margin:"0 0 4px",color:T.white}}>Join IncomeHub</h1>
          <p style={{fontSize:12,color:T.muted,margin:"0 0 24px"}}>Create your account in seconds</p>
          
          {error && <div style={{...card({padding:12,marginBottom:16,background:"rgba(231,76,60,.1)"}),fontSize:12,color:T.red}}>{error}</div>}
          
          <label style={lbl}>Full Name</label>
          <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} style={inp} />
          
          <label style={lbl}>Email Address</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inp} />
          
          <label style={lbl}>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={inp} />
          
          <label style={lbl}>Confirm Password</label>
          <input type="password" placeholder="••••••••" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} style={inp} />
          
          <div style={{...card({padding:12,marginBottom:20,background:"rgba(46,204,113,.05)"})}}>
            <p style={{margin:"0 0 4px",fontSize:12,fontWeight:600,color:T.green}}>Password Tips:</p>
            <p style={{margin:0,fontSize:11,color:T.muted,lineHeight:1.6}}>• At least 8 characters long
• Mix letters, numbers and symbols
• Avoid using your name or birthday</p>
          </div>
          
          <button onClick={register} disabled={loading} style={{...btnG(),opacity:loading?0.6:1}}>
            {loading ? <span style={{...flex("row","center","center",8)}}><Spin /> Creating...</span> : "Create Account"}
          </button>
          
          <button onClick={toLogin} style={{...btnS()}}>Already have an account?</button>
        </div>
      </div>
    </div>
  );
}


const BottomNav = ({active, setScreen}) => (
  <div style={{position:"fixed",bottom:0,left:0,right:0,height:68,background:"#0a1a0f",borderTop:"1px solid rgba(46,204,113,.15)",display:"flex",justifyContent:"space-around",alignItems:"center",paddingBottom:"env(safe-area-inset-bottom)",zIndex:100}}>
    {[
      {icon:"⊞",label:"Home",screen:"dashboard"},
      {icon:"🛍️",label:"Shop",screen:"products"},
      {icon:"🔗",label:"Refer",screen:"referral"},
      {icon:"💹",label:"Earnings",screen:"earnings"},
      {icon:"👤",label:"Profile",screen:"profile"},
    ].map((nav,i) => {
      const isActive = nav.screen === active;
      return (
        <button key={i} onClick={() => setScreen(nav.screen)} style={{background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,cursor:"pointer",padding:"4px 6px",minWidth:52}}>
          <div style={{fontSize:18,color:isActive?"#2ECC71":"#A0AEC0"}}>{nav.icon}</div>
          <span style={{fontSize:9,color:isActive?"#2ECC71":"#A0AEC0",fontWeight:isActive?700:400}}>{nav.label}</span>
          {isActive && <div style={{width:4,height:4,borderRadius:"50%",background:"#2ECC71"}} />}
        </button>
      );
    })}
  </div>
);

function DashboardScreen({user,setScreen,logout}) {
  const userLevel = LEVELS[user?.level || "free"];
  const h = new Date().getHours();
  const greeting = h < 12 ? "Good morning" : h < 17 ? "Good day" : "Good evening";
  const firstName = (user?.name || "User").split(" ")[0];
  const recentActivity = user?.recentActivity || [
    {icon:"⚡",title:"Upgraded from free to " + (user?.level || "bronze"),date:"13/06/2026",amount:-(LEVELS[user?.level || "bronze"].price)}
  ];

  return (
    <div style={{minHeight:"100vh",background:"#0F1419",fontFamily:"'Segoe UI',-apple-system,sans-serif",color:"#FFFFFF",overflowY:"auto"}}>
      <div style={{width:"100%",maxWidth:480,margin:"0 auto",paddingBottom:90,paddingTop:16}}>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 16px",marginBottom:20}}>
          <div>
            <p style={{margin:0,fontSize:13,color:"#2ECC71"}}>{greeting} 👋</p>
            <h1 style={{margin:0,fontSize:22,fontWeight:800,color:"#FFFFFF"}}>{firstName}.</h1>
          </div>
          <button onClick={() => setScreen("profile")} style={{background:"rgba(46,204,113,.15)",border:"1px solid rgba(46,204,113,.3)",borderRadius:"50%",width:44,height:44,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}>
            💰
          </button>
        </div>

        <div style={{margin:"0 16px 16px",borderRadius:16,background:"linear-gradient(135deg,#0d2b1a,#1a3d2b)",padding:20,border:"1px solid rgba(46,204,113,.2)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
            <div>
              <p style={{margin:"0 0 6px",fontSize:11,color:"rgba(255,255,255,.5)",fontWeight:600,letterSpacing:1}}>WALLET BALANCE</p>
              <p style={{margin:"0 0 4px",fontSize:32,fontWeight:800,color:"#FFFFFF"}}>₦{(user?.wallet || 0).toLocaleString()}</p>
              <p style={{margin:0,fontSize:12,color:"#2ECC71"}}>↑ ₦{(user?.weeklyEarnings || 0).toLocaleString()} this week</p>
            </div>
            <div style={{background:"rgba(0,0,0,.3)",borderRadius:10,padding:"6px 12px",textAlign:"center"}}>
              <p style={{margin:"0 0 2px",fontSize:10,color:"rgba(255,255,255,.5)",letterSpacing:.5}}>LEVEL</p>
              <p style={{margin:0,fontSize:14,fontWeight:800,color:userLevel.color}}>{userLevel.icon} {userLevel.name.toUpperCase()}</p>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            {[
              {emoji:"👥",value:String(user?.referralCount || 0),label:"Referrals"},
              {emoji:"💰",value:"₦"+(user?.referralEarnings || 0).toLocaleString(),label:"Ref. Earned"},
              {emoji:"📊",value:"₦"+(user?.earnings || 0).toLocaleString(),label:"Total Earned"},
            ].map((s,i) => (
              <div key={i} style={{background:"rgba(0,0,0,.25)",borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
                <div style={{fontSize:20,marginBottom:4}}>{s.emoji}</div>
                <p style={{margin:"0 0 2px",fontSize:13,fontWeight:700,color:"#FFFFFF"}}>{s.value}</p>
                <p style={{margin:0,fontSize:9,color:"rgba(255,255,255,.5)"}}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"0 16px",marginBottom:12}}>
          <button onClick={() => alert("Upgrade via your profile")} style={{background:"#2ECC71",color:"#0F1419",border:"none",borderRadius:12,padding:"14px 10px",fontSize:13,fontWeight:700,cursor:"pointer"}}>
            ⚡ Upgrade Level
          </button>
          <button onClick={() => setScreen("referral")} style={{background:"transparent",color:"#FFFFFF",border:"1.5px solid rgba(255,255,255,.2)",borderRadius:12,padding:"14px 10px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
            🔗 Refer &amp; Earn
          </button>
        </div>

        <div style={{overflowX:"auto",display:"flex",gap:8,padding:"0 16px 4px",scrollbarWidth:"none",marginBottom:20}}>
          {[
            {emoji:"🏧",label:"Withdraw",action:() => alert("Withdraw coming soon")},
            {emoji:"💳",label:"Deposit",action:() => alert("Deposit coming soon")},
            {emoji:"🛍️",label:"Buy",action:() => setScreen("products")},
            {emoji:"📊",label:"Report",action:() => alert("Report coming soon")},
          ].map((btn,i) => (
            <button key={i} onClick={btn.action} style={{background:"rgba(46,204,113,.08)",border:"1px solid rgba(46,204,113,.2)",borderRadius:20,padding:"8px 16px",color:"#FFFFFF",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:6}}>
              {btn.emoji} {btn.label}
            </button>
          ))}
        </div>

        <div style={{padding:"0 16px"}}>
          <h3 style={{margin:"0 0 12px",fontSize:16,fontWeight:700,color:"#FFFFFF"}}>Recent Activity</h3>
          {recentActivity.map((a,i) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"linear-gradient(135deg,#0d2b1a,#0a1f13)",border:"1px solid rgba(46,204,113,.15)",borderRadius:12,padding:"14px 16px",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,background:"rgba(46,204,113,.15)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
                  {a.icon}
                </div>
                <div>
                  <p style={{margin:"0 0 2px",fontSize:13,fontWeight:600,color:"#FFFFFF"}}>{a.title}</p>
                  <p style={{margin:0,fontSize:11,color:"#A0AEC0"}}>{a.date}</p>
                </div>
              </div>
              <p style={{margin:0,fontSize:14,fontWeight:700,color:a.amount < 0 ? "#E74C3C" : "#2ECC71"}}>
                {a.amount < 0 ? "-" : "+"}₦{Math.abs(a.amount).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="dashboard" setScreen={setScreen} />
    </div>
  );
}

function ProductsScreen({user,setScreen}) {
  const [activeTab,setActiveTab] = useState("all");

  const products = [
    {_id:"1",title:"Digital Marketing Mastery",description:"SEO, Ads, Social — full course",price:8500,category:"courses",requiredLevel:"bronze",emoji:"📱",rating:4.8,sales:234},
    {_id:"2",title:"Forex Trading Blueprint",description:"Step-by-step forex roadmap",price:12000,category:"courses",requiredLevel:"bronze",emoji:"📈",rating:4.9,sales:189},
    {_id:"3",title:"Business Plan Templates",description:"10 ready-to-use Nigerian business templates",price:2000,category:"tools",requiredLevel:"bronze",emoji:"📋",rating:4.6,sales:98},
    {_id:"4",title:"Affiliate Marketing Mastery",description:"Earn passive income from top affiliate platforms",price:4500,category:"ebooks",requiredLevel:"silver",emoji:"📘",rating:4.8,sales:203},
    {_id:"5",title:"Social Media Growth Kit",description:"Templates and tools to grow any page fast",price:6000,category:"tools",requiredLevel:"silver",emoji:"📲",rating:4.7,sales:145},
    {_id:"6",title:"Crypto Wealth Guide",description:"Beginner to advanced crypto investment strategies",price:15000,category:"ebooks",requiredLevel:"gold",emoji:"₿",rating:4.8,sales:89},
    {_id:"7",title:"Elite Investment Guide",description:"Stocks, REITs and portfolio diversification",price:18000,category:"ebooks",requiredLevel:"elite",emoji:"💼",rating:4.9,sales:67},
    {_id:"8",title:"Video Content Creation Masterclass",description:"Script, film and edit — full production course",price:15000,category:"courses",requiredLevel:"elite",emoji:"🎬",rating:5.0,sales:34},
    {_id:"9",title:"E-commerce & Dropshipping Blueprint",description:"Start a Nigerian online store from zero — no inventory needed",price:9000,category:"courses",requiredLevel:"silver",emoji:"🛒",rating:4.7,sales:112},
    {_id:"10",title:"Public Speaking & Personal Branding",description:"Command any room and build a powerful personal brand online",price:7500,category:"ebooks",requiredLevel:"bronze",emoji:"🎤",rating:4.8,sales:176},
  ];

  const tabs = ["all","courses","ebooks","tools","membership"];

  const filtered = activeTab === "all" ? products
    : activeTab === "membership" ? []
    : products.filter(p => p.category === activeTab);

  const canAccess = (requiredLevel) => {
    const userIdx = LEVEL_ORDER.indexOf(user?.level || "free");
    const requiredIdx = LEVEL_ORDER.indexOf(requiredLevel);
    return userIdx >= requiredIdx;
  };

  const levelBadgeColor = (lvl) => ({
    bronze:"#CD7F32", silver:"#BDC3C7", gold:"#F1C40F", elite:"#85C1E9", free:"#7F8C8D"
  }[lvl] || "#7F8C8D");

  return (
    <div style={{...scr,overflowY:"auto"}}>
      <div style={{width:"100%",maxWidth:480,margin:"0 auto",paddingBottom:90}}>

        {/* Hero Banner */}
        <div style={{margin:"12px 12px 0",borderRadius:16,background:"linear-gradient(135deg,#1a3d2b,#0d2b1a)",padding:"20px 16px",position:"relative",overflow:"hidden",minHeight:160,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
          <div style={{position:"absolute",top:0,right:0,bottom:0,width:"40%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:60,opacity:.9}}>💼</div>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:T.green,borderRadius:20,padding:"4px 10px",marginBottom:12}}>
              <span style={{fontSize:10}}>🔥</span>
              <span style={{fontSize:10,fontWeight:700,color:T.bg}}>FEATURED</span>
            </div>
            <h2 style={{margin:"0 0 6px",fontSize:22,fontWeight:800,color:T.white,lineHeight:1.2}}>Become a Reseller</h2>
            <p style={{margin:"0 0 16px",fontSize:12,color:"rgba(255,255,255,.7)"}}>Earn 30–50% on every product you sell</p>
            <button onClick={() => alert("Upgrade to Bronze or higher to start reselling")} style={{background:T.green,color:T.bg,border:"none",borderRadius:20,padding:"10px 20px",fontSize:13,fontWeight:700,cursor:"pointer"}}>
              Start Reselling
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{overflowX:"auto",display:"flex",gap:8,padding:"16px 12px 8px",scrollbarWidth:"none"}}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding:"8px 16px",
              borderRadius:20,
              border: activeTab===tab ? "none" : `1px solid rgba(255,255,255,.15)`,
              background: activeTab===tab ? T.green : "transparent",
              color: activeTab===tab ? T.bg : T.white,
              fontSize:13,
              fontWeight: activeTab===tab ? 700 : 400,
              cursor:"pointer",
              whiteSpace:"nowrap",
              textTransform:"capitalize",
            }}>
              {tab === "all" ? "All" : tab.charAt(0).toUpperCase()+tab.slice(1)}
            </button>
          ))}
        </div>

        {/* 2-Column Product Grid */}
        {activeTab === "membership" ? (
          <div style={{padding:"20px 12px",textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:12}}>🏆</div>
            <p style={{color:T.muted,fontSize:13}}>Go to your profile to upgrade your membership level.</p>
            <button onClick={() => setScreen("profile")} style={{...btnG(),width:"auto",padding:"10px 24px",marginTop:8}}>View Memberships</button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{padding:"40px 12px",textAlign:"center"}}>
            <p style={{color:T.muted,fontSize:13}}>No products in this category yet.</p>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,padding:"8px 12px"}}>
            {filtered.map(p => (
              <div key={p._id} style={{
                background:"#0d2b1a",
                borderRadius:14,
                overflow:"hidden",
                display:"flex",
                flexDirection:"column",
                border:"1px solid rgba(46,204,113,.15)",
              }}>
                {/* Level Badge + Emoji Area */}
                <div style={{background:"rgba(46,204,113,.07)",padding:"12px 10px 8px",position:"relative"}}>
                  <div style={{
                    display:"inline-block",
                    fontSize:10,
                    fontWeight:700,
                    color:levelBadgeColor(p.requiredLevel),
                    marginBottom:8,
                    letterSpacing:".3px"
                  }}>
                    {LEVELS[p.requiredLevel].name}+
                  </div>
                  <div style={{fontSize:44,lineHeight:1,display:"block"}}>{p.emoji}</div>
                </div>

                {/* Content */}
                <div style={{padding:"10px 10px 12px",display:"flex",flexDirection:"column",flex:1,gap:4}}>
                  <p style={{margin:0,fontSize:13,fontWeight:700,color:T.white,lineHeight:1.3}}>{p.title}</p>
                  <p style={{margin:0,fontSize:11,color:T.muted,lineHeight:1.4,flex:1}}>{p.description}</p>
                  <p style={{margin:"6px 0 2px",fontSize:17,fontWeight:800,color:T.green}}>
                    ₦{p.price.toLocaleString()}
                  </p>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,fontSize:11,color:T.muted}}>
                    <span>★ {p.rating}</span>
                    <span>•</span>
                    <span>{p.sales} sold</span>
                  </div>
                  <button
                    onClick={() => canAccess(p.requiredLevel)
                      ? alert("Purchase feature coming soon")
                      : alert(`Upgrade to ${LEVELS[p.requiredLevel].name} to access this`)}
                    style={{
                      background: canAccess(p.requiredLevel) ? T.green : "rgba(255,255,255,.08)",
                      color: canAccess(p.requiredLevel) ? T.bg : T.muted,
                      border:"none",
                      borderRadius:20,
                      padding:"10px 0",
                      fontSize:13,
                      fontWeight:700,
                      cursor:"pointer",
                      width:"100%",
                    }}>
                    {canAccess(p.requiredLevel) ? "Buy Now" : "🔒 Locked"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <BottomNav active="products" setScreen={setScreen} />
    </div>
  );
}


function ReferralScreen({user,setScreen}) {
  const levelKey = user?.level || "free";
  const userLevel = LEVELS[levelKey];
  const referralCode = user?.referralCode || ("INGHUB-" + (user?._id || "XXXXXXX").slice(-7).toUpperCase());
  const referralLink = "https://incomehub-ng.vercel.app?ref=" + referralCode;

  const shareVia = (platform) => {
    const text = "Join IncomeHub NG — Multiple Streams. One Platform. Use my referral link and let's earn together!";
    if(platform === "copy") {
      navigator.clipboard.writeText(referralLink).then(() => alert("Link copied!")).catch(() => alert("Link: " + referralLink));
    } else if(platform === "whatsapp") {
      window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(text + "\n\n" + referralLink), "_blank");
    } else if(platform === "email") {
      window.open("mailto:?subject=Join IncomeHub NG&body=" + encodeURIComponent(text + "\n\n" + referralLink), "_blank");
    } else if(platform === "share") {
      if(navigator.share) {
        navigator.share({title:"IncomeHub NG",text:text,url:referralLink}).catch(() => {});
      } else {
        navigator.clipboard.writeText(referralLink).then(() => alert("Link copied!")).catch(() => {});
      }
    }
  };

  return (
    <div style={{minHeight:"100vh",background:"#0F1419",fontFamily:"'Segoe UI',-apple-system,sans-serif",color:"#FFFFFF",overflowY:"auto"}}>
      <div style={{width:"100%",maxWidth:480,margin:"0 auto",paddingBottom:90,paddingTop:20}}>

        <div style={{padding:"0 16px",marginBottom:20}}>
          <h1 style={{margin:"0 0 4px",fontSize:22,fontWeight:800,color:"#FFFFFF"}}>Referral Hub</h1>
          <p style={{margin:0,fontSize:13,color:"#A0AEC0"}}>Share your link · Grow your passive income</p>
        </div>

        {/* Big Referral Code Card */}
        <div style={{margin:"0 16px 16px",borderRadius:16,background:"linear-gradient(135deg,#0d2b1a,#1a3d2b)",padding:20,border:"1px solid rgba(46,204,113,.2)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
            <div>
              <p style={{margin:"0 0 8px",fontSize:10,color:"rgba(255,255,255,.5)",fontWeight:600,letterSpacing:1}}>YOUR REFERRAL CODE</p>
              <p style={{margin:"0 0 12px",fontSize:26,fontWeight:900,color:"#2ECC71",letterSpacing:1,lineHeight:1.1}}>{referralCode}</p>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(0,0,0,.3)",borderRadius:20,padding:"4px 12px"}}>
                <span style={{fontSize:14}}>{userLevel.icon}</span>
                <span style={{fontSize:11,fontWeight:700,color:userLevel.color}}>{userLevel.name.toUpperCase()}</span>
              </div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:36,marginBottom:4}}>🎯</div>
              <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,.5)"}}>{user?.referralCount || 0} total</p>
            </div>
          </div>

          {/* Copy Link Row */}
          <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(0,0,0,.3)",borderRadius:10,padding:"10px 14px",marginBottom:14}}>
            <p style={{margin:0,fontSize:11,color:"#A0AEC0",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontFamily:"monospace"}}>{referralLink}</p>
            <button onClick={() => shareVia("copy")} style={{background:"transparent",border:"1.5px solid #2ECC71",color:"#2ECC71",borderRadius:8,padding:"5px 14px",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>Copy</button>
          </div>

          {/* Share Buttons */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            {[
              {emoji:"📤",label:"Share",action:"share"},
              {emoji:"📱",label:"WhatsApp",action:"whatsapp"},
              {emoji:"✉️",label:"Email",action:"email"},
            ].map((btn,i) => (
              <button key={i} onClick={() => shareVia(btn.action)} style={{background:"rgba(46,204,113,.08)",border:"1px solid rgba(46,204,113,.2)",borderRadius:10,padding:"12px 8px",color:"#FFFFFF",fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                <span style={{fontSize:22}}>{btn.emoji}</span>
                <span style={{color:"#2ECC71"}}>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2 stat cards */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"0 16px",marginBottom:20}}>
          <div style={{background:"linear-gradient(135deg,#0d2b1a,#1a3d2b)",border:"1px solid rgba(46,204,113,.2)",borderRadius:14,padding:"16px 12px",textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:6}}>💸</div>
            <p style={{margin:"0 0 2px",fontSize:22,fontWeight:800,color:"#2ECC71"}}>{userLevel.commission.l1}%</p>
            <p style={{margin:0,fontSize:11,color:"#A0AEC0"}}>Your Commission</p>
          </div>
          <div style={{background:"linear-gradient(135deg,#0d2b1a,#1a3d2b)",border:"1px solid rgba(46,204,113,.2)",borderRadius:14,padding:"16px 12px",textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:6}}>💰</div>
            <p style={{margin:"0 0 2px",fontSize:22,fontWeight:800,color:"#2ECC71"}}>₦{(user?.referralEarnings || 0).toLocaleString()}</p>
            <p style={{margin:0,fontSize:11,color:"#A0AEC0"}}>Total Earned</p>
          </div>
        </div>

        {/* Commission Tiers */}
        <div style={{padding:"0 16px"}}>
          <h3 style={{margin:"0 0 12px",fontSize:16,fontWeight:700,color:"#FFFFFF"}}>Your Commission Tiers</h3>
          {["bronze","silver","gold","elite"].map(level => {
            const lv = LEVELS[level];
            const isCurrentOrAbove = LEVEL_ORDER.indexOf(levelKey) >= LEVEL_ORDER.indexOf(level);
            return (
              <div key={level} style={{background:isCurrentOrAbove?"linear-gradient(135deg,#0d2b1a,#1a3d2b)":"rgba(255,255,255,.03)",border:`1px solid ${isCurrentOrAbove?"rgba(46,204,113,.25)":"rgba(255,255,255,.06)"}`,borderRadius:12,padding:"14px 16px",marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:18}}>{lv.icon}</span>
                    <span style={{fontSize:13,fontWeight:700,color:lv.color}}>{lv.name}</span>
                    {levelKey === level && <span style={{fontSize:9,background:"#2ECC71",color:"#0F1419",padding:"2px 6px",borderRadius:10,fontWeight:700}}>YOU</span>}
                  </div>
                  <span style={{fontSize:12,color:"#A0AEC0"}}>₦{lv.price.toLocaleString()}</span>
                </div>
                <div style={{display:"flex",gap:16,fontSize:11}}>
                  <span style={{color:isCurrentOrAbove?"#2ECC71":"#A0AEC0"}}>L1: {lv.commission.l1}%</span>
                  <span style={{color:isCurrentOrAbove?"#2ECC71":"#A0AEC0"}}>L2: {lv.commission.l2}%</span>
                  <span style={{color:isCurrentOrAbove?"#2ECC71":"#A0AEC0"}}>L3: {lv.commission.l3}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav active="referral" setScreen={setScreen} />
    </div>
  );
}

function ProfileScreen({user,setUser,setScreen,logout}) {
  const [editMode,setEditMode] = useState(false);
  const [formData,setFormData] = useState({name:user?.name||"",email:user?.email||""});
  const [loading,setLoading] = useState(false);
  const levelKey = user?.level || "free";
  const userLevel = LEVELS[levelKey];
  const isFree = levelKey === "free";

  const initials = (user?.name||"U").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);

  const updateProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://incomehub-backend-production.up.railway.app/api/user/profile", {
        method:"PUT",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+(user?.token||"")},
        body:JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success) { setUser({...user,...data.user}); setEditMode(false); }
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const menuItem = (emoji, title, subtitle, locked, action) => (
    <button onClick={action} style={{width:"100%",background:"none",border:"none",cursor:"pointer",padding:"14px 16px",display:"flex",alignItems:"center",gap:14,textAlign:"left"}}>
      <div style={{width:38,height:38,background:"rgba(46,204,113,.1)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{emoji}</div>
      <div style={{flex:1}}>
        <p style={{margin:0,fontSize:14,fontWeight:600,color:"#FFFFFF"}}>{title}{locked?" 🔒":""}</p>
        <p style={{margin:"2px 0 0",fontSize:12,color:"#A0AEC0"}}>{subtitle}</p>
      </div>
      <span style={{color:"#A0AEC0",fontSize:16}}>›</span>
    </button>
  );

  return (
    <div style={{minHeight:"100vh",background:"#0F1419",fontFamily:"'Segoe UI',-apple-system,sans-serif",color:"#FFFFFF",overflowY:"auto"}}>
      <div style={{width:"100%",maxWidth:480,margin:"0 auto",paddingBottom:90}}>

        {/* Green header bg */}
        <div style={{background:"linear-gradient(180deg,#0d2b1a 0%,#0F1419 100%)",padding:"40px 16px 24px",textAlign:"center"}}>

          {/* Avatar */}
          <div style={{position:"relative",width:90,height:90,margin:"0 auto 16px"}}>
            <div style={{width:90,height:90,borderRadius:"50%",background:"#2ECC71",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,fontWeight:800,color:"#0F1419"}}>
              {initials}
            </div>
            <button onClick={() => alert("Avatar upload coming soon")} style={{position:"absolute",bottom:2,right:2,width:28,height:28,background:"#F39C12",border:"2px solid #0F1419",borderRadius:"50%",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              ✏️
            </button>
          </div>

          <h2 style={{margin:"0 0 4px",fontSize:20,fontWeight:800,color:"#FFFFFF"}}>{user?.name||"User"}</h2>
          <p style={{margin:"0 0 16px",fontSize:13,color:"#A0AEC0"}}>{user?.email||""}</p>

          {/* Level badge + Upgrade */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.1)",borderRadius:20,padding:"6px 14px"}}>
              <span style={{fontSize:14}}>👤</span>
              <span style={{fontSize:13,fontWeight:700,color:"#FFFFFF"}}>{userLevel.name.toUpperCase()}</span>
            </div>
            <button onClick={() => alert("Select a membership tier to upgrade")} style={{background:"#2ECC71",color:"#0F1419",border:"none",borderRadius:20,padding:"6px 18px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
              ⚡ Upgrade
            </button>
          </div>
        </div>

        {/* 3 Stats Row */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",borderTop:"1px solid rgba(46,204,113,.15)",borderBottom:"1px solid rgba(46,204,113,.15)"}}>
          {[
            {value:"₦"+(user?.earnings||0).toLocaleString(),label:"Total Earned"},
            {value:String(user?.referralCount||0),label:"Referrals"},
            {value:userLevel.name,label:"Current Level",color:userLevel.color},
          ].map((s,i) => (
            <div key={i} style={{padding:"16px 8px",textAlign:"center",borderRight:i<2?"1px solid rgba(46,204,113,.15)":"none"}}>
              <p style={{margin:"0 0 4px",fontSize:15,fontWeight:800,color:s.color||"#2ECC71"}}>{s.value}</p>
              <p style={{margin:0,fontSize:10,color:"#A0AEC0"}}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Upgrade Banner (only if free) */}
        {isFree && (
          <div style={{margin:"16px 16px 0",border:"1.5px solid #F39C12",borderRadius:12,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(243,156,18,.05)"}}>
            <p style={{margin:0,fontSize:13,fontWeight:600,color:"#F39C12",flex:1}}>🔒 Upgrade to unlock full profile features</p>
            <button onClick={() => alert("Select a membership to upgrade")} style={{background:"#2ECC71",color:"#0F1419",border:"none",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer",marginLeft:10,whiteSpace:"nowrap"}}>Upgrade</button>
          </div>
        )}

        {/* ACCOUNT Section */}
        <div style={{padding:"20px 16px 0"}}>
          <p style={{margin:"0 0 10px",fontSize:11,fontWeight:700,color:"#A0AEC0",letterSpacing:1}}>ACCOUNT</p>
          <div style={{background:"linear-gradient(135deg,#0d2b1a,#0a1f13)",border:"1px solid rgba(46,204,113,.15)",borderRadius:14,overflow:"hidden"}}>
            {menuItem("👤","Edit Profile","Name, photo, bio", false, () => setEditMode(true))}
            <div style={{height:1,background:"rgba(46,204,113,.1)",margin:"0 16px"}} />
            {menuItem("🏦","Bank Accounts","Upgrade to add bank account", isFree, () => isFree ? alert("Upgrade to Bronze to add bank accounts") : alert("Bank account management coming soon"))}
          </div>
        </div>

        {/* Edit Profile Modal-style */}
        {editMode && (
          <div style={{margin:"16px 16px 0",background:"linear-gradient(135deg,#0d2b1a,#0a1f13)",border:"1px solid rgba(46,204,113,.2)",borderRadius:14,padding:16}}>
            <p style={{margin:"0 0 14px",fontSize:14,fontWeight:700,color:"#FFFFFF"}}>Edit Profile</p>
            <label style={lbl}>Full Name</label>
            <input type="text" value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})} style={inp} />
            <label style={lbl}>Email</label>
            <input type="email" value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})} style={inp} />
            <button onClick={updateProfile} disabled={loading} style={{...btnG(),opacity:loading?0.6:1}}>
              {loading?"Saving...":"Save Changes"}
            </button>
            <button onClick={()=>setEditMode(false)} style={{...btnS()}}>Cancel</button>
          </div>
        )}

        {/* EARNINGS Section */}
        <div style={{padding:"20px 16px 0"}}>
          <p style={{margin:"0 0 10px",fontSize:11,fontWeight:700,color:"#A0AEC0",letterSpacing:1}}>EARNINGS</p>
          <div style={{background:"linear-gradient(135deg,#0d2b1a,#0a1f13)",border:"1px solid rgba(46,204,113,.15)",borderRadius:14,overflow:"hidden"}}>
            {menuItem("💰","Withdrawal History","View all past withdrawals", false, () => alert("Withdrawal history coming soon"))}
            <div style={{height:1,background:"rgba(46,204,113,.1)",margin:"0 16px"}} />
            {menuItem("🚀","Reward Points","Coming soon — gaming & points economy", false, () => alert("Reward Points coming soon! Stay tuned for the gaming update."))}
          </div>
        </div>

        {/* SUPPORT Section */}
        <div style={{padding:"20px 16px 0"}}>
          <p style={{margin:"0 0 10px",fontSize:11,fontWeight:700,color:"#A0AEC0",letterSpacing:1}}>SUPPORT</p>
          <div style={{background:"linear-gradient(135deg,#0d2b1a,#0a1f13)",border:"1px solid rgba(46,204,113,.15)",borderRadius:14,overflow:"hidden"}}>
            {menuItem("📧","Email Us","incomehubng@gmail.com", false, () => window.open("mailto:incomehubng@gmail.com","_blank"))}
            <div style={{height:1,background:"rgba(46,204,113,.1)",margin:"0 16px"}} />
            {menuItem("💬","WhatsApp","07080707446 (chat only)", false, () => window.open("https://wa.me/2347080707446","_blank"))}
            <div style={{height:1,background:"rgba(46,204,113,.1)",margin:"0 16px"}} />
            {menuItem("📞","Call Us","09028134166 (calls only)", false, () => window.open("tel:09028134166","_blank"))}
          </div>
        </div>

        {/* Logout */}
        <div style={{padding:"20px 16px 0"}}>
          <button onClick={logout} style={{width:"100%",background:"rgba(231,76,60,.08)",color:"#E74C3C",border:"1px solid rgba(231,76,60,.25)",borderRadius:12,padding:"14px",fontSize:14,fontWeight:700,cursor:"pointer"}}>
            🚪 Log Out
          </button>
        </div>

      </div>
      <BottomNav active="profile" setScreen={setScreen} />
    </div>
  );
}

function EarningsScreen({user, setScreen}) {
  const levelKey = user?.level || "free";
  const [calcLevel, setCalcLevel] = useState(levelKey === "free" ? "bronze" : levelKey);
  const [refs, setRefs] = useState(5);

  const scenarios = [
    {refs:5,  label:"Starter",  emoji:"🌱"},
    {refs:10, label:"Growing",  emoji:"🌿"},
    {refs:20, label:"Hustler",  emoji:"🔥"},
    {refs:50, label:"Pro",      emoji:"💎"},
  ];

  const calc = (level, numRefs) => {
    const lv = LEVELS[level];
    const avgPrice = lv.price;
    const l1 = numRefs;
    const l2 = numRefs * numRefs;
    const l3 = numRefs * numRefs * numRefs;
    const e1 = (avgPrice * lv.commission.l1 / 100) * l1;
    const e2 = (avgPrice * lv.commission.l2 / 100) * l2;
    const e3 = (avgPrice * lv.commission.l3 / 100) * l3;
    return { l1, l2, l3, e1, e2, e3, total: e1 + e2 + e3 };
  };

  const result = calc(calcLevel, Number(refs) || 0);
  const lv = LEVELS[calcLevel];

  const encouragement = {
    bronze: "A great starting point! Bronze gives you access to referrals and digital products. But imagine how much more you could earn at higher levels...",
    silver: "Silver is where momentum begins! With 15% L1 commission, you're earning significantly more per referral. Upgrade to Gold to truly unlock the power of passive income.",
    gold:   "Gold earners are serious about income! 20% commission means every referral puts serious money in your pocket. One more step to Elite changes everything.",
    elite:  "Elite is the ultimate level! 30% L1 commission, 10% L2, and 4% L3 means your network works for you around the clock. This is where real wealth is built on IncomeHub NG.",
  };

  return (
    <div style={{minHeight:"100vh",background:"#0F1419",fontFamily:"'Segoe UI',-apple-system,sans-serif",color:"#FFFFFF",overflowY:"auto"}}>
      <div style={{width:"100%",maxWidth:480,margin:"0 auto",paddingBottom:90}}>

        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#0d2b1a,#1a3d2b)",padding:"32px 16px 24px"}}>
          <p style={{margin:"0 0 4px",fontSize:12,color:"#2ECC71",fontWeight:600,letterSpacing:1}}>INCOMEHUB NG</p>
          <h1 style={{margin:"0 0 6px",fontSize:24,fontWeight:900,color:"#FFFFFF"}}>Earnings Potential</h1>
          <p style={{margin:0,fontSize:13,color:"rgba(255,255,255,.6)"}}>See what you could earn through our referral network</p>
        </div>

        {/* How it works */}
        <div style={{margin:"16px 16px 0",background:"rgba(46,204,113,.06)",border:"1px solid rgba(46,204,113,.2)",borderRadius:14,padding:16}}>
          <p style={{margin:"0 0 12px",fontSize:13,fontWeight:700,color:"#2ECC71"}}>💡 How the 3-Level System Works</p>
          <div style={{fontSize:12,color:"rgba(255,255,255,.8)",lineHeight:1.8}}>
            <p style={{margin:"0 0 6px"}}>👤 <b style={{color:"#fff"}}>You</b> refer 5 people → those are your <b style={{color:"#2ECC71"}}>Level 1</b> referrals</p>
            <p style={{margin:"0 0 6px"}}>👥 Each of your 5 refers 5 more → <b style={{color:"#2ECC71"}}>Level 2</b> = 25 people</p>
            <p style={{margin:0}}>👥 Each of those 25 refers 5 more → <b style={{color:"#2ECC71"}}>Level 3</b> = 125 people</p>
          </div>
          <div style={{marginTop:12,padding:"10px 12px",background:"rgba(0,0,0,.2)",borderRadius:8,fontSize:11,color:"#A0AEC0"}}>
            ⚡ You earn a commission percentage on every single upgrade payment made by people in all 3 levels — automatically, forever.
          </div>
        </div>

        {/* Fixed Scenarios */}
        <div style={{padding:"20px 16px 0"}}>
          <p style={{margin:"0 0 14px",fontSize:14,fontWeight:700,color:"#FFFFFF"}}>📊 Example Scenarios — Elite Level</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {scenarios.map((sc,i) => {
              const r = calc("elite", sc.refs);
              return (
                <div key={i} style={{background:"linear-gradient(135deg,#0d2b1a,#0a1f13)",border:"1px solid rgba(46,204,113,.2)",borderRadius:14,padding:14}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                    <span style={{fontSize:18}}>{sc.emoji}</span>
                    <div>
                      <p style={{margin:0,fontSize:11,fontWeight:700,color:"#FFFFFF"}}>{sc.label}</p>
                      <p style={{margin:0,fontSize:10,color:"#A0AEC0"}}>{sc.refs} direct referrals</p>
                    </div>
                  </div>
                  <div style={{fontSize:10,color:"#A0AEC0",marginBottom:6,lineHeight:1.7}}>
                    <div>L1 ({sc.refs}): <span style={{color:"#2ECC71"}}>₦{r.e1.toLocaleString()}</span></div>
                    <div>L2 ({r.l2}): <span style={{color:"#2ECC71"}}>₦{r.e2.toLocaleString()}</span></div>
                    <div>L3 ({r.l3.toLocaleString()}): <span style={{color:"#2ECC71"}}>₦{r.e3.toLocaleString()}</span></div>
                  </div>
                  <div style={{borderTop:"1px solid rgba(46,204,113,.15)",paddingTop:8,marginTop:4}}>
                    <p style={{margin:0,fontSize:13,fontWeight:800,color:"#2ECC71"}}>₦{r.total.toLocaleString()}</p>
                    <p style={{margin:0,fontSize:9,color:"#A0AEC0"}}>Total potential</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop:10,background:"rgba(243,156,18,.08)",border:"1px solid rgba(243,156,18,.25)",borderRadius:10,padding:"10px 14px",fontSize:11,color:"#F39C12",textAlign:"center",fontWeight:600}}>
            💎 Elite L3 with just 5 referrals = {calc("elite",5).l3.toLocaleString()} people paying you commission
          </div>
        </div>

        {/* Interactive Calculator */}
        <div style={{padding:"20px 16px 0"}}>
          <p style={{margin:"0 0 14px",fontSize:14,fontWeight:700,color:"#FFFFFF"}}>🧮 Your Personal Calculator</p>

          {/* Level Selector */}
          <p style={{margin:"0 0 8px",fontSize:11,color:"#A0AEC0",fontWeight:600,letterSpacing:.5}}>SELECT YOUR LEVEL</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginBottom:16}}>
            {["bronze","silver","gold","elite"].map(lvl => (
              <button key={lvl} onClick={() => setCalcLevel(lvl)} style={{
                background: calcLevel===lvl ? LEVELS[lvl].color : "rgba(255,255,255,.05)",
                color: calcLevel===lvl ? "#0F1419" : "#A0AEC0",
                border: calcLevel===lvl ? "none" : "1px solid rgba(255,255,255,.1)",
                borderRadius:8, padding:"8px 4px", fontSize:11, fontWeight:700, cursor:"pointer"
              }}>
                {LEVELS[lvl].icon} {LEVELS[lvl].name}
              </button>
            ))}
          </div>

          {/* Refs Input */}
          <p style={{margin:"0 0 8px",fontSize:11,color:"#A0AEC0",fontWeight:600,letterSpacing:.5}}>HOW MANY PEOPLE WILL YOU REFER DIRECTLY?</p>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <button onClick={() => setRefs(r => Math.max(1, Number(r)-1))} style={{width:36,height:36,borderRadius:"50%",background:"rgba(46,204,113,.1)",border:"1px solid rgba(46,204,113,.3)",color:"#2ECC71",fontSize:18,cursor:"pointer",fontWeight:700}}>−</button>
            <input
              type="number" min="1" max="999"
              value={refs}
              onChange={e => setRefs(e.target.value)}
              style={{flex:1,padding:"10px 14px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(46,204,113,.3)",borderRadius:8,color:"#FFFFFF",fontSize:18,fontWeight:700,textAlign:"center",fontFamily:"inherit"}}
            />
            <button onClick={() => setRefs(r => Number(r)+1)} style={{width:36,height:36,borderRadius:"50%",background:"rgba(46,204,113,.1)",border:"1px solid rgba(46,204,113,.3)",color:"#2ECC71",fontSize:18,cursor:"pointer",fontWeight:700}}>+</button>
          </div>

          {/* Results Card */}
          <div style={{background:"linear-gradient(135deg,#0d2b1a,#1a3d2b)",border:"1px solid rgba(46,204,113,.3)",borderRadius:16,padding:18,marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <p style={{margin:0,fontSize:13,fontWeight:700,color:"#FFFFFF"}}>{lv.icon} {lv.name} Level Results</p>
              <p style={{margin:0,fontSize:11,color:"#A0AEC0"}}>₦{lv.price.toLocaleString()} per upgrade</p>
            </div>

            {[
              {label:"Level 1", people:result.l1, pct:lv.commission.l1, earned:result.e1, desc:"Your direct referrals"},
              {label:"Level 2", people:result.l2, pct:lv.commission.l2, earned:result.e2, desc:"Their referrals"},
              {label:"Level 3", people:result.l3, pct:lv.commission.l3, earned:result.e3, desc:"Their referrals' referrals"},
            ].map((row,i) => (
              <div key={i} style={{marginBottom: i < 2 ? 12 : 0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                  <div>
                    <span style={{fontSize:12,fontWeight:600,color:"#FFFFFF"}}>{row.label}</span>
                    <span style={{fontSize:10,color:"#A0AEC0",marginLeft:6}}>{row.desc} • {row.pct}% commission</span>
                  </div>
                  <span style={{fontSize:13,fontWeight:700,color:"#2ECC71"}}>₦{row.earned.toLocaleString()}</span>
                </div>
                <div style={{fontSize:10,color:"#A0AEC0",marginBottom:6}}>{row.people.toLocaleString()} people × ₦{lv.price.toLocaleString()} × {row.pct}%</div>
                <div style={{height:4,background:"rgba(255,255,255,.06)",borderRadius:2}}>
                  <div style={{height:4,background:"#2ECC71",borderRadius:2,width: result.total > 0 ? Math.min(100,(row.earned/result.total)*100)+"%" : "0%",transition:"width .4s ease"}} />
                </div>
                {i < 2 && <div style={{height:1,background:"rgba(46,204,113,.1)",margin:"12px 0 0"}} />}
              </div>
            ))}

            <div style={{marginTop:16,paddingTop:14,borderTop:"2px solid rgba(46,204,113,.3)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <p style={{margin:0,fontSize:13,color:"#A0AEC0",fontWeight:600}}>TOTAL POTENTIAL</p>
              <p style={{margin:0,fontSize:22,fontWeight:900,color:"#2ECC71"}}>₦{result.total.toLocaleString()}</p>
            </div>
          </div>

          {/* Encouragement */}
          <div style={{background:"rgba(46,204,113,.06)",border:"1px solid rgba(46,204,113,.15)",borderRadius:12,padding:14,marginBottom:16}}>
            <p style={{margin:"0 0 6px",fontSize:12,fontWeight:700,color:"#2ECC71"}}>💬 Our Take</p>
            <p style={{margin:0,fontSize:12,color:"rgba(255,255,255,.8)",lineHeight:1.7}}>{encouragement[calcLevel]}</p>
          </div>

          {/* CTA */}
          {calcLevel !== "elite" && (
            <div style={{background:"linear-gradient(135deg,#85C1E920,#2ECC7120)",border:"1px solid rgba(133,193,233,.3)",borderRadius:12,padding:14,marginBottom:16,textAlign:"center"}}>
              <p style={{margin:"0 0 4px",fontSize:13,fontWeight:700,color:"#FFFFFF"}}>💎 See what Elite could earn you</p>
              <p style={{margin:"0 0 12px",fontSize:11,color:"#A0AEC0"}}>With {refs} referrals at Elite level:</p>
              <p style={{margin:"0 0 12px",fontSize:24,fontWeight:900,color:"#85C1E9"}}>₦{calc("elite", Number(refs)||0).total.toLocaleString()}</p>
              <button onClick={() => setCalcLevel("elite")} style={{background:"#85C1E9",color:"#0F1419",border:"none",borderRadius:20,padding:"10px 24px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                Calculate Elite Earnings
              </button>
            </div>
          )}

          {calcLevel === "elite" && (
            <div style={{background:"linear-gradient(135deg,#85C1E915,#2ECC7115)",border:"1px solid #85C1E940",borderRadius:12,padding:16,marginBottom:16,textAlign:"center"}}>
              <p style={{margin:"0 0 6px",fontSize:20}}>👑</p>
              <p style={{margin:"0 0 4px",fontSize:14,fontWeight:800,color:"#FFFFFF"}}>You chose the best level!</p>
              <p style={{margin:"0 0 14px",fontSize:12,color:"#A0AEC0"}}>Elite members are the highest earners on IncomeHub NG. Your network compounds into serious income.</p>
              <button onClick={() => setScreen("profile")} style={{background:"#2ECC71",color:"#0F1419",border:"none",borderRadius:20,padding:"10px 24px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                ⚡ Upgrade to Elite Now
              </button>
            </div>
          )}

          {/* Commission table */}
          <p style={{margin:"20px 0 10px",fontSize:13,fontWeight:700,color:"#FFFFFF"}}>📋 Full Commission Table</p>
          <div style={{background:"linear-gradient(135deg,#0d2b1a,#0a1f13)",border:"1px solid rgba(46,204,113,.15)",borderRadius:14,overflow:"hidden",marginBottom:20}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",padding:"10px 12px",background:"rgba(0,0,0,.2)",borderBottom:"1px solid rgba(46,204,113,.1)"}}>
              {["Level","Price","L1","L2","L3"].map(h => (
                <p key={h} style={{margin:0,fontSize:10,fontWeight:700,color:"#A0AEC0",textAlign:"center"}}>{h}</p>
              ))}
            </div>
            {["bronze","silver","gold","elite"].map((lvl,i) => (
              <div key={lvl} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",padding:"12px",borderBottom:i<3?"1px solid rgba(46,204,113,.08)":"none",background:calcLevel===lvl?"rgba(46,204,113,.05)":"transparent"}}>
                <p style={{margin:0,fontSize:11,fontWeight:700,color:LEVELS[lvl].color,textAlign:"center"}}>{LEVELS[lvl].icon}</p>
                <p style={{margin:0,fontSize:10,color:"#FFFFFF",textAlign:"center"}}>₦{(LEVELS[lvl].price/1000).toFixed(0)}k</p>
                <p style={{margin:0,fontSize:11,fontWeight:700,color:"#2ECC71",textAlign:"center"}}>{LEVELS[lvl].commission.l1}%</p>
                <p style={{margin:0,fontSize:11,fontWeight:700,color:"#2ECC71",textAlign:"center"}}>{LEVELS[lvl].commission.l2}%</p>
                <p style={{margin:0,fontSize:11,fontWeight:700,color:"#2ECC71",textAlign:"center"}}>{LEVELS[lvl].commission.l3}%</p>
              </div>
            ))}
          </div>

        </div>
      </div>
      <BottomNav active="earnings" setScreen={setScreen} />
    </div>
  );
}

export default App;
