var Regl = require('regl')
var Mat4 = require('gl-mat4')
var Vec3 = require('gl-vec3')
var Quat = require('gl-quat')
var Camera = require('../index')
var regl = Regl()
var camera = new Camera(regl)

var triangle = {
  vertices: [ -1, -1, 0, 1, -1, 0, 0, 1, 0 ],
  indices: [ 0, 1, 2 ],
  model: Mat4.create()
}

var renderMesh = regl({
  vert: `
    attribute vec3 position;

    uniform mat4 projection;
    uniform mat4 view;
    uniform mat4 model;

    void main () {
      gl_Position = projection * view * model * vec4(position, 1);
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
    model: regl.prop('mesh.model') 
  },
  elements: regl.prop('mesh.indices')
})

regl.frame(function ({ tick, viewportWidth, viewportHeight }) {
  camera.aspectRatio = viewportWidth / viewportHeight
  camera.eye[2] = Math.sin(tick / 24) + 4
  camera.perspective({}, _ => renderMesh({ mesh: triangle }))
})
