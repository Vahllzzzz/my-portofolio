<template>
  <section id="blog" ref="section" class="blog">
    <div class="section-heading">
      <p class="eyebrow">{{ t.eyebrow }}</p>
      <h2>{{ t.title }}</h2>
      <p class="subtitle">{{ t.subtitle }}</p>
    </div>

    <div ref="list" class="blog-list">
      <NuxtLink
        v-for="(post, i) in posts"
        :key="post.slug"
        :to="`/blog/${post.slug}`"
        class="blog-article"
        :style="{ '--ac': catColor(post.category) }"
        @mousemove="onCardMove"
      >
        <span class="idx">{{ String(i + 1).padStart(2, "0") }}</span>

        <div class="content">
          <div class="meta-row">
            <span class="cat">
              {{ language === "en" ? post.category : post.categoryId }}
            </span>
            <span v-if="post.readTime" class="read">{{ post.readTime }}</span>
          </div>
          <h3>{{ language === "en" ? post.title : post.titleId }}</h3>
          <p>{{ language === "en" ? post.excerpt : post.excerptId }}</p>
        </div>

        <div class="side">
          <time>{{ post.date }}</time>
          <span class="go" aria-hidden="true">→</span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLanguage } from "../../composables/useLanguage"
import { getAllBlogPosts } from "../../data/blogPosts"

gsap.registerPlugin(ScrollTrigger)

const { language } = useLanguage()
const posts = getAllBlogPosts()
const section = ref()
const list = ref()

const t = computed(() => {
  const en = language.value === "en"
  return {
    eyebrow: en ? "Blog" : "Blog",
    title: en ? "Notes, thoughts, and experiments." : "Catatan, pemikiran, dan eksperimen.",
    subtitle: en
      ? "Write-ups about frontend engineering, 3D on the web, and game dev experiments."
      : "Tulisan tentang frontend engineering, 3D di web, dan eksperimen game dev.",
  }
})

/* warna kategori stabil dari hash nama — kategori sama = warna sama */
const PALETTE = ["#4a90e2", "#57d39f", "#f0b84c", "#d14f2f", "#7c6cff"]
function catColor(name = "") {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return PALETTE[h % PALETTE.length]
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
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduce) return

  ctx = gsap.context(() => {
    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: section.value, start: "top 75%", once: true },
      })
      .from(".section-heading > *", { opacity: 0, y: 24, stagger: 0.1, duration: 0.6 })
      .from(".blog-article", { opacity: 0, y: 30, stagger: 0.1, duration: 0.6 }, "-=0.3")
  }, section.value)
})

onUnmounted(() => ctx?.revert())
</script>

<style scoped>
.blog {
  padding: 96px 40px;
  background: var(--bg);
}

.section-heading,
.blog-list {
  width: min(1080px, 100%);
  margin-inline: auto;
}

.section-heading { margin-bottom: 36px; }

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
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
  margin: 14px 0 0;
  color: var(--text-muted);
  font-size: 1.02rem;
  line-height: 1.7;
}

/* ===== LIST ===== */
.blog-list {
  display: grid;
  gap: 12px;
}

.blog-article {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 26px;
  align-items: center;
  padding: 26px 28px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--bg-card);
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}

@media (hover: hover) {
  .blog-article:hover {
    border-color: color-mix(in srgb, var(--ac) 55%, var(--border));
    transform: translateY(-3px);
    box-shadow: 0 18px 40px -22px rgba(0, 0, 0, 0.5);
  }
}

.blog-article:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}

/* spotlight */
.blog-article::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background: radial-gradient(
    240px circle at var(--mx, 50%) var(--my, 50%),
    color-mix(in srgb, var(--ac) 10%, transparent),
    transparent 65%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.blog-article:hover::after { opacity: 1; }

.idx {
  align-self: start;
  color: var(--text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 1.1rem;
  font-weight: 800;
  opacity: 0.55;
  transition: color 0.25s ease, opacity 0.25s ease;
}

.blog-article:hover .idx {
  color: var(--ac);
  opacity: 1;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.cat {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 11px;
  border: 1px solid color-mix(in srgb, var(--ac) 40%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--ac) 9%, transparent);
  color: var(--ac);
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.cat::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--ac);
}

.read {
  color: var(--text-dim);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.72rem;
  font-weight: 700;
}

h3 {
  margin: 0;
  color: var(--text);
  font-size: 1.25rem;
  line-height: 1.35;
  transition: color 0.25s ease;
}

.blog-article:hover h3 { color: var(--ac); }

.content p {
  max-width: 760px;
  margin: 10px 0 0;
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.7;
}

.side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
}

time {
  color: var(--text-dim);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}

.go {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text-muted);
  font-size: 1rem;
  transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
}

.blog-article:hover .go {
  background: var(--ac);
  border-color: var(--ac);
  color: #ffffff;
  transform: translateX(4px);
}

@media (max-width: 720px) {
  .blog { padding: 72px 20px; }

  .blog-article {
    grid-template-columns: minmax(0, 1fr) auto;
    padding: 20px;
    gap: 14px;
  }

  .idx { display: none; }
  .side { gap: 10px; }
}

@media (max-width: 560px) {
  .blog { padding: 56px 16px; }

  .blog-article { padding: 18px; }
  h3 { font-size: 1.08rem; }
  .content p { font-size: 0.9rem; }
  .cat { font-size: 0.62rem; }
}
</style>