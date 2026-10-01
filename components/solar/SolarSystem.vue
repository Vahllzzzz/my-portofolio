<template>
  <div class="solar-system">
    <h1 class="title">{{ t.title }}</h1>

    <button class="back-btn" @click="backToPro">
      <span aria-hidden="true">←</span>
      <span class="back-label">{{ t.back }}</span>
    </button>

    <div ref="container" class="canvas-container">
      <div ref="tooltip" class="planet-tooltip" aria-hidden="true">
        <strong>{{ hoveredData?.name }}</strong>
        <small>{{ hoveredData?.section }}</small>
      </div>
    </div>

    <!-- hint desktop -->
    <div v-if="!selectedPlanet" class="hint desktop-hint">
      <p>{{ t.hint }}</p>
    </div>

    <!-- panel info desktop (digabung, gak blokin kanan) -->
    <Transition name="panel">
      <aside v-if="selectedPlanet" class="info-panel desktop-panel">
        <div class="planet-preview" :style="{ background: selectedPlanet.color }"></div>
        <h2>{{ selectedPlanet.name }}</h2>
        <span class="chip">{{ selectedPlanet.section }}</span>
        <p class="desc">{{ selectedPlanet.description }}</p>
        <button class="reset-btn" @click="resetView">{{ t.backToOrbit }}</button>
      </aside>
    </Transition>

    <!-- bottom sheet mobile -->
    <Transition name="slide-up">
      <div v-if="selectedPlanet" class="mobile-panel">
        <div class="mobile-panel-header">
          <div class="planet-indicator" :style="{ background: selectedPlanet.color }"></div>
          <div class="planet-info">
            <h2>{{ selectedPlanet.name }}</h2>
            <span>{{ selectedPlanet.section }}</span>
          </div>
          <button class="close-btn" aria-label="Close" @click="resetView">✕</button>
        </div>
        <p class="planet-description">{{ selectedPlanet.description }}</p>
      </div>
    </Transition>

    <div v-if="!selectedPlanet" class="mobile-instructions">
      <p>{{ t.instructions }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import gsap from "gsap"
import { useModeStore } from "../../stores/mode"
import { storeToRefs } from "pinia"
import { useLanguage } from "../../composables/useLanguage"

declare global {
  interface Window {
    solarPreviewEl?: HTMLElement
    solarTargetRect?: DOMRect
    __solarReturning?: boolean
  }
}

let leaving = false

/* tunggu hero ke-mount + mini solar-nya hidup, balikin elemennya */
function waitForHeroPreview(): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    const start = performance.now()
    const poll = () => {
      const el = window.solarPreviewEl
      const canvas = el?.querySelector("canvas")
      if (el && canvas) {
        // tunggu 2 frame biar frame pertama mini solar bener2 ke-render
        requestAnimationFrame(() =>
          requestAnimationFrame(() => resolve(el))
        )
        return
      }
      if (performance.now() - start > 3000) return resolve(null)
      requestAnimationFrame(poll)
    }
    poll()
  })
}

interface PlanetData {
  name: string
  section: string
  description: string
  color: string
  radius: number
  speed: number
  size: number
}

const store = useModeStore()
const { paused } = storeToRefs(store)
const { language } = useLanguage()

const container = ref<HTMLElement | null>(null)
const tooltip = ref<HTMLElement | null>(null)
const selectedPlanet = ref<PlanetData | null>(null)
const hoveredData = ref<PlanetData | null>(null)

