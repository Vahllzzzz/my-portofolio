<template>
  <section id="tech-stack" class="tech-stack">
    <div class="section-heading">
      <p>{{ language === 'en' ? 'Tech Stack' : 'Tech Stack' }}</p>
      <h2>
        {{
          language === 'en'
            ? 'Tools I use to build fast and polished interfaces.'
            : 'Tools yang saya gunakan untuk membangun interface yang cepat dan halus.'
        }}
      </h2>
    </div>

    <div class="stack-grid">
      <article v-for="group in stacks" :key="group.title">
        <div class="topline">
          <span>{{ group.initial }}</span>
          <h3>{{ language === 'en' ? group.title : group.titleId }}</h3>
        </div>
        <p>{{ language === 'en' ? group.desc : group.descId }}</p>
        <ul>
          <li v-for="item in group.items" :key="item">{{ item }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup>
import { useLanguage } from "../../composables/useLanguage"

const { language } = useLanguage()

const stacks = [
  {
    initial: "FE",
    title: "Frontend Core",
    titleId: "Frontend Core",
    desc: "Framework and language choices for maintainable user interfaces.",
    descId: "Framework dan pilihan bahasa untuk user interface yang maintainable.",
    items: ["HTML5", "CSS3", "JavaScript", "C", "C++", "C#", "Vue.js", "Nuxt", "TypeScript", "Pinia"]
  },
  {
    initial: "BE",
    title: "Backend Core",
    titleId: "Backend Core",
    desc: "Styling and interaction tools for responsive, readable screens.",
    descId: "Tools styling dan interaksi untuk layar yang responsif dan mudah dibaca.",
    items: ["PHP", "TypeScript", "Java", "Python"]
  },
  {
    initial: "3D",
    title: "Creative Web",
    titleId: "Web Kreatif",
    desc: "Libraries for immersive web experiments and motion-heavy pages.",
    descId: "Library untuk eksperimen web yang imersif dan halaman dengan banyak motion.",
    items: ["Three.js", "GSAP", "Canvas", "WebGL"]
  },
  {
    initial: "DX",
    title: "Workflow",
    titleId: "Workflow",
    desc: "Daily tooling for shipping, debugging, and keeping projects tidy.",
    descId: "Tools harian untuk shipping, debugging, dan menjaga proyek tetap rapi.",
    items: ["Vite", "GitHub", "npm", "Chrome DevTools"]
  }
]
</script>

<style scoped>
.tech-stack {
  padding: 96px 40px;
  background: var(--bg);
}

.section-heading,
.stack-grid {
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

.stack-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

article {
  padding: 22px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-card);
}

.topline {
  display: flex;
  gap: 12px;
  align-items: center;
}

.topline span {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 8px;
  background: var(--primary);
  color: var(--bg);
  font-size: 0.8rem;
  font-weight: 900;
}

h3 {
  margin: 0;
  color: var(--text);
  font-size: 1rem;
}

article p {
  min-height: 76px;
  margin: 16px 0 18px;
  color: var(--text-muted);
  font-size: 0.92rem;
  line-height: 1.65;
}

ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
}

li {
  padding: 7px 9px;
  border-radius: 8px;
  background: var(--border-dim);
  color: var(--text-muted);
  font-size: 0.74rem;
  font-weight: 800;
}

@media (max-width: 1020px) {
  .stack-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .tech-stack {
    padding: 72px 20px;
  }

  .stack-grid {
    grid-template-columns: 1fr;
  }

  .section-heading h2 {
    font-size: 1.8rem;
  }

  article p {
    min-height: auto;
  }
}

@media (max-width: 560px) {
  .tech-stack {
    padding: 56px 16px;
  }

  .section-heading h2 {
    font-size: 1.5rem;
  }

  article {
    padding: 18px;
  }

  .topline span {
    width: 38px;
    height: 38px;
    font-size: 0.75rem;
  }

  h3 {
    font-size: 0.95rem;
  }

  article p {
    font-size: 0.88rem;
    margin: 12px 0 14px;
  }

  ul {
    gap: 6px;
  }

  li {
    font-size: 0.7rem;
    padding: 6px 8px;
  }
}
</style>
