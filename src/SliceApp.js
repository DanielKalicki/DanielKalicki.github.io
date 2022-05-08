import logo from './logo.svg';
import './App.css';
import React, { Component } from "react";
import * as THREE from "three";
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { sliceGeometry } from "threejs-slice-geometry-typescript";

class SliceApp extends Component{
  componentDidMount() {
    var scene = new THREE.Scene();

    // camera
    var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
    camera.position.set( 2, -1.5, 28 );
    scene.add(camera);
    camera.lookAt( scene.position );

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

    let slicePlane;
    let slicePlane2;
    // slicePlane = new THREE.PlaneGeometry( 100, 100 );
    // slicePlain = new THREE.Plane(new THREE.Vector3(0, 0, -16), 0.8);
    slicePlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 12.01);
    slicePlane2 = new THREE.Plane(new THREE.Vector3(0, 0, 1), -12);
    console.log(slicePlane)
    // slicePlane.rotation.x += 1.57

    // slicePlain.position.z = camera.position.z-10;

    // load mesh
    let points;
    const loader = new PLYLoader()
    loader.load( '/olsztynska_v2.ply', function ( geometry ) {
      geometry.center();
      const material = new THREE.MeshPhongMaterial( { specular: 0x000000,
        flatShading: true,
        // shininess: 20,
        side: THREE.DoubleSide,
        clippingPlanes: [slicePlane2, slicePlane],
        // clippingPlanes: [slicePlane],
        clipShadows: true
      } );

      points = new THREE.Mesh( geometry, material );
      scene.add( points );
      
      points.rotation.x = -4.55
      points.rotation.y = 3.19
      points.rotation.z = -0.5
      camera.position.z = 15;


    } );

    const canvas = document.getElementById("cave_mesh_id");
    var renderer = new THREE.WebGLRenderer({canvas: canvas});
    var width = 1200;
    var height = 800;
    renderer.setSize(width, height, false);
    renderer.localClippingEnabled = true;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    document.body.appendChild( renderer.domElement );

    var animate = function () {
      requestAnimationFrame( animate );
          
      // slicePlain.position.z = camera.position.z-5;
      // ... 
      renderer.render( scene, camera );
    };

    animate();

    var caveMesh = document.getElementById("cave_mesh_id");

    let rotateStart_ = false;
    let x_ = 0;
    let y_ = 0;
    let camera_x_ = 0;
    let camera_y_ = 0;
    caveMesh.addEventListener("mousedown", function(e){
      rotateStart_ = true;
      x_ = e.clientX;
      y_ = e.clientY;
      camera_x_ = camera.rotation.x;
      camera_y_ = camera.rotation.y;
    }, true);
    caveMesh.addEventListener("mouseup", function(e){
      rotateStart_ = false;
    }, true);
    caveMesh.addEventListener("mousemove", function(e){
      if (rotateStart_){
        camera.rotation.y = camera_y_ - (x_ - e.clientX)/300;
        camera.rotation.x = camera_x_ - (y_ - e.clientY)/300;
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
          slicePlane.constant -= 0.2*Math.cos(camera.rotation.y);
          slicePlane2.constant += 0.2*Math.cos(camera.rotation.y);
      
          // camera.position.y -= 0.2*Math.sin(camera.rotation.x);
          // camera.position.z -= 0.2*Math.cos(camera.rotation.x);
          break;
        case "s":
          camera.position.z += 0.2*Math.cos(camera.rotation.y);
          camera.position.x += 0.2*Math.sin(camera.rotation.y);
          slicePlane.constant += 0.2*Math.cos(camera.rotation.y);
          slicePlane2.constant -= 0.2*Math.cos(camera.rotation.y);

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
      <canvas id="cave_mesh_id" data-engine="three.js r140" ></canvas>
    )
  }
}

export default SliceApp;
