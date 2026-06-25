export interface BlogPost {
  slug: string
  title: string
  titleId: string
  category: string
  categoryId: string
  date: string
  excerpt: string
  excerptId: string
  content: string
  contentId: string
  author: string
  readTime: string
  tags: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "building-living-portfolio-threejs",
    title: "Building a Living Portfolio with Three.js",
    titleId: "Membuat Portfolio yang Terasa Hidup dengan Three.js",
    category: "3D Web",
    categoryId: "3D Web",
    date: "17 Jun 2026",
    excerpt: "Notes on using 3D scenes as part of portfolio storytelling without making the experience feel heavy.",
    excerptId: "Catatan tentang cara memakai scene 3D sebagai bagian dari storytelling portfolio tanpa membuat pengalaman terasa berat.",
    author: "Reihan Azka Vahlepy",
    readTime: "5 min read",
    tags: ["Three.js", "Portfolio", "3D", "WebGL"],
    content: `
# Building a Living Portfolio with Three.js

Creating an interactive 3D portfolio is about more than just showing off technical skills—it's about crafting an experience that guides visitors through your work in a memorable way.

## Why 3D?

Traditional portfolios present work in a linear, scrollable format. While effective, they don't necessarily capture attention or create lasting impressions. A 3D environment adds:

- **Spatial storytelling**: Guide visitors through a journey
- **Interactive exploration**: Let users discover content at their own pace
- **Visual impact**: Stand out from traditional portfolios
- **Technical demonstration**: Show your 3D and WebGL skills

## The Challenge

The main challenge is balancing visual complexity with performance and usability. A portfolio that takes 10 seconds to load or requires high-end hardware defeats the purpose.

## Key Principles

### 1. Start Simple
Begin with basic geometries and gradually add detail. A solar system portfolio, for example, can start with simple spheres and rings before adding textures and effects.

### 2. Optimize Early
- Use instanced meshes for repeated elements
- Implement LOD (Level of Detail) for distant objects
- Lazy load textures and models
- Monitor frame rate and adjust accordingly

### 3. Progressive Enhancement
Design the experience to work without 3D as a fallback. Users on mobile or older devices should still access your content.

### 4. Purposeful Interaction
Every interaction should have meaning. Don't add rotation or animation just because you can—make it serve the user's journey through your work.

## Implementation Tips

\`\`\`typescript
// Example: Efficient orbit system
const planets = []
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)
  const t = clock.getElapsedTime()
  
  planets.forEach((planet) => {
    planet.position.x = Math.cos(t * planet.speed) * planet.radius
    planet.position.z = Math.sin(t * planet.speed) * planet.radius
  })
  
  renderer.render(scene, camera)
}
\`\`\`

## Balancing Act

The goal is creating something that feels alive and engaging without being overwhelming. Test with users who aren't developers—if they can navigate and understand your work, you've succeeded.

## Conclusion

A 3D portfolio is a powerful tool when done right. Focus on user experience first, technical complexity second, and let the 3D elements enhance rather than replace your actual work.
    `,
    contentId: `
# Membuat Portfolio yang Terasa Hidup dengan Three.js

Membuat portfolio 3D interaktif bukan hanya tentang memamerkan keahlian teknis—tetapi tentang menciptakan pengalaman yang memandu pengunjung melalui karya Anda dengan cara yang berkesan.

## Mengapa 3D?

Portfolio tradisional menyajikan karya dalam format linear yang bisa di-scroll. Meski efektif, format ini tidak selalu menarik perhatian atau menciptakan kesan yang bertahan lama. Lingkungan 3D menambahkan:

- **Storytelling spasial**: Pandu pengunjung melalui sebuah perjalanan
- **Eksplorasi interaktif**: Biarkan pengguna menemukan konten dengan kecepatan mereka sendiri
- **Dampak visual**: Menonjol dari portfolio tradisional
- **Demonstrasi teknis**: Tunjukkan keahlian 3D dan WebGL Anda

## Tantangannya

Tantangan utama adalah menyeimbangkan kompleksitas visual dengan performa dan usability. Portfolio yang membutuhkan 10 detik untuk load atau memerlukan hardware kelas atas akan mengalahkan tujuannya.

## Prinsip Kunci

### 1. Mulai Sederhana
Mulai dengan geometri dasar dan tambahkan detail secara bertahap. Portfolio sistem solar, misalnya, bisa dimulai dengan sphere dan ring sederhana sebelum menambahkan tekstur dan efek.

### 2. Optimasi Sejak Awal
- Gunakan instanced meshes untuk elemen yang berulang
- Implementasi LOD (Level of Detail) untuk objek yang jauh
- Lazy load tekstur dan model
- Monitor frame rate dan sesuaikan

### 3. Progressive Enhancement
Desain pengalaman agar berfungsi tanpa 3D sebagai fallback. User di mobile atau device lama tetap harus bisa mengakses konten Anda.

### 4. Interaksi yang Bermakna
Setiap interaksi harus punya makna. Jangan tambahkan rotasi atau animasi hanya karena bisa—buat itu melayani perjalanan user melalui karya Anda.

## Tips Implementasi

\`\`\`typescript
// Contoh: Sistem orbit yang efisien
const planets = []
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)
  const t = clock.getElapsedTime()
  
  planets.forEach((planet) => {
    planet.position.x = Math.cos(t * planet.speed) * planet.radius
    planet.position.z = Math.sin(t * planet.speed) * planet.radius
  })
  
  renderer.render(scene, camera)
}
\`\`\`

## Keseimbangan

Tujuannya adalah menciptakan sesuatu yang terasa hidup dan engaging tanpa overwhelming. Test dengan user yang bukan developer—jika mereka bisa navigasi dan memahami karya Anda, Anda berhasil.

## Kesimpulan

Portfolio 3D adalah tool yang powerful jika dilakukan dengan benar. Fokus pada user experience dulu, kompleksitas teknis kedua, dan biarkan elemen 3D memperkuat daripada menggantikan karya aktual Anda.
    `
  },
  {
    slug: "why-micro-interaction-details-matter",
    title: "Why Micro Interaction Details Matter",
    titleId: "Kenapa Detail Micro Interaction Penting",
    category: "UI Motion",
    categoryId: "UI Motion",
    date: "12 Jun 2026",
    excerpt: "An article on hover states, transitions, and small feedback that makes interfaces feel more trustworthy.",
    excerptId: "Artikel tentang hover state, transisi, dan feedback kecil yang membuat interface terasa lebih dipercaya.",
    author: "Reihan Azka Vahlepy",
    readTime: "4 min read",
    tags: ["UI/UX", "Animation", "GSAP", "Design"],
    content: `
# Why Micro Interaction Details Matter

The difference between a good interface and a great one often lies in the details—the subtle animations, hover states, and feedback that make users feel confident in their actions.

## What Are Micro Interactions?

Micro interactions are small, contained product moments that accomplish a single task. They include:

- Button hover and click states
- Loading indicators
- Form validation feedback
- Toggle switches
- Pull-to-refresh animations

## Why They Matter

### 1. Feedback and Confirmation
Users need to know their actions were registered. A button that doesn't respond to clicks feels broken, even if it works behind the scenes.

### 2. Visual Hierarchy
Motion can guide attention. A subtle animation can direct users to important actions without overwhelming the design.

### 3. Personality
Micro interactions are where your brand personality shines through. They're the difference between functional and delightful.

## Best Practices

### Keep It Subtle
Animations should enhance, not distract. If users notice the animation more than the content, it's too much.

### Be Consistent
Similar actions should have similar feedback. Don't use different animations for the same type of interaction.

### Consider Performance
Smooth 60fps animations are crucial. Use CSS transforms and opacity—avoid animating width, height, or position when possible.

### Example with GSAP

\`\`\`typescript
// Button hover effect
gsap.to('.button', {
  scale: 1.05,
  duration: 0.2,
  ease: 'power2.out'
})

// Form validation
gsap.from('.error-message', {
  y: -10,
  opacity: 0,
  duration: 0.3,
  ease: 'back.out'
})
\`\`\`

## The Trust Factor

When micro interactions are done well, users trust the interface more. They feel in control, they understand what's happening, and they're more likely to complete desired actions.

## Conclusion

Don't underestimate the power of small details. Invest time in polishing these moments—your users will notice, even if they can't articulate why your interface feels better.
    `,
    contentId: `
# Kenapa Detail Micro Interaction Penting

Perbedaan antara interface yang bagus dan yang hebat sering terletak pada detail—animasi halus, hover state, dan feedback yang membuat user merasa yakin dengan tindakan mereka.

## Apa Itu Micro Interactions?

Micro interactions adalah momen produk kecil yang terkandung yang menyelesaikan satu tugas. Termasuk:

- Button hover dan click states
- Loading indicators
- Feedback validasi form
- Toggle switches
- Animasi pull-to-refresh

## Mengapa Penting

### 1. Feedback dan Konfirmasi
User perlu tahu tindakan mereka terdaftar. Button yang tidak merespons klik terasa rusak, bahkan jika berfungsi di belakang layar.

### 2. Hierarki Visual
Motion bisa mengarahkan perhatian. Animasi halus dapat mengarahkan user ke tindakan penting tanpa overwhelming desain.

### 3. Kepribadian
Micro interactions adalah tempat kepribadian brand Anda bersinar. Mereka adalah perbedaan antara fungsional dan menyenangkan.

## Best Practices

### Jaga Agar Halus
Animasi harus memperkuat, bukan mengalihkan perhatian. Jika user lebih memperhatikan animasi daripada konten, itu terlalu banyak.

### Konsisten
Tindakan serupa harus memiliki feedback serupa. Jangan gunakan animasi berbeda untuk tipe interaksi yang sama.

### Pertimbangkan Performa
Animasi smooth 60fps sangat penting. Gunakan CSS transforms dan opacity—hindari animasi width, height, atau position jika memungkinkan.

### Contoh dengan GSAP

\`\`\`typescript
// Button hover effect
gsap.to('.button', {
  scale: 1.05,
  duration: 0.2,
  ease: 'power2.out'
})

// Form validation
gsap.from('.error-message', {
  y: -10,
  opacity: 0,
  duration: 0.3,
  ease: 'back.out'
})
\`\`\`

## Faktor Kepercayaan

Ketika micro interactions dilakukan dengan baik, user lebih mempercayai interface. Mereka merasa dalam kontrol, memahami apa yang terjadi, dan lebih mungkin menyelesaikan tindakan yang diinginkan.

## Kesimpulan

Jangan remehkan kekuatan detail kecil. Investasikan waktu dalam memoles momen-momen ini—user Anda akan memperhatikan, bahkan jika mereka tidak bisa mengartikulasikan mengapa interface Anda terasa lebih baik.
    `
  },
  {
    slug: "nuxt-component-structure-small-projects",
    title: "Nuxt Component Structure for Small Projects",
    titleId: "Struktur Komponen Nuxt untuk Project Kecil",
    category: "Nuxt",
    categoryId: "Nuxt",
    date: "06 Jun 2026",
    excerpt: "Discussion on separating sections, data, and styles so portfolio projects stay easy to maintain.",
    excerptId: "Pembahasan tentang memisahkan section, data, dan style agar project portfolio tetap mudah dirawat.",
    author: "Reihan Azka Vahlepy",
    readTime: "6 min read",
    tags: ["Nuxt", "Vue", "Architecture", "Best Practices"],
    content: `
# Nuxt Component Structure for Small Projects

Even small projects benefit from thoughtful organization. Here's how I structure Nuxt portfolio projects to stay maintainable as they grow.

## The Problem

Portfolio projects tend to start simple and grow organically. Without structure, you end up with:

- Giant components doing too much
- Styles scattered everywhere
- Hard-coded data mixed with logic
- Difficulty finding and updating content

## My Approach

### 1. Section-Based Components

Break the page into logical sections:

\`\`\`
components/
├── pro/
│   ├── ProHero.vue
│   ├── ProAbout.vue
│   ├── ProProjects.vue
│   ├── ProSkills.vue
│   └── ProContact.vue
├── common/
│   ├── ThemeToggle.vue
│   └── LanguageSelector.vue
└── layout/
    └── ModeSwitcher.vue
\`\`\`

Each section is self-contained with its own:
- Template structure
- Scoped styles
- Local state if needed

### 2. Separate Data from Components

Move content into data files:

\`\`\`typescript
// data/projects.ts
export const projects = [
  {
    title: "Project Name",
    description: "Project description",
    tech: ["Nuxt", "Three.js"],
    link: "https://github.com/..."
  }
]
\`\`\`

Then import in components:

\`\`\`vue
<script setup>
import { projects } from '~/data/projects'
</script>
\`\`\`

This makes updates easier—change data in one place, not scattered through templates.

### 3. Composables for Shared Logic

Create reusable composables:

\`\`\`typescript
// composables/useLanguage.ts
export function useLanguage() {
  const language = ref('en')
  
  const setLocale = (locale) => {
    language.value = locale
  }
  
  return { language, setLocale }
}
\`\`\`

### 4. Style Organization

Use CSS variables for theming:

\`\`\`css
:root {
  --bg: #0b0b0f;
  --text: #f6f7fb;
  --primary: #00c853;
}

:root[data-theme="light"] {
  --bg: #f5f7fb;
  --text: #111827;
}
\`\`\`

Components stay clean by referencing variables:

\`\`\`css
.section {
  background: var(--bg);
  color: var(--text);
}
\`\`\`

## Benefits

This structure provides:

- **Easy updates**: Change content in data files
- **Reusability**: Share composables and components
- **Maintainability**: Find things quickly
- **Scalability**: Add sections without breaking existing code

## When to Refactor

Start simple. Refactor when:

- A component exceeds 200 lines
- You're duplicating logic
- Finding things takes too long
- Adding features feels difficult

## Conclusion

Good structure doesn't mean over-engineering. It means organizing code so future you (or collaborators) can work efficiently. Start with clear separation, add abstraction only when it provides value.
    `,
    contentId: `
# Struktur Komponen Nuxt untuk Project Kecil

Bahkan project kecil mendapat manfaat dari organisasi yang thoughtful. Inilah cara saya menyusun project portfolio Nuxt agar tetap maintainable saat berkembang.

## Masalahnya

Project portfolio cenderung dimulai sederhana dan tumbuh secara organik. Tanpa struktur, Anda berakhir dengan:

- Komponen raksasa yang melakukan terlalu banyak hal
- Style tersebar di mana-mana
- Data hard-coded tercampur dengan logic
- Kesulitan menemukan dan mengupdate konten

## Pendekatan Saya

### 1. Komponen Berbasis Section

Pisahkan halaman menjadi section logical:

\`\`\`
components/
├── pro/
│   ├── ProHero.vue
│   ├── ProAbout.vue
│   ├── ProProjects.vue
│   ├── ProSkills.vue
│   └── ProContact.vue
├── common/
│   ├── ThemeToggle.vue
│   └── LanguageSelector.vue
└── layout/
    └── ModeSwitcher.vue
\`\`\`

Setiap section berdiri sendiri dengan:
- Struktur template
- Scoped styles
- Local state jika diperlukan

### 2. Pisahkan Data dari Komponen

Pindahkan konten ke file data:

\`\`\`typescript
// data/projects.ts
export const projects = [
  {
    title: "Nama Project",
    description: "Deskripsi project",
    tech: ["Nuxt", "Three.js"],
    link: "https://github.com/..."
  }
]
\`\`\`

Kemudian import di komponen:

\`\`\`vue
<script setup>
import { projects } from '~/data/projects'
</script>
\`\`\`

Ini membuat update lebih mudah—ubah data di satu tempat, bukan tersebar melalui template.

### 3. Composables untuk Logic Bersama

Buat composable yang reusable:

\`\`\`typescript
// composables/useLanguage.ts
export function useLanguage() {
  const language = ref('en')
  
  const setLocale = (locale) => {
    language.value = locale
  }
  
  return { language, setLocale }
}
\`\`\`

### 4. Organisasi Style

Gunakan CSS variables untuk theming:

\`\`\`css
:root {
  --bg: #0b0b0f;
  --text: #f6f7fb;
  --primary: #00c853;
}

:root[data-theme="light"] {
  --bg: #f5f7fb;
  --text: #111827;
}
\`\`\`

Komponen tetap clean dengan referensi variable:

\`\`\`css
.section {
  background: var(--bg);
  color: var(--text);
}
\`\`\`

## Manfaat

Struktur ini menyediakan:

- **Update mudah**: Ubah konten di file data
- **Reusability**: Share composables dan komponen
- **Maintainability**: Temukan hal dengan cepat
- **Scalability**: Tambah section tanpa merusak kode existing

## Kapan Refactor

Mulai sederhana. Refactor ketika:

- Komponen melebihi 200 baris
- Anda menduplikasi logic
- Menemukan hal memakan waktu terlalu lama
- Menambah fitur terasa sulit

## Kesimpulan

Struktur yang baik bukan berarti over-engineering. Artinya mengorganisir kode sehingga Anda di masa depan (atau kolaborator) dapat bekerja secara efisien. Mulai dengan pemisahan yang jelas, tambahkan abstraksi hanya ketika memberikan nilai.
    `
  }
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug)
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts
}
