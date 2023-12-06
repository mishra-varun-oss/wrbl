import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

let scene_params = {
	color: '#0260f7'
}
scene.background = new THREE.Color( scene_params.color );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
light.position.set( 0, 1, 1 ).normalize();
scene.add(light);
/*
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
*/
const geometry = new THREE.SphereGeometry( 15, 32, 16 );
//const geometry = new THREE.DodecahedronGeometry(17, 0);
//const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
//const material = new THREE.MeshPhongMaterial( { color: 0xfa7e02 } );

var material = new THREE.ShaderMaterial({
  uniforms: {
    color1: {
      value: new THREE.Color("#f76902")
    },
    color2: {
      value: new THREE.Color("#f7ba02")
    }
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;

    varying vec2 vUv;

    void main() {

      gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
    }
  `,
});

const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );
camera.position.z = 50;

function animate() {
	requestAnimationFrame( animate );
	sphere.rotation.x += .05;
	sphere.rotation.y += .05;
//	cube.rotation.x += 0.01;
//	cube.rotation.y += 0.01;
	renderer.render( scene, camera );
}

animate();
