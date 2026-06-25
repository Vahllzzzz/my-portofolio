<template>
  <section id="hero" ref="hero" class="hero">
    <div class="hero-copy">
      <p ref="badge" class="eyebrow">
        {{
          language === 'en'
            ? 'Frontend Developer • Game Dev • 3D Artist'
            : 'Frontend Developer • Game Dev • 3D Artist'
        }}
      </p>

      <h1 ref="title">
        {{
          language === 'en'
            ? 'Hi! The name is Reihan Azka Vahlepy.'
            : 'Hai! Nama saya Reihan Azka Vahlepy.'
        }}
    </h1>

      <p ref="subtitle" class="subtitle">
        {{
          language === 'en'
            ? "I'm a Frontend Developer, I also have passion in Game Development and 3D art."
            : 'Saya seorang Frontend Developer, saya juga memiliki passion dalam Game Development dan seni 3D.'
        }}
      </p>

      <div ref="cta" class="cta">
        <a href="#projects" class="primary">
          {{ language === 'en' ? 'View Projects' : 'Lihat Proyek' }}
        </a>
        <a href="#contact" class="secondary">
          {{ language === 'en' ? 'Contact Me' : 'Hubungi Saya' }}
        </a>
      </div>
    </div>

    <div ref="panel" class="hero-panel" aria-hidden="true">
      <div class="panel-top">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div class="panel-grid">
        <div class="preview large">
        <div class="preview-bar"></div>

        <div
            ref="solarPreview"
            class="preview-stage"
        ></div>
        </div>

        <div class="preview metric">
          <strong>5+</strong>
          <span>Projects</span>
        </div>

        <div class="preview stack">
          <span>Web Dev</span>
          <span>3D Artist</span>
          <span>Game Dev</span> 
        </div>
<div class="preview explore">
  <h3>
    {{ language === 'en' ? 'Interactive Portfolio' : 'Portfolio Interaktif' }}
  </h3>

  <p>
    {{
      language === 'en'
        ? 'Explore my projects through an interactive 3D solar system experience.'
        : 'Jelajahi proyek saya melalui pengalaman sistem solar 3D yang interaktif.'
    }}
  </p>

        <button
        class="explore-btn"
        @click="launchSolar"
        >
        {{ language === 'en' ? 'Launch Solar Portfolio →' : 'Buka Portfolio Solar →' }}
        </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import gsap from "gsap"
import * as THREE from "three"
import { useModeStore } from "../../stores/mode"
import { useLanguage } from "../../composables/useLanguage"

const { language } = useLanguage()

const hero = ref()
const badge = ref()
const title = ref()
const subtitle = ref()
const cta = ref()
const panel = ref()
const solarPreview = ref()
const store = useModeStore()

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer

function enterSolar() {
  gsap.set(panel.value, {
    transformOrigin: "center center"
  })

  const tl = gsap.timeline()

  tl.to(panel.value, {
    scale: 10,
    duration: 1.3,
    ease: "power4.inOut"
  }, 0)

  tl.to(hero.value, {
    opacity: 0,
    duration: 0.9,
    ease: "power2.out"
  }, 0)

  tl.call(() => {
    store.setMode("solar")
  }, [], 1.15)

  if (camera) {
    gsap.to(camera.position, {
      z: 4,
      duration: 1.1,
      ease: "power3.inOut"
    })
  }
}

function launchSolar() {

  const rect =
    solarPreview.value.getBoundingClientRect()

  window.solarTargetRect = rect

  enterSolar()

  const clone =
    solarPreview.value.cloneNode(true)

  document.body.appendChild(clone)

  Object.assign(
    clone.style,
    {
      position: "fixed",
      left: rect.left + "px",
      top: rect.top + "px",
      width: rect.width + "px",
      height: rect.height + "px",
      zIndex: 9999,
      borderRadius: "12px",
      overflow: "hidden"
    }
  )

  gsap.to(clone, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    borderRadius: 0,
    duration: 1,
    ease: "power3.inOut",

    onComplete() {

      store.setMode("solar")

      clone.remove()
    }
  })
}


onMounted(() => {

const target =
  window.solarPreviewEl
  window.solarPreviewEl = solarPreview.value

})

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

  tl.from(badge.value, { opacity: 0, y: 10, duration: 0.45 })
    .from(title.value, { opacity: 0, y: 24, duration: 0.7 }, "-=0.2")
    .from(subtitle.value, { opacity: 0, y: 18, duration: 0.55 }, "-=0.35")
    .from(cta.value, { opacity: 0, y: 16, duration: 0.5 }, "-=0.25")
    .from(panel.value, { opacity: 0, y: 28, duration: 0.7 }, "-=0.45")
    // MINI SOLAR SYSTEM

scene = new THREE.Scene()

camera = new THREE.PerspectiveCamera(
  60,
  solarPreview.value.clientWidth /
  solarPreview.value.clientHeight,
  0.1,
  100
)

camera.position.set(0, 6, 12)
camera.lookAt(0, 0, 0)

renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
})

renderer.setSize(
  solarPreview.value.clientWidth,
  solarPreview.value.clientHeight
)

solarPreview.value.appendChild(
  renderer.domElement
)

scene.add(
  new THREE.AmbientLight(
    0xffffff,
    2
  )
)

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(
    0.7,
    32,
    32
  ),
  new THREE.MeshBasicMaterial({
    color: "#ffd447"
  })
)

scene.add(sun)

const planets: any[] = []

