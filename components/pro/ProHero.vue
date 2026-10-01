<template>
  <section id="hero" ref="hero" class="hero">
    <div class="hero-copy">
      <p ref="badge" class="eyebrow">{{ t.badge }}</p>

      <h1 ref="title">
        {{ t.title }}
        <span class="gradient-text">Reihan Azka Vahlepy.</span>
      </h1>

      <p ref="subtitle" class="subtitle">{{ t.subtitle }}</p>

      <div ref="cta" class="cta">
        <a href="#projects" class="primary">{{ t.viewProjects }}</a>
        <a href="#contact" class="secondary">{{ t.contactMe }}</a>
      </div>
    </div>

    <div ref="panel" class="hero-panel">
      <div class="panel-top">
        <span></span><span></span><span></span>
        <em>solar-preview.exe</em>
      </div>

      <div class="panel-grid">
        <div class="preview large">
          <div class="preview-bar"></div>
          <div ref="solarPreview" class="preview-stage">
            <div ref="tooltip" class="solar-tooltip">
              <strong>{{ tooltipName }}</strong>
              <small>{{ tooltipRole }}</small>
            </div>
            <span class="drag-hint">{{ t.dragHint }}</span>
          </div>
        </div>

        <div class="preview metric">
          <strong>5+</strong>
          <span>{{ t.projectsLabel }}</span>
        </div>

        <div class="preview stack">
          <span>Web Dev</span>
          <span>Game Dev</span>
          <span>3D Artist</span>
        </div>

        <div class="preview explore">
          <h3>{{ t.exploreTitle }}</h3>
          <p>{{ t.exploreDesc }}</p>
          <button class="explore-btn" @click="launchSolar">{{ t.launch }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue"
import gsap from "gsap"
import * as THREE from "three"
import { useModeStore } from "../../stores/mode"
import { useLanguage } from "../../composables/useLanguage"

const { language } = useLanguage()
const store = useModeStore()

const hero = ref()
const badge = ref()
const title = ref()
const subtitle = ref()
const cta = ref()
const panel = ref()
const solarPreview = ref()
const tooltip = ref()
const tooltipName = ref("")
const tooltipRole = ref("")

const t = computed(() => {
  const en = language.value === "en"
  return {
    badge: "Frontend Developer • Game Dev • 3D Artist",
    title: en ? "Hi! The name is" : "Hai! Nama saya",
    subtitle: en
      ? "I'm a Frontend Developer, I also have passion in Game Development and 3D art."
      : "Saya seorang Frontend Developer, saya juga memiliki passion dalam Game Development dan seni 3D.",
    viewProjects: en ? "View Projects" : "Lihat Proyek",
    contactMe: en ? "Contact Me" : "Hubungi Saya",
    exploreTitle: en ? "Interactive Portfolio" : "Portfolio Interaktif",
    exploreDesc: en
      ? "Explore my projects through an interactive 3D solar system experience."
      : "Jelajahi proyek saya melalui pengalaman sistem solar 3D yang interaktif.",
    launch: en ? "Launch Solar Portfolio →" : "Buka Portfolio Solar →",
    dragHint: en ? "drag to rotate" : "drag untuk memutar",
    projectsLabel: en ? "Completed Projects" : "Proyek Selesai",
  }
})

/* ---------- three.js ---------- */
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let system: THREE.Group
let glow: THREE.Mesh
let stars: THREE.Points
let comet: THREE.Mesh
let cometMat: THREE.MeshBasicMaterial
let moon: THREE.Mesh
let rafId = 0
let resizeObserver: ResizeObserver | undefined
const clock = new THREE.Clock()

const planets: {
  mesh: THREE.Mesh
  mat: THREE.MeshStandardMaterial
  orbitMat: THREE.MeshBasicMaterial
  radius: number
  speed: number
  angle: number
  name: string
  role: Record<string, string>
}[] = []

const raycaster = new THREE.Raycaster()
const pointerNDC = new THREE.Vector2(-2, -2)
let hovered: (typeof planets)[number] | null = null

/* drag rotate + inersia */
let dragging = false
let lastX = 0
let lastY = 0
let velX = 0
let velY = 0
let rotX = -0.5
let rotY = 0

/* parallax + slow-mo */
const mouse = { x: 0, y: 0 }
let speed = 1
let targetSpeed = 1

/* komet */
let cometT = -1
let nextComet = 2.5
const cometFrom = new THREE.Vector3()
const cometTo = new THREE.Vector3()
let moonAngle = Math.random() * Math.PI * 2

function onWindowMouseMove(e: MouseEvent) {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
  mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
}

function onPointerDown(e: PointerEvent) {
  dragging = true
  lastX = e.clientX
  lastY = e.clientY
  solarPreview.value?.setPointerCapture?.(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  const el = solarPreview.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

  if (dragging) {
    velY = (e.clientX - lastX) * 0.005
    velX = (e.clientY - lastY) * 0.005
    rotY += velY
    rotX = THREE.MathUtils.clamp(rotX + velX, -1.2, -0.1)
    lastX = e.clientX
    lastY = e.clientY
  }
}

function onPointerUp() {
  dragging = false
}

function onStageLeave() {
  pointerNDC.set(-2, -2)
}

function onResize() {
  const el = solarPreview.value
  if (!el || !renderer) return
  camera.aspect = el.clientWidth / el.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(el.clientWidth, el.clientHeight)
}

function initSolar() {
  const el = solarPreview.value

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(55, el.clientWidth / el.clientHeight, 0.1, 100)
  camera.position.set(0, 6.5, 11)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(el.clientWidth, el.clientHeight)
  el.appendChild(renderer.domElement)

  scene.add(new THREE.AmbientLight(0xffffff, 2))
  scene.add(new THREE.PointLight(0xffd447, 30, 40)) // cahaya dari matahari

  system = new THREE.Group()
  system.rotation.x = rotX
  scene.add(system)

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 32, 32),
    new THREE.MeshBasicMaterial({ color: "#ffd447" })
  )
  system.add(sun)

  glow = new THREE.Mesh(
    new THREE.SphereGeometry(1.05, 32, 32),
    new THREE.MeshBasicMaterial({ color: "#ffb14d", transparent: true, opacity: 0.22 })
  )
  system.add(glow)

  const defs = [
    { radius: 2, color: "#4a90e2", speed: 1.2, name: "Nevara", role: { en: "Web Dev", id: "Web Dev" } },
    { radius: 3.5, color: "#d14f2f", speed: 0.8, name: "Pyros", role: { en: "Game Dev", id: "Game Dev" } },
    { radius: 5, color: "#57d39f", speed: 0.5, name: "Thalya", role: { en: "3D Artist", id: "Seni 3D" } },
  ]

  defs.forEach((p) => {
    const orbitMat = new THREE.MeshBasicMaterial({
      color: p.color,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    })
    const orbit = new THREE.Mesh(
      new THREE.RingGeometry(p.radius - 0.012, p.radius + 0.012, 128),
      orbitMat
    )
    orbit.rotation.x = Math.PI / 2
    system.add(orbit)

    const mat = new THREE.MeshStandardMaterial({
      color: p.color,
      emissive: p.color,
      emissiveIntensity: 0,
    })
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 24), mat)
    system.add(mesh)

    planets.push({
      mesh, mat, orbitMat,
      radius: p.radius, speed: p.speed,
      angle: Math.random() * Math.PI * 2,
      name: p.name, role: p.role,
    })
  })

  // bulan mengorbit planet pertama
  moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 12, 12),
    new THREE.MeshStandardMaterial({ color: "#cfd8e3" })
  )
  system.add(moon)

  // bintang
  const positions: number[] = []
  for (let i = 0; i < 500; i++) {
    positions.push(
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 40
    )
  }
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
  stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ size: 0.045, transparent: true, opacity: 0.85 })
  )
  scene.add(stars)

  // komet
  cometMat = new THREE.MeshBasicMaterial({ color: "#bfe3ff", transparent: true, opacity: 0 })
  comet = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), cometMat)
  scene.add(comet)

  /* interaksi */
  el.addEventListener("mouseenter", () => (targetSpeed = 0.25))
  el.addEventListener("mouseleave", () => {
    targetSpeed = 1
    onStageLeave()
  })
  el.addEventListener("pointerdown", onPointerDown)
  el.addEventListener("pointermove", onPointerMove)
  window.addEventListener("pointerup", onPointerUp)
  window.addEventListener("mousemove", onWindowMouseMove)

  resizeObserver = new ResizeObserver(onResize)
  resizeObserver.observe(el)

  rafId = requestAnimationFrame(animate)
}

