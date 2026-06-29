<template>
  <div class="solar-system">
    <h1 class="title">3D Solar System Portfolio</h1>
    
    <!-- Desktop Panels -->
    <div v-if="selectedPlanet" class="left-panel desktop-panel">
      <div class="planet-preview" :style="{background:selectedPlanet.color}"></div>
      <h2>{{ selectedPlanet.name }}</h2>
      <p>{{ selectedPlanet.section }}</p>
    </div>

    <div ref="container" class="canvas-container"></div>

    <div v-if="selectedPlanet" class="right-panel desktop-panel">
      <h2>{{ selectedPlanet.name }}</h2>
      <p>{{ selectedPlanet.description }}</p>
      <button @click="resetView">Back to Solar System</button>
    </div>

    <!-- Mobile Bottom Panel -->
    <Transition name="slide-up">
      <div v-if="selectedPlanet" class="mobile-panel">
        <div class="mobile-panel-header">
          <div class="planet-indicator" :style="{background:selectedPlanet.color}"></div>
          <div class="planet-info">
            <h2>{{ selectedPlanet.name }}</h2>
            <span>{{ selectedPlanet.section }}</span>
          </div>
          <button class="close-btn" @click="resetView">✕</button>
        </div>
        <p class="planet-description">{{ selectedPlanet.description }}</p>
      </div>
    </Transition>

    <!-- Mobile Instructions -->
    <div v-if="!selectedPlanet" class="mobile-instructions">
      <p>{{ instructions }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import * as THREE from "three"
import gsap from "gsap"
import { useModeStore } from "../../stores/mode"
import { storeToRefs } from "pinia"

declare global {
  interface Window {
    solarPreviewEl: HTMLElement
    solarTargetRect: DOMRect
  }
}

const store = useModeStore()

const { paused } =
  storeToRefs(store)

const container = ref<HTMLElement | null>(null)
const selectedPlanet = ref<any>(null)
const focusedPlanet = ref<THREE.Mesh | null>(null)
const instructions = ref("Tap on a planet to explore")

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let frame = 0
let resize: (() => void) | null = null
let isMobile = false

const planets = [
{ 
  name:"Mercury", 
  section:"About Me", 
  description:"Hi! I'm Reihan Azka Vahlepy, a passionate Frontend Developer from SMK ASSALAAM BANDUNG. I specialize in creating beautiful, interactive web experiences using modern technologies. Beyond coding, I explore 3D art and game development to bring creative visions to life.", 
  color:"#b3b3b3", 
  radius:5, 
  speed:1, 
  size: 0.5 
},
{ 
  name:"Venus", 
  section:"Skills & Technologies", 
  description:"Frontend: HTML5, CSS3, JavaScript, TypeScript, Vue.js, Nuxt.js • 3D & Animation: Three.js, GSAP, WebGL, Canvas API • Backend: PHP, Python, Java • Tools: Git, npm, Vite, Chrome DevTools • Creative: Blender, Unity basics, game design fundamentals", 
  color:"#d7ba7d", 
  radius:8, 
  speed:.8, 
  size: 0.7 
},
{ 
  name:"Earth", 
  section:"Featured Projects", 
  description:"Interactive Solar Portfolio: This 3D solar system built with Three.js and Nuxt • E-Commerce Platform: Full-stack Laravel application with product management and payment integration • Motion UI Kit: Reusable GSAP animation components and patterns • Responsive Portfolio: Modern design with theme switching and multi-language support", 
  color:"#4a90e2", 
  radius:11, 
  speed:.7, 
  size: 0.8 
},
{ 
  name:"Mars", 
  section:"Game Development", 
  description:"Exploring game development with Unity and Unreal Engine. Currently learning: 3D environment design, character controllers, physics systems, and interactive gameplay mechanics. Working on small prototype projects to understand game architecture and player experience design.", 
  color:"#d14f2f", 
  radius:14, 
  speed:.55, 
  size: 0.65 
},
{ 
  name:"Jupiter", 
  section:"Web Applications", 
  description:"Building large-scale web applications with focus on: Performance optimization and code splitting • State management with Pinia • RESTful API integration • Responsive design patterns • Accessibility compliance (WCAG) • Progressive Web App features • Real-time updates with WebSockets", 
  color:"#c89d6f", 
  radius:18, 
  speed:.45, 
  size: 1.2 
},
{ 
  name:"Saturn", 
  section:"3D Art & Design", 
  description:"Creating 3D models and renders using Blender. Skills include: Low-poly and high-poly modeling • UV mapping and texturing • Lighting and scene composition • Materials and shaders • Basic rigging and animation • Rendering optimization for web and real-time applications", 
  color:"#d9c98f", 
  radius:23, 
  speed:.35, 
  size: 1.0 
},
{ 
  name:"Uranus", 
  section:"Experiments & Prototypes", 
  description:"Creative explorations and experimental projects: WebGL shaders and visual effects • Procedural generation algorithms • Interactive data visualizations • Particle systems • Physics simulations • Generative art with Canvas API • Audio-reactive animations", 
  color:"#8fdde3", 
  radius:28, 
  speed:.28, 
  size: 0.85 
},
{ 
  name:"Neptune", 
  section:"Let's Connect", 
  description:"I'm available for freelance projects, collaborations, and full-time opportunities. Feel free to reach out! • Email: hannvahll09@gmail.com • GitHub: github.com/Vahllzzzz • LinkedIn: Connect with me for professional networking • Always open to discussing new ideas and interesting projects", 
  color:"#4169ff", 
  radius:33, 
  speed:.22, 
  size: 0.85 
}
]

const meshes: THREE.Mesh[] = []
const hitboxes: THREE.Mesh[] = [] // Invisible larger spheres for easier clicking
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

function resetView(){
  selectedPlanet.value = null
  focusedPlanet.value = null
  instructions.value = "Tap on a planet to explore"
  meshes.forEach(m => {
    const mat = m.material as THREE.MeshStandardMaterial
    mat.transparent = false
    mat.opacity = 1
  })
}

onMounted(() => {
  // Detect mobile
  isMobile = window.innerWidth <= 920

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(
    isMobile ? 85 : 75, 
    window.innerWidth/window.innerHeight, 
    .1, 
    1000
  )
  
  // Adjust camera position for mobile
  if (isMobile) {
    camera.position.set(0, 15, 50)
  } else {
    camera.position.set(0, 12, 45)
  }

  renderer = new THREE.WebGLRenderer({antialias:true})
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value?.appendChild(renderer.domElement)

  scene.add(new THREE.AmbientLight(0xffffff, 2))

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(2.5,64,64),
    new THREE.MeshBasicMaterial({color:"#ffd447"})
  )
  scene.add(sun)

  const starsGeo = new THREE.BufferGeometry()
  const stars = []
  for(let i=0;i<3000;i++){
    stars.push((Math.random()-.5)*500,(Math.random()-.5)*500,(Math.random()-.5)*500)
  }
  starsGeo.setAttribute("position", new THREE.Float32BufferAttribute(stars,3))
  scene.add(new THREE.Points(starsGeo,
    new THREE.PointsMaterial({color:"#ffffff", size:.6, transparent:true, opacity:.9
})
  ))

  planets.forEach(p=>{
    const orbit = new THREE.Mesh(
      new THREE.RingGeometry(p.radius-.03,p.radius+.03,128),
      new THREE.MeshBasicMaterial({
        color:"#4a90e2",
        transparent:true,
        opacity:.35,
        side:THREE.DoubleSide
      })
    )
    orbit.rotation.x = Math.PI/2
    scene.add(orbit)
    orbit.position.y = -0.02

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(p.size,32,32),
      new THREE.MeshStandardMaterial({
        color:p.color,
        roughness:1,
        metalness:0,
        emissive: p.color,
        emissiveIntensity: 0.2
      })
    )
    mesh.userData = p
    
    // Create invisible hitbox (larger sphere for easier clicking)
    const hitbox = new THREE.Mesh(
      new THREE.SphereGeometry(p.size * 2.5, 16, 16), // 2.5x larger for easier clicks
      new THREE.MeshBasicMaterial({
        visible: false // Invisible but still detectable by raycaster
      })
    )
    hitbox.userData = p
    
    if (p.name === "Saturn") {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(
          p.size * 1.5,
          p.size * 2.6,
          64
        ),
        new THREE.MeshBasicMaterial({
          color: "#d9c98f",
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9
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

  function click(e:MouseEvent|TouchEvent){
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    const r = renderer.domElement.getBoundingClientRect()
    mouse.x=((clientX-r.left)/r.width)*2-1
    mouse.y=-((clientY-r.top)/r.height)*2+1
    raycaster.setFromCamera(mouse,camera)
    
    // Check hitboxes first (easier to click)
    const hitboxHits = raycaster.intersectObjects(hitboxes)
    const hit = hitboxHits[0]
    
    if(hit){
      // Find the corresponding visible mesh
      const planetData = hit.object.userData
      const correspondingMesh = meshes.find(m => m.userData.name === planetData.name)
      
      if (correspondingMesh) {
        focusedPlanet.value = correspondingMesh
        selectedPlanet.value = planetData
        instructions.value = "Tap close or outside to return"
        
        // Visual feedback
        meshes.forEach(m => {
          const mat = m.material as THREE.MeshStandardMaterial
          if (m === focusedPlanet.value) {
            mat.transparent = false
            mat.opacity = 1
            mat.emissiveIntensity = 0.4 // Brighter when selected
          } else {
            mat.transparent = true
            mat.opacity = 0.15
            mat.emissiveIntensity = 0.1
          }
        })
      }
    }
  }

  renderer.domElement.addEventListener("click", click)
  renderer.domElement.addEventListener("touchstart", click as any)

  let lastTime = performance.now()

  const animate = ()=>{
    frame=requestAnimationFrame(animate)
    
    const currentTime = performance.now()
    const delta = (currentTime - lastTime) / 1000
    lastTime = currentTime

if (!paused.value) {
  simulationTime += delta
}

const t = simulationTime

if(!paused.value){
  meshes.forEach((mesh, index)=>{
    const d:any = mesh.userData
    const angle = t * d.speed
    
    mesh.position.x = Math.cos(angle) * d.radius
    mesh.position.z = Math.sin(angle) * d.radius
    
    // Update corresponding hitbox position
    hitboxes[index].position.copy(mesh.position)
    
    // Subtle rotation
    mesh.rotation.y += 0.01
  })
}

    if(focusedPlanet.value){
      const p = focusedPlanet.value.position
      const offset = isMobile ? 5 : 4
      const yOffset = isMobile ? 2 : 1.5
      camera.position.lerp(
        new THREE.Vector3(
          p.x + offset,
          p.y + yOffset,
          p.z + offset
        ),
        0.015
      )
      camera.lookAt(p)
    }else{
      const defaultPos = isMobile 
        ? new THREE.Vector3(0, 15, 50) 
        : new THREE.Vector3(0, 12, 45)
      camera.position.lerp(defaultPos, 0.02)
      camera.lookAt(0,0,0)
    }

    renderer.render(scene,camera)
  }
  animate()

  resize=()=>{
    isMobile = window.innerWidth <= 920
    camera.aspect=window.innerWidth/window.innerHeight
    camera.fov = isMobile ? 85 : 75
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
  }
  window.addEventListener("resize",resize)
})

onUnmounted(()=>{
  if (frame) {
    cancelAnimationFrame(frame)
  }
  if (resize) {
    window.removeEventListener("resize", resize)
  }
})

let simulationTime = 0

function backToPro() {

  const rect =
    window.solarTargetRect

  if (!rect) {

    store.setMode("pro")
    return
  }

  const clone =
    renderer.domElement.cloneNode(true) as HTMLCanvasElement

  document.body.appendChild(clone)

  Object.assign(clone.style, {
    position: "fixed",
    left: "0px",
    top: "0px",
    width: "100vw",
    height: "100vh",
    zIndex: "99999",
    pointerEvents: "none"
  })

  gsap.to(clone, {

    left: rect.left + "px",
    top: rect.top + "px",

    width: rect.width + "px",
    height: rect.height + "px",

    borderRadius: "12px",

    duration: 1,

    ease: "power3.inOut",

    onComplete() {

      store.setMode("pro")

      clone.remove()
    }
  })
}
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

button {
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background: rgba(0, 200, 83, 1);
  color: white;
  font-weight: 800;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 200, 83, 0.3);
}

button:hover {
  background: rgba(0, 220, 90, 1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 200, 83, 0.4);
}

button:active {
  transform: translateY(0);
}

/* Mobile Panel */
.mobile-panel {
  display: none;
}

.mobile-instructions {
  display: none;
}

/* Desktop only */
.desktop-panel {
  display: block;
}

/* Mobile Styles */
@media (max-width: 920px) {
  .desktop-panel {
    display: none;
  }

  .title {
    font-size: 1rem;
    top: 15px;
    padding: 10px 20px;
  }

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
    padding: 24px 20px 24px;
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
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.3),
      inset 0 2px 8px rgba(255, 255, 255, 0.2);
    position: relative;
  }

  .planet-indicator::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 60%);
  }

  .planet-info {
    flex: 1;
    min-width: 0;
  }

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
    letter-spacing: 0.02em;
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

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .close-btn:active {
    transform: scale(0.95);
  }

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
