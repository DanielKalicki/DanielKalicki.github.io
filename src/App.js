import logo from './logo.svg';
import './App.css';
import React, { Component } from "react";
import * as THREE from "three";
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { sliceGeometry } from "threejs-slice-geometry-typescript";

class App extends Component{
  componentDidMount() {
    var scene = new THREE.Scene();
    var sceneSlice = new THREE.Scene();
    sceneSlice.background = new THREE.Color( 0xeeeeee );

    // camera
    var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
    camera.position.set( 0, 0, 0);
    scene.add(camera);
    camera.lookAt( scene.position );

    // camera slice
    var cameraSlice = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
    // cameraSlice.position.set( 2, -1.5, 28 );
    cameraSlice.position.set( 0, 0, 0);
    sceneSlice.add(cameraSlice);

    cameraSlice.lookAt( sceneSlice.position );

    // lights
    const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light.position.set( 0, 1, 1 ); //default; light shining from top
    scene.add( light );
    
    const light2 = new THREE.DirectionalLight( 0xffffff, 0.2 );
    light2.position.set( 1, 0, 1 );
    scene.add( light2 );
    
    const light3 = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light3.position.set( 0, 0.2, -1 );
    scene.add( light3 );
    
    const ambientLight = new THREE.AmbientLight( 0x333333 );
    scene.add( ambientLight );

    const lightSlice = new THREE.DirectionalLight( 0x00ff00, 0.5 );
    lightSlice.position.set( 0, 1, 1 );
    sceneSlice.add( lightSlice );
    const lightSlice2 = new THREE.DirectionalLight( 0x00ff00, 0.5 );
    lightSlice2.position.set( -1, -1, 1 );
    sceneSlice.add( lightSlice2 );
    const lightSlice3 = new THREE.DirectionalLight( 0x00ff00, 0.5 );
    lightSlice3.position.set( 1, 1, 0 );
    sceneSlice.add( lightSlice3 );

    var plane = new THREE.GridHelper(100, 100);
    plane.geometry.rotateX( Math.PI / 2 );
    sceneSlice.add(plane);

    var plane2 = new THREE.GridHelper(100, 100);
    plane2.geometry.rotateX( Math.PI / 2 );
    scene.add(plane2);

    // load mesh
    let points;
    let pointsSlice;
    let slicePlane;
    let slicePlane2;
    let helper;
    let mesh2;
    const loader = new PLYLoader()
    loader.load( '/olsztynska_v2.ply', function ( geometry ) {
      geometry.center();
      console.log(geometry)
      const material = new THREE.MeshPhongMaterial( { specular: 0x000000,
        flatShading: true,
        // shininess: 20,
        side: THREE.DoubleSide,
        clipShadows: true
      } );

      // slicePlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 12.1);
      slicePlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.1);
      // slicePlane2 = new THREE.Plane(new THREE.Vector3(0, 0, 1), -12);
      slicePlane2 = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0);
    
      points = new THREE.Mesh( geometry, material );
      scene.add( points );

      // helper = new THREE.PlaneHelper( slicePlane2, 10, 0xffff00 );
      // helper = new THREE.Mesh( helper, materialSlice );
      // scene.add(helper)
      
      points.rotation.x = -4.55
      points.rotation.y = 3.19
      points.rotation.z = 0.15;

      points.position.x = -9.3;
      points.position.y = 0.3;
      points.position.z = -18.2;

      helper.position.z = camera.position.z-1
      helper.position.x = camera.position.x
      helper.position.y = camera.position.y
    })

    let caveGeometry = new THREE.BufferGeometry();

    var updateGeometry = function(pos){
      sceneSlice.remove(mesh2);
      const geometry2 = new THREE.BufferGeometry();
      let vertices = new Float32Array(caveGeometry.attributes.position.array.length);
      let v_idx = 0;
      console.log(camera.rotation.y)
      for (let i = 0; i<caveGeometry.attributes.position.array.length; i+=3){
        var val_z = caveGeometry.attributes.position.array[i+2]
        var val_y = caveGeometry.attributes.position.array[i+1]
        // if (val_z < (Math.sin(-camera.rotation.y)*val_y + pos) && val_z > (Math.sin(-camera.rotation.y)*val_y + pos-0.25)) {
        if (val_z < (Math.sin(-plane2.rotation.y)*val_y + pos) && val_z > (Math.sin(-plane2.rotation.y)*val_y + pos-0.25)) {
        // if (val_z < pos && val_z > (pos-0.25)) {
          vertices[v_idx++] = caveGeometry.attributes.position.array[i];
          vertices[v_idx++] = caveGeometry.attributes.position.array[i+1];
          vertices[v_idx++] = caveGeometry.attributes.position.array[i+2];
        }
      }
      geometry2.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
      // const material2 = new THREE.PointsMaterial( { color: 0x888888, size: 0.1 } );
      const material2 = new THREE.PointsMaterial( { color: 0x000000, size: 0.3 } );
      mesh2 = new THREE.Points( geometry2, material2 );
      sceneSlice.add(mesh2);
    }

    loader.load( '/olsztynska_v2.ply', function ( geometry_ ) {
      geometry_.center();
      geometry_.rotateX(4.55)
      geometry_.rotateY(-3.0)
      geometry_.rotateZ(0.07)
      geometry_.translate(-9.3, 0.3, -18.2)
      console.log(geometry_)
      caveGeometry.copy(geometry_)
    })

    const canvas = document.getElementById("cave_mesh_id");
    var renderer = new THREE.WebGLRenderer({canvas: canvas});
    var width = 1200;
    var height = 400;
    renderer.setSize(width, height, false);
    renderer.localClippingEnabled = true;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    document.body.appendChild( renderer.domElement );

    const canvasSlice = document.getElementById("cave_slice_id");
    var rendererSlice = new THREE.WebGLRenderer({canvas: canvasSlice});
    var widthSlice = 1200;
    var heightSlice = 400;
    rendererSlice.setSize(widthSlice, heightSlice, false);
    rendererSlice.localClippingEnabled = true;
    cameraSlice.aspect = widthSlice / heightSlice;
    cameraSlice.updateProjectionMatrix();
    document.body.appendChild( rendererSlice.domElement );

    var animate = function () {
      requestAnimationFrame( animate );
      // ... 
      renderer.render( scene, camera );

      // cameraSlice.position.x = camera.position.x;
      // cameraSlice.position.y = camera.position.y;
      cameraSlice.position.z = camera.position.z+20;

      plane.position.z = camera.position.z;

      // plane2.rotation.x = camera.rotation.x;
      // plane2.rotation.y = camera.rotation.y;
      plane2.position.z = camera.position.z;

      // cameraSlice.rotation.x = camera.rotation.x;
      // cameraSlice.rotation.y = camera.rotation.y;
      // cameraSlice.rotation.z = camera.rotation.z;
      // if (slicePlane){
      //   slicePlane.setComponents(slicePlane.normal.x, slicePlane.normal.y, slicePlane.normal.z, slicePlane.constant);
      //   slicePlane2.setComponents(slicePlane2.normal.x, slicePlane2.normal.y, slicePlane2.normal.z, slicePlane2.constant);
      // }
      // slicePlane.normal.x += 0.01
      // slicePlane2.normal.x += 0.01
      rendererSlice.render( sceneSlice, cameraSlice );
    };

    animate();

    var caveMesh = document.getElementById("cave_mesh_id");

    let rotateStart_ = false;
    let x_ = 0;
    let y_ = 0;
    let camera_x_ = 0;
    let camera_y_ = 0;
    let pointsSlice_z_ = 0;
    caveMesh.addEventListener("mousedown", function(e){
      rotateStart_ = true;
      x_ = e.clientX;
      y_ = e.clientY;
      camera_x_ = camera.rotation.x;
      camera_y_ = camera.rotation.y;
      // pointsSlice_z_ = pointsSlice.rotation.z;
    }, true);
    caveMesh.addEventListener("mouseup", function(e){
      rotateStart_ = false;
    }, true);
    caveMesh.addEventListener("mousemove", function(e){
      if (rotateStart_){
        camera.rotation.y = camera_y_ - (x_ - e.clientX)/300;
        camera.rotation.x = camera_x_ - (y_ - e.clientY)/300;

        // pointsSlice.rotation.z = pointsSlice_z_ - (x_ - e.clientX)/300
        // helper.rotation.z = pointsSlice_z_ - (x_ - e.clientX)/300

        updateGeometry(camera.position.z)
      }
    }, true);

    window.addEventListener("keydown", function (event) {
      if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
      }

      switch (event.key) {
        case "w":
          camera.position.z -= 0.2*Math.cos(camera.rotation.y);
          camera.position.x -= 0.2*Math.sin(camera.rotation.y);
          // slicePlane.constant -= 0.2*Math.cos(camera.rotation.y);
          // slicePlane2.constant += 0.2*Math.cos(camera.rotation.y);

          console.log(camera.position)
          updateGeometry(camera.position.z)

          // camera.position.y -= 0.2*Math.sin(camera.rotation.x);
          // camera.position.z -= 0.2*Math.cos(camera.rotation.x);
          break;
        case "s":
          camera.position.z += 0.2*Math.cos(camera.rotation.y);
          camera.position.x += 0.2*Math.sin(camera.rotation.y);
          // slicePlane.constant += 0.2*Math.cos(camera.rotation.y);
          // slicePlane2.constant -= 0.2*Math.cos(camera.rotation.y);

          updateGeometry(camera.position.z)

          // camera.position.y += 0.2*Math.sin(camera.rotation.x);
          // camera.position.z += 0.2*Math.cos(camera.rotation.x);
          break;
        case "a":
          camera.position.x -= 0.2*Math.sin(camera.rotation.y+1.5708);
          camera.position.z -= 0.2*Math.cos(camera.rotation.y+1.5708);
          break;
        case "d":
          camera.position.x += 0.2*Math.sin(camera.rotation.y+1.5708);
          camera.position.z += 0.2*Math.cos(camera.rotation.y+1.5708);
          break;

        case "r":
          camera.position.y += 0.5
          if (slicePlane){
            // slicePlane.setComponents(slicePlane.normal.x+0.1, slicePlane.normal.y, slicePlane.normal.z, slicePlane.constant);
            // slicePlane2.setComponents(slicePlane2.normal.x+0.1, slicePlane2.normal.y, slicePlane2.normal.z, slicePlane2.constant);
            // pointsSlice.rotation.z += 0.01
          }
          break;
        case "f":
          camera.position.y -= 0.5
          if (slicePlane){
            // slicePlane.setComponents(slicePlane.normal.x-0.1, slicePlane.normal.y, slicePlane.normal.z, slicePlane.constant);
            // slicePlane2.setComponents(slicePlane2.normal.x-0.1, slicePlane2.normal.y, slicePlane2.normal.z, slicePlane2.constant);
            // pointsSlice.rotation.z -= 0.01
          }
          break;

        case "t":
          mesh2.rotation.z -= 0.01
          console.log('z' + mesh2.rotation.z.toString())
          break;
        case "g":
          mesh2.rotation.z += 0.01
          console.log('z' + mesh2.rotation.z.toString())
          break;

        case "y":
          mesh2.rotation.y -= 0.01
          console.log('y' + mesh2.rotation.y.toString())
          break;
        case "h":
          mesh2.rotation.y += 0.01
          console.log('y' + mesh2.rotation.y.toString())
          break;
        case "u":
          // mesh2.rotation.x -= 0.01
          // console.log('x' + mesh2.rotation.x.toString())
          plane2.rotation.y -= 0.01
          updateGeometry(camera.position.z)
          break;
        case "j":
          // mesh2.rotation.x += 0.01
          // console.log('x' + mesh2.rotation.x.toString())
          plane2.rotation.y += 0.01
          updateGeometry(camera.position.z)
          break;
          
        default:
          return; // Quit when this doesn't handle the key event.
      }
      // slicePlain.position.z = camera.position.z-10;


      // Cancel the default action to avoid it being handled twice
      event.preventDefault();
    }, true); 
  }
  render() {
    return (
      <div>
        <canvas id="cave_mesh_id" data-engine="three.js r140" ></canvas>
        <canvas id="cave_slice_id" data-engine="three.js r140" ></canvas>
      </div>
    )
  }
}

export default App;
