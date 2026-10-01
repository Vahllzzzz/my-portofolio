<template>
  <section id="friends" ref="section" class="friends">
    <div class="section-heading">
      <p class="eyebrow">{{ t.eyebrow }}</p>
      <h2>{{ t.title }}</h2>
      <p class="subtitle">{{ t.subtitle }}</p>

      <a class="gh-cta" href="https://github.com/NLFTs" target="_blank" rel="noopener">
        <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/>
        </svg>
        {{ t.cta }}
        <em>{{ friends.length }}</em>
      </a>
    </div>

    <div ref="grid" class="friends-grid">
      <a
        v-for="(f, i) in friends"
        :key="f.login"
        :href="f.url"
        target="_blank"
        rel="noopener"
        class="friend-card"
        :style="cardVars(i)"
        @mousemove="onCardMove"
      >
        <span class="fc-in">
          <span class="avatar-wrap">
            <img :src="f.avatar" :alt="`@${f.login}`" loading="lazy" />
          </span>
          <span class="who">
            <strong>{{ f.name }}</strong>
            <span>@{{ f.login }}</span>
          </span>
          <span class="go" aria-hidden="true">↗</span>
        </span>
      </a>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLanguage } from "../../composables/useLanguage"

gsap.registerPlugin(ScrollTrigger)

const { language } = useLanguage()
const section = ref()

const t = computed(() => {
  const en = language.value === "en"
  return {
    eyebrow: en ? "Friends" : "Teman",
    title: en ? "People from the NLFTs GitHub community." : "Orang-orang dari komunitas GitHub NLFTs.",
    subtitle: en
      ? "The people I build, break things, and learn with."
      : "Orang-orang yang bareng saya bikin, ngerusak, dan belajar sesuatu.",
    cta: en ? "View on GitHub" : "Lihat di GitHub",
    visit: en ? "Visit" : "Kunjungi",
  }
})

/* ===== DATA ===== */
const friends = [
  { login: "Barabr0", name: "Bara", avatar: "https://avatars.githubusercontent.com/u/228843429?s=96&v=4", url: "https://github.com/Barabr0" },
  { login: "davingm", name: "Kinn", avatar: "https://avatars.githubusercontent.com/u/228851591?s=96&v=4", url: "https://github.com/davingm" },
  { login: "Destkaa", name: "KakaViangi", avatar: "https://avatars.githubusercontent.com/u/228332586?s=96&v=4", url: "https://github.com/Destkaa" },
  { login: "Fakhri-8G", name: "Fakhri", avatar: "https://avatars.githubusercontent.com/u/228840381?s=96&v=4", url: "https://github.com/Fakhri-8G" },
  { login: "fandybuilds", name: "afandysantosa", avatar: "https://avatars.githubusercontent.com/u/216720543?s=96&v=4", url: "https://github.com/fandybuilds" },
  { login: "Ilman91", name: "Ilman Abidullah", avatar: "https://avatars.githubusercontent.com/u/228839961?s=96&v=4", url: "https://github.com/Ilman91" },
  { login: "lintangnwy", name: "LintangNurWijaya", avatar: "https://avatars.githubusercontent.com/u/216552062?s=96&v=4", url: "https://github.com/lintangnwy" },
  { login: "Maruu-glitc", name: "AmadTemola", avatar: "https://avatars.githubusercontent.com/u/225441519?s=96&v=4", url: "https://github.com/Maruu-glitc" },
  { login: "MiftahAja", name: "PanggilAjaMip", avatar: "https://avatars.githubusercontent.com/u/232498018?s=96&v=4", url: "https://github.com/MiftahAja" },
  { login: "nairha", name: "azunya", avatar: "https://avatars.githubusercontent.com/u/204519754?s=96&v=4", url: "https://github.com/nairha" },
  { login: "Radiedtya", name: "Radiedtya", avatar: "https://avatars.githubusercontent.com/u/226198461?s=96&v=4", url: "https://github.com/Radiedtya" },
  { login: "RakhaAZ3", name: "Rakha", avatar: "https://avatars.githubusercontent.com/u/228839918?s=96&v=4", url: "https://github.com/RakhaAZ3" },
  { login: "Rehan-Ramadhan", name: "Rehan Ramadhan", avatar: "https://avatars.githubusercontent.com/u/218329504?s=96&v=4", url: "https://github.com/Rehan-Ramadhan" },
  { login: "sidiktsq", name: "シディック", avatar: "https://avatars.githubusercontent.com/u/230048582?s=96&v=4", url: "https://github.com/sidiktsq" },
  { login: "Tokitakun", name: "Nafeez", avatar: "https://avatars.githubusercontent.com/u/182593937?s=96&v=4", url: "https://github.com/Tokitakun" },
  { login: "x1aomei", name: "Xiao mei", avatar: "https://avatars.githubusercontent.com/u/232498781?s=96&v=4", url: "https://github.com/x1aomei" },
]

