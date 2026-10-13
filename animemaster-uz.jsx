import { useState } from "react";
import { Play, Plus, Trash2, Pencil, Shield, X, Check, Tv, CreditCard, LayoutGrid, LogOut, ChevronLeft, Star, Clock, Menu as MenuIcon } from "lucide-react";

const ADMIN_EMAIL = "egamberdiyovasilbek0@gmail.com";
const ADMIN_PHONE = "+998881170611";

const QUALITIES = ["144p","240p","360p","480p","720p","1080p","1440p","2048p"];
const PLANS = [
  { months: 1, price: 19000 },
  { months: 2, price: 35000 },
  { months: 3, price: 49000 },
  { months: 6, price: 89000 },
  { months: 12, price: 149000 },
];

const PALETTE = ["#E8B04B","#FF5D8F","#5DC9E8","#8B7FE8","#6BD68C","#E86B6B"];

const seedAnime = [
  { id: 1, title: "Sokin Olov", genre: "Aksiya / Fantastika", desc: "Qadimiy olov ruhini o'zida jamlagan yosh jangchining taqdir bilan kurashi.", color: PALETTE[0], year: 2023, rating: 8.7,
    episodes: [
      { id: 1, number: 1, title: "Uyg'onish", quality: ["144p","360p","720p","1080p"] },
      { id: 2, number: 2, title: "Birinchi Jang", quality: ["144p","360p","720p","1080p","2048p"] },
      { id: 3, number: 3, title: "Sinov", quality: ["144p","360p","720p"] },
    ]},
  { id: 2, title: "Oy Soyasi", genre: "Drama / Sirli", desc: "Tunda paydo bo'ladigan sirli olam va uni kashf etgan qizning sarguzashtlari.", color: PALETTE[1], year: 2022, rating: 9.1,
    episodes: [
      { id: 1, number: 1, title: "Kirish eshigi", quality: ["144p","480p","1080p"] },
      { id: 2, number: 2, title: "Ikkinchi dunyo", quality: ["144p","480p","1080p","2048p"] },
    ]},
  { id: 3, title: "Temir Qanot", genre: "Mexa / Aksiya", desc: "Kelajak Yaponiyasida robot-pilotlarning shaharni himoya qilish jangi.", color: PALETTE[2], year: 2024, rating: 8.3,
    episodes: [
      { id: 1, number: 1, title: "Ishga tushirish", quality: ["144p","360p","720p"] },
      { id: 2, number: 2, title: "Hujum", quality: ["144p","360p","720p","1080p"] },
      { id: 3, number: 3, title: "Qarshi zarba", quality: ["144p","360p","720p","1080p","1440p"] },
      { id: 4, number: 4, title: "So'nggi chiziq", quality: ["144p","360p","1080p","2048p"] },
    ]},
  { id: 4, title: "Bahor Qasri", genre: "Romantika / Slice of Life", desc: "Kichik shaharchada o'tgan bir bahorning unutilmas hikoyasi.", color: PALETTE[3], year: 2021, rating: 8.9,
    episodes: [
      { id: 1, number: 1, title: "Uchrashuv", quality: ["144p","480p","1080p"] },
      { id: 2, number: 2, title: "Gullar orasida", quality: ["144p","480p"] },
    ]},
  { id: 5, title: "Qorong'u Nasl", genre: "Dahshat / Fantastika", desc: "Insoniyat va soyalar o'rtasidagi asrlar davomida davom etgan kurash.", color: PALETTE[4], year: 2023, rating: 8.5,
    episodes: [
      { id: 1, number: 1, title: "Birinchi soya", quality: ["144p","360p","720p","2048p"] },
    ]},
  { id: 6, title: "Yulduzlar Sardori", genre: "Ilmiy-fantastika", desc: "Galaktika chegarasida yo'qolgan flotning yo'lni topish sayohati.", color: PALETTE[5], year: 2024, rating: 9.0,
    episodes: [
      { id: 1, number: 1, title: "Uchish", quality: ["144p","480p","1080p"] },
      { id: 2, number: 2, title: "Meteor maydoni", quality: ["144p","480p","1080p","1440p"] },
      { id: 3, number: 3, title: "Signal", quality: ["144p","480p"] },
    ]},
];

