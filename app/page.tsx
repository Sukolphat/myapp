"use client";

import { useRef, useState, type ReactNode } from "react";
import { Noto_Sans_Thai } from "next/font/google";

const noto = Noto_Sans_Thai({ subsets: ["thai", "latin"], weight: ["400", "700"] });

/* ---------- ข้อมูลตัวอย่าง ---------- */
type Platform = "mobile" | "pc" | "console";
type Game = { id: string; name: string; platform: Platform; icon: string; bg: string; fg: string };
type Pkg = { id: string; amount: string; price: number; hot?: boolean };
type Screen = "home" | "pkg" | "pay" | "done";
type Order = { id: string; time: string; game: string; amount: string; uid: string; pay: string; total: number };

const GAMES: Game[] = [
  { id: "a", name: "เกม A", platform: "mobile", icon: "gem", bg: "#7C4DFF", fg: "#FFD600" },
  { id: "b", name: "เกม B", platform: "mobile", icon: "sword", bg: "#FF2E93", fg: "#FFFFFF" },
  { id: "c", name: "เกม C", platform: "pc", icon: "crown", bg: "#FF6D00", fg: "#FFF176" },
  { id: "d", name: "เกม D", platform: "pc", icon: "shield", bg: "#00B8D4", fg: "#FFFFFF" },
  { id: "e", name: "เกม E", platform: "console", icon: "car", bg: "#00C853", fg: "#FFFFFF" },
  { id: "f", name: "เกม F", platform: "console", icon: "star", bg: "#D500F9", fg: "#FFEB3B" },
];
const PACKAGES: Pkg[] = [
  { id: "p1", amount: "60 เพชร", price: 29 },
  { id: "p2", amount: "330 เพชร", price: 149, hot: true },
  { id: "p3", amount: "660 เพชร", price: 299 },
  { id: "p4", amount: "1,980 เพชร", price: 899 },
  { id: "p5", amount: "3,960 เพชร", price: 1790 },
  { id: "p6", amount: "8,100 เพชร", price: 3590 },
];
const SERVERS = ["เอเชีย", "ยุโรป", "อเมริกา"];
const PAYS = [
  { id: "promptpay", name: "พร้อมเพย์ QR", icon: "qr", bg: "#1E88E5" },
  { id: "card", name: "บัตรเครดิต / เดบิต", icon: "card", bg: "#FF6D00" },
  { id: "wallet", name: "TrueMoney Wallet", icon: "wallet", bg: "#FF2E93" },
  { id: "bank", name: "โอนผ่านแอปธนาคาร", icon: "bank", bg: "#00C853" },
];
const COUPONS: Record<string, number> = { WELCOME10: 0.1 };
const FILTERS: [Platform | "all", string][] = [["all", "ทั้งหมด"], ["mobile", "มือถือ"], ["pc", "พีซี"], ["console", "คอนโซล"]];

/* ---------- ไอคอน SVG ---------- */
const GLYPH: Record<string, ReactNode> = {
  gem: (<><path d="M24 6l15 11-15 25L9 17z" /><path d="M9 17h30M24 6l-6 11 6 25 6-25z" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="2" /></>),
  sword: <path d="M36 6l6 6-20 20-6-6zM12 30l6 6-4 4-6-2-2-6z" />,
  crown: (<><path d="M7 34V15l9 9 8-14 8 14 9-9v19z" /><rect x="7" y="37" width="34" height="4" rx="2" /></>),
  shield: (<><path d="M24 5l15 5v13c0 10-6 17-15 20C15 40 9 33 9 23V10z" /><path d="M24 14v20" stroke="#fff" strokeOpacity=".6" strokeWidth="3" /></>),
  star: <path d="M24 5l5.5 12 13 1.5-9.7 8.8 2.8 12.8L24 33l-11.6 7.1 2.8-12.8L5.5 18.5l13-1.5z" />,
  car: (<><path d="M6 28l5-11h26l5 11v8H6z" /><circle cx="14" cy="37" r="5" stroke="#fff" strokeOpacity=".7" strokeWidth="2" /><circle cx="34" cy="37" r="5" stroke="#fff" strokeOpacity=".7" strokeWidth="2" /></>),
  cart: (<><path d="M6 8h6l4 20h20l4-14H14" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="19" cy="37" r="3" /><circle cx="34" cy="37" r="3" /></>),
  qr: <path d="M6 6h14v14H6zM28 6h14v14H28zM6 28h14v14H6zM28 28h6v6h-6zM36 36h6v6h-6z" />,
  card: (<><path d="M5 10h38v28H5z" /><path d="M5 18h38" stroke="#14082E" strokeWidth="5" /></>),
  wallet: (<><path d="M6 12h34v26H6z" /><circle cx="34" cy="25" r="4" fill="#14082E" /></>),
  bank: <path d="M24 5l19 10H5zM9 19h6v16H9zM21 19h6v16h-6zM33 19h6v16h-6zM5 38h38v5H5z" />,
};

