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
  const [auth,setAuth] = useState(null);
  
  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if(stored) setAuth(JSON.parse(stored));
  },[]);
  
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
  const [screen,setScreen] = useState(user?"dashboard":"splash");
  const [loading,setLoading] = useState(false);
  const [formData,setFormData] = useState({});
  const [show,setShow] = useState({});

  return (
    <style>{`
      @keyframes spin { to { transform: rotate(360deg); } }
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; background: ${T.bg}; color: ${T.white}; font-family: ${T.ff}; }
      input:focus, textarea:focus { outline: none; border-color: ${T.green} !important; background: rgba(255,255,255,.08) !important; }
      button:hover { opacity: 0.9; }
      button:disabled { opacity: 0.5; cursor: not-allowed; }
    `}
      {screen === "splash" && <SplashScreen next={() => setScreen("onboarding")} />}
      {screen === "onboarding" && <OnboardingScreen next={() => setScreen("login")} />}
      {screen === "login" && <LoginScreen next={(u) => { setUser(u); setScreen("dashboard"); }} toReg={() => setScreen("register")} />}
      {screen === "register" && <RegisterScreen next={(u) => { setUser(u); setScreen("dashboard"); }} toLogin={() => setScreen("login")} />}
      {screen === "dashboard" && <DashboardScreen user={user} setScreen={setScreen} logout={() => { logout(); setScreen("splash"); }} />}
      {screen === "products" && <ProductsScreen user={user} setScreen={setScreen} />}
      {screen === "referral" && <ReferralScreen user={user} setScreen={setScreen} />}
      {screen === "profile" && <ProfileScreen user={user} setUser={setUser} setScreen={setScreen} logout={() => { logout(); setScreen("splash"); }} />}
    </style>
  );
}

