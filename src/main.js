import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import * as dat from 'dat.gui'

import vertexShader from './shader/vertex.glsl'
import fragmentShader from './shader/fragment.glsl'

import data from './json/data.json'

const gui = new dat.GUI({ width: 400 })

const canvas = document.getElementById('canvas')

const windowSize = {
  width: window.innerWidth,
  height: window.innerHeight
}
//鼠标位置
const mouse = {
  x: null,
  y: null
}

/**
 * textureLoader
 */
const textureLoader = new THREE.TextureLoader().setPath(
  '/assets/sn-cp-platform3d/textures/'
)

let camera,
  renderer,
  scene,
  controls,
  directionLight,
  ambientLight,
  font = null

const cubes = []
const cubeMaps = [
  textureLoader.load('poly.jpg'),
  textureLoader.load('resource-usa86.png')
]

const tubeMaterial = new THREE.ShaderMaterial({
  color: 0xee0000,
  // transparent: true,
  // opacity: 0.5,
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: textureLoader.load('resource-3exds.png') }
  }
})

//Raycaster
const raycaster = new THREE.Raycaster()

/**
 * create objects
 */
const createObjects = () => {
  const group = new THREE.Group()
  const texture = textureLoader.load('circuit.jpg')
  const planeMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: texture
  })
  const { layers } = data
  layers.forEach((layer, index) => {
    //flatten box
    const boxGeometry = new THREE.BoxBufferGeometry(
      layer.size,
      layer.size,
      0.02
    )
    const boxMaterialArr = []
    const positionAttribute = boxGeometry.getAttribute('position')
    const colors = []
    const color = new THREE.Color()
    for (let i = 0; i < positionAttribute.count; i += 3) {
      color.set(i < 12 ? layer.colors.sub : layer.colors.main)
      const transparent = i < 12 ? false : true
      boxMaterialArr.push(
        new THREE.MeshBasicMaterial({
          transparent,
          opacity: 0.3,
          vertexColors: true
        })
      )
      colors.push(color.r, color.g, color.b)
      colors.push(color.r, color.g, color.b)
      colors.push(color.r, color.g, color.b)
    }
    boxGeometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3)
    )
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterialArr)
    const boxY = index * 0.6
    boxMesh.position.y = boxY
    boxMesh.rotation.x = Math.PI / 2
    //texture plane
    const planeGeometry = new THREE.PlaneBufferGeometry(
      layer.size * 0.8,
      layer.size * 0.8
    )
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
    planeMesh.position.y = boxY - 0.009
    planeMesh.rotation.x = Math.PI / 2

    //text
    const textGeometry = new TextGeometry(layer.name, {
      font,
      size: 0.1,
      height: 0.2
    })
    textGeometry.center()

    const textMesh = new THREE.Mesh(
      textGeometry,
      new THREE.MeshStandardMaterial({
        color: 0xffffff
      })
    )
    textMesh.scale.set(0.7, 0.7, 0.05)
    textMesh.position.set(0, boxY + 0.1, (layer.size * 0.9) / 2)

    boxMesh.userData = layer

    //cube
    createCubes(boxMesh)
    group.add(boxMesh, planeMesh, textMesh)
  })

  //flying lines
  createFlyingLines()
  scene.add(group)
}

/**
 * create cubes
 */
const createCubes = (pMesh) => {
  const currentCubes = data.cubes.filter(
    ({ layerId }) => layerId === pMesh.userData.id
  )
  const columns = Math.floor(Math.sqrt(currentCubes.length))
  let rows = Math.floor(currentCubes.length / columns)
  if (columns * rows < currentCubes.length) rows += 1
  const cubeSize = 0.12
  const cubeGroup = new THREE.Group()
  const pos = {
    x: pMesh.position.x - (pMesh.userData.size * 0.55) / 2 + cubeSize / 2,
    y: pMesh.position.y,
    z: pMesh.position.z - (pMesh.userData.size * 0.55) / 2 + cubeSize / 2
  }
  let count = 0
  for (let column = 0; column < columns; column++) {
    for (let row = 0; row < rows; row++) {
      count++
      if (count > currentCubes.length) return
      const cubeGeometry = new THREE.BoxBufferGeometry(
        cubeSize,
        cubeSize,
        cubeSize
      )
      const cubeMaterial = new THREE.MeshBasicMaterial({
        map: cubeMaps[0]
      })
      const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)

      const cubePos = {
        x: pos.x + column * (cubeSize + pMesh.userData.size / columns / 2.5),
        y: pos.y + 0.075,
        z: pos.z + row * (cubeSize + pMesh.userData.size / rows / 4)
      }
      cubeMesh.position.set(cubePos.x, cubePos.y, cubePos.z)
      cubeMesh.userData = {
        ...currentCubes[count - 1],
        clickable: true
      }
      cubes.push(cubeMesh)
      const textGeometry = new TextGeometry(`TEST-${row + 1}-${column + 1}`, {
        font,
        size: 0.1,
        height: 0.2
      })
      textGeometry.center()
      const textMesh = new THREE.Mesh(
        textGeometry,
        new THREE.MeshPhongMaterial({
          color: 0xffffff
        })
      )
      textMesh.scale.set(0.273, 0.273, 0.01)
      textMesh.position.set(cubePos.x, cubePos.y + 0.1, cubePos.z)
      cubeGroup.add(cubeMesh, textMesh)
    }
    scene.add(cubeGroup)
  }
}

