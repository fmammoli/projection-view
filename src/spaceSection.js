import * as THREE from "three";
import { Object3D } from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
import { TrackballControls } from "three/examples/jsm/controls//TrackballControls";

//import { HDRCubeTextureLoader } from "three/examples/jsm/loaders/HDRCubeTextureLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

import elementModal from "./elementModal";

// import plsAttr from "../data/pls_attr2.json";

import hdrImg from "../resources/misty_pines_2k.hdr";
//import f from "../static/helvetiker_regular.typeface.json";

function spaceSection(DATA_TABLE, axisData) {
  let reqAnimationFrameId;

  const elModal = elementModal();

  // For raycasting stuff
  let raycaster;
  const mouse = new THREE.Vector2();
  let INTERSECTED;
  let SELECTED;

  //   Three.js variables
  let perspectiveCamera, orthographicCamera, controls, scene, renderer, stats;

  //   Camera parameters
  const params = {
    orthographicCamera: false,
  };
  const frustumSize = 400;

  function init() {
    const aspect = window.innerWidth / window.innerHeight;

    perspectiveCamera = new THREE.PerspectiveCamera(60, aspect, 1, 2000);
    perspectiveCamera.position.z = 200;
    perspectiveCamera.position.x = 200;
    perspectiveCamera.position.y = 200;

    orthographicCamera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      1,
      1000
    );
    orthographicCamera.position.z = 500;

    // world

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);

    new RGBELoader()
      .setDataType(THREE.UnsignedByteType)
      .load(hdrImg, function (texture) {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;

        scene.background = envMap;
        scene.environment = envMap;

        texture.dispose();
        pmremGenerator.dispose();

        render();
      });

    // Create Elements and populate the scene
    createItems(DATA_TABLE.length);

    // Create the Axis Lines
    createLines();

    // lights

    const dirLight1 = new THREE.DirectionalLight(0xffffff);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x002288);
    dirLight2.position.set(-1, -1, -1);
    scene.add(dirLight2);

    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    raycaster = new THREE.Raycaster();

    // renderer
    scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    //renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;

    //renderer.physicallyCorrectLights = true;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const space = document.querySelector("#space");
    space.appendChild(renderer.domElement);

    stats = new Stats();
    //space.appendChild(stats.dom);

    //
    // const gui = new GUI();
    // gui
    //   .add(params, "orthographicCamera")
    //   .name("use orthographic")
    //   .onChange(function (value) {
    //     controls.dispose();

    //     createControls(value ? orthographicCamera : perspectiveCamera);
    //   });

    space.addEventListener("mousemove", onDocumentMouseMove);
    space.addEventListener("click", onMouseClick);
    //window.addEventListener("touchmove", onDocumentMouseMove);
    space.addEventListener("touchstart", onMouseClick);
    window.addEventListener("resize", onWindowResize);

    createControls(perspectiveCamera);
  }

  function createItems(n) {
    //const geometry = new THREE.OctahedronGeometry(5);
    const geometry = new THREE.TetrahedronGeometry(5);
    const material = { color: 0x00ffff, flatShading: false };

    for (let i = 0; i < n; i++) {
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial(material)
      );

      mesh.position.x = DATA_TABLE[i][axisData.current.x] * axisData.current.xf;
      mesh.position.y = DATA_TABLE[i][axisData.current.y] * axisData.current.xf;
      mesh.position.z = DATA_TABLE[i][axisData.current.z] * axisData.current.xf;
      //   mesh.position.x = parseFloat(plsAttr[i].troot) * 30;
      //   mesh.position.y = parseFloat(plsAttr[i].twood) * 5;
      //   mesh.position.z = parseFloat(plsAttr[i].tleaf) * 30;

      mesh.rotation.x = Math.random() * 2 * Math.PI;
      mesh.rotation.y = Math.random() * 2 * Math.PI;
      mesh.rotation.z = Math.random() * 2 * Math.PI;

      //   mesh.position.x = (Math.random() - 0.5) * 1000;
      //   mesh.position.y = (Math.random() - 0.5) * 1000;
      //   mesh.position.z = (Math.random() - 0.5) * 1000;

      mesh.userData = {
        plsData: DATA_TABLE[i],
        position: {
          x: mesh.position.x,
          y: mesh.position.y,
          z: mesh.position.z,
        },
      };

      //mesh.updateMatrix();
      mesh.matrixAutoUpdate = true;
      scene.add(mesh);
    }
  }

  function createLines() {
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0fffff });

    const xAxis = [];
    xAxis.push(new THREE.Vector3(0, 0, 0));
    xAxis.push(new THREE.Vector3(200, 0, 0));
    const xAxisLineGeometry = new THREE.BufferGeometry().setFromPoints(xAxis);
    const xAxisLine = new THREE.Line(xAxisLineGeometry, lineMaterial);
    scene.add(xAxisLine);

    const yAxis = [];
    yAxis.push(new THREE.Vector3(0, 0, 0));
    yAxis.push(new THREE.Vector3(0, 200, 0));
    const yAxisLineGeometry = new THREE.BufferGeometry().setFromPoints(yAxis);
    const yAxisLine = new THREE.Line(yAxisLineGeometry, lineMaterial);
    scene.add(yAxisLine);

    const zAxis = [];
    zAxis.push(new THREE.Vector3(0, 0, 0));
    zAxis.push(new THREE.Vector3(0, 0, 200));
    const zAxisLineGeometry = new THREE.BufferGeometry().setFromPoints(zAxis);
    const zAxisLine = new THREE.Line(zAxisLineGeometry, lineMaterial);
    scene.add(zAxisLine);

    createAxisLabels(axisData);
  }

  function createAxisLabels(axisData) {
    const loader = new THREE.FontLoader();
    loader.load("./static/helvetiker_regular.typeface.json", function (font) {
      const material = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        flatShading: true,
      });

      const geometryX = new THREE.TextGeometry(axisData.current.x, {
        font: font,
        size: 10,
        height: 5,
        curveSegments: 12,
      });

      let x = new THREE.Mesh(geometryX, material);
      x.position.x = 200;
      x.position.z = 10;
      x.rotation.y = 0.25 * 2 * Math.PI;

      const geometryY = new THREE.TextGeometry(axisData.current.y, {
        font: font,
        size: 10,
        height: 5,
        curveSegments: 12,
      });
      let y = new THREE.Mesh(geometryY, material);
      y.position.y = 200;
      y.position.x = -15;
      y.rotation.x = -0.25 * 2 * Math.PI;

      const geometryZ = new THREE.TextGeometry(axisData.current.z, {
        font: font,
        size: 10,
        height: 5,
        curveSegments: 12,
      });
      let z = new THREE.Mesh(geometryZ, material);
      z.position.z = 200;
      z.position.x = -15;
      z.rotation.y = 1 * 2 * Math.PI;

      scene.add(x);
      scene.add(y);
      scene.add(z);
      x.updateMatrix();
      y.updateMatrix();
      z.updateMatrix();
    });
  }

  function createControls(camera) {
    controls = new TrackballControls(camera, renderer.domElement);

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.keys = [65, 83, 68];
  }

  function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;

    perspectiveCamera.aspect = aspect;
    perspectiveCamera.updateProjectionMatrix();

    orthographicCamera.left = (-frustumSize * aspect) / 2;
    orthographicCamera.right = (frustumSize * aspect) / 2;
    orthographicCamera.top = frustumSize / 2;
    orthographicCamera.bottom = -frustumSize / 2;
    orthographicCamera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    controls.handleResize();
  }

  function onDocumentMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function onMouseClick(event) {
    if (!SELECTED) {
      if (
        INTERSECTED &&
        INTERSECTED.type !== "Line" &&
        INTERSECTED.geometry.type !== "TextGeometry"
      ) {
        INTERSECTED.scale.x++;
        INTERSECTED.scale.y++;
        INTERSECTED.scale.z++;
        INTERSECTED.updateMatrix();
        SELECTED = INTERSECTED;
        elModal.open(SELECTED);
      }
    }
  }

  elModal.modal.addEventListener("closed", (e) => {
    SELECTED = null;
  });

  elModal.modal.addEventListener("deleteElement", (e) => {
    DATA_TABLE.push({ uuid: e.detail.uuid, data: e.detail.userData });

    const obj = scene.getObjectByProperty("uuid", e.detail.uuid);
    obj.geometry.dispose();
    obj.material.dispose();
    scene.remove(obj);
    renderer.renderLists.dispose();
    SELECTED = null;
  });

  function animate() {
    reqAnimationFrameId = requestAnimationFrame(animate);

    controls.update();

    stats.update();

    render();
  }

  function updatePositions(event) {
    console.log(event);
    scene.children.forEach((e) => {
      if (e.type === "Mesh") {
        if (e.geometry.type === "TextGeometry") {
          e.geometry.dispose();
          e.material.dispose();
          scene.remove(e);
        } else {
          if (e.geometry.type === "TetrahedronGeometry") {
            const dataElement = DATA_TABLE.find(
              (i) => i.PLS_id === e.userData.plsData.PLS_id
            );

            e.position.x =
              dataElement[event.detail.x] * parseFloat(event.detail.xf);
            e.position.y =
              dataElement[event.detail.y] * parseFloat(event.detail.yf);
            e.position.z =
              dataElement[event.detail.z] * parseFloat(event.detail.zf);
          }
          e.updateMatrix();
        }
      }
    });
    createAxisLabels(axisData);
  }

  function clearScene() {
    for (let index = scene.children.length - 1; index >= 0; index--) {
      const element = scene.children[index];
      if (element.type === "Mesh") {
        console.log("Removeing", element);
        element.geometry.dispose();
        element.material.dispose();
        scene.remove(element);
      }
    }
    renderer.renderLists.dispose();
    cancelAnimationFrame(reqAnimationFrameId);
  }

  function render() {
    const camera = params.orthographicCamera
      ? orthographicCamera
      : perspectiveCamera;

    // find intersections

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      if (
        intersects[0].object.type === "Line" ||
        intersects[0].object.geometry.type === "TextGeometry"
      ) {
        //console.log(INTERSECTED)
      } else {
        if (INTERSECTED != intersects[0].object) {
          if (INTERSECTED)
            INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

          INTERSECTED = intersects[0].object;

          INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
          INTERSECTED.material.emissive.setHex(0xff0000);
        }
      }
    } else {
      if (INTERSECTED)
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

      INTERSECTED = null;
    }
    //console.log("secne: ", scene.children.length);
    renderer.render(scene, camera);
  }
  function start(data, aData) {
    DATA_TABLE = data;
    axisData = aData;
    console.log(axisData);
    init();
    animate();

    document.addEventListener("axisUpdated", updatePositions);
  }
  function clear() {
    clearScene();
  }
  return { start, clear };
}

export default spaceSection;
