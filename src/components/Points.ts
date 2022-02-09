import Orbitcontrols from "three-orbitcontrols";
import Stats from "stats.js";
import TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
// import GLTFLoader from "three-gltf-loader";
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

    let canvas: any;

    function changeCanvas() {
      canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      (app as Element).appendChild(canvas);
      const ctx = canvas.getContext("2d");
      ctx.font = "16pt Arial";
      ctx.fillStyle = "orange";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < canvas.width; i += 10) ctx.fillText("踏得网", i, i);
    }
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

    //增加监控的信息状态
    // const stats = new Stats();
    // container.appendChild( stats.dom );
    let mesh: any;
    let mesh2: any;
    function initObject() {
      // 定义一种线条的材质
      const material = new THREE.LineBasicMaterial({
        color: "red",
        linewidth: 10,
      });
      // 面的材质
      var mshBasicMaterial = new THREE.MeshBasicMaterial({
        color: 0x0000ff, //三角面颜色
        side: THREE.DoubleSide, //两面可见
      });
      //材质对象
      var vertexmaterial = new THREE.PointsMaterial({
        // 使用顶点颜色数据渲染模型，不需要再定义color属性
        // color: 0xff0000,
        size: 10.0, //点对象像素尺寸
      });
      //这里用这个构造
      const geometry = new THREE.BufferGeometry();
      var vertices = new Float32Array([
        0,
        0,
        0, //顶点1坐标
        50,
        0,
        0, //顶点2坐标
        0,
        50,
        0, //顶点3坐标
        0,
        0,
        0, //顶点4坐标
        0,
        0,
        100, //顶点5坐标
        50,
        0,
        0, //顶点6坐标
      ]);
      // 创建属性缓冲区对象
      var attribue = new THREE.BufferAttribute(vertices, 3);
      // 设置几何体attributes属性的位置属性
      geometry.attributes.position = attribue;
      var colors = new Float32Array([
        1,
        0,
        0, //顶点1颜色
        0,
        1,
        0, //顶点2颜色
        0,
        0,
        1, //顶点3颜色

        1,
        1,
        0, //顶点4颜色
        0,
        1,
        1, //顶点5颜色
        1,
        0,
        1, //顶点6颜色
      ]);
      // 设置几何体attributes属性的颜色color属性
      geometry.attributes.color = new THREE.BufferAttribute(colors, 3);
      var normals = new Float32Array([
        0,
        0,
        1, //顶点1法向量
        0,
        0,
        1, //顶点2法向量
        0,
        0,
        1, //顶点3法向量

        0,
        1,
        0, //顶点4法向量
        0,
        1,
        0, //顶点5法向量
        0,
        1,
        0, //顶点6法向量
      ]);
      // 设置几何体attributes属性的位置normal属性
      geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);
      //下述基本一样
      // mesh = new THREE.Line(geometry, [mshBasicMaterial, material]);
      mesh = new THREE.Mesh(geometry, vertexmaterial);
      mesh.position.set(0, 0, 10);
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
      mesh2 = new THREE.Line(geometry2, material);
      mesh.position.set(20, 0, 0);
      scene.add(mesh2);
    }
    function initTween() {
      new TWEEN.Tween(mesh.rotation)
        .to({ y: 360 }, 3000)
        .repeat(Infinity)
        .start();
      new TWEEN.Tween(mesh2.rotation)
        .to({ y: 360 }, 3000)
        .repeat(Infinity)
        .start();
    }
    function initCubeGeometry() {
      var planeGeometry2 = new THREE.PlaneGeometry(500, 500, 1, 1);
      // 漫反射 MeshLambertMaterial  镜面反射 MeshPhongMaterial
      var material = new THREE.MeshLambertMaterial();
      material.side = THREE.DoubleSide;
      var planeGeometryMesh = new THREE.Mesh(planeGeometry2, material);
      // planeGeometryMesh.rotateX(90);
      // scene.add(planeGeometryMesh);
      // 几何体位置起点全部在物体的中心
      var geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
      // 漫反射 MeshLambertMaterial  镜面反射 MeshPhongMaterial
      var material = new THREE.MeshLambertMaterial({ color: 0xffffff }); // 我们使用了兰伯特材质，并将这种材质赋予了黑色
      var cylinder = new THREE.Mesh(geometry, material);
      var axesHelper = new THREE.AxesHelper(50);
      cylinder.add(axesHelper);
      cylinder.rotateZ(45);
      cylinder.translateX(100);
      group.add(cylinder);
      // 创建几何体和材质----Mesh 网格, 使用canvas 当作材质
      // var texture1 = new THREE.Texture(canvas);
      // var geometry2 = new THREE.BoxBufferGeometry(20, 20, 20);
      // var material2 = new THREE.MeshBasicMaterial({ map: texture1 });
      // // 如果更改了图像，画布，视频和数据纹理，则需要设置以下标志：
      // texture1.needsUpdate = true;
      // var mesh3 = new THREE.Mesh(geometry2, material2);
      // mesh3.position.set(0, 0, 10);
      // scene.add(mesh3);

      // var textureLoader = new THREE.TextureLoader(); // 纹理加载器
      // var texture = textureLoader.load("/assets/gis.png"); // 加载图片，返回Texture对象
      // var planeGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
      // var material3 = new THREE.MeshBasicMaterial({ map: texture });
      // material3.side = THREE.DoubleSide; // 为什么我的物体的一部分是不可见的？
      // var mesh = new THREE.Mesh(planeGeometry, material3);
      // scene.add(mesh);

      // 立方几何体
      var boxGeometry = new THREE.BoxGeometry(20, 20, 20);
      const materialArr = [];
      for (var i = 0; i < boxGeometry.groups.length; i++) {
        var hex = Math.random() * 0xffffff;
        var material4 = new THREE.MeshBasicMaterial({
          color: new THREE.Color(hex),
          opacity: 0.5,
          transparent: true,
        });
        materialArr.push(material4);
      }
      var mesh4 = new THREE.Mesh(boxGeometry, materialArr);
      mesh4.name = "我是最帅的";
      // mesh4.position.set(50, 10, 20);
      group.add(mesh4);
      // group.translateY(20);
      console.log("查看group的子对象", scene.children);
    }

    // 材质Material
    const showMaterial = () => {
      var geometry = new THREE.SphereGeometry(100, 25, 25); //创建一个球体几何对象
      // 创建一个点材质对象
      var material = new THREE.PointsMaterial({
        color: 0x0000ff, //颜色
        size: 3, //点渲染尺寸
      });
      // 直线基础材质对象
      var material2 = new THREE.LineBasicMaterial({
        color: 0x0000ff,
      });

      var point = new THREE.Points(geometry, material);
      scene.add(point); //网格模型添加到场景中
      var line = new THREE.Line(geometry, material2); //线模型对象
      scene.add(line); //网格模型添加到场景中
    };
    // 相机作为Orbitcontrols的参数，支持鼠标交互
    const controls = new Orbitcontrols(camera, render.domElement);
    controls.addEventListener("change", (e: Event) => {
      //  render.render(scene, camera);
    }); //监听鼠标、键盘事件
    render.domElement.removeAttribute("tabindex"); //去除鼠标控件使用时的白色边框
    function initLight() {
      // 平行光
      const light = new THREE.DirectionalLight(0xffffff);
      light.position.set(100, 100, 200);
      scene.add(light);
      // // 环境光
      // const light2 = new THREE.AmbientLight(0xff0000);
      // light2.position.set(100, 100, 200);
      // scene.add(light2);
      // 点光源
      const pointLight = new THREE.PointLight(0xff0000, 1, 40);
      pointLight.position.set(10, 10, 10);
      scene.add(pointLight);
      //  光源的辅助
      // var spotLightHelper = new THREE.PointLightHelper(pointLight);
      // scene.add(spotLightHelper);

      const spotLight = new THREE.SpotLight(0xffff00);
      spotLight.position.set(100, 1000, 100);
      scene.add(spotLight);
      spotLight.castShadow = true;

      spotLight.shadow.mapSize.width = 1024;
      spotLight.shadow.mapSize.height = 1024;

      spotLight.shadow.camera.near = 500;
      spotLight.shadow.camera.far = 4000;
      spotLight.shadow.camera.fov = 30;
      var spotLightHelper = new THREE.SpotLightHelper(spotLight);
      scene.add(spotLightHelper);
    }
    //添加光源:环境光和点光源
    // let ambi = new THREE.AmbientLight(0xffffff); //环境光
    // scene.add(ambi);
    // let directionalLight = new THREE.DirectionalLight(0xffffff, 1); //点光源
    // scene.add(directionalLight);
    // const spotLight = new THREE.SpotLight(0xffff00, 1.0, 0, 75);
    // scene.add(spotLight);
    // 世界坐标系
    const initWorldPosition = () => {
      var geometry = new THREE.BoxGeometry(20, 20, 20);
      var material = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
      });
      var mesh = new THREE.Mesh(geometry, material);
      // mesh的本地坐标设置为(50, 0, 0)
      mesh.position.set(50, 0, 0);
      var group = new THREE.Group();
      // group本地坐标设置和mesh一样设置为(50, 0, 0)
      // mesh父对象设置position会影响得到mesh的世界坐标
      group.position.set(50, 0, 0);
      group.add(mesh);
      scene.add(group);

      // .position属性获得本地坐标
      console.log("本地坐标", mesh.position);

      // getWorldPosition()方法获得世界坐标
      //该语句默认在threejs渲染的过程中执行,如果渲染之前想获得世界矩阵属性、世界位置属性等属性，需要通过代码更新
      scene.updateMatrixWorld(true);
      var worldPosition = new THREE.Vector3();
      mesh.getWorldPosition(worldPosition);
      console.log("世界坐标", worldPosition);
    };
    var spriteGroup = new THREE.Group();
    scene.add(spriteGroup);
    // 精灵模型Sprite---下雨系统
    const initSprite = () => {
      var texture = new THREE.TextureLoader().load("/assets/snowflake2.png");
      // 创建精灵材质对象SpriteMaterial
      // var spriteMaterial = new THREE.SpriteMaterial({
      //   color: 0xff00ff, //设置精灵矩形区域颜色
      //   rotation: Math.PI / 3, //旋转精灵对象45度，弧度值
      //   map: texture, //设置精灵纹理贴图
      // });
      // // 创建精灵模型对象，不需要几何体geometry参数
      // var sprite = new THREE.Sprite(spriteMaterial);
      // scene.add(sprite);
      // // 控制精灵大小，比如可视化中精灵大小表征数据大小
      // sprite.scale.set(10, 10, 1); //// 只需要设置x、y两个分量就可以
      for (let i = 0; i < 400; i++) {
        var spriteMaterial = new THREE.SpriteMaterial({
          map: texture, //设置精灵纹理贴图
        });
        // 创建精灵模型对象
        var sprite = new THREE.Sprite(spriteMaterial);
        spriteGroup.add(sprite);
        // 控制精灵大小,
        sprite.scale.set(8, 10, 1); //// 只需要设置x、y两个分量就可以
        var k1 = Math.random() - 0.5;
        var k2 = Math.random() - 0.5;
        var k3 = Math.random() - 0.5;
        // 设置精灵模型位置，在整个空间上上随机分布
        sprite.position.set(200 * k1, 200 * k3, 200 * k2);
      }
    };

    // STLLoader
    // 辅助三维坐标系AxisHelper
    const initAxesHelper = () => {
      // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
      var axesHelper = new THREE.AxesHelper(50);
      scene.add(axesHelper);
    };
    /*============模型加载==============*/

    // 记载模型
    const getGLTFmodel = () => {
      //  哪一种三维物体格式能够得到最好地支持？
      // 推荐使用glTF（gl传输格式）来对三维物体进行导入和导出，由于glTF这种格式专注于在程序运行时呈现三维物体，
      // 因此它的传输效率非常高，且加载速度非常快
      const loader = new GLTFLoader();
      loader.load(
        "/ftm/scene.gltf",
        (gltf) => {
          // called when the resource is loaded
          scene.add(gltf.scene);
        },
        (xhr) => {
          // called while loading is progressing
          console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
        },
        (error) => {
          // called when loading has errors
          console.error("An error happened", error);
        }
      );
    };

    // 1-.stl格式模型加载----相当于几何体
    const initSTLLoader = () => {
      var loader = new STLLoader();
      // 立方体默认尺寸长宽高各200
      loader.load(
        "/threejs/examples/models/stl/ascii/slotted_disk.stl",
        function (geometry: any) {
          // 控制台查看加载放回的threejs对象结构
          console.log(geometry);
          // 查看顶点数，一个立方体6个矩形面，每个矩形面至少2个三角面，每个三角面3个顶点，
          // 如果没有索引index复用顶点，就是说一个立方体至少36个顶点
          console.log(geometry.attributes.position.count);
          // 缩放几何体
          // geometry.scale(0.5,0.5,0.5);
          // 几何体居中
          // geometry.center();
          // 平移立方体
          // geometry.translate(-50,-50,-50);
          var material = new THREE.MeshBasicMaterial({
            color: "red",
          }); //材质对象Material
          var mesh = new THREE.Points(geometry, material); //网格模型对象Mesh
          scene.add(mesh); //网格模型添加到场景中
        }
      );
    };

    // 2-.obj 模型加载  obj + mtl
    const initOBJandMTL = () => {
      let OBJLoader2 = new OBJLoader(); //obj加载器
      let MTLLoader2 = new MTLLoader(); //材质文件加载器
      MTLLoader2.load(
        "/threejs/examples/models/obj/male02/male02_dds.mtl",
        function (materials: any) {
          // 返回一个包含材质的对象MaterialCreator
          console.log(materials);
          //obj的模型会和MaterialCreator包含的材质对应起来
          OBJLoader2.setMaterials(materials);
          OBJLoader2.load(
            "/threejs/examples/models/obj/male02/male02.obj",
            function (obj: any) {
              console.log(obj);
              //  obj.scale.set(2, 2, 2); //放大obj组对象
              scene.add(obj); //返回的组对象插入场景中
            }
          );
        }
      );
    };

    let mixer: any = null; //声明一个混合器变量
    // 3- pbx模型帧动画
    const initFBXLoader = () => {
      var loader = new FBXLoader(); //创建一个FBX加载器
      loader.load(
        "/threejs/examples/models/fbx/Samba%20Dancing.fbx",
        function (obj) {
          // console.log(obj);//查看加载后返回的模型对象
          scene.add(obj);
          // 适当平移fbx模型位置
          obj.translateY(-80);

          // obj作为参数创建一个混合器，解析播放obj及其子对象包含的动画数据
          mixer = new THREE.AnimationMixer(obj);
          // 查看动画数据
          console.log(obj.animations);
          // obj.animations[0]：获得剪辑对象clip
          var AnimationAction = mixer.clipAction(obj.animations[0]);
          // AnimationAction.timeScale = 1; //默认1，可以调节播放速度
          // AnimationAction.loop = THREE.LoopOnce; //不循环播放
          // AnimationAction.clampWhenFinished=true;//暂停在最后一帧播放的状态
          AnimationAction.play(); //播放动画
        }
      );
    };

    // 参照物 网格
    const initGrid = () => {
      // 网格的边长是1000，每个小网格的边长是50
      var helper = new THREE.GridHelper(500, 50, 0x0000ff, 0x808080);
      scene.add(helper);
    };
    // 窗口大小响应
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      render.setSize(window.innerWidth, window.innerHeight);
    }
    // 渲染函数
    function spriteGroupRender() {
      // 每次渲染遍历雨滴群组，刷新频率30~60FPS，两帧时间间隔16.67ms~33.33ms
      // 每次渲染都会更新雨滴的位置，进而产生动画效果
      spriteGroup.children.forEach((sprite) => {
        // 雨滴的y坐标每次减1
        sprite.position.y -= 1;
        if (sprite.position.y < -200) {
          // 如果雨滴落到地面，重置y，从新下落
          sprite.position.y = 200;
        }
      });
    }

    var clock = new THREE.Clock();
    // 渲染函数
    function renderClock() {
      if (mixer !== null) {
        //clock.getDelta()方法获得两帧的时间间隔
        // 更新混合器相关的时间
        mixer.update(clock.getDelta());
      }
    }
    let mouse: any = null;
    /*=========事件交互========*/
    const onDocumentMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      mouse = new THREE.Vector2();
      mouse.x = (event.clientX / width) * 2 - 1;
      mouse.y = -(event.clientY / height) * 2 + 1;
    };
    const raycaster: any = new THREE.Raycaster();
    const initRaycaster = () => {
      if (!mouse) return;
      camera.updateMatrixWorld();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children, false);

      if (intersects.length > 0) {
        for (var i = 0; i < intersects.length; i++) {
          intersects[i].object.material.color.set(0xff0000);
        }

        // const targetDistance: number = intersects[0].distance;
        // camera.setFocalLength(targetDistance);
        // INTERSECTED = intersects?.[0]?.object;
        // INTERSECTED.material.color = new THREE.Color(0xff0000);
      }
      mouse = null;
    };
    //渲染循环
    var animate = function () {
      requestAnimationFrame(animate);
      spriteGroupRender();
      renderClock();
      //  弧度计算公式 度＝弧度×180°/π
      // 将上面的弧度变为0.01,计算的结果是0.57，也就是每个帧循环将旋转0.57度。
      //  initTween();
      // mesh2.rotation.y -= 0.002; //整体转动
      // camera.rotation.y -= 0.002; //整体平移
      // texture.needsUpdate = true;
      initRaycaster();
      render.render(scene, camera);
      stats.update();
      // TWEEN.update();
    };
    // initAxesHelper();
    // initGrid();
    // showMaterial();
    // changeCanvas();
    initLight();
    initObject();
    // initWorldPosition();
    // initCubeGeometry();
    // getGLTFmodel();
    // initTween();
    // initSprite();
    // initSTLLoader();
    // initOBJandMTL();
    app?.addEventListener("click", onDocumentMouseMove);
    initFBXLoader();
    animate();
  }
}

export default Points;
