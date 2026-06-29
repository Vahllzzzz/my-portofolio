<template>
  <section id="blog" class="blog">
    <div class="section-heading">
      <p>{{ language === 'en' ? 'Blog' : 'Blog' }}</p>
      <h2>
        {{
          language === 'en'
            ? 'Notes, thoughts, and experiments.'
            : 'Catatan, pemikiran, dan eksperimen.'
        }}
      </h2>
    </div>

    <div class="blog-list">
      <NuxtLink 
        v-for="post in posts" 
        :key="post.slug" 
        :to="`/blog/${post.slug}`"
        class="blog-article"
      >
        <div>
          <span>{{ language === 'en' ? post.category : post.categoryId }}</span>
          <h3>{{ language === 'en' ? post.title : post.titleId }}</h3>
          <p>{{ language === 'en' ? post.excerpt : post.excerptId }}</p>
        </div>
        <time>{{ post.date }}</time>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { useLanguage } from "../../composables/useLanguage"
import { getAllBlogPosts } from "../../data/blogPosts"

const { language } = useLanguage()
const posts = getAllBlogPosts()
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

.section-heading {
  margin-bottom: 32px;
}

.section-heading p {
  margin: 0 0 10px;
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
}

.section-heading h2 {
  max-width: 720px;
  margin: 0;
  color: var(--text);
  font-size: 2.4rem;
  line-height: 1.16;
}

.blog-list {
  display: grid;
  gap: 12px;
}

.blog-article {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 24px;
  align-items: start;
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-card);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.blog-article:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 200, 83, 0.1);
}

span {
  display: inline-flex;
  margin-bottom: 10px;
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
}

h3 {
  margin: 0;
  color: var(--text);
  font-size: 1.2rem;
}

p {
  max-width: 760px;
  margin: 10px 0 0;
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.7;
}

time {
  color: var(--text-dim);
  font-size: 0.85rem;
  font-weight: 800;
  white-space: nowrap;
}

@media (max-width: 720px) {
  .blog {
    padding: 72px 20px;
  }

  .blog-article {
    grid-template-columns: 1fr;
    padding: 20px;
    gap: 12px;
  }

  .section-heading h2 {
    font-size: 1.8rem;
  }

  time {
    font-size: 0.8rem;
  }
}

@media (max-width: 560px) {
  .blog {
    padding: 56px 16px;
  }

  .section-heading h2 {
    font-size: 1.5rem;
  }

  .blog-article {
    padding: 18px;
  }

  h3 {
    font-size: 1.05rem;
  }

  p {
    font-size: 0.88rem;
  }

  span {
    font-size: 0.7rem;
  }
}
</style>