const t = computed(() => {
  const en = language.value === "en"
  return {
    title: en ? "3D Solar System Portfolio" : "Portfolio Sistem Solar 3D",
    back: en ? "Back to Portfolio" : "Kembali ke Portfolio",
    backToOrbit: en ? "Back to Solar System" : "Kembali ke Sistem Solar",
    hint: en
      ? "Drag to orbit • Scroll to zoom • Click a planet"
      : "Drag untuk memutar • Scroll untuk zoom • Klik planet",
    instructions: en ? "Tap a planet to explore" : "Ketuk planet untuk menjelajah",
    sunSection: en ? "Home Base" : "Markas",
    sunDesc: en
      ? "You are here. Every planet in this system holds a piece of what I do — click one to explore."
      : "Kamu di sini. Setiap planet di sistem ini menyimpan satu bagian dari yang saya kerjakan — klik untuk menjelajah.",
  }
})

/* ===== DATA (deskripsi masih EN — tinggal tambah field ID kalau mau) ===== */
const planets: PlanetData[] = [
  { name: "Mercury", section: "About Me", description: "Hi! I'm Reihan Azka Vahlepy, a passionate Frontend Developer from SMK ASSALAAM BANDUNG. I specialize in creating beautiful, interactive web experiences using modern technologies. Beyond coding, I explore 3D art and game development to bring creative visions to life.", color: "#b3b3b3", radius: 5, speed: 1, size: 0.5 },
  { name: "Venus", section: "Skills & Technologies", description: "Frontend: HTML5, CSS3, JavaScript, TypeScript, Vue.js, Nuxt.js • 3D & Animation: Three.js, GSAP, WebGL, Canvas API • Backend: PHP, Python, Java • Tools: Git, npm, Vite, Chrome DevTools • Creative: Blender, Unity basics, game design fundamentals", color: "#d7ba7d", radius: 8, speed: 0.8, size: 0.7 },
  { name: "Earth", section: "Featured Projects", description: "Interactive Solar Portfolio: This 3D solar system built with Three.js and Nuxt • E-Commerce Platform: Full-stack Laravel application with product management and payment integration • Motion UI Kit: Reusable GSAP animation components and patterns • Responsive Portfolio: Modern design with theme switching and multi-language support", color: "#4a90e2", radius: 11, speed: 0.7, size: 0.8 },
  { name: "Mars", section: "Game Development", description: "Exploring game development with Unity and Unreal Engine. Currently learning: 3D environment design, character controllers, physics systems, and interactive gameplay mechanics. Working on small prototype projects to understand game architecture and player experience design.", color: "#d14f2f", radius: 14, speed: 0.55, size: 0.65 },
  { name: "Jupiter", section: "Web Applications", description: "Building large-scale web applications with focus on: Performance optimization and code splitting • State management with Pinia • RESTful API integration • Responsive design patterns • Accessibility compliance (WCAG) • Progressive Web App features • Real-time updates with WebSockets", color: "#c89d6f", radius: 18, speed: 0.45, size: 1.2 },
  { name: "Saturn", section: "3D Art & Design", description: "Creating 3D models and renders using Blender. Skills include: Low-poly and high-poly modeling • UV mapping and texturing • Lighting and scene composition • Materials and shaders • Basic rigging and animation • Rendering optimization for web and real-time applications", color: "#d9c98f", radius: 23, speed: 0.35, size: 1.0 },
  { name: "Uranus", section: "Experiments & Prototypes", description: "Creative explorations and experimental projects: WebGL shaders and visual effects • Procedural generation algorithms • Interactive data visualizations • Particle systems • Physics simulations • Generative art with Canvas API • Audio-reactive animations", color: "#8fdde3", radius: 28, speed: 0.28, size: 0.85 },
  { name: "Neptune", section: "Let's Connect", description: "I'm available for freelance projects, collaborations, and full-time opportunities. Feel free to reach out! • Email: hannvahll09@gmail.com • GitHub: github.com/Vahllzzzz • LinkedIn: Connect with me for professional networking • Always open to discussing new ideas and interesting projects", color: "#4169ff", radius: 33, speed: 0.22, size: 0.85 },
]

/* ===== three.js state ===== */
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let sunMesh: THREE.Mesh
let sunGlow: THREE.Mesh
let sunHitbox: THREE.Mesh
let stars: THREE.Points
let frame = 0
let resizeFn: (() => void) | null = null
let isMobile = false

