<template>
  <section id="contact" ref="section" class="contact">
    <div class="contact-copy">
      <p>{{ language === 'en' ? 'Contact' : 'Kontak' }}</p>
      <h2>
        {{
          language === 'en'
            ? "Let's build something great together."
            : 'Mari membangun sesuatu yang luar biasa bersama.'
        }}
      </h2>
      <span>
        {{
          language === 'en'
            ? 'Available for freelance projects, collaborations, and full-time opportunities.'
            : 'Tersedia untuk proyek freelance, kolaborasi, dan kesempatan full-time.'
        }}
      </span>
    </div>

    <div class="links">
      <a href="mailto:hannvahll09@gmail.com" class="primary">
        {{ language === 'en' ? 'Email Me' : 'Email Saya' }}
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a>
      <a href="https://github.com/Vahllzzzz" target="_blank" rel="noopener">GitHub</a>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLanguage } from "../../composables/useLanguage"

const { language } = useLanguage()

gsap.registerPlugin(ScrollTrigger)

const section = ref()

onMounted(() => {
  gsap.from(section.value.children, {
    scrollTrigger: {
      trigger: section.value,
      start: "top 82%"
    },
    opacity: 0,
    y: 28,
    stagger: 0.12,
    duration: 0.65,
    ease: "power3.out"
  })
})
</script>

<style scoped>
.contact {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 28px;
  align-items: center;
  width: min(1080px, calc(100% - 80px));
  margin: 0 auto;
  padding: 44px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-card);
}

.contact-copy p {
  margin: 0 0 10px;
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
}

h2 {
  max-width: 620px;
  margin: 0;
  color: var(--text);
  font-size: 2rem;
  line-height: 1.2;
}

.contact-copy span {
  display: block;
  margin-top: 14px;
  color: var(--text);
  line-height: 1.7;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}

a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 16px;
  border: 3px solid var(--bg);
  border-radius: 8px;
  background: var(--border-dim);
  color: var(--text);
  font-size: 0.9rem;
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.2s ease, background 0.2s ease;
}

a:hover {
  background: var(--primary);
  color: #ffffff;
  transform: translateY(-2px);
}

.primary {
  border-color: transparent;
  background: var(--primary);
}

.primary:hover {
  background: var(--primary);
}

@media (max-width: 760px) {
  .contact {
    grid-template-columns: 1fr;
    width: calc(100% - 48px);
    padding: 28px;
  }

  .links {
    justify-content: flex-start;
  }

  h2 {
    font-size: 1.7rem;
  }
}
</style>
