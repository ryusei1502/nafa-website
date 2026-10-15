// NAFA サイト共通スクリプト
// ・ヘッダーとフッターはここで全ページ共通に作る(メニューを変えるときはここの NAV だけ直せばOK)
// ・大会日程のデータは SCHEDULE にまとめてある(トップのカウントダウンと大会日程ページで使う)
document.documentElement.classList.add("js");

const NAV = [
  ["about.html", "NAFAとは", "about"],
  ["debate.html", "ディベートとは", "debate"],
  ["schedule.html", "大会日程", "schedule"],
  ["tournaments.html", "主催大会", "tournaments"],
  ["members.html", "加盟団体", "members"],
  ["awards.html", "NAFA褒賞", "awards"],
  ["join.html", "入会案内", "join"],
  ["contact.html", "お問い合わせ", "contact"],
];

// 2026年度大会日程(旧サイト 2026年3月30日現在)
// [表示用の日付, 開始(月-日), 終了(月-日), 大会名, 会場・形式, 印]
// 印: award=褒賞大会 host=NAFA主催 g1=1年生大会 g2=2年生大会 open=シーズン制限なし event=その他イベント
const SEASON_YEAR = 2026;
const SCHEDULE = [
  ["3/1", "03-01", "03-01", "NAFA Spring Seminar", "", ["event"]],
  ["3/7–8", "03-07", "03-08", "KIDL Camp", "", ["event"]],
  ["3/14–15", "03-14", "03-15", "NAFA 教育リーグ", "", ["g2", "host"]],
  ["3/21–22", "03-21", "03-22", "KUEL Spring Debate Tournament", "", ["host"]],
  ["4/18–19", "04-18", "04-19", "Jr.KIDL × AYAME", "", ["g2"]],
  ["4/25–26", "04-25", "04-26", "The 40th NAFA Michinoku Tournament", "関東・対面予定", ["award", "host"]],
  ["5/9–10", "05-09", "05-10", "春KIDL", "", []],
  ["5/30–31", "05-30", "05-31", "SEED", "", ["g2"]],
  ["6/13–14, 20", "06-13", "06-20", "The 44th Japan National Debate Tournament", "予選オンライン/本戦 関西・対面予定", ["award", "host"]],
  ["8/16", "08-16", "08-16", "NAFA Summer Seminar", "", ["event"]],
  ["9/5–6", "09-05", "09-06", "NIF", "", ["g1"]],
  ["9/12–13", "09-12", "09-13", "The 19th NAFA Kyushu Tournament", "関東・対面予定", ["award", "host"]],
  ["9/19–20", "09-19", "09-20", "立青杯", "", ["g1"]],
  ["9/26–27", "09-26", "09-27", "NSDT", "", ["g2", "host"]],
  ["10/10–11", "10-10", "10-11", "FEED / FLDT", "", ["g1", "host"]],
  ["10/17–18, 24", "10-17", "10-24", "The 55th All Japan Debate Tournament", "予選オンライン/本戦 関西・対面予定", ["award", "host"]],
  ["10/31–11/1", "10-31", "11-01", "FFDT / KESSAT for freshman", "", ["g1"]],
  ["11/7–8", "11-07", "11-08", "KID", "", ["g2"]],
  ["11/14–15, 21", "11-14", "11-21", "The 45th NAFA Tournament", "予選オンライン/本戦 関東・対面予定", ["award", "host"]],
  ["11/28–29", "11-28", "11-29", "KAEDE × NIDT", "", ["open"]],
  ["12/5–6, 12", "12-05", "12-12", "MFDT", "予選オンライン/本戦 関東・対面予定", ["g1", "host"]],
];
const MARK = { award: ["award", "褒賞"], host: ["host", "NAFA主催"], g1: ["grade", "1年生"], g2: ["grade", "2年生"], open: ["grade", "Open"], event: ["event", "イベント"] };

function toDate(md, endOfDay) {
  const [m, d] = md.split("-").map(Number);
  return new Date(m <= 2 ? SEASON_YEAR + 1 : SEASON_YEAR, m - 1, d, endOfDay ? 23 : 0, endOfDay ? 59 : 0);
}
const events = SCHEDULE.map(([label, s, e, name, where, tags]) => ({ label, start: toDate(s), end: toDate(e, true), name, where, tags }));
const now = new Date();
const nextIndex = events.findIndex(ev => ev.end >= now);

/* ---------- Header / Footer ---------- */
const page = document.body.dataset.page || "home";
const logo = `<a class="logo" href="index.html" aria-label="NAFA トップへ"><span class="mark" aria-hidden="true"><i></i><i></i></span><span><b>NAFA</b><small>全日本英語討論協会</small></span></a>`;
const header = document.createElement("header");
header.className = "site-header";
header.innerHTML = `<div class="wrap">${logo}
  <button class="menu" id="menu-btn" aria-expanded="false" aria-controls="site-nav">メニュー</button>
  <nav class="nav" id="site-nav" aria-label="メインメニュー"><ul>${NAV.map(([href, label, key]) =>
    `<li><a href="${href}"${key === page ? ' aria-current="page"' : ""}>${label}</a></li>`).join("")}</ul></nav></div>`;
