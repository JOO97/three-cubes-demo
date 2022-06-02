import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import * as dat from 'dat.gui'

import { nodes, edges } from './json/data.json'

const gui = new dat.GUI({ width: 400 })

const canvas = document.getElementById('canvas')

const windowSize = {
  width: window.innerWidth,
  height: window.innerHeight
}

let camera,
  renderer,
  scene,
  controls,
  directionLight,
  ambientLight = null

/**
 * textureLoader
 */
const textureLoader = new THREE.TextureLoader().setPath(
  '/assets/sn-cp-platform3d/textures/'
)
const init = () => {
  //renderer
  renderer = new THREE.WebGLRenderer({
    canvas
  })
  renderer.setSize(windowSize.width, windowSize.height)
  renderer.clearColor()
  //scene
  scene = new THREE.Scene()
  // scene.background = new THREE.CubeTextureLoader()
  //   .setPath('assets/sn-cp-platform3d/skyboxes/DeepAsh/')
  //   .load([
  //     'posx.jpg',
  //     'negx.jpg',
  //     'posy.jpg',
  //     'negy.jpg',
  //     'posz.jpg',
  //     'negz.jpg'
  //   ])
  scene.background = new THREE.Color('#242e38')
  //camera
  camera = new THREE.PerspectiveCamera(
    45,
    windowSize.width / windowSize.height,
    0.01,
    100
  )
  camera.position.set(1, 1, 2)

  controls = new OrbitControls(camera, renderer.domElement)

  //light
  ambientLight = new THREE.AmbientLight({ color: 0xffffff, intensity: 5 })
  gui
    .add(ambientLight, 'intensity')
    .min(0.1)
    .max(10)
    .step(0.1)
    .name('ambientLight intensity')

  // directionLight = new THREE.DirectionalLight(0xffffff, 5)
  // directionLight.position.set(0, 1.2, 1)
  // directionLight.castShadow = true
  // directionLight.shadow.mapSize.width = 1024
  // directionLight.shadow.mapSize.height = 1024
  // gui.add(directionLight.position, 'x').min(-30).max(30).step(0.001)
  // gui.add(directionLight.position, 'y').min(-30).max(30).step(0.001)
  // gui.add(directionLight.position, 'z').min(-30).max(30).step(0.001)
  // scene.add(new THREE.DirectionalLightHelper(directionLight, 5))

  scene.add(ambientLight, camera, new THREE.AxesHelper())

  animate()
}

const animate = () => {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  controls.update()
}

const createObjects = () => {
  const group = new THREE.Group()
  const texture = textureLoader.load('circuit.jpg')

  //box
  const boxGeometry = new THREE.BoxBufferGeometry(2, 2, 0.03)
  const boxMaterial = new THREE.MeshBasicMaterial({
    color: 0x39c2ec,
    transparent: true,
    map: texture,
    opacity: 0.3
  })
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
  boxMesh.rotation.x = Math.PI / 2
  //plane
  const planeGeometry = new THREE.PlaneBufferGeometry(1.5, 1.5)
  const planeMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: texture
  })
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
  planeMesh.position.y = 0.0151
  planeMesh.rotation.x = Math.PI / 2
  //cube
  const cubeGeometry = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1)
  const cubeMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load('poly.jpg')
  })
  const cubeGroup = new THREE.Group()
  const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
  // gui.add(cubeMesh.position, 'y').min(-1).max(1).step(0.001).name('cube y')
  cubeMesh.position.set(0, 0.08, 0)

  new FontLoader().load(
    '/assets/font/Alibaba PuHuiTi H_Regular.json',
    (font) => {
      const textMesh = new THREE.Mesh(
        new TextGeometry('TEST', {
          font,
          size: 0.1,
          height: 0.2,
          weight: 'normal',
          style: 'normal',
          curveSegments: 12,
          bevelThickness: 0.1,
          bevelSize: 0.1,
          curveSegments: 20,
          bevelEnabled: !1
        }),
        new THREE.MeshPhongMaterial({
          color: 0xffffff
        })
      )
      textMesh.position.set(0, 0.2, 0)
      textMesh.scale.set(0.1, 0.1, 0.1)
      scene.add(textMesh)
      console.log('textMesh', textMesh)
      gui
        .add(textMesh.position, 'y')
        .min(-1)
        .max(1)
        .step(0.001)
        .name('textMesh y')
    }
  )
  group.add(boxMesh, cubeGroup, cubeMesh)
  scene.add(group)
}

init()
createObjects()