const meshes: THREE.Mesh[] = []
const hitboxes: THREE.Mesh[] = []
const angles: number[] = planets.map(() => Math.random() * Math.PI * 2) // start acak, gak sejajar

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2(-2, -2)
const tmpV = new THREE.Vector3() // reuse, gak alokasi per frame
const clock = new THREE.Clock()

let focusMesh: THREE.Mesh | null = null
let hoveredMesh: THREE.Mesh | null = null
let hoverDirty = false

/* drag vs click */
let downX = -9999
let downY = -9999

const BASE_EMI = 0.2
const FOCUS_EMI = 0.55

/* ===== helpers ===== */
function collectMats(mesh: THREE.Mesh): THREE.Material[] {
  const mats: THREE.Material[] = []
  if (mesh.material) {
    if (Array.isArray(mesh.material)) mats.push(...mesh.material)
    else mats.push(mesh.material)
  }
  mesh.children.forEach((c) => {
    const m = (c as THREE.Mesh).material
    if (!m) return
    if (Array.isArray(m)) mats.push(...m)
    else mats.push(m)
  })
  return mats
}

/* dim: 1 = normal, 0.15 = redup */
function applyStates() {
  const all = [sunMesh, ...meshes]
  all.forEach((m) => {
    const isFocus = m === focusMesh
    const opacity = isFocus || !selectedPlanet.value ? 1 : 0.15
    collectMats(m).forEach((mat) => {
      mat.transparent = opacity < 1
      mat.opacity = opacity
      const anyM = mat as any
      if ("emissiveIntensity" in anyM) {
        anyM.emissiveIntensity = isFocus ? FOCUS_EMI : BASE_EMI
      }
    })
  })
}

function setRay(cx: number, cy: number) {
  const r = renderer.domElement.getBoundingClientRect()
  pointer.x = ((cx - r.left) / r.width) * 2 - 1
  pointer.y = -((cy - r.top) / r.height) * 2 + 1
}

function pickables(): THREE.Object3D[] {
  return [...hitboxes, sunHitbox]
}

function meshOf(data: PlanetData): THREE.Mesh {
  return data.name === "Sun" ? sunMesh : meshes.find((m) => (m.userData as PlanetData).name === data.name)!
}

function focusCameraOn(mesh: THREE.Mesh) {
  const data = mesh.userData as PlanetData
  const target = mesh.position.clone()
  const dist = Math.max((data.size ?? 2.5) * 6, 6)

  const dir = camera.position.clone().sub(target)
  if (dir.lengthSq() < 0.001) dir.set(1, 0.6, 1)
  dir.normalize()

  const dest = target.clone().addScaledVector(dir, dist)
  dest.y = target.y + Math.max(dist * 0.35, 2)

  gsap.to(controls.target, { x: target.x, y: target.y, z: target.z, duration: 1.1, ease: "power3.inOut" })
  gsap.to(camera.position, { x: dest.x, y: dest.y, z: dest.z, duration: 1.1, ease: "power3.inOut" })
}

function select(data: PlanetData) {
  const mesh = meshOf(data)
  focusMesh = mesh
  selectedPlanet.value = data
  hoveredData.value = null
  applyStates()
  focusCameraOn(mesh)
}

function resetView() {
  selectedPlanet.value = null
  focusMesh = null
  applyStates()

  const def = isMobile ? new THREE.Vector3(0, 15, 50) : new THREE.Vector3(0, 12, 45)
  gsap.to(controls.target, { x: 0, y: 0, z: 0, duration: 1, ease: "power3.inOut" })
  gsap.to(camera.position, { x: def.x, y: def.y, z: def.z, duration: 1, ease: "power3.inOut" })
}

function onPointerDown(e: PointerEvent) {
  downX = e.clientX
  downY = e.clientY
}

