<template>
  <div class="blog-post-page">
    <!-- progress bar baca -->
    <div class="read-progress" aria-hidden="true">
      <i :style="{ width: progress + '%' }"></i>
    </div>

    <nav class="blog-nav">
      <NuxtLink to="/" class="back-link">
        ← {{ language === "en" ? "Back to Home" : "Kembali ke Home" }}
      </NuxtLink>
      <ClientOnly>
        <ThemeToggle />
      </ClientOnly>
    </nav>

    <div v-if="post" class="post-layout">
      <article ref="articleEl" class="blog-post">
        <header class="post-header">
          <span class="post-category">
            {{ language === "en" ? post.category : post.categoryId }}
          </span>
          <h1 class="post-title">{{ language === "en" ? post.title : post.titleId }}</h1>
          <div class="post-meta">
            <span class="post-author">✍ {{ post.author }}</span>
            <span class="post-date">📅 {{ post.date }}</span>
            <span v-if="post.readTime" class="post-read-time">⏱ {{ post.readTime }}</span>
          </div>
          <div class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
          </div>
        </header>

        <div class="post-content markdown-body" v-html="renderedContent"></div>

        <footer class="post-footer">
          <!-- next post -->
          <NuxtLink v-if="nextPost" :to="`/blog/${nextPost.slug}`" class="next-post">
            <span class="np-label">{{ t.nextLabel }}</span>
            <span class="np-title">
              {{ language === "en" ? nextPost.title : nextPost.titleId }}
              <b>→</b>
            </span>
          </NuxtLink>

          <div class="author-card">
            <div class="avatar" aria-hidden="true">R</div>
            <div class="author-info">
              <h3>{{ post.author }}</h3>
              <p>{{ t.authorRole }}</p>
            </div>
          </div>

          <div class="back-to-blog">
            <NuxtLink to="/#blog" class="btn-primary">
              {{ language === "en" ? "View All Posts" : "Lihat Semua Post" }}
            </NuxtLink>
          </div>
        </footer>
      </article>

      <!-- TOC sticky -->
      <aside v-if="toc.length" class="toc" aria-label="Table of contents">
        <p class="toc-title">{{ t.toc }}</p>
        <a
          v-for="h in toc"
          :key="h.id"
          :href="'#' + h.id"
          class="toc-link"
          :class="[`lv${h.level}`, { active: activeId === h.id }]"
          @click.prevent="goTo(h.id)"
        >
          {{ h.text }}
        </a>
      </aside>
    </div>

    <div v-else class="not-found">
      <p class="nf-code">404</p>
      <h1>{{ language === "en" ? "Post Not Found" : "Post Tidak Ditemukan" }}</h1>
      <p class="nf-desc">{{ t.nfDesc }}</p>
      <NuxtLink to="/" class="btn-primary">{{ language === "en" ? "Go Home" : "Ke Home" }}</NuxtLink>
    </div>

    <!-- back to top -->
    <transition name="pop">
      <button v-if="showTop" class="to-top" aria-label="Back to top" @click="toTop">↑</button>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue"
import { useRoute } from "vue-router"
import { getBlogPost, getAllBlogPosts } from "../../data/blogPosts"
import { useLanguage } from "../../composables/useLanguage"
import ThemeToggle from "../../components/common/ThemeToggle.vue"
import { marked } from "marked"

const route = useRoute()
const { language } = useLanguage()

const slug = computed(() => route.params.slug as string)
const post = computed(() => getBlogPost(slug.value))
const articleEl = ref()

const t = computed(() => {
  const en = language.value === "en"
  return {
    toc: en ? "On this page" : "Di halaman ini",
    nextLabel: en ? "Read next" : "Baca selanjutnya",
    authorRole: en
      ? "Frontend Developer, 3D Artist, Game Developer"
      : "Frontend Developer, 3D Artist, Game Developer",
    nfDesc: en
      ? "The article you're looking for doesn't exist or has been moved."
      : "Artikel yang kamu cari tidak ada atau sudah dipindahkan.",
  }
})

/* ---------- markdown → html + TOC + id heading ---------- */
function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

