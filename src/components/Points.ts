import Orbitcontrols from "three-orbitcontrols";
import Stats from "stats.js";
// import * as THREE from "three";
const THREE = require("three");
class Points {
  constructor(domID: string) {
    /********************************************************/
    var app = document.getElementById(domID);
    const width = app?.offsetWidth ?? 0;
    const height = app?.offsetHeight ?? 0;
    // 3个基础概念：场景（scene）、相机（camera）和渲染器（renderer）。
    // == 场景是一个载体，容器，所有的一切都运行在这个容器里面（存放着所有渲染的物体和使用的光源）
    // 创建场景
    const scene = new THREE.Scene();

    // 渲染性能性能监控器，查看Threejs渲染帧率FPS
    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    (app as Element).appendChild(stats.dom);
    // 创建Group
    const group = new THREE.Group();
    scene.add(group);

    //创建相机
    // ===相机 camera 的作用是定义可视域，相当于我们的双眼，生产一个个快照，最为常用的是 PerspectiveCamera 透视摄像机，
    // 其他还有 ArrayCamera 阵列摄像机（包含多个子摄像机，通过这一组子摄像机渲染出实际效果，适用于 VR 场景），
    // CubeCamera 立方摄像机（创建六个 PerspectiveCamera（透视摄像机），适用于镜面场景），StereoCamera 立体相机
    //（双透视摄像机适用于 3D 影片、视差效果）。相机主要分为两类正投影相机和透视相机，正投影相机的话，
    // 所有方块渲染出来的尺寸都一样； 对象和相机之间的距离不会影响渲染结果，而透视相机接近真实世界，看物体会产生远近高低各不同
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000); //PerspectiveCamera 透视摄像机--模拟人眼的视觉，根据物体距离摄像机的距离，近大远小
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 100;
    camera.lookAt(scene.position);

    // 渲染
    // =渲染器 renderer 则负责用如何渲染出图像，是使用 WeBGL 还是 Canvas，类似于 react 中 render，产生实际的页面效果
    const render = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, //设置canvas为背景透明
    });
    render.setPixelRatio(window.devicePixelRatio);
    render.setClearColor("black"); // 环境背景色
    render.setSize(width as number, height as number);
    (app as Element).appendChild(render.domElement);

    //增加监控的信息状态
    // const stats = new Stats();
    // container.appendChild( stats.dom );
    let mesh: {
      position: { set: (arg0: number, arg1: number, arg2: number) => void };
      rotation: { y: number };
    };
    let mesh2: { rotation: { y: number } };
    function initObject() {
      // 定义一种线条的材质
      const material = new THREE.LineBasicMaterial({
        color: "red",
        Linewidth: 10,
      });
      //这里用这个构造
      const geometry = new THREE.BufferGeometry();
      const pointsArray = new Array();
      pointsArray.push(new THREE.Vector3(0, 0, 0));
      pointsArray.push(new THREE.Vector3(20, 0, 0));
      pointsArray.push(new THREE.Vector3(20, 20, 0));
      pointsArray.push(new THREE.Vector3(0, 20, 0));
      pointsArray.push(new THREE.Vector3(0, 0, 0));
      // pointsArray.push(new THREE.Vector3(1, 20, 100));
      //用这个api传入顶点数组
      geometry.setFromPoints(pointsArray);
      //下述基本一样
      mesh = new THREE.Line(geometry, material, THREE.LinePieces);
      // mesh.position.set(0, 6, 0);
      scene.add(mesh);

      const geometry2 = new THREE.BufferGeometry();
      const pointsArray2 = new Array();
      pointsArray2.push(new THREE.Vector3(0, 0, 20));
      pointsArray2.push(new THREE.Vector3(20, 0, 20));
      pointsArray2.push(new THREE.Vector3(20, 20, 20));
      pointsArray2.push(new THREE.Vector3(0, 20, 20));
      pointsArray2.push(new THREE.Vector3(0, 0, 20));
      geometry2.setFromPoints(pointsArray2);
      //下述基本一样
      mesh2 = new THREE.Line(geometry2, material, THREE.LinePieces);
      mesh.position.set(20, 0, 0);
      scene.add(mesh2);
    }
    initObject();

    // 相机作为Orbitcontrols的参数，支持鼠标交互
    const controls = new Orbitcontrols(camera, render.domElement);
    render.domElement.removeAttribute("tabindex"); //去除鼠标控件使用时的白色边框

    //添加光源:环境光和点光源
    let ambi = new THREE.AmbientLight(0x686868); //环境光
    scene.add(ambi);
    let spotLight = new THREE.DirectionalLight(0xffffff); //点光源
    spotLight.position.set(550, 100, 550);
    spotLight.intensity = 0.6;
    scene.add(spotLight);

    const loopRebder = () => {};
    //渲染循环
    var animate = function () {
      requestAnimationFrame(animate);
      mesh.rotation.y -= 0.002; //整体转动
      mesh2.rotation.y -= 0.002; //整体转动
      // camera.rotation.y -= 0.002; //整体平移
      render.render(scene, camera);
      stats.update();
    };

    animate();
  }
}

export default Points;