function onPointerUp(e: PointerEvent) {
  // drag = bukan klik (biar OrbitControls rotate gak salah select)
  if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return
  setRay(e.clientX, e.clientY)
  raycaster.setFromCamera(pointer, camera)
  const hit = raycaster.intersectObjects(pickables(), false)[0]

  if (hit) {
    select(hit.object.userData as PlanetData)
  } else if (selectedPlanet.value) {
    resetView() // janji "tap outside to return" sekarang beneran jalan
  }
}

function onPointerMove(e: PointerEvent) {
  if (e.pointerType === "touch") return
  setRay(e.clientX, e.clientY)
  hoverDirty = true
}

function doHover() {
  raycaster.setFromCamera(pointer, camera)
  const hit = raycaster.intersectObjects(pickables(), false)[0]
  hoveredMesh = hit ? meshOf(hit.object.userData as PlanetData) : null
  hoveredData.value = hit ? (hit.object.userData as PlanetData) : null
  renderer.domElement.style.cursor = hit ? "pointer" : "grab"
}

function updateTooltip() {
  const tip = tooltip.value
  if (!tip) return
  if (!hoveredMesh) {
    tip.classList.remove("show")
    return
  }
  tmpV.copy(hoveredMesh.position).project(camera)
  const w = container.value?.clientWidth ?? window.innerWidth
  const h = container.value?.clientHeight ?? window.innerHeight
  tip.style.left = (tmpV.x * 0.5 + 0.5) * w + "px"
  tip.style.top = (-tmpV.y * 0.5 + 0.5) * h + "px"
  tip.classList.add("show")
}

function onKey(e: KeyboardEvent) {
  if (e.key === "Escape" && selectedPlanet.value) resetView()
}

