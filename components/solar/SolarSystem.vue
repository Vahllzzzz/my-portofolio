<template>
  <div class="solar-system">
    <h1 class="title">3D Solar System Portfolio</h1>
    <div v-if="selectedPlanet" class="left-panel">
      <div class="planet-preview" :style="{background:selectedPlanet.color}"></div>
      <h2>{{ selectedPlanet.name }}</h2>
      <p>{{ selectedPlanet.section }}</p>
    </div>

    <div ref="container" class="canvas-container"></div>

    <div v-if="selectedPlanet" class="right-panel">
      <h2>{{ selectedPlanet.name }}</h2>
      <p>{{ selectedPlanet.description }}</p>
        <button @click="resetView">Back to Solar System</button>
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

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let frame = 0
let resize: (() => void) | null = null

const planets = [
{ name:"Mercury", section:"About Me", description:"My name is Reihan Azka Vahlepy, I'm a student in SMK ASSALAAM BANDUNG, I'm a Frontend Developer, 3D Artist, Beginner Game Developer.", color:"#b3b3b3", radius:5, speed:1 },
{ name:"Venus", section:"Skills", description:"HTML5, CSS3, PHP, JavaScript, Nuxt, Three.js, GSAP.", color:"#d7ba7d", radius:8, speed:.8 },
{ name:"Earth", section:"Projects", description:"Featured projects.", color:"#4a90e2", radius:11, speed:.7 },
{ name:"Mars", section:"Game Dev", description:"Game development journey.", color:"#d14f2f", radius:14, speed:.55 },
{ name:"Jupiter", section:"Web Apps", description:"Large web projects.", color:"#c89d6f", radius:18, speed:.45 },
{ name:"Saturn", section:"3D Art", description:"Models and renders.", color:"#d9c98f", radius:23, speed:.35 },
{ name:"Uranus", section:"Experiments", description:"Creative prototypes.", color:"#8fdde3", radius:28, speed:.28 },
{ name:"Neptune", section:"Contact", description:"Links and contact info.", color:"#4169ff", radius:33, speed:.22 }
]

const meshes: THREE.Mesh[] = []
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

function resetView(){
  selectedPlanet.value = null
  focusedPlanet.value = null
  meshes.forEach(m => {

  const mat =
    m.material as THREE.MeshStandardMaterial

  mat.transparent = false
  mat.opacity = 1
})
}

onMounted(() => {
  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, .1, 1000)
  camera.position.set(0,12,45)

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
      new THREE.SphereGeometry(.8,32,32),
      new THREE.MeshStandardMaterial({
  color:p.color,
  roughness:1,
  metalness:0
})
    )
    mesh.userData = p
    if (p.name === "Saturn") {

  const ring = new THREE.Mesh(

    new THREE.RingGeometry(
      1.2,
      2.1,
      64
    ),

    new THREE.MeshBasicMaterial({
      color: "#d9c98f",
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    })
  )

  ring.rotation.x =
    Math.PI / 2.7

  mesh.add(ring)
}
    meshes.push(mesh)
    scene.add(mesh)
  })

  function click(e:MouseEvent){
    const r = renderer.domElement.getBoundingClientRect()
    mouse.x=((e.clientX-r.left)/r.width)*2-1
    mouse.y=-((e.clientY-r.top)/r.height)*2+1
    raycaster.setFromCamera(mouse,camera)
    const hits = raycaster.intersectObjects(meshes)
    const hit = hits[0]
    if(hit){
      focusedPlanet.value = hit.object as THREE.Mesh
      selectedPlanet.value = focusedPlanet.value.userData
      meshes.forEach(m => {

  const mat =
    m.material as THREE.MeshStandardMaterial

  if (m === focusedPlanet.value) {

    mat.transparent = false
    mat.opacity = 1

  } else {

    mat.transparent = true
    mat.opacity = 0.15
  }
})
    }
  }

  renderer.domElement.addEventListener("click", click)

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

  meshes.forEach(mesh=>{

    const d:any = mesh.userData

    mesh.position.x =
      Math.cos(t * d.speed) *
      d.radius

    mesh.position.z =
      Math.sin(t * d.speed) *
      d.radius
  })
}

    if(focusedPlanet.value){
      const p = focusedPlanet.value.position
camera.position.lerp(
  new THREE.Vector3(
    p.x + 3,
    p.y + 1.5,
    p.z + 4
  ),
  0.015
)
      camera.lookAt(p)
    }else{
      camera.position.lerp(new THREE.Vector3(0,12,45),0.02)
      camera.lookAt(0,0,0)
    }

    renderer.render(scene,camera)
  }
  animate()

  resize=()=>{
    camera.aspect=window.innerWidth/window.innerHeight
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
.solar-system{position:relative;height:100vh;background:#05070b;overflow:hidden}
.canvas-container{width:100%;height:100%}
.title{position:absolute;top:20px;left:50%;transform:translateX(-50%);color:white;z-index:10}
.left-panel,.right-panel{
position:absolute;top:50%;transform:translateY(-50%);
width:300px;padding:20px;color:white;z-index:10;
background:rgba(255,255,255,.06);
backdrop-filter:blur(10px);
border:1px solid rgba(255,255,255,.1);
border-radius:16px}
.left-panel{left:20px}
.right-panel{right:20px}
.planet-preview{height:220px;border-radius:12px;margin-bottom:12px}
button{padding:10px 16px;border:none;border-radius:10px;cursor:pointer}
@media(max-width:1000px){.left-panel,.right-panel{display:none}}
</style>