function animate() {
  rafId = requestAnimationFrame(animate)

  const el = solarPreview.value
  const delta = Math.min(clock.getDelta(), 0.05)
  const elapsed = clock.getElapsedTime()

  speed += (targetSpeed - speed) * 0.06

  /* rotasi: drag + inersia + auto-rotate pelan */
  if (!dragging) {
    rotY += velY
    rotX = THREE.MathUtils.clamp(rotX + velX, -1.2, -0.1)
    velX *= 0.94
    velY *= 0.94
    rotY += delta * 0.06
  }
  system.rotation.y += (rotY - system.rotation.y) * 0.12
  system.rotation.x += (rotX + mouse.y * 0.05 - system.rotation.x) * 0.1
  system.rotation.z += (mouse.x * 0.06 - system.rotation.z) * 0.1

  /* hover raycast */
  if (dragging) {
    hovered = null
  } else if (pointerNDC.x > -1.5) {
    raycaster.setFromCamera(pointerNDC, camera)
    const hit = raycaster.intersectObjects(planets.map((p) => p.mesh))[0]
    const found = hit ? planets.find((p) => p.mesh === hit.object) ?? null : null
    if (found !== hovered) {
      hovered = found
      if (hovered) {
        tooltipName.value = hovered.name
        tooltipRole.value = hovered.role[language.value] ?? hovered.role.en
      }
    }
  }

  /* update planet */
  planets.forEach((p) => {
    p.angle += p.speed * delta * speed
    p.mesh.position.x = Math.cos(p.angle) * p.radius
    p.mesh.position.z = Math.sin(p.angle) * p.radius

    const isHover = p === hovered
    p.mesh.scale.setScalar(THREE.MathUtils.lerp(p.mesh.scale.x, isHover ? 1.8 : 1, 0.15))
    p.mat.emissiveIntensity = THREE.MathUtils.lerp(p.mat.emissiveIntensity, isHover ? 0.7 : 0, 0.15)
    p.orbitMat.opacity = THREE.MathUtils.lerp(p.orbitMat.opacity, isHover ? 0.65 : 0.22, 0.15)
  })

  /* bulan */
  if (planets[0] && moon) {
    moonAngle += delta * 3
    moon.position.set(
      planets[0].mesh.position.x + Math.cos(moonAngle) * 0.42,
      Math.sin(moonAngle * 0.7) * 0.08,
      planets[0].mesh.position.z + Math.sin(moonAngle) * 0.42
    )
  }

  glow.scale.setScalar(1 + Math.sin(elapsed * 2.4) * 0.04)
  stars.rotation.y += delta * 0.02

  /* komet */
  if (cometT < 0 && elapsed > nextComet) {
    cometFrom.set((Math.random() - 0.5) * 18, 3 + Math.random() * 4, -6 - Math.random() * 4)
    cometTo.set(cometFrom.x - 12, cometFrom.y - 4, cometFrom.z + 8)
    cometT = 0
  }
  if (cometT >= 0) {
    cometT += delta / 2.2
    if (cometT >= 1) {
      cometT = -1
      nextComet = elapsed + 4 + Math.random() * 6
    } else {
      comet.position.lerpVectors(cometFrom, cometTo, cometT)
      const fade = Math.sin(cometT * Math.PI)
      cometMat.opacity = fade
      comet.scale.setScalar(0.5 + fade)
    }
  }

  /* tooltip ngikutin posisi planet */
  const tip = tooltip.value
  if (tip) {
    if (hovered && el) {
      const v = new THREE.Vector3()
      hovered.mesh.getWorldPosition(v).project(camera)
      tip.style.left = (v.x * 0.5 + 0.5) * el.clientWidth + "px"
      tip.style.top = (-v.y * 0.5 + 0.5) * el.clientHeight + "px"
      tip.classList.add("show")
    } else {
      tip.classList.remove("show")
    }
  }

  renderer.render(scene, camera)
}

