var Regl = require('regl')
var Mat4 = require('gl-mat4')
var Vec3 = require('gl-vec3')
var Quat = require('gl-quat')
var Camera = require('../index')
var regl = Regl()
var camera = new Camera(regl)

var mesh = {
  vertices: [ -1, -1, 0, 1, -1, 0, 0, 1, 0 ],
  indices: [ 0, 1, 2 ],
  position: Vec3.create(),
  rotation: Quat.create(),
  model: Mat4.create(),
  transform: Mat4.create()
}

var renderMesh = regl({
  vert: `
    attribute vec3 position;

    uniform mat4 projection;
    uniform mat4 view;
    uniform mat4 transform;
    uniform mat4 model;

    void main () {
      gl_Position = transform * vec4(position, 1);
    } 
  `,
  frag: `
    precision mediump float;

    const vec4 color = vec4(.2, .4, .7, 1);
    
    void main () {
      gl_FragColor = color;
    }
  `,
  attributes: {
    position: regl.prop('mesh.vertices'),
  },
  uniforms: {
    model: regl.prop('mesh.model'),
    transform: regl.prop('mesh.transform')
  },
  elements: regl.prop('mesh.indices'),
  cull: {
    enable: true 
  }
})

regl.frame(function ({ tick, viewportWidth, viewportHeight }) {
  Quat.rotateY(mesh.rotation, mesh.rotation, Math.PI / 60)
  Vec3.set(mesh.position, 0, Math.sin(tick / 20), 0)
  Mat4.fromRotationTranslation(mesh.model, mesh.rotation, mesh.position)
  camera.aspectRatio = viewportWidth / viewportHeight
  camera.eye[2] = 8
  camera.perspective({}, function (c, p) {
    Mat4.multiply(mesh.transform, camera.projection, camera.view)
    Mat4.multiply(mesh.transform, mesh.transform, mesh.model)
    renderMesh({ mesh })
  })
})