class CustomSinCurve extends THREE.Curve {
  constructor(scale = 1) {
    super()

    this.scale = scale
  }

  getPoint(t, optionalTarget = new THREE.Vector3()) {
    const tx = t * 3 - 1.5
    const ty = Math.sin(Math.PI * t)
    const tz = 0
    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale)
  }
}

/**
 * create flying lines
 */
const createFlyingLines = () => {
  const { edges } = data
  let mesh = null
  const pos = {
    x: 0,
    y: 0,
    z: 0
  }

  edges.forEach((edge) => {
    const sourceCube = cubes.find((item) => item.userData.id === edge.source)
    const targetCube = cubes.find((item) => item.userData.id === edge.target)

    // function update() {
    //   console.log('mesh', mesh)
    //   if (mesh) {
    //     scene.remove(mesh)
    //     mesh = null
    //   }
    // }
    const geometry = new THREE.TubeGeometry(
      new THREE.QuadraticBezierCurve3(
        sourceCube.position,
        new THREE.Vector3(
          // pos.x,
          // pos.y,
          // pos.z,
          0.02,
          sourceCube.position.y + 0.1,
          0.02
        ),
        targetCube.position
      ),
      20,
      0.005,
      8,
      false
    )
    // const tubeTexture = textureLoader.load('resource-3exds.png')
    // tubeTexture.wrapS = THREE.RepeatWrapping
    // tubeTexture.wrapT = THREE.RepeatWrapping
    // tubeTexture.repeat.set(2, 5)
    // const material = new THREE.MeshBasicMaterial({
    //   map: tubeTexture
    // })

    mesh = new THREE.Mesh(geometry, tubeMaterial)
    scene.add(mesh)
    // gui
    //   .add(pos, 'x')
    //   .min(-1)
    //   .max(1)
    //   .step(0.01)
    //   .name('middle x')
    //   .onChange((value) => {
    //     pos.x = value
    //     update()
    //   })
    // gui
    //   .add(pos, 'y')
    //   .min(-1)
    //   .max(1)
    //   .step(0.01)
    //   .name('middle y')
    //   .onChange((value) => {
    //     console.log('update y')
    //     pos.y = value
    //     update()
    //   })
    // gui
    //   .add(pos, 'z')
    //   .min(-1)
    //   .max(1)
    //   .step(0.01)
    //   .name('middle z')
    //   .onChange((value) => {
    //     pos.z = value
    //     update()
    //   })
  })
}

window.addEventListener('click', ({ clientX, clientY }) => {
  mouse.x = (clientX / window.innerWidth) * 2 - 1
  mouse.y = -(clientY / window.innerHeight) * 2 + 1
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children)
  cubes.forEach(({ material }) => {
    material.map = cubeMaps[0]
  })
  if (intersects.length) {
    let flag = false
    intersects.forEach(({ object }) => {
      if (!flag && object.userData.clickable) {
        flag = true
        object.material.map = cubeMaps[1]
      }
    })
  }
})

const init = () => {
  //renderer
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true //抗锯齿
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
  camera.position.set(1, 1.6, 3)

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

  scene.add(ambientLight, camera, new THREE.AxesHelper(100))

  animate()
}

let clock = new THREE.Clock()
let pre = 0
const animate = () => {
  const elapsedTime = clock.getElapsedTime()
  // const delta = elapsedTime - pre //差值
  pre = elapsedTime

  tubeMaterial.uniforms.uTime.value = elapsedTime

  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  controls.update()
}

new FontLoader().load('/assets/font/Alibaba PuHuiTi H_Regular.json', (r) => {
  font = r
  init()
  createObjects()
})

// const test = []
// for (let index = 0; index < 47; index++) {
//   test.push({
//     layerId: index < 30 ? 1 : index < 41 ? 2 : 3,
//     id: index + 1 + ''
//   })
// }
// console.log(JSON.stringify(test))