function fmt(n){ return n.toLocaleString("ru-RU").replace(/,/g," "); }

function Logo({ size = 30 }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <div style={{width:size,height:size}} className="rounded-lg bg-gradient-to-br from-amber-400 to-pink-500 flex items-center justify-center font-black text-[#12131C]" >A</div>
      <span className="font-black tracking-tight text-lg" style={{fontFamily:"'Zen Dots', sans-serif"}}>
        <span className="text-amber-400">Anime</span><span className="text-pink-400">Master</span><span className="text-white/50">.Uz</span>
      </span>
    </div>
  );
}

export default function App(){
  const [fontsReady] = useState(true);
  const [anime, setAnime] = useState(seedAnime);
  const [menuItems, setMenuItems] = useState([
    {id:1, name:"Bosh sahifa"}, {id:2, name:"Barcha animelar"}, {id:3, name:"Janrlar"}, {id:4, name:"Obuna"}
  ]);
  const [adminCard, setAdminCard] = useState(""); // "" = hammasi tekin
  const [payments, setPayments] = useState([]);
  const [user, setUser] = useState(null); // {name, method, isAdmin, subscribed, subUntil}
  const [view, setView] = useState("home"); // home | detail | admin | subscribe
  const [activeAnimeId, setActiveAnimeId] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginTab, setLoginTab] = useState("google");
  const [loginInput, setLoginInput] = useState("");
  const [toast, setToast] = useState(null);
  const [adminTab, setAdminTab] = useState("anime");
  const [editingAnimeId, setEditingAnimeId] = useState(null);
  const [addingEpisodeFor, setAddingEpisodeFor] = useState(null);
  const [cardDraft, setCardDraft] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("1080p");

  function showToast(msg){ setToast(msg); setTimeout(()=>setToast(null), 2600); }

  function handleLogin(){
    const val = loginInput.trim();
    if(!val){ return; }
    let isAdmin = false;
    if(loginTab === "google" && val.toLowerCase() === ADMIN_EMAIL.toLowerCase()) isAdmin = true;
    if(loginTab === "phone" && val.replace(/\s/g,"") === ADMIN_PHONE) isAdmin = true;
    setUser({ name: isAdmin ? "Admin" : (loginTab==="google" ? val.split("@")[0] : val), method: loginTab, isAdmin, subscribed: false, subUntil: null });
    setShowLogin(false);
    setLoginInput("");
    showToast(isAdmin ? "Admin sifatida kirdingiz" : "Xush kelibsiz, tizimga kirdingiz");
    if(isAdmin) setView("admin");
  }

  function logout(){ setUser(null); setView("home"); }

  const isFreeForAll = adminCard.trim() === "";

  function canWatch(){
    if(!user) return false;
    if(user.isAdmin) return true;
    if(isFreeForAll) return true;
    return user.subscribed;
  }

  function openAnime(id){ setActiveAnimeId(id); setView("detail"); }

  function subscribe(plan){
    if(!user){ setShowLogin(true); return; }
    if(isFreeForAll){ showToast("Hozircha barcha animelar bepul!"); return; }
    setPayments(p => [...p, { id: Date.now(), user: user.name, months: plan.months, amount: plan.price, date: new Date().toLocaleDateString("uz-UZ") }]);
    setUser(u => ({...u, subscribed: true, subUntil: `${plan.months} oylik`}));
    showToast(`To'lov muvaffaqiyatli! ${plan.months} oylik obuna faollashtirildi.`);
    setView("home");
  }

  function addAnime(data){
    setAnime(a => [...a, { id: Date.now(), episodes: [], color: PALETTE[a.length % PALETTE.length], year: new Date().getFullYear(), rating: 0, ...data }]);
    showToast("Yangi anime qo'shildi");
  }
  function updateAnime(id, data){
    setAnime(a => a.map(x => x.id===id ? {...x, ...data} : x));
    showToast("Anime yangilandi");
  }
  function deleteAnime(id){
    setAnime(a => a.filter(x=>x.id!==id));
    showToast("Anime o'chirildi");
  }
  function addEpisode(animeId, ep){
    setAnime(a => a.map(x => x.id===animeId ? {...x, episodes:[...x.episodes, {id:Date.now(), number: x.episodes.length+1, ...ep}]} : x));
    showToast("Qism qo'shildi");
  }
  function deleteEpisode(animeId, epId){
    setAnime(a => a.map(x => x.id===animeId ? {...x, episodes: x.episodes.filter(e=>e.id!==epId)} : x));
  }

  const activeAnime = anime.find(a=>a.id===activeAnimeId);

  return (
    <div className="min-h-screen bg-[#12131C] text-[#EDEDF2]" style={{fontFamily:"'Manrope', sans-serif"}}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zen+Dots&family=Manrope:wght@400;500;600;700;800&display=swap');
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#12131C]/85 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <button onClick={()=>setView("home")}><Logo/></button>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
            {menuItems.map(m => <span key={m.id} className="hover:text-amber-400 cursor-pointer transition-colors">{m.name}</span>)}
          </nav>
          <div className="flex items-center gap-3">
            {user?.isAdmin && (
              <button onClick={()=>setView("admin")} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full bg-pink-500/15 text-pink-400 border border-pink-500/30 hover:bg-pink-500/25 transition-colors">
                <Shield size={14}/> Admin panel
              </button>
            )}
            {user ? (
              <button onClick={logout} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <LogOut size={14}/> {user.name}
              </button>
            ) : (
              <button onClick={()=>setShowLogin(true)} className="text-xs font-bold px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-[#12131C] hover:opacity-90 transition-opacity">
                Kirish
              </button>
            )}
          </div>
        </div>
      </header>

      {/* HOME */}
      {view==="home" && (
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          <section className="rounded-3xl overflow-hidden relative mb-10 border border-white/10 bg-gradient-to-br from-[#1B1D2B] to-[#242739] p-8 md:p-12">
            <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl"/>
            <div className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl"/>
            <p className="text-amber-400 font-bold text-xs tracking-[0.2em] mb-3 relative">O'ZBEKISTONDAGI ANIME MARKAZI</p>
            <h1 className="text-3xl md:text-5xl font-black mb-4 relative max-w-xl" style={{fontFamily:"'Zen Dots', sans-serif"}}>Sevimli animelaringizni <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-pink-500">bir joydan</span> tomosha qiling</h1>
            <p className="text-white/60 max-w-lg mb-6 relative">144p dan 2048p gacha sifatda, reklamasiz, istalgan qurilmada — kuni-kuniga yangi qismlar bilan.</p>
            {isFreeForAll && <span className="inline-block relative text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Hozircha barcha animelar bepul</span>}
          </section>

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold flex items-center gap-2"><Tv size={20} className="text-amber-400"/> Barcha animelar</h2>
            <span className="text-xs text-white/40">{anime.length} ta anime</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {anime.map(a => (
              <button key={a.id} onClick={()=>openAnime(a.id)} className="group text-left rounded-2xl overflow-hidden border border-white/10 bg-[#1B1D2B] hover:border-white/25 transition-all hover:-translate-y-1">
                <div className="aspect-[3/4] flex items-center justify-center relative" style={{background:`linear-gradient(150deg, ${a.color}55, #12131C)`}}>
                  <span className="text-5xl font-black opacity-90" style={{fontFamily:"'Zen Dots', sans-serif", color:a.color}}>{a.title.charAt(0)}</span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <Play size={32} fill="white" className="text-white"/>
                  </div>
                  <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/50 flex items-center gap-1"><Star size={10} className="text-amber-400" fill="currentColor"/>{a.rating}</span>
                </div>
                <div className="p-3">
                  <p className="font-bold text-sm truncate">{a.title}</p>
                  <p className="text-[11px] text-white/40 truncate">{a.genre}</p>
                  <p className="text-[11px] text-white/30 mt-1">{a.episodes.length} qism</p>
                </div>
              </button>
            ))}
          </div>
        </main>
      )}

      {/* DETAIL */}
      {view==="detail" && activeAnime && (
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          <button onClick={()=>setView("home")} className="flex items-center gap-1 text-sm text-white/50 hover:text-white mb-6"><ChevronLeft size={16}/> Orqaga</button>

          <div className="grid md:grid-cols-[220px_1fr] gap-8 mb-10">
            <div className="aspect-[3/4] rounded-2xl flex items-center justify-center" style={{background:`linear-gradient(150deg, ${activeAnime.color}55, #12131C)`}}>
              <span className="text-6xl font-black" style={{fontFamily:"'Zen Dots', sans-serif", color:activeAnime.color}}>{activeAnime.title.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-3xl font-black mb-2" style={{fontFamily:"'Zen Dots', sans-serif"}}>{activeAnime.title}</h1>
              <div className="flex items-center gap-3 text-xs text-white/50 mb-4">
                <span className="flex items-center gap-1"><Star size={12} className="text-amber-400" fill="currentColor"/>{activeAnime.rating}</span>
                <span>{activeAnime.year}</span>
                <span>{activeAnime.genre}</span>
                <span>{activeAnime.episodes.length} qism</span>
              </div>
              <p className="text-white/60 leading-relaxed max-w-2xl mb-5">{activeAnime.desc}</p>
              {!canWatch() && (
                <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 max-w-md">
                  <p className="text-sm text-amber-300 font-semibold mb-2">Tomosha qilish uchun obuna kerak</p>
                  <button onClick={()=>setView("subscribe")} className="text-xs font-bold px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-[#12131C]">Obuna bo'lish</button>
                </div>
              )}
            </div>
          </div>

          <h2 className="text-lg font-bold mb-4">Qismlar</h2>
          <div className="space-y-2">
            {activeAnime.episodes.map(ep => (
              <div key={ep.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#1B1D2B] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center font-bold text-sm">{ep.number}</div>
                  <div>
                    <p className="font-semibold text-sm">{ep.title}</p>
                    <p className="text-[11px] text-white/40 flex items-center gap-1"><Clock size={10}/> {ep.quality.length} sifat variantlari</p>
                  </div>
                </div>
                {canWatch() ? (
                  <div className="flex items-center gap-2">
                    <select defaultValue={ep.quality.includes("1080p")?"1080p":ep.quality[0]} onChange={e=>setSelectedQuality(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg text-xs px-2 py-1.5">
                      {ep.quality.map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                    <button onClick={()=>showToast(`"${ep.title}" ${selectedQuality} sifatida ijro etilmoqda (demo)`)} className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg bg-amber-400 text-[#12131C]"><Play size={12} fill="currentColor"/> Ko'rish</button>
                  </div>
                ) : (
                  <button onClick={()=>user?setView("subscribe"):setShowLogin(true)} className="text-xs font-semibold px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40">🔒 Qulflangan</button>
                )}
              </div>
            ))}
            {activeAnime.episodes.length===0 && <p className="text-white/30 text-sm">Hali qismlar qo'shilmagan.</p>}
          </div>
        </main>
      )}

      {/* SUBSCRIBE */}
      {view==="subscribe" && (
        <main className="max-w-4xl mx-auto px-4 md:px-6 py-12">
          <h1 className="text-2xl font-black mb-2" style={{fontFamily:"'Zen Dots', sans-serif"}}>Obuna tanlang</h1>
          <p className="text-white/50 mb-8 text-sm">Barcha rejalar 144p–2048p sifatida cheklovsiz tomosha qilish imkonini beradi.</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {PLANS.map(p => (
              <div key={p.months} className="rounded-2xl border border-white/10 bg-[#1B1D2B] p-4 flex flex-col items-center text-center hover:border-amber-400/40 transition-colors">
                <p className="text-2xl font-black" style={{fontFamily:"'Zen Dots', sans-serif"}}>{p.months}</p>
                <p className="text-[11px] text-white/40 mb-3">oylik</p>
                <p className="text-sm font-bold text-amber-400 mb-4">{fmt(p.price)} so'm</p>
                <button onClick={()=>subscribe(p)} className="w-full text-xs font-bold py-2 rounded-lg bg-gradient-to-r from-amber-400 to-pink-500 text-[#12131C]">Tanlash</button>
              </div>
            ))}
          </div>
          {isFreeForAll && <p className="text-emerald-400 text-xs mt-6">Eslatma: admin hozircha to'lov kartasini kiritmagan — shuning uchun barcha kontent bepul ko'rsatilmoqda.</p>}
        </main>
      )}

      {/* ADMIN */}
      {view==="admin" && user?.isAdmin && (
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          <h1 className="text-2xl font-black mb-6 flex items-center gap-2" style={{fontFamily:"'Zen Dots', sans-serif"}}><Shield className="text-pink-400"/> Admin panel</h1>
          <div className="flex gap-2 mb-6 flex-wrap">
            {[["anime","Animelar"],["episodes","Qismlar"],["menu","Menyu"],["payment","To'lov sozlamalari"],["stats","Statistika"]].map(([k,l])=>(
              <button key={k} onClick={()=>setAdminTab(k)} className={`text-xs font-bold px-4 py-2 rounded-full border transition-colors ${adminTab===k?"bg-amber-400 text-[#12131C] border-amber-400":"border-white/10 text-white/50 hover:text-white"}`}>{l}</button>
            ))}
          </div>

          {adminTab==="anime" && <AnimeAdmin anime={anime} addAnime={addAnime} updateAnime={updateAnime} deleteAnime={deleteAnime} />}
          {adminTab==="episodes" && <EpisodeAdmin anime={anime} addEpisode={addEpisode} deleteEpisode={deleteEpisode} />}
          {adminTab==="menu" && <MenuAdmin menuItems={menuItems} setMenuItems={setMenuItems} />}
          {adminTab==="payment" && (
            <div className="max-w-md rounded-2xl border border-white/10 bg-[#1B1D2B] p-6">
              <p className="font-bold mb-1 flex items-center gap-2"><CreditCard size={16} className="text-amber-400"/> To'lov qabul qiluvchi karta</p>
              <p className="text-xs text-white/40 mb-4">Karta kiritilmasa — barcha animelar barcha foydalanuvchilarga bepul ko'rsatiladi.</p>
              <input value={cardDraft || adminCard} onChange={e=>setCardDraft(e.target.value)} placeholder="8600 0000 0000 0000" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm mb-3" />
              <div className="flex gap-2">
                <button onClick={()=>{setAdminCard(cardDraft); showToast("Karta saqlandi. Endi to'lovlar shu kartaga tushadi.");}} className="flex-1 text-xs font-bold py-2.5 rounded-lg bg-amber-400 text-[#12131C]">Saqlash</button>
                {adminCard && <button onClick={()=>{setAdminCard(""); setCardDraft(""); showToast("Karta o'chirildi — barcha animelar bepul bo'ldi.");}} className="text-xs font-bold px-4 py-2.5 rounded-lg bg-white/5 border border-white/10">O'chirish</button>}
              </div>
              <p className="text-[11px] text-white/30 mt-3">{adminCard ? `Joriy karta: •••• ${adminCard.slice(-4)}` : "Hozir: hech qanday karta kiritilmagan (bepul rejim)"}</p>
            </div>
          )}
          {adminTab==="stats" && (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-6 max-w-xl">
                <div className="rounded-xl border border-white/10 bg-[#1B1D2B] p-4"><p className="text-2xl font-black text-amber-400">{anime.length}</p><p className="text-[11px] text-white/40">Anime</p></div>
                <div className="rounded-xl border border-white/10 bg-[#1B1D2B] p-4"><p className="text-2xl font-black text-pink-400">{payments.length}</p><p className="text-[11px] text-white/40">To'lovlar</p></div>
                <div className="rounded-xl border border-white/10 bg-[#1B1D2B] p-4"><p className="text-2xl font-black text-emerald-400">{fmt(payments.reduce((s,p)=>s+p.amount,0))}</p><p className="text-[11px] text-white/40">Jami so'm</p></div>
              </div>
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-white/40 text-xs"><tr><th className="text-left p-3">Foydalanuvchi</th><th className="text-left p-3">Reja</th><th className="text-left p-3">Summa</th><th className="text-left p-3">Sana</th></tr></thead>
                  <tbody>
                    {payments.map(p=>(<tr key={p.id} className="border-t border-white/5"><td className="p-3">{p.user}</td><td className="p-3">{p.months} oylik</td><td className="p-3">{fmt(p.amount)} so'm</td><td className="p-3">{p.date}</td></tr>))}
                    {payments.length===0 && <tr><td colSpan={4} className="p-4 text-center text-white/30">Hali to'lovlar yo'q</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      )}

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={()=>setShowLogin(false)}>
          <div onClick={e=>e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-[#1B1D2B] border border-white/10 p-6 relative">
            <button onClick={()=>setShowLogin(false)} className="absolute top-4 right-4 text-white/40 hover:text-white"><X size={18}/></button>
            <Logo/>
            <p className="text-white/50 text-sm mt-4 mb-5">Davom etish uchun kiring</p>
            <div className="flex gap-2 mb-4">
              <button onClick={()=>setLoginTab("google")} className={`flex-1 text-xs font-bold py-2 rounded-lg border ${loginTab==="google"?"bg-white/10 border-white/30":"border-white/10 text-white/40"}`}>Google</button>
              <button onClick={()=>setLoginTab("phone")} className={`flex-1 text-xs font-bold py-2 rounded-lg border ${loginTab==="phone"?"bg-white/10 border-white/30":"border-white/10 text-white/40"}`}>Telefon raqam</button>
            </div>
            <input
              value={loginInput}
              onChange={e=>setLoginInput(e.target.value)}
              placeholder={loginTab==="google" ? "email@gmail.com" : "+998 90 000 00 00"}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm mb-4"
            />
            <button onClick={handleLogin} className="w-full text-sm font-bold py-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-pink-500 text-[#12131C]">
              {loginTab==="google" ? "Google orqali kirish" : "Telefon orqali kirish"}
            </button>
            <p className="text-[10px] text-white/25 mt-4 leading-relaxed">Demo rejimi: admin sifatida kirish uchun oldindan belgilangan email yoki raqamni kiriting. Boshqa har qanday qiymat oddiy foydalanuvchi sifatida kiritadi.</p>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-[#12131C] text-sm font-semibold px-5 py-3 rounded-full shadow-xl z-50 flex items-center gap-2">
          <Check size={16}/> {toast}
        </div>
      )}
    </div>
  );
}

function AnimeAdmin({ anime, addAnime, updateAnime, deleteAnime }){
  const [form, setForm] = useState({title:"", genre:"", desc:""});
  const [editId, setEditId] = useState(null);

  function submit(){
    if(!form.title.trim()) return;
    if(editId){ updateAnime(editId, form); setEditId(null); }
    else { addAnime(form); }
    setForm({title:"",genre:"",desc:""});
  }

  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-6">
      <div className="rounded-2xl border border-white/10 bg-[#1B1D2B] p-5 h-fit">
        <p className="font-bold mb-3 flex items-center gap-2"><Plus size={16} className="text-amber-400"/> {editId? "Animeni tahrirlash" : "Yangi anime qo'shish"}</p>
        <input placeholder="Nomi" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm mb-2"/>
        <input placeholder="Janr" value={form.genre} onChange={e=>setForm({...form,genre:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm mb-2"/>
        <textarea placeholder="Tavsif" value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm mb-3"/>
        <button onClick={submit} className="w-full text-xs font-bold py-2.5 rounded-lg bg-amber-400 text-[#12131C]">{editId? "Saqlash" : "Qo'shish"}</button>
        {editId && <button onClick={()=>{setEditId(null); setForm({title:"",genre:"",desc:""});}} className="w-full text-xs font-semibold py-2 mt-2 rounded-lg border border-white/10 text-white/50">Bekor qilish</button>}
      </div>
      <div className="space-y-2">
        {anime.map(a=>(
          <div key={a.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#1B1D2B] px-4 py-3">
            <div>
              <p className="font-semibold text-sm">{a.title}</p>
              <p className="text-[11px] text-white/40">{a.genre} • {a.episodes.length} qism</p>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>{setEditId(a.id); setForm({title:a.title, genre:a.genre, desc:a.desc});}} className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"><Pencil size={14}/></button>
              <button onClick={()=>deleteAnime(a.id)} className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EpisodeAdmin({ anime, addEpisode, deleteEpisode }){
  const [animeId, setAnimeId] = useState(anime[0]?.id || null);
  const [title, setTitle] = useState("");
  const [quality, setQuality] = useState(["144p","720p","1080p"]);
  const current = anime.find(a=>a.id===animeId);

  function toggleQ(q){ setQuality(prev => prev.includes(q) ? prev.filter(x=>x!==q) : [...prev,q]); }
  function submit(){
    if(!title.trim() || !animeId) return;
    addEpisode(animeId, { title, quality });
    setTitle("");
  }

  return (
    <div className="grid md:grid-cols-[320px_1fr] gap-6">
      <div className="rounded-2xl border border-white/10 bg-[#1B1D2B] p-5 h-fit">
        <p className="font-bold mb-3 flex items-center gap-2"><Plus size={16} className="text-amber-400"/> Yangi qism qo'shish</p>
        <select value={animeId||""} onChange={e=>setAnimeId(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm mb-2">
          {anime.map(a=><option key={a.id} value={a.id}>{a.title}</option>)}
        </select>
        <input placeholder="Qism nomi" value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm mb-3"/>
        <p className="text-[11px] text-white/40 mb-2">Mavjud sifatlar (144p–2048p)</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {QUALITIES.map(q=>(
            <button key={q} onClick={()=>toggleQ(q)} className={`text-[10px] font-bold px-2 py-1 rounded-md border ${quality.includes(q)?"bg-amber-400 text-[#12131C] border-amber-400":"border-white/10 text-white/40"}`}>{q}</button>
          ))}
        </div>
        <button onClick={submit} className="w-full text-xs font-bold py-2.5 rounded-lg bg-amber-400 text-[#12131C]">Qism qo'shish</button>
      </div>
      <div className="space-y-2">
        {current?.episodes.map(ep=>(
          <div key={ep.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#1B1D2B] px-4 py-3">
            <div>
              <p className="font-semibold text-sm">{ep.number}-qism: {ep.title}</p>
              <p className="text-[11px] text-white/40">{ep.quality.join(", ")}</p>
            </div>
            <button onClick={()=>deleteEpisode(animeId, ep.id)} className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"><Trash2 size={14}/></button>
          </div>
        ))}
        {!current?.episodes.length && <p className="text-white/30 text-sm">Bu anime uchun hali qismlar yo'q.</p>}
      </div>
    </div>
  );
}

function MenuAdmin({ menuItems, setMenuItems }){
  const [name, setName] = useState("");
  const [img, setImg] = useState("");
  function add(){
    if(!name.trim()) return;
    setMenuItems(m=>[...m, {id:Date.now(), name, img}]);
    setName(""); setImg("");
  }
  return (
    <div className="grid md:grid-cols-[320px_1fr] gap-6">
      <div className="rounded-2xl border border-white/10 bg-[#1B1D2B] p-5 h-fit">
        <p className="font-bold mb-3 flex items-center gap-2"><MenuIcon size={16} className="text-amber-400"/> Yangi menyu qo'shish</p>
        <input placeholder="Menyu nomi" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm mb-2"/>
        <input placeholder="Rasm havolasi (ixtiyoriy)" value={img} onChange={e=>setImg(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm mb-3"/>
        <button onClick={add} className="w-full text-xs font-bold py-2.5 rounded-lg bg-amber-400 text-[#12131C]">Qo'shish</button>
      </div>
      <div className="space-y-2">
        {menuItems.map(m=>(
          <div key={m.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#1B1D2B] px-4 py-3">
            <div className="flex items-center gap-3">
              {m.img && <img src={m.img} className="w-8 h-8 rounded object-cover" />}
              <p className="font-semibold text-sm">{m.name}</p>
            </div>
            <button onClick={()=>setMenuItems(items=>items.filter(x=>x.id!==m.id))} className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"><Trash2 size={14}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}