;[
  { radius: 2, color: "#4a90e2", speed: 1.2 },
  { radius: 3.5, color: "#d14f2f", speed: 0.8 },
  { radius: 5, color: "#57d39f", speed: 0.5 }
].forEach((p) => {

  const orbit = new THREE.Mesh(
    new THREE.RingGeometry(
      p.radius - 0.01,
      p.radius + 0.01,
      128
    ),
    new THREE.MeshBasicMaterial({
      color: "#4a90e2",
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    })
  )

  orbit.rotation.x =
    Math.PI / 2

  scene.add(orbit)

  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.15,
      16,
      16
    ),
    new THREE.MeshStandardMaterial({
      color: p.color
    })
  )

  scene.add(planet)

  planets.push({
    mesh: planet,
    radius: p.radius,
    speed: p.speed
  })
})

const starsGeometry =
  new THREE.BufferGeometry()

const starsVertices = []

for (let i = 0; i < 400; i++) {

  starsVertices.push(
    (Math.random() - 0.5) * 30,
    (Math.random() - 0.5) * 30,
    (Math.random() - 0.5) * 30
  )
}

starsGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(
    starsVertices,
    3
  )
)

const stars = new THREE.Points(
  starsGeometry,
  new THREE.PointsMaterial({
    size: 0.04
  })
)

scene.add(stars)

let lastTime = performance.now()

function animateSolar() {

  requestAnimationFrame(
    animateSolar
  )

  const currentTime = performance.now()
  const t = currentTime / 1000

  planets.forEach((p) => {

    p.mesh.position.x =
      Math.cos(t * p.speed) *
      p.radius

    p.mesh.position.z =
      Math.sin(t * p.speed) *
      p.radius
  })

  sun.rotation.y += 0.002

  renderer.render(
    scene,
    camera
  )
}

animateSolar()
})
</script>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(340px, 0.92fr);
  gap: 56px;
  align-items: center;
  min-height: 92vh;
  padding: 120px 40px 72px;
  background:
    linear-gradient(120deg, rgba(0, 200, 83, 0.08), transparent 36%),
    var(--bg);
}

.hero-copy {
  width: min(720px, 100%);
  justify-self: end;
}

.eyebrow {
  width: fit-content;
  margin: 0 0 18px;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--border-dim);
  color: var(--primary);
  font-size: 0.85rem;
  font-weight: 800;
}

h1 {
  margin: 0;
  color: var(--text);
  font-size: 4rem;
  line-height: 1.02;
  font-weight: 900;
}

.subtitle {
  max-width: 640px;
  margin: 24px 0 0;
  color: var(--text-muted);
  font-size: 1.1rem;
  line-height: 1.8;
}

.cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 34px;
}

.cta a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 8px;
  color: var(--text);
  font-size: 0.95rem;
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.cta a:hover {
  transform: translateY(-2px);
}

.primary {
  background: var(--primary);
}

.secondary {
  border: 1px solid var(--border);
  background: var(--border-dim);
}

.hero-panel {
  width: min(480px, 100%);
  justify-self: start;
  overflow: hidden;
  will-change: transform;
  transform-origin: center center;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-surface);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.4);
}

.panel-top {
  display: flex;
  gap: 8px;
  padding: 14px;
  border-bottom: 1px solid var(--border);
}

.panel-top span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #e94560;
}

.panel-top span:nth-child(2) {
  background: #f0b84c;
}

.panel-top span:nth-child(3) {
  background: #57d39f;
}

.panel-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 12px;
  padding: 16px;
}

.preview {
  min-height: 132px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-card);
}

.large {
  grid-row: span 2;
  min-height: 276px;
  padding: 14px;
}

.preview-bar {
  width: 62%;
  height: 8px;
  border-radius: 999px;
  background: var(--border);
}

.preview-stage {
  position: relative;
  height: 226px;
  margin-top: 18px;
  overflow: hidden;
  border-radius: 8px;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    #090a10;
  background-size: 28px 28px;
}

.preview-stage canvas{
  width:100%;
  height:100%;
  display:block;
}

.preview-stage{
  position:relative;
  overflow:hidden;

  background:
    radial-gradient(
      circle at center,
      rgba(57,130,246,.08),
      transparent 60%
    ),
    #090a10;
}

.metric,
.stack {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 18px;
}

.metric strong {
  color: var(--text);
  font-size: 2.4rem;
  line-height: 1;
}

.metric span {
  margin-top: 8px;
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 700;
}

.stack {
  gap: 8px;
}

.stack span {
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 800;
}

@media (max-width: 920px) {
  .hero {
    grid-template-columns: 1fr;
    min-height: auto;
    padding: 116px 24px 56px;
  }

  .hero-copy,
  .hero-panel {
    justify-self: stretch;
    width: 100%;
  }

  h1 {
    font-size: 3rem;
  }
}

@media (max-width: 560px) {
  h1 {
    font-size: 2.45rem;
  }

  .panel-grid {
    grid-template-columns: 1fr;
  }

  .large {
    grid-row: auto;
  }
}

.explore{
  grid-column: span 2;

  display:flex;
  flex-direction:column;
  justify-content:center;

  padding:20px;
}

.explore h3{
  margin:0;
  color: var(--text);
  font-size:1rem;
}

.explore p{
  margin:8px 0 16px;
  color: var(--text-muted);
  line-height:1.6;
  font-size:.9rem;
}

.explore-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;

  width:max-content;

  padding:12px 18px;

  border-radius:8px;

  background: var(--primary);

  color: var(--text);
  text-decoration:none;

  font-weight:700;

  transition:.25s;
}

.explore-btn:hover{
  transform:translateY(-2px);
  box-shadow:0 10px 25px var(--primary);
}

</style>
