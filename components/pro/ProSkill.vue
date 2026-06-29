<template>
  <section class="skills">
    <div class="section-heading">
      <p>{{ language === 'en' ? 'Capabilities' : 'Kemampuan' }}</p>
      <h2>
        {{
          language === 'en'
            ? 'Focused skills for modern frontend work.'
            : 'Keahlian yang fokus untuk pekerjaan frontend modern.'
        }}
      </h2>
    </div>

    <div class="skill-grid">
      <article v-for="group in groups" :key="group.title">
        <h3>{{ language === 'en' ? group.title : group.titleId }}</h3>
        <p>{{ language === 'en' ? group.desc : group.descId }}</p>
        <div class="list">
          <span v-for="skill in group.skills" :key="skill">{{ skill }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { useLanguage } from "../../composables/useLanguage"

const { language } = useLanguage()

const groups = [
  {
    title: "Frontend Engineering",
    titleId: "Frontend Engineering",
    desc: "Building structured, maintainable interfaces with component-driven workflows.",
    descId: "Membangun interface yang terstruktur dan maintainable dengan alur kerja component-driven.",
    skills: ["Vue", "Nuxt", "TypeScript", "Pinia"]
  },
  {
    title: "Interactive Experience",
    titleId: "Pengalaman Interaktif",
    desc: "Adding motion and spatial interaction where it improves clarity and engagement.",
    descId: "Menambahkan motion dan interaksi spasial yang meningkatkan kejelasan dan engagement.",
    skills: ["Three.js", "GSAP", "WebGL", "Canvas"]
  },
  {
    title: "Product Interface",
    titleId: "Interface Produk",
    desc: "Designing responsive screens that feel sharp, readable, and production-ready.",
    descId: "Mendesain layar responsif yang terasa tajam, mudah dibaca, dan siap produksi.",
    skills: ["Responsive UI", "Design Systems", "Accessibility", "Performance"]
  }
]
</script>

<style scoped>
.skills {
  padding: 96px 40px;
  background: var(--bg);
}

.section-heading,
.skill-grid {
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
  max-width: 680px;
  margin: 0;
  color: var(--text);
  font-size: 2.4rem;
  line-height: 1.16;
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

article {
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-card);
}

h3 {
  margin: 0;
  color: var(--text);
  font-size: 1.12rem;
}

article p {
  margin: 12px 0 20px;
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.7;
}

.list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

span {
  padding: 7px 9px;
  border-radius: 8px;
  background: var(--border-dim);
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 800;
}

@media (max-width: 920px) {
  .skills {
    padding: 72px 20px;
  }

  .skill-grid {
    grid-template-columns: 1fr;
  }

  .section-heading h2 {
    font-size: 1.8rem;
  }
}

@media (max-width: 560px) {
  .skills {
    padding: 56px 16px;
  }

  .section-heading h2 {
    font-size: 1.5rem;
  }

  article {
    padding: 20px;
  }

  h3 {
    font-size: 1.05rem;
  }

  article p {
    font-size: 0.9rem;
    margin: 10px 0 16px;
  }

  .list {
    gap: 6px;
  }

  span {
    font-size: 0.7rem;
    padding: 6px 8px;
  }
}
</style>
