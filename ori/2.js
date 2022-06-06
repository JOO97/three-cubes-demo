const main = {
  getLinks: function (t) {
    return this._data[0].links.filter(function (e) {
      return e.from == t || e.to == t
    })
  },

  getNodes: function (t) {
    return this._data[0].nodes.filter(function (e) {
      return t == e.layerID
    })
  },

  getChildFromGroup: function (e, t, n) {
    var r
    return (
      e.children.forEach(function (e) {
        e[t] == n && (r = e)
      }),
      r
    )
  },

  findDataInDict: function (e, t, n) {
    var r
    return (
      e.forEach(function (e) {
        e[t] == n && (r = e)
      }),
      r
    )
  },

  findLinkRelation: function () {
    var i = this,
      o = this._data[0]
    ;(this.linkRelation = {}),
      o.nodes.forEach(function (t) {
        var n = [],
          r = [],
          e =
            (o.links.forEach(function (e) {
              ;(e.to != t.nodeID && e.from != t.nodeID) ||
                (n.push(e.from), n.push(e.to), r.push(e.from + e.to))
            }),
            (n = Array.from(new Set(n))),
            {
              nodeID: t.nodeID,
              layerID: t.layerID,
              nodeIDs: n,
              linkIDs: r
            })
        i.linkRelation[t.nodeID] = e
      })
  },

  consturctScene: function () {
    var e,
      y = this,
      s = this,
      g = this._data[0],
      t = this.mergeConfig(this.config),
      T = new THREE.TextureLoader(),
      n =
        ((this.layerGroup = new THREE.Group()),
        (this.nodeGroup = new THREE.Group()),
        (this.textGroup = new THREE.Group()),
        (this.linkGroup = new THREE.Group()),
        (this.layerGroup.visible = !1),
        (this.nodeGroup.visible = !1),
        (this.linkGroup.visible = !1),
        (this.textGroup.visible = !1),
        (this.nodeGroup.name = 'nodeGroup'),
        this.scene.add(this.nodeGroup),
        (this.layerGroup.name = 'layerGroup'),
        this.scene.add(this.layerGroup),
        []),
      r = G(g.layers)
    try {
      for (r.s(); !(e = r.n()).done; ) {
        d = e.value
        var i = new THREE.TextureLoader().load(d.texture.layerUrl),
          o = new THREE.PlaneGeometry(d.size, d.size),
          a = new THREE.MeshBasicMaterial({
            map: i,
            side: THREE.DoubleSide
          }),
          l = new THREE.Mesh(o, a)
        if (
          (l.position.set(0, d.elevation, 0),
          l.rotateX(-Math.PI / 2),
          (l.layerName = d.layerName),
          (l.layerSize = d.size),
          (l.layerElevation = d.elevation),
          this.layerGroup.add(l),
          d.decro && d.decro.plate)
        ) {
          for (
            var c = d.decro.plate,
              h = new THREE.BoxGeometry(c.size, 0.2, c.size),
              u = [],
              f = 0;
            f < h.faces.length;
            f++
          ) {
            var p = void 0,
              m = void 0,
              m =
                0 == f || 1 == f || 4 == f || 5 == f
                  ? ((p = c.edgeColor), !1)
                  : ((p = c.color), !0),
              E = new THREE.MeshBasicMaterial({
                color: p,
                transparent: m,
                opacity: c.opacity
              })
            u.push(E)
          }

          var v = new THREE.Mesh(h, u)
          ;(v.layerElevation = d.elevation),
            v.position.set(0, d.elevation - 0.3, 0),
            this.layerGroup.add(v)
        }

        n.push({
          layerID: d.layerID,
          layerSize: d.size,
          total: 0,
          nodes: []
        })
      }
    } catch (e) {
      r.e(e)
    } finally {
      r.f()
    }

    n.forEach(function (e) {
      var t,
        n = G(g.nodes)
      try {
        for (n.s(); !(t = n.n()).done; )
          (d = t.value).layerID == e.layerID && (e.total++, e.nodes.push(d))
      } catch (e) {
        n.e(e)
      } finally {
        n.f()
      }
    }),
      n.forEach(function (t) {
        for (
          var e = Math.ceil(Math.sqrt(t.total)),
            n = y.findDataInDict(g.layers, 'layerID', t.layerID),
            r = t.layerSize / e,
            i = n.offsetX
              ? (e / 2) * -r + r / 2 + Number(n.offsetX)
              : (e / 2) * -r + r / 2,
            o = n.offsetZ
              ? (e / 2) * -r + r / 2 + Number(n.offsetZ)
              : (e / 2) * -r + r / 2,
            a = 0,
            s = t.total,
            l = 0;
          l < e;
          l++
        ) {
          var c = void 0
          g.layers.forEach(function (e) {
            e.layerID == t.layerID && (c = e.elevation)
          })
          for (var d = 0; d < e; d++) {
            if (s <= l * e + d) return
            var h,
              u,
              f = t.nodes[a],
              p = f.nodeID,
              m = (a++, void 0),
              E = void 0,
              v = void 0,
              m =
                ((m = f.nodeSize
                  ? ((h = v = f.nodeSize), new THREE.BoxGeometry(h, h, h))
                  : n.node.nodeSize
                  ? ((h = v = n.node.nodeSize), new THREE.BoxGeometry(h, h, h))
                  : new THREE.BoxGeometry(1, 1, 1)),
                (E =
                  f.texture && f.texture.nodeUrl
                    ? ((u = T.load(f.texture.nodeUrl)),
                      new THREE.MeshBasicMaterial({
                        map: u,
                        side: THREE.DoubleSide
                      }))
                    : ((u = T.load(n.node.texture.nodeUrl)),
                      new THREE.MeshBasicMaterial({
                        map: u,
                        side: THREE.DoubleSide
                      }))),
                new THREE.Mesh(m, E))
            ;(m.normalMaterial = E),
              (m.activeMaterial = new THREE.MeshBasicMaterial({
                map: T.load(n.node.texture.activeUrl),
                side: THREE.DoubleSide
              })),
              (m.name = f.name),
              (m.layerID = f.layerID),
              (m.nodeSize = v),
              (m.nodeID = p),
              m.position.set(i + l * r, c + 0.8, o + d * r),
              y.nodeGroup.add(m)
          }
        }
      }),
      (this.linkGroup.name = 'linkGroup'),
      this.scene.add(this.linkGroup)
    var R = g.links,
      b = g.style.link,
      R =
        (R.forEach(function (e) {
          var t,
            n,
            r,
            i,
            o = s.getChildFromGroup(s.nodeGroup, 'nodeID', e.from),
            a = s.getChildFromGroup(s.nodeGroup, 'nodeID', e.to)
          o &&
            ((n = o.position),
            (n = new THREE.Vector3(n.x, n.y, n.z)),
            a &&
              ((t = a.position),
              (t = new THREE.Vector3(t.x, t.y, t.z)),
              Number(o.layerID) > Number(a.layerID)
                ? ((n.y -= o.nodeSize / 2), (t.y += a.nodeSize / 2))
                : ((n.y += o.nodeSize / 2), (t.y -= a.nodeSize / 2)))),
            n &&
              t &&
              n.isVector3 &&
              t.isVector3 &&
              ('curve' == g.style.link.lineStyle
                ? ((o = Math.abs(n.x - t.x)),
                  (a = Math.abs(n.y - t.y)),
                  (r = Math.abs(n.z - t.z)),
                  n.y > t.y && ((i = t), (t = n), (n = i)),
                  (i = n.x + Math.random() * o),
                  (o = n.y + Math.random() * a),
                  (a = n.z + Math.random() * r),
                  (r = new THREE.Vector3(i, o, a)),
                  (i = new THREE.QuadraticBezierCurve3(n, r, t).getPoints(50)),
                  (r = new THREE.TubeGeometry(
                    new THREE.CatmullRomCurve3(i),
                    20,
                    0.1,
                    8,
                    !1
                  )))
                : 'straigh' == g.style.link.lineStyle &&
                  ((o = new THREE.CatmullRomCurve3([n, t])),
                  (r = new THREE.TubeGeometry(o, 5, b.linkRadius))),
              (a = new THREE.ShaderMaterial({
                uniforms: y.uniforms,
                vertexShader:
                  '\n            varying vec2 vUv;\n            void main()\n            {\n              vUv = uv;\n              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n            }\n          ',
                fragmentShader:
                  '\n            uniform sampler2D albedo;\n            uniform float time;\n            varying vec2 vUv;\n            void main()\n            {\n              vec2 st = vUv + vec2(1.0, 0.0) * time * 0.5;\n              vec4 color = texture2D(albedo, st);\n              gl_FragColor = color;\n            }\n          ',
                depthTest: !0,
                depthWrite: !0,
                transparent: !0
              })),
              ((i = new THREE.Mesh(r, a)).linkID = e.from + e.to),
              y.linkGroup.add(i))
        }),
        (this.textGroup.name = 'textGroup'),
        this.scene.add(this.textGroup),
        t.sourceUrl[0] + t.sourceUrl[3]),
      w = g.style
    new THREE.FontLoader().load(R, function (i) {
      var r = w.layerText,
        o =
          (s.layerGroup.children.forEach(function (e) {
            var t, n
            e.layerName &&
              ((t = new THREE.TextGeometry(e.layerName, {
                size: r.size,
                height: r.height,
                weight: 'normal',
                font: i,
                style: 'normal',
                bevelThickness: 0.005,
                bevelSize: 0.005,
                curveSegments: 10,
                bevelEnabled: !0
              })),
              (n = new THREE.MeshPhongMaterial({
                color: r.color,
                shininess: 60,
                specular: 13421772
              })),
              (t = new THREE.Mesh(t, n)),
              (n = e.layerName.length),
              (n = r.size * (1 + n / 2)),
              t.position.set(
                -n,
                e.position.y + 1,
                e.position.z + e.layerSize / 2 + 2
              ),
              y.textGroup.add(t))
          }),
          w.nodeText)
      s.nodeGroup.children.forEach(function (e) {
        var t = e.name.length,
          n = new THREE.TextGeometry(e.name, {
            size: o.size,
            height: o.height,
            weight: 'normal',
            font: i,
            style: 'normal',
            bevelThickness: 0.1,
            bevelSize: 0.1,
            curveSegments: 20,
            bevelEnabled: !1
          }),
          r = new THREE.MeshPhongMaterial({
            color: o.color,
            shininess: 60,
            specular: 13421772
          }),
          n = new THREE.Mesh(n, r),
          r = o.size * (1 + t / 2)
        n.position.set(
          e.position.x - r,
          e.position.y + e.nodeSize / 2 + 0.2,
          e.position.z
        ),
          y.textGroup.add(n)
      }),
        y.playIntroAnimate()
    })
  },

  playIntroAnimate: function () {
    var e = this,
      t = (this.textGroup && this.textGroup.children.length, this)
    this.layerGroup.children.forEach(function (e) {
      ;(e.position.y = 0), e.scale.set(0, 0, 0)
    }),
      (this.layerGroup.visible = !0),
      new TWEEN.Tween({
        p: 0
      })
        .to(
          {
            p: 1
          },

          2e3
        )
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function (n) {
          t.layerGroup.children.forEach(function (e) {
            var t = e.layerElevation * n.p
            ;(e.position.y = t), e.scale.set(n.p, n.p, n.p)
          })
        })
        .onComplete(function () {
          ;(e.nodeGroup.visible = !0),
            (e.linkGroup.visible = !0),
            (e.textGroup.visible = !0),
            t.startLinkAnimation('0')
        })
        .start()
  },

  activeNodes: function (e) {
    var r = this
    if (e && !(0 < !e.length)) {
      var t,
        n = G(r.nodeGroup.children)
      try {
        for (n.s(); !(t = n.n()).done; )
          (nodeMesh = t.value).material = nodeMesh.normalMaterial
      } catch (e) {
        n.e(e)
      } finally {
        n.f()
      }

      e.forEach(function (e) {
        var t,
          n = G(r.nodeGroup.children)
        try {
          for (n.s(); !(t = n.n()).done; )
            (nodeMesh = t.value).nodeID == e &&
              (nodeMesh.material = nodeMesh.activeMaterial)
        } catch (e) {
          n.e(e)
        } finally {
          n.f()
        }
      })
    }
  },

  activeLinks: function (e) {
    var r = this
    if (e && !(0 < !e.length)) {
      var t,
        n = G(r.linkGroup.children)
      try {
        for (n.s(); !(t = n.n()).done; ) (linkMesh = t.value).visible = !1
      } catch (e) {
        n.e(e)
      } finally {
        n.f()
      }

      e.forEach(function (e) {
        var t,
          n = G(r.linkGroup.children)
        try {
          for (n.s(); !(t = n.n()).done; )
            (linkMesh = t.value).linkID == e && (linkMesh.visible = !0)
        } catch (e) {
          n.e(e)
        } finally {
          n.f()
        }
      })
    }
  },

  startLinkAnimation: function (e) {
    var n = this,
      r = n.getNodes(e),
      i = (n.slideInterval && clearInterval(n.slideInterval), 0),
      o = r.length
    n.slideInterval = setInterval(
      function () {
        var e, t
        i < o
          ? ((t = r[i].nodeID),
            n.linkRelation &&
              ((e = n.linkRelation[t].linkIDs),
              (t = n.linkRelation[t].nodeIDs),
              n.activeLinks(e),
              n.activeNodes(t)),
            i++)
          : (i = 0)
      },

      2e3
    )
  },

  stopAnimation: function () {
    _this.slideInterval && clearInterval(_this.slideInterval)
  },

  initScene: function () {
    var e = this.mergeConfig(this.config),
      t = this._data[0],
      n =
        ((this.cache = window.X = {}),
        this.renderer ||
          ((this.renderer = new THREE.WebGLRenderer({
            antialias: !0,
            alpha: !0
          })),
          (this.cache.renderer = this.renderer),
          this.renderer.setSize(
            this.container.outerWidth(),
            this.container.outerHeight()
          ),
          this.renderer.setClearColor(15658734, 0),
          this.container.append(this.renderer.domElement).css({
            width: this.container.outerWidth() + 'px',
            height: this.container.outerHeight() + 'px'
          })),
        (this.scene = new THREE.Scene()),
        (this.cache.scene = this.scene),
        new THREE.AmbientLight(16711422)),
      n = (this.scene.add(n), this.container.outerWidth()),
      r = this.container.outerHeight(),
      i = t.style.camera,
      i =
        ('ortho' == i.type
          ? ((i = i.division),
            (this.camera = new THREE.OrthographicCamera(
              n / -i,
              n / i,
              r / i,
              r / -i,
              1,
              1e3
            )))
          : ((this.camera = new THREE.PerspectiveCamera(45, n / r, 0.1, 1e4)),
            (this.scene.background = new THREE.CubeTextureLoader().load([
              e.skyboxes[0],
              e.skyboxes[1],
              e.skyboxes[2],
              e.skyboxes[3],
              e.skyboxes[4],
              e.skyboxes[5]
            ]))),
        (this.cache.camera = this.camera),
        t.style.camera.position),
      n = i.x,
      r = i.y,
      e = i.z
    this.camera.position.set(n, r, e),
      (this.controller = new THREE.OrbitControls(
        this.camera,
        this.renderer.domElement
      )),
      (this.controller.target = new THREE.Vector3(0, 0, 0)),
      (this.clock = new THREE.Clock())
    var i = new THREE.TextureLoader().load(t.style.link.linkTexture),
      o =
        ((this.uniforms = {
          albedo: {
            value: i
          },

          time: {
            value: 0
          }
        }),
        (this.uniforms.albedo.value.wrapS = this.uniforms.albedo.value.wrapT =
          THREE.RepeatWrapping),
        this.consturctScene(),
        this.findLinkRelation(),
        this)
    this.renderer.domElement.onclick = function (e) {
      console.log('objects')
      e = o.getIntersects(e, o)
      console.log(e)
    }
  },

  getIntersects: function (e, t) {
    e.preventDefault()
    var n = new THREE.Raycaster(),
      r = t.renderer.domElement.getBoundingClientRect(),
      i = new THREE.Vector2()
    return (
      (i.x = ((e.clientX - r.left) / r.width) * 2 - 1),
      (i.y = (-(e.clientY - r.top) / r.height) * 2 + 1),
      n.setFromCamera(i, t.camera),
      n.intersectObjects(t.linkGroup.children, !0)
    )
  },

  loop: function () {
    this.uniforms && (this.uniforms.time.value += this.clock.getDelta()),
      this.renderer &&
        (this.renderer.clear(), this.renderer.render(this.scene, this.camera)),
      TWEEN.update(),
      (this.animateFrame = requestAnimationFrame(this.loop.bind(this)))
  },

  init: function (e) {
    this.mergeConfig(e)
  },

  render: function (e, t) {
    e = this.data(e)
    var e = this.mergeConfig(t),
      n = this
    this.animateFrame
      ? (cancelAnimationFrame(this.animateFrame), n.loop(), n.initScene())
      : ((t = e.sourceUrl[0] + e.sourceUrl[1]),
        (e = e.sourceUrl[0] + e.sourceUrl[2]),
        (e = [
          h(t + '/build/three.js'),
          h(e),
          h(t + '/examples/js/loaders/GLTFLoader.js'),
          h(t + '/examples/js/controls/OrbitControls.js')
        ]),
        Promise.all(e).then(function () {
          console.log('THREEJS VERSION:' + THREE.REVISION),
            n.loop(),
            n.initScene()
        }))
  },

  resize: function (e, t) {
    this.renderer &&
      (this.renderer.setSize(e, t),
      this.camera &&
        ((this.camera.aspect = e / t), this.camera.updateProjectionMatrix()))
  },

  data: function (e) {
    return e && (this._data = e), this._data
  },

  mergeConfig: function (e) {
    return (
      e &&
        ((this.config.theme = c.defaultsDeep(
          e.theme || {},

          this.config.theme
        )),
        (this.config = c.defaultsDeep(
          e || {},

          this.config
        ))),
      this.config
    )
  },

  destroy: function () {
    console.log('请实现 destroy 方法')
  }
}
