<template>
  <section id="about" ref="section" class="about">
    <div class="copy">
      <p class="eyebrow">{{ language === 'en' ? 'About Me' : 'Tentang Saya' }}</p>
      <h2>
        {{
          language === 'en'
            ? 'A developer who cares about the interface after the code compiles.'
            : 'Seorang developer yang peduli tentang tampilan setelah kode selesai dikompilasi.'
        }}
      </h2>
      <p>
        {{
          language === 'en'
            ? 'I focus on frontend experiences that are structured, responsive, and enjoyable to use. My work sits between engineering and visual craft: clean Vue/Nuxt architecture, thoughtful motion, and interfaces that feel intentional.'
            : 'Saya fokus pada pengalaman frontend yang terstruktur, responsif, dan menyenangkan untuk digunakan. Pekerjaan saya berada di antara engineering dan visual craft: arsitektur Vue/Nuxt yang bersih, motion yang thoughtful, dan interface yang terasa disengaja.'
        }}
      </p>
      <p>
        {{
          language === 'en'
            ? 'I enjoy building interactive scenes, polished portfolio systems, and product-facing UI where performance and presentation both matter.'
            : 'Saya senang membangun scene interaktif, sistem portfolio yang halus, dan UI produk dimana performa dan presentasi sama-sama penting.'
        }}
      </p>
    </div>

    <div class="stats">
      <div>
        <strong>3D</strong>
        <span>{{ language === 'en' ? 'Interactive web scenes' : 'Scene web interaktif' }}</span>
      </div>
      <div>
        <strong>SPA</strong>
        <span>{{ language === 'en' ? 'Nuxt and Vue interfaces' : 'Interface Nuxt dan Vue' }}</span>
      </div>
      <div>
        <strong>UX</strong>
        <span>{{ language === 'en' ? 'Motion and responsive polish' : 'Motion dan polish responsif' }}</span>
      </div>
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
      start: "top 75%"
    },
    opacity: 0,
    y: 34,
    stagger: 0.14,
    duration: 0.7,
    ease: "power3.out"
  })
})
</script>

<style scoped>
.about {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
  gap: 40px;
  align-items: start;
  width: min(1080px, calc(100% - 80px));
  margin: 0 auto;
  padding: 96px 0;
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
}

h2 {
  margin: 0 0 22px;
  color: var(--text);
  font-size: 2.4rem;
  line-height: 1.16;
}

.copy p:not(.eyebrow) {
  margin: 0 0 16px;
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.8;
}

.stats {
  display: grid;
  gap: 14px;
}

.stats div {
  padding: 22px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-card);
}

.stats strong {
  display: block;
  color: var(--primary);
  font-size: 2rem;
  line-height: 1;
}

.stats span {
  display: block;
  margin-top: 8px;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 700;
}

@media (max-width: 920px) {
  .about {
    grid-template-columns: 1fr;
    width: calc(100% - 48px);
    padding: 72px 0;
  }

  h2 {
    font-size: 2rem;
  }
}
</style>