function Glyph({ k, fill, size }: { k: string; fill: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill={fill} aria-hidden="true">
      {GLYPH[k]}
    </svg>
  );
}

function Icon({ k, bg, fg = "#fff", size = 48, radius = 14 }: { k: string; bg: string; fg?: string; size?: number; radius?: number }) {
  return (
    <div className="flex shrink-0 items-center justify-center" style={{ width: size, height: size, borderRadius: radius, background: bg }}>
      <Glyph k={k} fill={fg} size={Math.round(size * 0.72)} />
    </div>
  );
}

/* ---------- คลาสที่ใช้ซ้ำ ---------- */
const btnY = "h-[54px] w-full rounded-2xl bg-[#FFD600] text-base font-bold text-[#14082E] transition active:scale-95 disabled:opacity-60";
const btnO = "h-[54px] w-full rounded-2xl border-2 border-[#7C4DFF] text-base font-bold text-white transition active:scale-95";
const inputC = "h-12 w-full rounded-xl border-2 border-[#3B2480] bg-[#241150] px-3.5 text-base text-white outline-none placeholder:text-white/50 focus:border-[#00E5FF]";
const cardC = "rounded-2xl border-2 border-[#3B2480] bg-[#241150]";
const baht = (n: number) => `฿ ${n.toLocaleString("th-TH")}`;