const rendered = computed(() => {
  if (!post.value) return { html: "", toc: [] as { id: string; text: string; level: number }[] }

  const raw = language.value === "en" ? post.value.content : post.value.contentId
  let html = marked(raw)

  // kasih id ke tiap h2/h3 + kumpulkan buat TOC
  const toc: { id: string; text: string; level: number }[] = []
  let i = 0
  html = html.replace(/<h([23])>(.*?)<\/h\1>/g, (_m, level: string, text: string) => {
    const id = `sec-${i++}`
    toc.push({ id, text: decodeEntities(text.replace(/<[^>]+>/g, "")), level: Number(level) })
    return `<h${level} id="${id}">${text}</h${level}>`
  })

  return { html, toc }
})

const renderedContent = computed(() => rendered.value.html)
const toc = computed(() => rendered.value.toc)

/* post berikutnya buat card "Read next" */
const nextPost = computed(() => {
  const all = getAllBlogPosts()
  if (all.length < 2) return null
  const i = all.findIndex((p) => p.slug === slug.value)
  return all[(i + 1) % all.length]
})

/* ---------- progress bar + back to top ---------- */
const progress = ref(0)
const showTop = ref(false)

function onScroll() {
  showTop.value = window.scrollY > 500
  const el = articleEl.value
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY
  const start = top - 60
  const end = top + el.offsetHeight - window.innerHeight
  const p = (window.scrollY - start) / Math.max(end - start, 1)
  progress.value = Math.min(Math.max(p, 0), 1) * 100
}

function toTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

/* ---------- TOC active tracking ---------- */
const activeId = ref("")
let observer: IntersectionObserver | undefined

function observeHeadings() {
  observer?.disconnect()
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) activeId.value = e.target.id
      })
    },
    { rootMargin: "-15% 0px -70% 0px" }
  )
  document
    .querySelectorAll(".post-content h2[id], .post-content h3[id]")
    .forEach((h) => observer?.observe(h))
}

function goTo(id: string) {
  activeId.value = id
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
}

/* ---------- copy button di code block ---------- */
function enhanceCode() {
  document.querySelectorAll(".markdown-body pre").forEach((pre) => {
    if (pre.querySelector(".copy-btn")) return
    const btn = document.createElement("button")
    btn.className = "copy-btn"
    btn.type = "button"
    btn.textContent = "Copy"
    btn.addEventListener("click", async () => {
      const code = pre.querySelector("code")?.innerText ?? ""
      try {
        await navigator.clipboard.writeText(code)
        btn.textContent = "Copied ✓"
      } catch {
        btn.textContent = "Failed ✕"
      }
      setTimeout(() => (btn.textContent = "Copy"), 1600)
    })
    pre.appendChild(btn)
  })
}

watch(renderedContent, () => {
  nextTick(() => {
    enhanceCode()
    observeHeadings()
  })
})

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true })
  onScroll()
  nextTick(() => {
    enhanceCode()
    observeHeadings()
  })
})

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll)
  observer?.disconnect()
})

// SEO
useHead(() => ({
  title: post.value
    ? language.value === "en"
      ? post.value.title
      : post.value.titleId
    : "Blog Post",
  meta: [
    {
      name: "description",
      content: post.value
        ? language.value === "en"
          ? post.value.excerpt
          : post.value.excerptId
        : "",
    },
  ],
}))
</script>

<style scoped>
.blog-post-page {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  padding: 20px;
}

/* ===== progress bar ===== */
.read-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 500;
  background: transparent;
}

.read-progress i {
  display: block;
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, var(--primary), #4a90e2);
  box-shadow: 0 0 12px rgba(0, 200, 83, 0.5);
  transition: width 0.1s linear;
}

.blog-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1080px;
  margin: 0 auto 40px;
  padding: 20px 0;
}

.back-link {
  display: inline-flex;
  align-items: center;
  padding: 10px 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-card);
  color: var(--text);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.back-link:hover {
  border-color: var(--primary);
  transform: translateX(-4px);
}