document.body.prepend(header);
const bar = document.createElement("div");
bar.className = "progress";
document.body.prepend(bar);

const footer = document.createElement("footer");
footer.className = "site-footer";
footer.innerHTML = `<div class="wrap"><div class="foot-top">${logo}
  <ul class="foot-nav">${NAV.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join("")}</ul></div>
  <div>© ${SEASON_YEAR} National Association of Forensics and Argumentation</div></div>`;
document.body.append(footer);

const btn = document.getElementById("menu-btn"), nav = document.getElementById("site-nav");
const mq = matchMedia("(max-width:980px)");
const syncNav = () => { nav.hidden = mq.matches && btn.getAttribute("aria-expanded") !== "true"; };
btn.addEventListener("click", () => { btn.setAttribute("aria-expanded", btn.getAttribute("aria-expanded") === "true" ? "false" : "true"); syncNav(); });
mq.addEventListener("change", syncNav);
syncNav();

/* ---------- Scroll effects ---------- */
const onScroll = () => {
  header.classList.toggle("compact", scrollY > 40);
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
}

// 数字のカウントアップ
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
document.querySelectorAll("[data-count]").forEach(el => {
  const target = Number(el.dataset.count);
  if (reduce || !("IntersectionObserver" in window)) { el.textContent = target; return; }
  const io = new IntersectionObserver(([en]) => {
    if (!en.isIntersecting) return;
    io.disconnect();
    const t0 = performance.now(), dur = 1400, from = target > 100 ? target - 60 : 0;
    const step = t => {
      const p = Math.min(1, (t - t0) / dur), k = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (target - from) * k);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
  io.observe(el);
});

// トップの論題を単語ごとに表示
document.querySelectorAll("[data-words]").forEach(h => {
  const words = h.textContent.trim().split(/\s+/);
  h.innerHTML = words.map((w, i) => `<span class="w" style="animation-delay:${0.25 + i * 0.06}s">${w}</span>`).join(" ");
});

// 写真: images/ にファイルが無いときは枠の模様だけを表示する
document.querySelectorAll(".photo img, .hero-bg img, .page-hero .bg img").forEach(img => {
  const drop = () => img.remove();
  if (img.complete && img.naturalWidth === 0) drop(); else img.addEventListener("error", drop);
});

// メールアドレスのコピー
document.querySelectorAll(".copy").forEach(b => b.addEventListener("click", async () => {
  const text = b.previousElementSibling.textContent.trim();
  try { await navigator.clipboard.writeText(text); }
  catch { const r = document.createRange(); r.selectNodeContents(b.previousElementSibling); getSelection().removeAllRanges(); getSelection().addRange(r); }
  b.textContent = "コピーしました"; b.classList.add("done");
  setTimeout(() => { b.textContent = "コピー"; b.classList.remove("done"); }, 1800);
}));

/* ---------- Schedule ---------- */
const marks = tags => tags.map(t => `<span class="mk ${MARK[t][0]}">${MARK[t][1]}</span>`).join("");

// トップ: 次の大会までのカウントダウン
const nextBox = document.getElementById("next-event");
if (nextBox) {
  const ev = events[nextIndex];
  if (ev) {
    const started = ev.start <= now;
    const days = Math.ceil((ev.start - now) / 864e5);
    nextBox.querySelector(".name").textContent = ev.name;
    nextBox.querySelector(".when").textContent = `${ev.label}${ev.where ? " ・ " + ev.where : ""}`;
    nextBox.querySelector(".days").innerHTML = started ? "開催中" : `${days}<small>日後</small>`;
  } else {
    nextBox.hidden = true;
  }
}

// 大会日程ページ: 表と絞り込み
const tbody = document.getElementById("schedule-body");
if (tbody) {
  const render = filter => {
    tbody.innerHTML = events.map((ev, i) => {
      if (filter !== "all" && !ev.tags.includes(filter)) return "";
      const past = ev.end < now, isNext = i === nextIndex;
      const cls = [past && "past", isNext && "is-next"].filter(Boolean).join(" ");
      return `<tr${cls ? ` class="${cls}"` : ""}><td class="date">${ev.label}</td><td class="name">${ev.name}<span class="marks">${isNext ? '<span class="mk next">次の予定</span>' : ""}${marks(ev.tags)}</span></td><td class="where">${ev.where}</td></tr>`;
    }).join("");
  };
  document.querySelectorAll(".filters button").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll(".filters button").forEach(x => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
    render(b.dataset.filter);
  }));
  render("all");
}

// マーキー(流れる大会名)
const track = document.querySelector(".marquee .track");
if (track) {
  const names = events.filter(e => e.tags.includes("award")).map(e => e.name.replace(/^The /, ""));
  const html = names.map(n => `<span>${n}</span>`).join("");
  track.innerHTML = html + html;
}