/* ===== keluar mode solar (snapshot, bukan cloneNode!) ===== */
async function backToPro() {
  if (leaving) return
  leaving = true

  if (!renderer) {
    store.setMode("pro")
    return
  }

  // snapshot layar (bukan cloneNode — canvas hasil clone itu kosong!)
  renderer.render(scene, camera)
  const snapshot = renderer.domElement.toDataURL()

  const clone = document.createElement("div")
  Object.assign(clone.style, {
    position: "fixed",
    left: "0",
    top: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "99999",
    pointerEvents: "none",
    backgroundColor: "#05070b",
    backgroundImage: `url(${snapshot})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  })
  document.body.appendChild(clone)

  // pasang flag (biar Hero skip intro) + ganti mode →
  // pro page mount DI BELAKANG overlay, swap-nya gak keliatan
  window.__solarReturning = true
  store.setMode("pro")

  // tunggu mini solar hidup, ukur posisi TERKINI (aman dari resize/scroll)
  const el = await waitForHeroPreview()

  if (!el) {
    clone.remove()
    window.__solarReturning = false
    return
  }

  const r = el.getBoundingClientRect()

  // zoom-out: fullscreen → mengecil ke kotak mini solar
  gsap.to(clone, {
    left: r.left + "px",
    top: r.top + "px",
    width: r.width + "px",
    height: r.height + "px",
    borderRadius: "12px",
    duration: 1,
    ease: "power3.inOut",
    // crossfade tipis ke canvas mini yang hidup di belakangnya
    onComplete() {
      gsap.to(clone, {
        opacity: 0,
        duration: 0.25,
        ease: "power1.out",
        onComplete() {
          clone.remove()
          window.__solarReturning = false
          leaving = false
        },
      })
    },
  })
}

/* ===== init ===== */
onMounted(() => {
  isMobile = window.innerWidth <= 920

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(
    isMobile ? 85 : 75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 26, 85) // mulai jauh → intro animation

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // tajam di retina
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value?.appendChild(renderer.domElement)

  /* OrbitControls: drag rotate + scroll/pinch zoom */
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.06
  controls.enablePan = false
  controls.minDistance = 6
  controls.maxDistance = 140

  scene.add(new THREE.AmbientLight(0xffffff, 2))

  /* sun + glow + hitbox (bisa diklik) */
  sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 64, 64),
    new THREE.MeshBasicMaterial({ color: "#ffd447" })
  )
  sunMesh.userData = {
    name: "Sun",
    section: t.value.sunSection,
    description: t.value.sunDesc,
    color: "#ffd447",
    size: 2.5,
  } as PlanetData
  scene.add(sunMesh)

  sunGlow = new THREE.Mesh(
    new THREE.SphereGeometry(3.2, 32, 32),
    new THREE.MeshBasicMaterial({ color: "#ffb14d", transparent: true, opacity: 0.18 })
  )
  scene.add(sunGlow)

  sunHitbox = new THREE.Mesh(
    new THREE.SphereGeometry(3.4, 12, 12),
    new THREE.MeshBasicMaterial({ visible: false })
  )
  sunHitbox.userData = sunMesh.userData
  scene.add(sunHitbox)

  /* stars */
  const starsGeo = new THREE.BufferGeometry()
  const starVerts: number[] = []
  for (let i = 0; i < 3000; i++) {
    starVerts.push((Math.random() - 0.5) * 500, (Math.random() - 0.5) * 500, (Math.random() - 0.5) * 500)
  }
  starsGeo.setAttribute("position", new THREE.Float32BufferAttribute(starVerts, 3))
  stars = new THREE.Points(
    starsGeo,
    new THREE.PointsMaterial({ color: "#ffffff", size: 0.6, transparent: true, opacity: 0.9 })
  )
  scene.add(stars)

  /* planets */
  planets.forEach((p) => {
    const orbit = new THREE.Mesh(
      new THREE.RingGeometry(p.radius - 0.03, p.radius + 0.03, 128),
      new THREE.MeshBasicMaterial({
        color: p.color, // warna orbit = warna planetnya
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      })
    )
    orbit.rotation.x = Math.PI / 2
    orbit.position.y = -0.02
    scene.add(orbit)

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(p.size, 32, 32),
      new THREE.MeshStandardMaterial({
        color: p.color,
        roughness: 1,
        metalness: 0,
        emissive: p.color,
        emissiveIntensity: BASE_EMI,
      })
    )
    mesh.userData = p

    const hitbox = new THREE.Mesh(
      new THREE.SphereGeometry(p.size * 2.5, 12, 12),
      new THREE.MeshBasicMaterial({ visible: false })
    )
    hitbox.userData = p

    if (p.name === "Saturn") {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(p.size * 1.5, p.size * 2.6, 64),
        new THREE.MeshBasicMaterial({
          color: "#d9c98f",
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
        })
      )
      ring.rotation.x = Math.PI / 2.7
      mesh.add(ring)
    }

    meshes.push(mesh)
    hitboxes.push(hitbox)
    scene.add(mesh)
    scene.add(hitbox)
  })

  /* input: pointer events tunggal (fix dobel-fire touchstart+click) */
  const dom = renderer.domElement
  dom.style.cursor = "grab"
  dom.addEventListener("pointerdown", onPointerDown)
  dom.addEventListener("pointerup", onPointerUp)
  dom.addEventListener("pointermove", onPointerMove)
  window.addEventListener("keydown", onKey)

  /* intro kamera */
  const defPos = isMobile ? new THREE.Vector3(0, 15, 50) : new THREE.Vector3(0, 12, 45)
  gsap.to(camera.position, { x: defPos.x, y: defPos.y, z: defPos.z, duration: 1.8, ease: "power3.out" })

  resizeFn = () => {
    isMobile = window.innerWidth <= 920
    camera.aspect = window.innerWidth / window.innerHeight
    camera.fov = isMobile ? 85 : 75
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener("resize", resizeFn)

  const animate = () => {
    frame = requestAnimationFrame(animate)
    const delta = Math.min(clock.getDelta(), 0.05)
    const elapsed = clock.getElapsedTime()

    if (!paused.value) {
      meshes.forEach((mesh, i) => {
        if (mesh === focusMesh) return // planet yang dilihat dibekukan biar stabil
        angles[i] += delta * (mesh.userData as PlanetData).speed
      })
    }

    meshes.forEach((mesh, i) => {
      const d = mesh.userData as PlanetData
      mesh.position.x = Math.cos(angles[i]) * d.radius
      mesh.position.z = Math.sin(angles[i]) * d.radius
      hitboxes[i].position.copy(mesh.position)
      mesh.rotation.y += delta * 0.4
    })

    sunMesh.rotation.y += delta * 0.05
    sunGlow.scale.setScalar(1 + Math.sin(elapsed * 2.2) * 0.035)
    stars.rotation.y += delta * 0.01

    if (hoverDirty) {
      hoverDirty = false
      doHover()
    }
    updateTooltip()

    controls.update()
    renderer.render(scene, camera)
  }
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  resizeFn && window.removeEventListener("resize", resizeFn)
  window.removeEventListener("keydown", onKey)

  gsap.killTweensOf(camera?.position ?? {})
  controls?.target && gsap.killTweensOf(controls.target)
  controls?.dispose()

  scene?.traverse((obj: any) => {
    obj.geometry?.dispose?.()
    const m = obj.material
    if (Array.isArray(m)) m.forEach((x: any) => x.dispose?.())
    else m?.dispose?.()
  })
  renderer?.dispose()
  renderer?.domElement.remove()
})
</script>

<style scoped>
.solar-system {
  position: relative;
  height: 100vh;
  background: #05070b;
  overflow: hidden;
}

.canvas-container {
  width: 100%;
  height: 100%;
}

.title {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  z-index: 10;
  font-size: 1.5rem;
  text-align: center;
  padding: 12px 24px;
  margin: 0;
  background: rgba(11, 11, 15, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.left-panel,
.right-panel {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 320px;
  padding: 24px;
  color: white;
  z-index: 10;
  background: rgba(11, 11, 15, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.left-panel {
  left: 20px;
}

.right-panel {
  right: 20px;
}

.planet-preview {
  height: 220px;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.planet-preview::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 50%);
}

.left-panel h2,
.right-panel h2 {
  margin: 0 0 12px;
  font-size: 1.6rem;
  color: #fff;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.left-panel p,
.right-panel p {
  margin: 0 0 20px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.7;
  font-size: 1rem;
}

/* ganti blok button lama dengan ini */
.reset-btn {
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background: #00c853;
  color: #fff;
  font-weight: 800;
  font-size: 0.95rem;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 200, 83, 0.3);
}
.reset-btn:hover { background: #00dc5a; transform: translateY(-2px); }
.reset-btn:active { transform: translateY(0); }

/* tombol kembali ke portfolio — SELALU terlihat */
.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 20;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  background: rgba(11, 11, 15, 0.8);
  backdrop-filter: blur(10px);
  color: #fff;
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.back-btn:hover { transform: translateX(-2px); border-color: rgba(0, 200, 83, 0.6); }

/* tooltip hover planet */
.planet-tooltip {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 15;
  pointer-events: none;
  transform: translate(-50%, calc(-100% - 14px));
  padding: 7px 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 9px;
  background: rgba(9, 10, 16, 0.92);
  backdrop-filter: blur(6px);
  color: #fff;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.planet-tooltip.show { opacity: 1; }
.planet-tooltip strong { display: block; font-size: 0.82rem; }
.planet-tooltip small {
  display: block;
  color: #00c853;
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* hint desktop bawah */
.hint p { margin: 0; }
.desktop-hint {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  padding: 10px 20px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  background: rgba(11, 11, 15, 0.8);
  backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.8rem;
  font-weight: 700;
}

/* panel desktop digabung jadi satu */
.info-panel {
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  width: 340px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding: 24px;
  color: #fff;
  z-index: 10;
  background: rgba(11, 11, 15, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.chip {
  display: inline-flex;
  padding: 5px 11px;
  margin-bottom: 14px;
  border-radius: 999px;
  background: rgba(0, 200, 83, 0.15);
  color: #00c853;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.panel-enter-active,
.panel-leave-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.panel-enter-from,
.panel-leave-to { opacity: 0; transform: translateY(-50%) translateX(-24px); }

/* ===== base: elemen mobile disembunyiin di desktop ===== */
.mobile-panel { display: none; }
.mobile-instructions { display: none; }

@media (max-width: 920px) {
  .back-btn {
    width: 40px;
    height: 40px;
    padding: 0;
    justify-content: center;
    border-radius: 999px;
  }
  .back-label { display: none; }
  .desktop-hint { display: none; }
  .info-panel { display: none; }

  .title {
    font-size: 1rem;
    top: 15px;
    padding: 10px 20px;
  }

  /* bottom sheet */
  .mobile-panel {
    display: block;
    position: fixed;
    bottom: 70px;
    left: 0;
    right: 0;
    z-index: 101;
    background: linear-gradient(to top, rgba(11, 11, 15, 0.98), rgba(11, 11, 15, 0.95));
    backdrop-filter: blur(30px);
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    padding: 24px 20px;
    padding-bottom: max(24px, env(safe-area-inset-bottom));
    border-radius: 24px 24px 0 0;
    box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.5);
    max-height: calc(100vh - 140px);
    overflow-y: auto;
  }

  .mobile-panel-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }

  .planet-indicator {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), inset 0 2px 8px rgba(255, 255, 255, 0.2);
    position: relative;
  }

  .planet-indicator::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent 60%);
  }

  .planet-info { flex: 1; min-width: 0; }

  .planet-info h2 {
    margin: 0 0 4px;
    color: #fff;
    font-size: 1.4rem;
    line-height: 1.2;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .planet-info span {
    display: inline-flex;
    padding: 4px 10px;
    margin-top: 6px;
    border-radius: 6px;
    background: rgba(0, 200, 83, 0.15);
    color: rgba(0, 200, 83, 1);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .close-btn {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    border-radius: 50%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 1.3rem;
    flex-shrink: 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.2s ease;
  }

  .close-btn:hover { background: rgba(255, 255, 255, 0.15); }
  .close-btn:active { transform: scale(0.95); }

  .planet-description {
    margin: 0;
    padding: 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.7;
    font-size: 0.98rem;
  }

  .mobile-instructions {
    display: block;
    position: fixed;
    bottom: 90px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 15;
    background: rgba(11, 11, 15, 0.9);
    backdrop-filter: blur(20px);
    padding: 12px 24px;
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }

  .mobile-instructions p {
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.88rem;
    font-weight: 600;
  }
}

@media (max-width: 560px) {
  .title {
    font-size: 0.9rem;
    top: 12px;
    padding: 8px 16px;
  }

  .mobile-panel {
    bottom: 60px;
    padding: 20px 16px 20px;
    padding-bottom: max(20px, env(safe-area-inset-bottom));
    max-height: calc(100vh - 120px);
  }

  .planet-indicator {
    width: 48px;
    height: 48px;
  }

  .planet-info h2 {
    font-size: 1.2rem;
  }

  .planet-info span {
    font-size: 0.75rem;
    padding: 3px 8px;
  }

  .planet-description {
    font-size: 0.92rem;
    padding: 14px;
  }

  .close-btn {
    width: 36px;
    height: 36px;
    min-width: 36px;
    min-height: 36px;
    font-size: 1.1rem;
  }

  .mobile-instructions {
    bottom: 76px;
    padding: 10px 20px;
  }

  .mobile-instructions p {
    font-size: 0.82rem;
  }
}

/* Slide up transition */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