/* ===== layout: artikel + TOC ===== */
.post-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 40px;
  max-width: 1080px;
  margin: 0 auto;
  align-items: start;
}

.blog-post {
  max-width: 800px;
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 56px;
}

.post-header {
  margin-bottom: 44px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
}

.post-category {
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 16px;
  border-radius: 999px;
  background: rgba(0, 200, 83, 0.1);
  color: var(--primary);
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.post-title {
  margin: 0 0 24px;
  color: var(--text);
  font-size: 2.6rem;
  line-height: 1.12;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.post-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.post-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--border-dim);
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 700;
}

.post-content {
  margin-bottom: 44px;
}

.post-footer {
  padding-top: 40px;
  border-top: 1px solid var(--border);
}

/* next post card */
.next-post {
  display: block;
  margin-bottom: 28px;
  padding: 20px 22px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--bg-surface);
  text-decoration: none;
  transition: border-color 0.25s ease, transform 0.25s ease;
}

.next-post:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.np-label {
  display: block;
  margin-bottom: 6px;
  color: var(--primary);
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.np-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  color: var(--text);
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.4;
}

.np-title b {
  transition: transform 0.25s ease;
}

.next-post:hover .np-title b {
  transform: translateX(5px);
}

/* author card */
.author-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px 24px;
  border-radius: 14px;
  background: var(--bg-surface);
  margin-bottom: 32px;
}

.avatar {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--primary), #4a90e2);
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 900;
}

.author-info h3 {
  margin: 0 0 4px;
  color: var(--text);
  font-size: 1.15rem;
}

.author-info p {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
  font-size: 0.9rem;
}

.back-to-blog { text-align: center; }

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  border-radius: 10px;
  background: var(--primary);
  color: #ffffff;
  text-decoration: none;
  font-weight: 800;
  font-size: 0.95rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px -8px var(--primary);
}

/* ===== TOC ===== */
.toc {
  position: sticky;
  top: 32px;
  display: grid;
  gap: 2px;
  padding: 18px 0;
  border-left: 1px solid var(--border);
}

.toc-title {
  margin: 0 0 10px 18px;
  color: var(--text-dim);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.toc-link {
  position: relative;
  padding: 6px 12px 6px 18px;
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.45;
  text-decoration: none;
  border-left: 2px solid transparent;
  margin-left: -1.5px;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.toc-link.lv3 { padding-left: 30px; font-size: 0.78rem; }

.toc-link:hover { color: var(--text); }

.toc-link.active {
  color: var(--primary);
  border-left-color: var(--primary);
}

/* ===== back to top ===== */
.to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 400;
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg-card);
  color: var(--text);
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.to-top:hover {
  transform: translateY(-3px);
  border-color: var(--primary);
  color: var(--primary);
}

.pop-enter-active,
.pop-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.pop-enter-from,
.pop-leave-to { opacity: 0; transform: translateY(10px); }

/* ===== 404 ===== */
.not-found {
  max-width: 600px;
  margin: 100px auto;
  text-align: center;
}

.nf-code {
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 5rem;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(120deg, var(--primary), #4a90e2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  opacity: 0.7;
}

.not-found h1 {
  margin: 12px 0 10px;
  color: var(--text);
  font-size: 2rem;
}

.nf-desc {
  margin: 0 0 28px;
  color: var(--text-muted);
}

/* ===== responsive ===== */
@media (max-width: 1100px) {
  .post-layout { grid-template-columns: 1fr; }
  .toc { display: none; }
}

@media (max-width: 768px) {
  .blog-post { padding: 32px 24px; border-radius: 12px; }
  .post-title { font-size: 2rem; }
  .blog-nav { flex-direction: column; gap: 16px; align-items: flex-start; }
  .post-header { margin-bottom: 32px; padding-bottom: 24px; }
  .author-card { padding: 20px; }
}

@media (max-width: 560px) {
  .blog-post-page { padding: 16px; }
  .blog-post { padding: 24px 16px; }
  .post-title { font-size: 1.6rem; }
  .back-link { font-size: 0.85rem; padding: 8px 12px; }
  .post-meta { font-size: 0.8rem; gap: 12px; }
  .tag { font-size: 0.72rem; padding: 5px 10px; }
  .author-card { padding: 16px; }
  .btn-primary { width: 100%; }
  .to-top { right: 16px; bottom: 16px; }
}
</style>

<style>
/* ===== Markdown Content (unscoped — konten dari v-html gak kena scoped attr) ===== */
.markdown-body {
  color: var(--text);
  line-height: 1.8;
  font-size: 1rem;
}

.markdown-body > :first-child { margin-top: 0; }

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4 {
  margin: 32px 0 16px;
  color: var(--text);
  font-weight: 800;
  line-height: 1.3;
  scroll-margin-top: 24px; /* biar gak kepotong pas lompat dari TOC */
}

.markdown-body h1 {
  font-size: 2rem;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border);
}

.markdown-body h2 {
  font-size: 1.55rem;
  margin-top: 48px;
  padding-left: 14px;
  border-left: 3px solid var(--primary);
}

.markdown-body h3 { font-size: 1.25rem; }

.markdown-body p {
  margin: 16px 0;
  color: var(--text-muted);
}

.markdown-body ul,
.markdown-body ol {
  margin: 16px 0;
  padding-left: 24px;
  color: var(--text-muted);
}

.markdown-body li { margin: 8px 0; }
.markdown-body li::marker { color: var(--primary); }

.markdown-body code {
  padding: 3px 7px;
  border-radius: 5px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--primary);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.88em;
}