/* ---------- หน้าหลัก ---------- */
export default function Page() {
  const [screen, setScreen] = useState<Screen>("home");
  const [filter, setFilter] = useState<Platform | "all">("all");
  const [q, setQ] = useState("");
  const [game, setGame] = useState<Game>(GAMES[0]);
  const [pkg, setPkg] = useState<Pkg>(PACKAGES[1]);
  const [uid, setUid] = useState("");
  const [server, setServer] = useState("");
  const [pay, setPay] = useState("promptpay");
  const [coupon, setCoupon] = useState("");
  const [rate, setRate] = useState(0);
  const [order, setOrder] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "error" | "ok" | "info" } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = Math.round(pkg.price * (1 - rate));
  const games = GAMES.filter((g) => (filter === "all" || g.platform === filter) && g.name.toLowerCase().includes(q.trim().toLowerCase()));

  function say(msg: string, type: "error" | "ok" | "info" = "error") {
    setToast({ msg, type });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2800);
  }

  function reset() {
    setQ(""); setUid(""); setServer(""); setPay("promptpay"); setCoupon(""); setRate(0); setOrder(null); setBusy(false);
    setPkg(PACKAGES[1]);
    setScreen("home");
  }

  function toPay() {
    if (!/^\d{5,15}$/.test(uid)) return say("กรุณากรอก UID เป็นตัวเลข 5–15 หลัก");
    if (!server) return say("กรุณาเลือกเซิร์ฟเวอร์");
    setScreen("pay");
  }

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (!code) { setRate(0); return; }
    const r = COUPONS[code];
    setRate(r ?? 0);
    say(r ? `ใช้โค้ดสำเร็จ ลด ${Math.round(r * 100)}%` : "โค้ดไม่ถูกต้อง", r ? "ok" : "error");
  }

  async function submit() {
    if (busy) return;
    setBusy(true);
    // TODO: เรียก API จริง เช่น fetch("/api/orders", { method: "POST", body: JSON.stringify({...}) })
    await new Promise((r) => setTimeout(r, 900));
    setOrder({
      id: `TP${Date.now().toString().slice(-10)}`,
      time: new Date().toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" }),
      game: game.name, amount: pkg.amount, uid, pay, total,
    });
    setBusy(false);
    setScreen("done");
  }

  const soon = (n: string) => say(`${n}: เร็วๆ นี้`, "info");

  const Back = ({ to, title }: { to: Screen; title: string }) => (
    <div className="flex h-[60px] items-center">
      <button className="h-11 px-2 text-[15px] text-[#00E5FF]" onClick={() => setScreen(to)}>‹ ย้อนกลับ</button>
      <h1 className="flex-1 pr-16 text-center font-bold">{title}</h1>
    </div>
  );

  const Footer = ({ children }: { children: ReactNode }) => (
    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 border-t border-[#3B2480] bg-[#1E0E45] px-4 pb-6 pt-3">{children}</div>
  );

  return (
    <main className={`${noto.className} flex min-h-dvh justify-center bg-[#0b0420]`}>
      <div className="relative h-dvh w-full max-w-[390px] overflow-hidden bg-[#14082E] text-white sm:my-4 sm:h-[882px] sm:rounded-[28px] sm:ring-2 sm:ring-[#3B2480]">
        {toast && (
          <div role="status" className={`absolute left-1/2 top-3 z-50 w-[90%] -translate-x-1/2 rounded-xl px-4 py-3 text-sm shadow-lg ${toast.type === "error" ? "bg-red-500 text-white" : "bg-[#00E5FF] text-[#14082E]"}`}>
            {toast.msg}
          </div>
        )}

        {/* 1) หน้าแรก */}
        {screen === "home" && (
          <>
            <div className="h-[calc(100%-68px)] overflow-y-auto px-4 pb-4">
              <div className="flex items-center py-4">
                <h1 className="flex-1 text-2xl font-bold">เติมเกม</h1>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF2E93]"><Glyph k="cart" fill="#fff" size={22} /></div>
              </div>
              <input className={inputC} value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาเกมที่ต้องการเติม" aria-label="ค้นหาเกม" />

              <div className="relative mt-4 flex h-[150px] items-center overflow-hidden rounded-3xl bg-[#6C2BFF] px-5">
                <div className="absolute -right-8 -top-10 h-44 w-44 rounded-full bg-[#FF2E93]" />
                <div className="absolute -bottom-12 right-12 h-28 w-28 rounded-full bg-[#00E5FF]" />
                <svg className="absolute right-4 top-6" width="104" height="104" viewBox="0 0 48 48" fill="#FFD600" aria-hidden="true">{GLYPH.gem}</svg>
                <div className="relative flex w-44 flex-col gap-1.5">
                  <span className="self-start rounded-full bg-[#FFD600] px-2.5 py-0.5 text-[11px] font-bold text-[#14082E]">โปรโมชันพิเศษ</span>
                  <b className="text-2xl leading-tight">โบนัสเพชร +20%</b>
                  <span className="text-xs text-[#E9E1FF]">เติมวันนี้ รับทันที</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto">
                {FILTERS.map(([k, n]) => (
                  <button key={k} onClick={() => setFilter(k)} className={`h-9 shrink-0 rounded-full px-4 text-[13px] ${filter === k ? "bg-[#FFD600] font-bold text-[#14082E]" : "bg-[#2F1A6B] text-[#E9E1FF]"}`}>{n}</button>
                ))}
              </div>

              <h2 className="mb-2 mt-4 font-bold">เกมยอดนิยม</h2>
              <div className="grid grid-cols-3 gap-3">
                {games.map((g) => (
                  <button key={g.id} onClick={() => { setGame(g); setPkg(PACKAGES[1]); setScreen("pkg"); }} className="flex flex-col items-center gap-1.5">
                    <span className={`${cardC} flex w-full justify-center p-2.5 transition active:scale-95`}><Icon k={g.icon} bg={g.bg} fg={g.fg} size={64} radius={16} /></span>
                    <span className="text-xs">{g.name}</span>
                  </button>
                ))}
                {games.length === 0 && <p className="col-span-3 py-6 text-center text-sm opacity-70">ไม่พบเกมที่ค้นหา</p>}
              </div>

              <h2 className="mb-2 mt-4 font-bold">โปรโมชันวันนี้</h2>
              {([["gem", "#7C4DFF", "#FFD600", "เพชรโบนัสเท่าตัว"], ["sword", "#FF2E93", "#fff", "ซื้อ 2 แถม 1"]] as const).map(([k, b, f, t]) => (
                <div key={t} className={`${cardC} mb-2 flex items-center gap-3 p-3`}>
                  <Icon k={k} bg={b} fg={f} size={48} radius={12} />
                  <div className="flex-1"><b>{t}</b><div className="text-xs text-[#C4B5FD]">เติมครบ ฿ 299 รับของแถม</div></div>
                  <span className="rounded-full bg-[#FF2E93] px-2.5 py-0.5 text-xs font-bold">HOT</span>
                </div>
              ))}
            </div>
            <nav className="absolute inset-x-0 bottom-0 flex h-[68px] items-center justify-around border-t border-[#3B2480] bg-[#1E0E45] text-[11px]">
              {([["หน้าแรก", "crown"], ["คำสั่งซื้อ", "cart"], ["โปรโมชัน", "star"], ["บัญชี", "shield"]] as const).map(([n, k], i) => (
                <button key={n} onClick={() => (i === 0 ? reset() : soon(n))} className={`flex flex-col items-center gap-1 ${i === 0 ? "font-bold text-[#FFD600]" : "text-[#C4B5FD]"}`}>
                  <Glyph k={k} fill="currentColor" size={24} />{n}
                </button>
              ))}
            </nav>
          </>
        )}

        {/* 2) เลือกแพ็กเกจ */}
        {screen === "pkg" && (
          <>
            <div className="h-full overflow-y-auto px-4 pb-44">
              <Back to="home" title={`เติม${game.name}`} />
              <div className="flex items-center gap-3 rounded-2xl bg-[#6C2BFF] p-3">
                <Icon k={game.icon} bg="#14082E" fg={game.fg} size={64} radius={16} />
                <div><b className="text-lg">{game.name}</b><div className="text-xs text-[#E9E1FF]">เติมทันที · รองรับหลายเซิร์ฟเวอร์</div></div>
              </div>
              <h2 className="mb-2 mt-4 font-bold"><span className="text-[#00E5FF]">1.</span> กรอกข้อมูลบัญชี</h2>
              <input className={`${inputC} mb-2`} inputMode="numeric" maxLength={15} value={uid} onChange={(e) => setUid(e.target.value.replace(/\D/g, ""))} placeholder="ไอดีผู้เล่น (UID)" aria-label="ไอดีผู้เล่น" />
              <select className={`${inputC} [color-scheme:dark]`} value={server} onChange={(e) => setServer(e.target.value)} aria-label="เซิร์ฟเวอร์">
                <option value="">เลือกเซิร์ฟเวอร์</option>
                {SERVERS.map((s) => <option key={s}>{s}</option>)}
              </select>
              <h2 className="mb-3 mt-4 font-bold"><span className="text-[#00E5FF]">2.</span> เลือกแพ็กเกจ</h2>
              <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                {PACKAGES.map((p) => (
                  <button key={p.id} onClick={() => setPkg(p)} aria-pressed={pkg.id === p.id} className={`relative flex h-[100px] flex-col items-center justify-center gap-1.5 rounded-2xl border-2 ${pkg.id === p.id ? "border-[#00E5FF] bg-[#2F1A6B]" : "border-[#3B2480] bg-[#241150]"}`}>
                    {p.hot && <span className="absolute -top-2.5 right-2.5 rounded-full bg-[#FF2E93] px-2.5 py-0.5 text-xs font-bold">ยอดนิยม</span>}
                    <span className="flex items-center gap-2"><Icon k="gem" bg="#7C4DFF" fg="#FFD600" size={32} radius={10} /><b className="text-[17px]">{p.amount.split(" ")[0]}</b></span>
                    <b className="text-[#FFD600]">{baht(p.price)}</b>
                  </button>
                ))}
              </div>
            </div>
            <Footer>
              <div className="flex items-center justify-between"><span className="text-sm text-[#C4B5FD]">ยอดรวม</span><b className="text-[22px] text-[#FFD600]">{baht(pkg.price)}</b></div>
              <button className={btnY} onClick={toPay}>ถัดไป</button>
            </Footer>
          </>
        )}

        {/* 3) ชำระเงิน */}
        {screen === "pay" && (
          <>
            <div className="h-full overflow-y-auto px-4 pb-36">
              <Back to="pkg" title="ชำระเงิน" />
              <div className={`${cardC} flex items-center gap-3 p-3`}>
                <Icon k={game.icon} bg={game.bg} fg={game.fg} size={56} />
                <div className="flex-1"><b>{game.name}</b><div className="text-xs text-[#C4B5FD]">{pkg.amount} · UID {uid}</div></div>
                <b className="text-[#FFD600]">{baht(pkg.price)}</b>
              </div>
              <h2 className="mb-2 mt-4 font-bold">เลือกวิธีชำระเงิน</h2>
              {PAYS.map((m) => (
                <button key={m.id} onClick={() => setPay(m.id)} aria-pressed={pay === m.id} className={`mb-2 flex h-[62px] w-full items-center gap-3 rounded-2xl border-2 px-3 ${pay === m.id ? "border-[#00E5FF] bg-[#2F1A6B]" : "border-[#3B2480] bg-[#241150]"}`}>
                  <Icon k={m.icon} bg={m.bg} size={40} radius={12} />
                  <b className="flex-1 text-left">{m.name}</b>
                  <span className={`h-[22px] w-[22px] rounded-full border-2 border-[#00E5FF] ${pay === m.id ? "bg-[#00E5FF]" : ""}`} />
                </button>
              ))}
              <div className="mt-3 flex gap-2">
                <input className={`${inputC} flex-1`} value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="โค้ดส่วนลด (ลอง WELCOME10)" aria-label="โค้ดส่วนลด" />
                <button className="h-12 w-24 rounded-xl border-2 border-[#7C4DFF] text-sm font-bold" onClick={applyCoupon}>ใช้โค้ด</button>
              </div>
              <div className={`${cardC} mt-4 p-3 text-sm`}>
                <div className="flex justify-between py-1.5"><span className="text-[#C4B5FD]">ราคาแพ็กเกจ</span><span>{baht(pkg.price)}</span></div>
                <div className="flex justify-between py-1.5"><span className="text-[#C4B5FD]">ส่วนลด</span><span className="text-[#00E676]">- {baht(pkg.price - total)}</span></div>
                <div className="mt-1 flex justify-between border-t border-[#3B2480] pt-2.5"><b>ยอดชำระ</b><b className="text-xl text-[#FFD600]">{baht(total)}</b></div>
              </div>
            </div>
            <Footer>
              <button className={btnY} disabled={busy} onClick={submit}>{busy ? "กำลังดำเนินการ…" : `ชำระเงิน ${baht(total)}`}</button>
            </Footer>
          </>
        )}

        {/* 4) สำเร็จ */}
        {screen === "done" && order && (
          <>
            <div className="h-full overflow-y-auto px-4 pb-52">
              <div className="flex h-[60px] items-center justify-center font-bold">สถานะคำสั่งซื้อ</div>
              <div className="relative mx-auto mt-2 h-[130px] w-[150px]">
                <div className="absolute left-[25px] top-[15px] flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#00E676]">
                  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#14082E" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>
                </div>
                <svg className="absolute left-0 top-0" width="34" height="34" viewBox="0 0 48 48" fill="#FFD600" aria-hidden="true">{GLYPH.gem}</svg>
                <svg className="absolute right-0 top-[70px]" width="40" height="40" viewBox="0 0 48 48" fill="#FF2E93" aria-hidden="true">{GLYPH.star}</svg>
                <svg className="absolute right-3.5 top-0" width="26" height="26" viewBox="0 0 48 48" fill="#00E5FF" aria-hidden="true">{GLYPH.star}</svg>
              </div>
              <div className="mt-4 text-center"><h2 className="text-2xl font-bold">ชำระเงินสำเร็จ</h2><p className="mt-1 text-xs text-[#C4B5FD]">ระบบกำลังเติมให้อัตโนมัติ ปกติไม่เกิน 5 นาที</p></div>
              <div className="mt-5 flex">
                {["ชำระแล้ว", "กำลังเติม", "สำเร็จ"].map((n, i) => (
                  <div key={n} className="flex flex-1 flex-col items-center gap-1.5">
                    <div className={`flex h-[30px] w-[30px] items-center justify-center rounded-full text-[13px] font-bold ${i < 2 ? "bg-[#00E676] text-[#14082E]" : "bg-[#3B2480] text-[#C4B5FD]"}`}>{i + 1}</div>
                    <span className={`text-xs ${i < 2 ? "font-bold" : "text-[#C4B5FD]"}`}>{n}</span>
                  </div>
                ))}
              </div>
              <div className={`${cardC} mt-5 p-3 text-sm`}>
                {([["เลขที่คำสั่งซื้อ", order.id], ["เกม", order.game], ["แพ็กเกจ", order.amount], ["UID", order.uid], ["วิธีชำระเงิน", PAYS.find((m) => m.id === order.pay)?.name ?? order.pay], ["เวลา", order.time], ["ยอดชำระ", baht(order.total)]] as const).map(([a, b]) => (
                  <div key={a} className="flex justify-between py-1.5"><span className="text-[#C4B5FD]">{a}</span><span>{b}</span></div>
                ))}
              </div>
            </div>
            <Footer>
              <button className={btnY} onClick={() => soon("คำสั่งซื้อของฉัน")}>ดูคำสั่งซื้อของฉัน</button>
              <button className={btnO} onClick={reset}>กลับหน้าแรก</button>
            </Footer>
          </>
        )}
      </div>
    </main>
  );
}