function SplashScreen({next}) {
  return (
    <div style={scr}>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .fade { animation: fadeIn 0.8s ease-in; }`}</style>
      <div style={{...cont,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"100vh"}}>
        <div className="fade" style={{textAlign:"center"}}>
          <div style={{fontSize:64,marginBottom:20}}>💰</div>
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

function DashboardScreen({user,setScreen,logout}) {
  const userLevel = LEVELS[user?.level || "free"];
  const nextLevel = LEVEL_ORDER[LEVEL_ORDER.indexOf(user?.level || "free") + 1];

  return (
    <div style={scr}>
      <div style={{...cont,paddingTop:20,paddingBottom:100}}>
        <div style={{...flex("row","space-between","center"),marginBottom:24}}>
          <h1 style={{fontSize:18,fontWeight:700,margin:0,color:T.white}}>Dashboard</h1>
          <button onClick={() => setScreen("profile")} style={{background:"none",border:"none",fontSize:20,cursor:"pointer"}}>⚙️</button>
        </div>

        {/* Profile Card */}
        <div style={{...card({padding:16,marginBottom:20})}}>
          <div style={{...flex("row","space-between","center"),marginBottom:12}}>
            <div>
              <p style={{margin:"0 0 4px",fontSize:11,color:T.muted,fontWeight:600}}>CURRENT LEVEL</p>
              <p style={{margin:0,fontSize:16,fontWeight:700,color:userLevel.color}}>{userLevel.icon} {userLevel.name}</p>
            </div>
            <div style={{textAlign:"right"}}>
              <p style={{margin:"0 0 4px",fontSize:11,color:T.muted,fontWeight:600}}>WALLET</p>
              <p style={{margin:0,fontSize:16,fontWeight:700,color:T.green}}>₦{(user?.wallet || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{...flex("row","space-between","stretch"),gap:8,marginBottom:20}}>
          <div style={{...card({padding:12,marginBottom:0,background:"rgba(46,204,113,.05)"}),flex:1,textAlign:"center"}}>
            <p style={{margin:0,fontSize:20,fontWeight:700,color:T.green}}>₦{(user?.earnings || 0).toLocaleString()}</p>
            <p style={{margin:"4px 0 0",fontSize:10,color:T.muted}}>Total Earnings</p>
          </div>
          <div style={{...card({padding:12,marginBottom:0,background:"rgba(63,184,175,.05)"}),flex:1,textAlign:"center"}}>
            <p style={{margin:0,fontSize:20,fontWeight:700,color:"#3FB8AF"}}>₦{(user?.withdrawn || 0).toLocaleString()}</p>
            <p style={{margin:"4px 0 0",fontSize:10,color:T.muted}}>Withdrawn</p>
          </div>
          <div style={{...card({padding:12,marginBottom:0,background:"rgba(243,156,18,.05)"}),flex:1,textAlign:"center"}}>
            <p style={{margin:0,fontSize:20,fontWeight:700,color:T.orange}}>₦{((user?.earnings || 0) - (user?.withdrawn || 0)).toLocaleString()}</p>
            <p style={{margin:"4px 0 0",fontSize:10,color:T.muted}}>Pending</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{...flex("row","space-between","stretch"),gap:8,marginBottom:20}}>
          <button onClick={() => alert("Deposit feature coming soon")} style={{...btnS(),flex:1,margin:0}}>💳 Deposit</button>
          <button onClick={() => alert("Withdrawal feature coming soon")} style={{...btnS(),flex:1,margin:0}}>🏦 Withdraw</button>
          <button onClick={() => alert("Reports feature coming soon")} style={{...btnS(),flex:1,margin:0}}>📊 Report</button>
        </div>

        {/* Upgrade Banner */}
        {nextLevel && (
          <div style={{...card({padding:14,marginBottom:20,background:`linear-gradient(135deg,${userLevel.color}20,${LEVELS[nextLevel].color}20)`})}}>
            <div style={{...flex("row","space-between","center")}}>
              <div>
                <p style={{margin:"0 0 4px",fontSize:11,color:T.muted,fontWeight:600}}>UPGRADE TO</p>
                <p style={{margin:0,fontSize:14,fontWeight:700,color:T.white}}>{LEVELS[nextLevel].icon} {LEVELS[nextLevel].name}</p>
                <p style={{margin:"4px 0 0",fontSize:11,color:T.muted}}>₦{LEVELS[nextLevel].price.toLocaleString()} — Earn {LEVELS[nextLevel].commission.l1}% commission</p>
              </div>
              <button onClick={() => alert("Payment gateway coming soon")} style={{padding:"8px 12px",background:T.green,color:T.bg,border:"none",borderRadius:4,fontSize:11,fontWeight:600,cursor:"pointer"}}>Upgrade</button>
            </div>
          </div>
        )}

        {/* Featured Products */}
        <h3 style={{fontSize:13,fontWeight:600,margin:"20px 0 12px",color:T.white}}>📚 Featured Products</h3>
        <div style={{...flex("row","space-between","stretch"),gap:8,marginBottom:20}}>
          {[
            {title:"Digital Marketing Mastery",price:8000,emoji:"📱"},
            {title:"Forex Trading Blueprint",price:12000,emoji:"📈"},
          ].map((p,i) => (
            <div key={i} onClick={() => setScreen("products")} style={{...card({padding:12,marginBottom:0}),flex:1,cursor:"pointer"}}>
              <p style={{margin:0,fontSize:16,marginBottom:8}}>{p.emoji}</p>
              <p style={{margin:"0 0 4px",fontSize:11,fontWeight:600,color:T.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.title}</p>
              <p style={{margin:0,fontSize:12,fontWeight:700,color:T.green}}>₦{p.price.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div style={{position:"fixed",bottom:0,left:0,right:0,height:70,background:T.bg,borderTop:`1px solid rgba(255,255,255,.08)`,display:"flex",justifyContent:"space-around",alignItems:"center",paddingBottom:"env(safe-area-inset-bottom)"}}>
          {[
            {icon:"🏠",label:"Home",screen:"dashboard"},
            {icon:"📦",label:"Products",screen:"products"},
            {icon:"🤝",label:"Referral",screen:"referral"},
            {icon:"👤",label:"Profile",screen:"profile"},
          ].map((nav,i) => (
            <button key={i} onClick={() => setScreen(nav.screen)} style={{background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,cursor:"pointer",fontSize:12,color:nav.screen===("dashboard")?"":T.muted,fontWeight:nav.screen===("dashboard")?600:400}}>
              <div style={{fontSize:20}}>{nav.icon}</div>
              <span style={{fontSize:10}}>{nav.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsScreen({user,setScreen}) {
  const products = [
    {_id:"1",title:"Digital Marketing Mastery",description:"Complete guide to social media, email marketing and content strategy.",price:8000,category:"ebooks",requiredLevel:"bronze",emoji:"📱",rating:4.9,sales:156},
    {_id:"2",title:"Forex Trading Blueprint",description:"Step-by-step guide to profitable forex trading with chart reading and risk management.",price:12000,category:"courses",requiredLevel:"bronze",emoji:"📈",rating:4.9,sales:189},
    {_id:"3",title:"Business Plan Templates",description:"10 ready-to-use professional business plan templates for Nigerian businesses.",price:2000,category:"tools",requiredLevel:"bronze",emoji:"📋",rating:4.6,sales:98},
    {_id:"4",title:"Affiliate Marketing Mastery",description:"Earn passive income promoting products through Jumia, Konga and Amazon affiliates.",price:4500,category:"ebooks",requiredLevel:"silver",emoji:"📘",rating:4.8,sales:203},
    {_id:"5",title:"Social Media Growth Kit",description:"Strategies, templates and tools to grow followers and engagement across all platforms.",price:6000,category:"tools",requiredLevel:"silver",emoji:"📲",rating:4.7,sales:145},
    {_id:"6",title:"Crypto Wealth Guide",description:"Beginner to advanced cryptocurrency investment and trading strategies.",price:15000,category:"ebooks",requiredLevel:"gold",emoji:"₿",rating:4.8,sales:89},
    {_id:"7",title:"Elite Investment Guide",description:"Advanced wealth-building strategies covering stocks, REITs and portfolio diversification.",price:18000,category:"ebooks",requiredLevel:"elite",emoji:"💼",rating:4.9,sales:67},
    {_id:"8",title:"Video Content Creation Masterclass",description:"Full production course: scripting, filming, editing with CapCut and YouTube monetisation.",price:15000,category:"courses",requiredLevel:"elite",emoji:"🎬",rating:5.0,sales:34},
  ];

  const canAccess = (requiredLevel) => {
    const userIdx = LEVEL_ORDER.indexOf(user?.level || "free");
    const requiredIdx = LEVEL_ORDER.indexOf(requiredLevel);
    return userIdx >= requiredIdx;
  };

  return (
    <div style={scr}>
      <div style={{...cont,paddingTop:20,paddingBottom:100}}>
        <div style={{...flex("row","space-between","center"),marginBottom:24}}>
          <h1 style={{fontSize:18,fontWeight:700,margin:0,color:T.white}}>Products</h1>
          <button onClick={() => setScreen("dashboard")} style={{background:"none",border:"none",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>

        {products.map(p => (
          <div key={p._id} style={{...card({padding:12,marginBottom:12})}}>
            <div style={{...flex("row","space-between","flex-start")}}>
              <div style={{flex:1}}>
                <p style={{margin:"0 0 4px",fontSize:12,fontWeight:600,color:T.white}}>{p.emoji} {p.title}</p>
                <p style={{margin:"0 0 8px",fontSize:11,color:T.muted}}>{p.description}</p>
                <div style={{...flex("row","flex-start","center",8),fontSize:10,color:T.muted}}>
                  <span>⭐ {p.rating}</span>
                  <span>•</span>
                  <span>{p.sales} sold</span>
                  <span>•</span>
                  <span>{LEVELS[p.requiredLevel].name}+</span>
                </div>
              </div>
              <div style={{textAlign:"right",marginLeft:12}}>
                <p style={{margin:"0 0 8px",fontSize:14,fontWeight:700,color:T.green}}>₦{p.price.toLocaleString()}</p>
                <button onClick={() => canAccess(p.requiredLevel) ? alert("Purchase feature coming soon") : alert("Upgrade to access this")} style={{...btnS(),margin:0,width:"100%",padding:"8px 12px",fontSize:11}}>
                  {canAccess(p.requiredLevel) ? "Buy" : "Locked"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{position:"fixed",bottom:0,left:0,right:0,height:70,background:T.bg,borderTop:`1px solid rgba(255,255,255,.08)`,display:"flex",justifyContent:"space-around",alignItems:"center",paddingBottom:"env(safe-area-inset-bottom)"}}>
        {[
          {icon:"🏠",label:"Home",screen:"dashboard"},
          {icon:"📦",label:"Products",screen:"products"},
          {icon:"🤝",label:"Referral",screen:"referral"},
          {icon:"👤",label:"Profile",screen:"profile"},
        ].map((nav,i) => (
          <button key={i} onClick={() => setScreen(nav.screen)} style={{background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,cursor:"pointer",fontSize:12,color:nav.screen===("products")?"":T.muted,fontWeight:nav.screen===("products")?600:400}}>
            <div style={{fontSize:20}}>{nav.icon}</div>
            <span style={{fontSize:10}}>{nav.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ReferralScreen({user,setScreen}) {
  const referralLink = `https://incomehub-ng.vercel.app?ref=${user?._id || "ref123"}`;

  const shareVia = (platform) => {
    const text = "Join IncomeHub NG! Multiple Streams. One Platform. Earn from digital products and referral commissions.";
    const urls = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + referralLink)}`,
      email: `mailto:?subject=Join IncomeHub NG&body=${encodeURIComponent(text + "\n\n" + referralLink)}`,
      copy: () => { navigator.clipboard.writeText(referralLink); alert("Link copied!"); }
    };
    
    if(platform === "copy") urls.copy();
    else window.open(urls[platform], "_blank");
  };

  return (
    <div style={scr}>
      <div style={{...cont,paddingTop:20,paddingBottom:100}}>
        <div style={{...flex("row","space-between","center"),marginBottom:24}}>
          <h1 style={{fontSize:18,fontWeight:700,margin:0,color:T.white}}>Referral Hub</h1>
          <button onClick={() => setScreen("dashboard")} style={{background:"none",border:"none",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>

        {/* Info Box */}
        <div style={{...card({padding:16,marginBottom:20,background:"rgba(46,204,113,.05)"})}}>
          <h3 style={{margin:"0 0 12px",fontSize:13,fontWeight:600,color:T.green}}>How It Works</h3>
          {[
            {icon:"🔗",text:"Get your unique referral link"},
            {icon:"💰",text:`Earn ${LEVELS[user?.level || "free"].commission.l1}% commission on Level 1`},
            {icon:"📊",text:"Track earnings 3 levels deep"},
            {icon:"⚡",text:"One-time fee — earn forever"},
          ].map((it,i) => (
            <div key={i} style={{...flex("row","flex-start","center",12),marginBottom:i < 3 ? 8 : 0,fontSize:12}}>
              <span style={{fontSize:16}}>{it.icon}</span>
              <span style={{color:T.white}}>{it.text}</span>
            </div>
          ))}
        </div>

        {/* Referral Link */}
        <div style={{...card({padding:12,marginBottom:20})}}>
          <p style={{margin:"0 0 8px",fontSize:11,color:T.muted,fontWeight:600}}>YOUR REFERRAL LINK</p>
          <div style={{...flex("row","space-between","center",8),background:"rgba(255,255,255,.05)",padding:10,borderRadius:6,marginBottom:12}}>
            <p style={{margin:0,fontSize:11,fontFamily:"monospace",color:T.muted,overflow:"hidden",textOverflow:"ellipsis",flex:1}}>{referralLink}</p>
            <button onClick={() => shareVia("copy")} style={{padding:"6px 10px",background:T.green,color:T.bg,border:"none",borderRadius:4,fontSize:10,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>Copy</button>
          </div>
          <div style={{...flex("row","space-between","stretch"),gap:8}}>
            <button onClick={() => shareVia("whatsapp")} style={{...btnS(),flex:1,margin:0}}>📱 WhatsApp</button>
            <button onClick={() => shareVia("email")} style={{...btnS(),flex:1,margin:0}}>✉️ Email</button>
            <button onClick={() => alert("Share feature coming soon")} style={{...btnS(),flex:1,margin:0}}>📤 Share</button>
          </div>
        </div>

        {/* Commission Rates */}
        <h3 style={{fontSize:13,fontWeight:600,margin:"20px 0 12px",color:T.white}}>💰 Commission Rates</h3>
        <div>
          {LEVEL_ORDER.filter(l => l !== "free").map(level => (
            <div key={level} style={{...card({padding:12,marginBottom:12})}}>
              <div style={{...flex("row","space-between","center"),marginBottom:8}}>
                <p style={{margin:0,fontSize:12,fontWeight:600,color:LEVELS[level].color}}>{LEVELS[level].icon} {LEVELS[level].name}</p>
                <p style={{margin:0,fontSize:11,color:T.muted}}>₦{LEVELS[level].price.toLocaleString()}</p>
              </div>
              <div style={{fontSize:11,color:T.muted,lineHeight:1.6}}>
                <div>L1: {LEVELS[level].commission.l1}% • L2: {LEVELS[level].commission.l2}% • L3: {LEVELS[level].commission.l3}%</div>
              </div>
            </div>
          ))}
        </div>

        {/* Earnings */}
        <h3 style={{fontSize:13,fontWeight:600,margin:"20px 0 12px",color:T.white}}>📊 Your Referral Earnings</h3>
        <div style={{...card({padding:12,marginBottom:80})}}>
          <div style={{...flex("row","space-between","center"),marginBottom:12}}>
            <span style={{fontSize:12,color:T.muted}}>Level 1</span>
            <span style={{fontSize:14,fontWeight:700,color:T.green}}>₦{(user?.referralEarnings?.l1 || 0).toLocaleString()}</span>
          </div>
          <Divider mt={0} mb={12} />
          <div style={{...flex("row","space-between","center"),marginBottom:12}}>
            <span style={{fontSize:12,color:T.muted}}>Level 2</span>
            <span style={{fontSize:14,fontWeight:700,color:T.green}}>₦{(user?.referralEarnings?.l2 || 0).toLocaleString()}</span>
          </div>
          <Divider mt={0} mb={12} />
          <div style={{...flex("row","space-between","center")}}>
            <span style={{fontSize:12,color:T.muted}}>Level 3</span>
            <span style={{fontSize:14,fontWeight:700,color:T.green}}>₦{(user?.referralEarnings?.l3 || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div style={{position:"fixed",bottom:0,left:0,right:0,height:70,background:T.bg,borderTop:`1px solid rgba(255,255,255,.08)`,display:"flex",justifyContent:"space-around",alignItems:"center",paddingBottom:"env(safe-area-inset-bottom)"}}>
        {[
          {icon:"🏠",label:"Home",screen:"dashboard"},
          {icon:"📦",label:"Products",screen:"products"},
          {icon:"🤝",label:"Referral",screen:"referral"},
          {icon:"👤",label:"Profile",screen:"profile"},
        ].map((nav,i) => (
          <button key={i} onClick={() => setScreen(nav.screen)} style={{background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,cursor:"pointer",fontSize:12,color:nav.screen===("referral")?"":T.muted,fontWeight:nav.screen===("referral")?600:400}}>
            <div style={{fontSize:20}}>{nav.icon}</div>
            <span style={{fontSize:10}}>{nav.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen({user,setUser,setScreen,logout}) {
  const [editMode,setEditMode] = useState(false);
  const [formData,setFormData] = useState({name:user?.name || "",email:user?.email || ""});
  const [loading,setLoading] = useState(false);

  const updateProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://incomehub-backend-production.up.railway.app/api/user/profile", {
        method:"PUT",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${user?.token}`},
        body:JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success) {
        setUser({...user,...data.user});
        setEditMode(false);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={scr}>
      <div style={{...cont,paddingTop:20,paddingBottom:100}}>
        <div style={{...flex("row","space-between","center"),marginBottom:24}}>
          <h1 style={{fontSize:18,fontWeight:700,margin:0,color:T.white}}>Profile</h1>
          <button onClick={() => setScreen("dashboard")} style={{background:"none",border:"none",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>

        {/* Avatar Section */}
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{position:"relative",width:80,height:80,margin:"0 auto 12px",background:"rgba(255,255,255,.08)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>
            👤
            <button onClick={() => alert("Avatar upload feature coming soon")} style={{position:"absolute",bottom:0,right:0,width:28,height:28,background:T.green,border:"none",borderRadius:"50%",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✏️</button>
          </div>
          <h2 style={{margin:"0 0 4px",fontSize:16,fontWeight:700,color:T.white}}>{user?.name}</h2>
          <p style={{margin:0,fontSize:11,color:T.muted}}>{LEVELS[user?.level || "free"].icon} {LEVELS[user?.level || "free"].name}</p>
        </div>

        {/* Account Info */}
        <h3 style={{fontSize:12,fontWeight:600,margin:"20px 0 12px",color:T.white,textTransform:"uppercase",letterSpacing:".5px"}}>Account Information</h3>
        {editMode ? (
          <div>
            <label style={lbl}>Full Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData,name:e.target.value})} style={inp} />
            <label style={lbl}>Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData,email:e.target.value})} style={inp} />
            <button onClick={updateProfile} disabled={loading} style={{...btnG(),opacity:loading?0.6:1}}>
              {loading ? <span style={{...flex("row","center","center",8)}}><Spin /> Saving...</span> : "Save Changes"}
            </button>
            <button onClick={() => setEditMode(false)} style={{...btnS()}}>Cancel</button>
          </div>
        ) : (
          <div>
            <div style={{...card({padding:12,marginBottom:12})}}>
              <p style={{margin:"0 0 4px",fontSize:10,color:T.muted,fontWeight:600,textTransform:"uppercase"}}>Full Name</p>
              <p style={{margin:0,fontSize:14,color:T.white}}>{user?.name}</p>
            </div>
            <div style={{...card({padding:12,marginBottom:12})}}>
              <p style={{margin:"0 0 4px",fontSize:10,color:T.muted,fontWeight:600,textTransform:"uppercase"}}>Email Address</p>
              <p style={{margin:0,fontSize:14,color:T.white}}>{user?.email}</p>
            </div>
            <button onClick={() => setEditMode(true)} style={{...btnS(),marginBottom:12}}>✏️ Edit Profile</button>
          </div>
        )}

        {/* Earnings Section */}
        <h3 style={{fontSize:12,fontWeight:600,margin:"20px 0 12px",color:T.white,textTransform:"uppercase",letterSpacing:".5px"}}>Earnings</h3>
        <div style={{...card({padding:12,marginBottom:12})}}>
          <p style={{margin:"0 0 4px",fontSize:10,color:T.muted,fontWeight:600,textTransform:"uppercase"}}>Total Earnings</p>
          <p style={{margin:0,fontSize:16,fontWeight:700,color:T.green}}>₦{(user?.earnings || 0).toLocaleString()}</p>
        </div>
        <div style={{...card({padding:12,marginBottom:12})}}>
          <p style={{margin:"0 0 4px",fontSize:10,color:T.muted,fontWeight:600,textTransform:"uppercase"}}>Withdrawn</p>
          <p style={{margin:0,fontSize:16,fontWeight:700,color:"#3FB8AF"}}>₦{(user?.withdrawn || 0).toLocaleString()}</p>
        </div>
        <div style={{...card({padding:12,marginBottom:12})}}>
          <p style={{margin:"0 0 4px",fontSize:10,color:T.muted,fontWeight:600,textTransform:"uppercase"}}>Reward Points</p>
          <p style={{margin:0,fontSize:14,fontWeight:600,color:T.orange}}>Coming Soon 🚀</p>
        </div>

        {/* Support Section */}
        <h3 style={{fontSize:12,fontWeight:600,margin:"20px 0 12px",color:T.white,textTransform:"uppercase",letterSpacing:".5px"}}>Contact Us</h3>
        <div style={{...card({padding:12,marginBottom:12})}}>
          <p style={{margin:"0 0 8px",fontSize:12,fontWeight:600,color:T.white}}>📧 Email</p>
          <a href="mailto:incomehubng@gmail.com" style={{fontSize:13,color:T.green,textDecoration:"none"}}>incomehubng@gmail.com</a>
        </div>
        <div style={{...card({padding:12,marginBottom:12})}}>
          <p style={{margin:"0 0 8px",fontSize:12,fontWeight:600,color:T.white}}>💬 WhatsApp</p>
          <a href="https://wa.me/2347080707446" target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:T.green,textDecoration:"none"}}>+234 708 070 7446</a>
        </div>
        <div style={{...card({padding:12,marginBottom:24})}}>
          <p style={{margin:"0 0 8px",fontSize:12,fontWeight:600,color:T.white}}>☎️ Call</p>
          <a href="tel:09028134166" style={{fontSize:13,color:T.green,textDecoration:"none"}}>+234 902 813 4166</a>
        </div>

        {/* Logout Button */}
        <button onClick={logout} style={{...btnS(),background:"rgba(231,76,60,.1)",color:T.red,border:`1px solid rgba(231,76,60,.3)`,marginBottom:80}}>🚪 Log Out</button>
      </div>

      <div style={{position:"fixed",bottom:0,left:0,right:0,height:70,background:T.bg,borderTop:`1px solid rgba(255,255,255,.08)`,display:"flex",justifyContent:"space-around",alignItems:"center",paddingBottom:"env(safe-area-inset-bottom)"}}>
        {[
          {icon:"🏠",label:"Home",screen:"dashboard"},
          {icon:"📦",label:"Products",screen:"products"},
          {icon:"🤝",label:"Referral",screen:"referral"},
          {icon:"👤",label:"Profile",screen:"profile"},
        ].map((nav,i) => (
          <button key={i} onClick={() => setScreen(nav.screen)} style={{background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,cursor:"pointer",fontSize:12,color:nav.screen===("profile")?"":T.muted,fontWeight:nav.screen===("profile")?600:400}}>
            <div style={{fontSize:20}}>{nav.icon}</div>
            <span style={{fontSize:10}}>{nav.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
