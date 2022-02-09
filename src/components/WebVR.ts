import Orbitcontrols from "three-orbitcontrols";
import Stats from "stats.js";
import * as THREE from "three";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
// import GLTFLoader from "three-gltf-loader";
class WebVR {
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

    //创建相机
    // ===相机 camera 的作用是定义可视域，相当于我们的双眼，生产一个个快照，最为常用的是 PerspectiveCamera 透视摄像机，
    // 其他还有 ArrayCamera 阵列摄像机（包含多个子摄像机，通过这一组子摄像机渲染出实际效果，适用于 VR 场景），
    // CubeCamera 立方摄像机（创建六个 PerspectiveCamera（透视摄像机），适用于镜面场景），StereoCamera 立体相机
    //（双透视摄像机适用于 3D 影片、视差效果）。相机主要分为两类正投影相机和透视相机，正投影相机的话，
    // 所有方块渲染出来的尺寸都一样； 对象和相机之间的距离不会影响渲染结果，而透视相机接近真实世界，看物体会产生远近高低各不同
    const camera = new THREE.PerspectiveCamera(90, width / height, 1, 10000); //PerspectiveCamera 透视摄像机--模拟人眼的视觉，根据物体距离摄像机的距离，近大远小
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
    (app as Element).appendChild(VRButton.createButton(render));
    //  render.vr.enabled = true;
    // 相机作为Orbitcontrols的参数，支持鼠标交互
    const controls = new Orbitcontrols(camera, render.domElement);
    render.domElement.removeAttribute("tabindex"); //去除鼠标控件使用时的白色边框
    render.setAnimationLoop(function () {
      render.render(scene, camera);
    });
  }
}

export default WebVR;