/* ===== warna & rotasi deterministik (SSR-safe, tanpa Math.random di render) ===== */
const PALETTE = ["#4a90e2", "#57d39f", "#f0b84c", "#d14f2f", "#7c6cff", "#e668a7"]
const ROTS = [-1.8, 1.4, -0.9, 1.9, -1.3, 0.8, -1.6, 1.1]

function hashColor(s) {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return PALETTE[h % PALETTE.length]
}

function cardVars(i) {
  return {
    "--ac": hashColor(friends[i].login),
    "--rot": `${ROTS[i % ROTS.length]}deg`,
  }
}

/* spotlight */
function onCardMove(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty("--mx", `${e.clientX - r.left}px`)
  el.style.setProperty("--my", `${e.clientY - r.top}px`)
}

let ctx

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: section.value, start: "top 75%", once: true },
    })

    tl.from(".section-heading > *", { opacity: 0, y: 24, stagger: 0.09, duration: 0.6 })
      .from(".fc-in", { opacity: 0, y: 26, stagger: 0.035, duration: 0.55 }, "-=0.3")
  }, section.value)
})

onUnmounted(() => ctx?.revert())
</script>

<style scoped>
.friends {
  padding: 96px 40px;
  background: var(--bg);
}

.section-heading,
.friends-grid {
  width: min(1080px, 100%);
  margin-inline: auto;
}

.section-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 14px 24px;
  align-items: end;
  margin-bottom: 36px;
}

.section-heading > p {
  grid-column: 1 / -1;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.eyebrow::before {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--primary);
  box-shadow: 0 0 10px var(--primary);
}

.section-heading h2 {
  max-width: 720px;
  margin: 0;
  color: var(--text);
  font-size: clamp(1.9rem, 3.4vw, 2.4rem);
  line-height: 1.16;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.subtitle {
  max-width: 620px;
  margin: 0;
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.7;
}

.gh-cta {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--border-dim);
  color: var(--text);
  font-size: 0.85rem;
  font-weight: 800;
  text-decoration: none;
  transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}

.gh-cta:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 12px 26px -10px var(--primary);
}

.gh-cta em {
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--primary);
  color: #fff;
  font-size: 0.68rem;
  font-style: normal;
  font-weight: 900;
}

/* ===== GRID ===== */
.friends-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

/* ===== CARD (sticker wall) ===== */
.friend-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--bg-card);
  text-decoration: none;
  transform: rotate(var(--rot));
  transition: transform 0.3s cubic-bezier(0.34, 1.4, 0.64, 1), border-color 0.25s ease, box-shadow 0.25s ease;
}

.friend-card:hover {
  transform: rotate(0deg) translateY(-4px) scale(1.02);
  border-color: color-mix(in srgb, var(--ac) 55%, var(--border));
  box-shadow: 0 18px 38px -18px rgba(0, 0, 0, 0.5);
  z-index: 2;
}

/* spotlight */
.friend-card::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background: radial-gradient(
    200px circle at var(--mx, 50%) var(--my, 50%),
    color-mix(in srgb, var(--ac) 12%, transparent),
    transparent 65%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.friend-card:hover::after { opacity: 1; }

.fc-in {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
}

/* avatar + ring warna */
.avatar-wrap {
  position: relative;
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
}

.avatar-wrap::before {
  content: "";
  position: absolute;
  inset: -3px;
  border-radius: 999px;
  border: 1.5px solid color-mix(in srgb, var(--ac) 45%, transparent);
  opacity: 0.45;
  transition: opacity 0.25s ease, box-shadow 0.25s ease, inset 0.25s ease;
}

.friend-card:hover .avatar-wrap::before {
  opacity: 1;
  inset: -4px;
  box-shadow: 0 0 14px color-mix(in srgb, var(--ac) 40%, transparent);
}

.avatar-wrap img {
  width: 100%;
  height: 100%;
  border-radius: 999px;
  background: var(--bg-surface);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.friend-card:hover .avatar-wrap img {
  transform: rotate(-8deg) scale(1.08);
}

.who {
  min-width: 0;
  flex: 1;
}

.who strong,
.who span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.who strong {
  color: var(--text);
  font-size: 0.95rem;
}

.who span {
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 700;
}

/* indikator ↗ */
.go {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text-muted);
  font-size: 0.85rem;
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity 0.25s ease, transform 0.25s ease, background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}

.friend-card:hover .go {
  opacity: 1;
  transform: none;
  background: var(--ac);
  border-color: var(--ac);
  color: #fff;
}

@media (hover: none) {
  .friend-card { transform: none; }
  .go { opacity: 1; transform: none; }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1020px) {
  .friends-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .section-heading { grid-template-columns: 1fr; }
  .gh-cta { justify-self: start; }
}

@media (max-width: 640px) {
  .friends { padding: 72px 20px; }
  .friends-grid { grid-template-columns: 1fr; }
  .gh-cta { width: 100%; justify-content: center; min-height: 48px; }
}

@media (max-width: 560px) {
  .friends { padding: 56px 16px; }
  .friends-grid { gap: 12px; }
  .fc-in { padding: 13px; }
  .who strong { font-size: 0.92rem; }
}
</style>