function launchSolar() {
  if (window.innerWidth <= 920) {
    store.setMode("solar")
    return
  }

  const el = solarPreview.value
  const rect = el.getBoundingClientRect()
  window.solarTargetRect = rect

  renderer.render(scene, camera)
  const snapshot = renderer.domElement.toDataURL()

  const clone = document.createElement("div")
  Object.assign(clone.style, {
    position: "fixed",
    left: rect.left + "px",
    top: rect.top + "px",
    width: rect.width + "px",
    height: rect.height + "px",
    zIndex: 9999,
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#090a10",
    backgroundImage: `url(${snapshot})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  })
  document.body.appendChild(clone)

  gsap.to(hero.value, { opacity: 0, duration: 0.7, ease: "power2.out" })

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
    },
  })
}

onMounted(() => {
  window.solarPreviewEl = solarPreview.value
  initSolar()

    if (window.__solarReturning) return

  gsap
    .timeline({ defaults: { ease: "power3.out" } })
    .from(badge.value, { opacity: 0, y: 10, duration: 0.45 })
    .from(title.value, { opacity: 0, y: 24, duration: 0.7 }, "-=0.2")
    .from(subtitle.value, { opacity: 0, y: 18, duration: 0.55 }, "-=0.35")
    .from(cta.value, { opacity: 0, y: 16, duration: 0.5 }, "-=0.25")
    .from(panel.value, { opacity: 0, y: 28, duration: 0.7 }, "-=0.45")
  })

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  resizeObserver?.disconnect()
  window.removeEventListener("mousemove", onWindowMouseMove)
  window.removeEventListener("pointerup", onPointerUp)

  scene?.traverse((obj: any) => {
    obj.geometry?.dispose()
    if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose())
    else obj.material?.dispose()
  })
  renderer?.dispose()
  renderer?.domElement.remove()
})
</script>

<style scoped>
/* ============ HERO ============ */
.hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr);
  gap: 56px;
  align-items: center;
  min-height: 92vh;
  padding: 120px 40px 72px;
  overflow: hidden;
  background:
    radial-gradient(900px 500px at 80% 15%, rgba(74, 144, 226, 0.08), transparent 60%),
    radial-gradient(700px 420px at 8% 90%, rgba(0, 200, 83, 0.07), transparent 60%),
    var(--bg);
}

.hero-copy {
  width: min(720px, 100%);
  justify-self: end;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  margin: 0 0 18px;
  padding: 8px 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--border-dim);
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.03em;
}

.eyebrow::before {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--primary);
  box-shadow: 0 0 10px var(--primary);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  50% { opacity: 0.35; transform: scale(0.75); }
}

h1 {
  margin: 0;
  color: var(--text);
  font-size: clamp(2.4rem, 5vw, 4rem);
  line-height: 1.05;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.gradient-text {
  background: linear-gradient(92deg, var(--primary) 10%, #4a9fe2 55%, #7c6cff 95%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
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
  padding: 0 20px;
  border-radius: 10px;
  color: var(--text);
  font-size: 0.95rem;
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.cta a:hover { transform: translateY(-2px); }
.cta a:active { transform: translateY(0) scale(0.97); }

.primary {
  background: var(--primary);
  box-shadow: 0 8px 24px -8px var(--primary);
}

.primary:hover { box-shadow: 0 14px 34px -8px var(--primary); }

.secondary {
  border: 1px solid var(--border);
  background: var(--border-dim);
}

/* ============ PANEL ============ */
.hero-panel {
  width: min(480px, 100%);
  justify-self: start;
  overflow: hidden;
  will-change: transform;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--bg-surface);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
}

.panel-top {
  display: flex;
  align-items: center;
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

.panel-top span:nth-child(2) { background: #f0b84c; }
.panel-top span:nth-child(3) { background: #57d39f; }

.panel-top em {
  margin-left: auto;
  color: var(--text-muted);
  font-size: 0.7rem;
  font-style: normal;
  font-weight: 700;
  opacity: 0.7;
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
  border-radius: 12px;
  background: var(--bg-card);
  overflow: hidden;
}

/* ============ STAGE 3D ============ */
.large {
  grid-row: span 2;
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
  height: 218px;
  margin-top: 14px;
  overflow: hidden;
  border-radius: 8px;
  cursor: grab;
  touch-action: pan-y;
  background:
    radial-gradient(circle at center, rgba(57, 130, 246, 0.1), transparent 60%),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    #090a10;
  background-size: 100%, 28px 28px, 28px 28px, 100%;
}

.preview-stage:active { cursor: grabbing; }

.preview-stage canvas {
  display: block;
}

.solar-tooltip {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  pointer-events: none;
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: rgba(9, 10, 16, 0.92);
  color: var(--text);
  font-size: 0.72rem;
  font-weight: 800;
  line-height: 1.3;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.solar-tooltip.show { opacity: 1; }

.solar-tooltip small {
  display: block;
  color: var(--primary);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.drag-hint {
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 3;
  pointer-events: none;
  padding: 5px 10px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: rgba(9, 10, 16, 0.7);
  color: var(--text-muted);
  font-size: 0.65rem;
  font-weight: 700;
  backdrop-filter: blur(4px);
}

/* ============ METRIC & STACK ============ */
.metric,
.stack {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 18px;
}

.metric strong {
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(120deg, var(--text), var(--primary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.metric span {
  margin-top: 8px;
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1.2;
}

.stack { gap: 7px; }

.stack span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 800;
  line-height: 1.2;
}

.stack span::before {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 999px;
}

/* warna titik = warna planetnya */
.stack span:nth-child(1)::before { background: #4a90e2; box-shadow: 0 0 8px #4a90e2; }
.stack span:nth-child(2)::before { background: #d14f2f; box-shadow: 0 0 8px #d14f2f; }
.stack span:nth-child(3)::before { background: #57d39f; box-shadow: 0 0 8px #57d39f; }

/* ============ EXPLORE ============ */
.explore {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
}

.explore h3 {
  margin: 0;
  color: var(--text);
  font-size: 1rem;
}

.explore p {
  margin: 8px 0 16px;
  color: var(--text-muted);
  line-height: 1.6;
  font-size: 0.9rem;
}

.explore-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 13px 18px;
  border: none;
  border-radius: 10px;
  background: var(--primary);
  color: var(--text);
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.explore-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px -6px var(--primary);
}

.explore-btn:active { transform: translateY(0) scale(0.98); }

.explore-btn:focus-visible,
.cta a:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}

/* ============ RESPONSIVE ============ */
@media (max-width: 920px) {
  .hero {
    grid-template-columns: 1fr;
    min-height: auto;
    padding: 90px 20px 56px;
    gap: 40px;
  }

  .hero-copy,
  .hero-panel {
    justify-self: stretch;
    width: 100%;
  }

  .subtitle { font-size: 1rem; line-height: 1.7; }

  .preview-stage { height: 200px; }
}

@media (max-width: 560px) {
  .hero { padding: 80px 16px 40px; gap: 32px; }

  .cta { flex-direction: column; gap: 10px; }
  .cta a { width: 100%; min-height: 48px; }

  .panel-grid {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 12px;
  }

  .large { grid-row: auto; }
  .preview-stage { height: 160px; }
  .explore { grid-column: auto; }
  .explore-btn { width: 100%; }
  .metric strong { font-size: 1.9rem; }
}

@media (prefers-reduced-motion: reduce) {
  .eyebrow::before { animation: none; }
}
</style>