.markdown-body pre {
  position: relative;
  margin: 24px 0;
  padding: 20px;
  border-radius: 12px;
  background: #0b0d13;
  border: 1px solid var(--border);
  overflow-x: auto;
}

:root[data-theme="light"] .markdown-body pre {
  background: #10131c;
}

.markdown-body pre code {
  padding: 0;
  background: none;
  border: none;
  color: #dce6f2;
  font-size: 0.88rem;
  line-height: 1.7;
}

/* tombol copy — di-inject via JS, harus unscoped */
.copy-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.07);
  color: #dce6f2;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease, background 0.2s ease;
}

.markdown-body pre:hover .copy-btn,
.copy-btn:focus-visible { opacity: 1; }

.copy-btn:hover { background: rgba(255, 255, 255, 0.16); }

.markdown-body a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.2s ease;
}

.markdown-body a:hover { text-decoration: underline; }

.markdown-body blockquote {
  margin: 24px 0;
  padding: 16px 24px;
  border-left: 4px solid var(--primary);
  border-radius: 0 10px 10px 0;
  background: var(--bg-surface);
  color: var(--text-muted);
  font-style: italic;
}

.markdown-body img {
  max-width: 100%;
  border-radius: 10px;
  margin: 24px 0;
}

.markdown-body hr {
  margin: 48px 0;
  border: none;
  border-top: 1px solid var(--border);
}

.markdown-body table {
  width: 100%;
  margin: 24px 0;
  border-collapse: collapse;
  font-size: 0.92rem;
}

.markdown-body th,
.markdown-body td {
  padding: 10px 14px;
  border: 1px solid var(--border);
  text-align: left;
}

.markdown-body th {
  background: var(--bg-surface);
  color: var(--text);
  font-weight: 800;
}

@media (max-width: 768px) {
  .markdown-body h1 { font-size: 1.6rem; }
  .markdown-body h2 { font-size: 1.35rem; margin-top: 32px; }
  .markdown-body h3 { font-size: 1.15rem; }
  .markdown-body pre { padding: 16px; }
  .copy-btn { opacity: 1; } /* di touch gak ada hover */
}

@media (max-width: 560px) {
  .markdown-body h1 { font-size: 1.4rem; }
  .markdown-body h2 { font-size: 1.2rem; }
  .markdown-body h3 { font-size: 1.05rem; }
  .markdown-body p,
  .markdown-body ul,
  .markdown-body ol { font-size: 0.95rem; }
  .markdown-body pre { padding: 12px; font-size: 0.8rem; }
  .markdown-body blockquote { padding: 12px 16px; margin: 16px 0; }
}
</style>