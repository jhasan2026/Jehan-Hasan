// ---------- Helpers ----------
const qs = (sel, el=document) => el.querySelector(sel);
const qsa = (sel, el=document) => Array.from(el.querySelectorAll(sel));

// ---------- Footer Year ----------
qs("#year").textContent = new Date().getFullYear();

// ---------- Mobile Menu ----------
const menuBtn = qs("#menuBtn");
const nav = qs("#nav");

menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("show");
  menuBtn.setAttribute("aria-expanded", String(open));
});

// Close menu when clicking a link (mobile)
qsa("#nav a").forEach(a => {
  a.addEventListener("click", () => {
    nav.classList.remove("show");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// ---------- Project Modal ----------
const modal = qs("#modal");
const modalClose = qs("#modalClose");
const mTitle = qs("#mTitle");
const mTags  = qs("#mTags");
const mDesc  = qs("#mDesc");
const mPoints = qs("#mPoints");

function openModalFromCard(card){
  mTitle.textContent = card.dataset.title || "Project";
  mTags.textContent  = (card.dataset.tags || "").trim();
  mDesc.textContent  = (card.dataset.desc || "").trim();

  mPoints.innerHTML = "";
  const points = (card.dataset.points || "").split(";").map(s => s.trim()).filter(Boolean);
  points.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p;
    mPoints.appendChild(li);
  });

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

qsa(".project").forEach(card => {
  card.addEventListener("click", (e) => {
    // avoid opening if user selects text
    if (window.getSelection && window.getSelection().toString()) return;
    openModalFromCard(card);
  });
});

// Close modal via X, backdrop, ESC
modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target && e.target.dataset && e.target.dataset.close) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
});

// ---------- Research: Abstract Toggle ----------
qsa(".toggle-abs").forEach(btn => {
  btn.addEventListener("click", () => {
    const paper = btn.closest(".paper");
    const abs = qs(".abstract", paper);
    const isHidden = abs.hasAttribute("hidden");

    if (isHidden){
      abs.removeAttribute("hidden");
      btn.textContent = "Hide abstract";
    } else {
      abs.setAttribute("hidden", "true");
      btn.textContent = "Show abstract";
    }
  });
});

// ---------- Research: Filters ----------
const paperSearch = qs("#paperSearch");
const paperYear = qs("#paperYear");
const onlyML = qs("#onlyML");
const resetFilters = qs("#resetFilters");
const papers = qsa(".paper");

function normalize(s){ return (s || "").toLowerCase(); }

function applyPaperFilters(){
  const q = normalize(paperSearch.value);
  const y = paperYear.value;
  const mlOnly = onlyML.checked;

  papers.forEach(p => {
    const text = normalize(p.innerText);
    const year = p.dataset.year;
    const isML = p.dataset.ml === "true";

    const matchQ = !q || text.includes(q);
    const matchY = (y === "all") || (year === y);
    const matchML = !mlOnly || isML;

    p.style.display = (matchQ && matchY && matchML) ? "" : "none";
  });
}

paperSearch.addEventListener("input", applyPaperFilters);
paperYear.addEventListener("change", applyPaperFilters);
onlyML.addEventListener("change", applyPaperFilters);

resetFilters.addEventListener("click", () => {
  paperSearch.value = "";
  paperYear.value = "all";
  onlyML.checked = false;
  applyPaperFilters();
});

// ---------- Contact Form Demo ----------
qs("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Thanks! This is a demo form. Connect it to a backend (Formspree/Netlify/etc.) to receive messages.");
  e.target.reset();
});
