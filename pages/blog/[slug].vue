<template>
  <div class="blog-post-page">
    <nav class="blog-nav">
      <NuxtLink to="/" class="back-link">
        ← {{ language === 'en' ? 'Back to Home' : 'Kembali ke Home' }}
      </NuxtLink>
      <ClientOnly>
        <ThemeToggle />
      </ClientOnly>
    </nav>

    <article v-if="post" class="blog-post">
      <header class="post-header">
        <span class="post-category">{{ language === 'en' ? post.category : post.categoryId }}</span>
        <h1 class="post-title">{{ language === 'en' ? post.title : post.titleId }}</h1>
        <div class="post-meta">
          <span class="post-author">{{ post.author }}</span>
          <span class="post-date">{{ post.date }}</span>
          <span class="post-read-time">{{ post.readTime }}</span>
        </div>
        <div class="post-tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </header>

      <div class="post-content markdown-body" v-html="renderedContent"></div>

      <footer class="post-footer">
        <div class="author-card">
          <div class="author-info">
            <h3>{{ post.author }}</h3>
            <p>{{ language === 'en' ? 'Frontend Developer, 3D Artist, Game Developer' : 'Frontend Developer, 3D Artist, Game Developer' }}</p>
          </div>
        </div>

        <div class="back-to-blog">
          <NuxtLink to="/#blog" class="btn-primary">
            {{ language === 'en' ? 'View All Posts' : 'Lihat Semua Post' }}
          </NuxtLink>
        </div>
      </footer>
    </article>

    <div v-else class="not-found">
      <h1>{{ language === 'en' ? 'Post Not Found' : 'Post Tidak Ditemukan' }}</h1>
      <NuxtLink to="/">{{ language === 'en' ? 'Go Home' : 'Ke Home' }}</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getBlogPost } from '../../data/blogPosts'
import { useLanguage } from '../../composables/useLanguage'
import ThemeToggle from '../../components/common/ThemeToggle.vue'
import { marked } from 'marked'

const route = useRoute()
const { language } = useLanguage()

const slug = computed(() => route.params.slug as string)
const post = computed(() => getBlogPost(slug.value))

const renderedContent = computed(() => {
  if (!post.value) return ''
  const content = language.value === 'en' ? post.value.content : post.value.contentId
  return marked(content)
})

// SEO
useHead(() => ({
  title: post.value ? (language.value === 'en' ? post.value.title : post.value.titleId) : 'Blog Post',
  meta: [
    {
      name: 'description',
      content: post.value ? (language.value === 'en' ? post.value.excerpt : post.value.excerptId) : ''
    }
  ]
}))
</script>

<style scoped>
.blog-post-page {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  padding: 20px;
}

.blog-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
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
  transition: all 0.2s ease;
}

.back-link:hover {
  border-color: var(--primary);
  transform: translateX(-4px);
}

.blog-post {
  max-width: 800px;
  margin: 0 auto;
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 60px;
}

.post-header {
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
}

.post-category {
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 16px;
  border-radius: 6px;
  background: rgba(0, 200, 83, 0.1);
  color: var(--primary);
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
}

.post-title {
  margin: 0 0 24px;
  color: var(--text);
  font-size: 3rem;
  line-height: 1.1;
  font-weight: 900;
}

.post-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.post-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.post-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 6px 12px;
  border-radius: 6px;
  background: var(--border-dim);
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 700;
}

.post-content {
  margin-bottom: 48px;
}

.post-footer {
  padding-top: 48px;
  border-top: 1px solid var(--border);
}

.author-card {
  padding: 24px;
  border-radius: 12px;
  background: var(--bg-surface);
  margin-bottom: 32px;
}

.author-info h3 {
  margin: 0 0 8px;
  color: var(--text);
  font-size: 1.3rem;
}

.author-info p {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
}

.back-to-blog {
  text-align: center;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  border-radius: 8px;
  background: var(--primary);
  color: #ffffff;
  text-decoration: none;
  font-weight: 800;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 200, 83, 0.3);
}

.not-found {
  max-width: 600px;
  margin: 100px auto;
  text-align: center;
}

.not-found h1 {
  margin-bottom: 24px;
  color: var(--text);
  font-size: 2.5rem;
}

.not-found a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 700;
}

@media (max-width: 768px) {
  .blog-post {
    padding: 32px 24px;
  }

  .post-title {
    font-size: 2rem;
  }

  .blog-nav {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>

<style>
/* Markdown Content Styling */
.markdown-body {
  color: var(--text);
  line-height: 1.8;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4 {
  margin: 32px 0 16px;
  color: var(--text);
  font-weight: 800;
  line-height: 1.3;
}

.markdown-body h1 {
  font-size: 2.2rem;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border);
}

.markdown-body h2 {
  font-size: 1.8rem;
  margin-top: 48px;
}

.markdown-body h3 {
  font-size: 1.4rem;
}

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

.markdown-body li {
  margin: 8px 0;
}

.markdown-body code {
  padding: 3px 6px;
  border-radius: 4px;
  background: var(--bg-surface);
  color: var(--primary);
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.markdown-body pre {
  margin: 24px 0;
  padding: 20px;
  border-radius: 8px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  overflow-x: auto;
}

.markdown-body pre code {
  padding: 0;
  background: none;
  color: var(--text);
}

.markdown-body a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.2s ease;
}

.markdown-body a:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.markdown-body blockquote {
  margin: 24px 0;
  padding: 16px 24px;
  border-left: 4px solid var(--primary);
  background: var(--bg-surface);
  color: var(--text-muted);
  font-style: italic;
}

.markdown-body img {
  max-width: 100%;
  border-radius: 8px;
  margin: 24px 0;
}

.markdown-body hr {
  margin: 48px 0;
  border: none;
  border-top: 1px solid var(--border);
}
</style>
