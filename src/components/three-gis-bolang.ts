// import Orbitcontrols from "three-orbitcontrols";
import * as THREE from "three";
// import Stats from "stats.js";
class ThreeGis {
  constructor(domID: string) {
    /********************************************************/
    var app = document.getElementById(domID);
    const width = app?.offsetWidth ?? 0;
    const height = app?.offsetHeight ?? 0;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0008); //设置雾

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.set(500, 100, 500); //创建相机并设置位置
    camera.lookAt(scene.position);

    let spriteGeometry = new THREE.BufferGeometry();
    let position = new Float32Array(50 * 50 * 3); //创建顶点存储空间
    let scales = new Float32Array(50 * 50); //创建存储尺寸的空间
    let i = 0,
      j = 0;
    for (let x = 0; x < 50; x++) {
      //创建坐标点
      for (let y = 0; y < 50; y++) {
        position[i] = x * 100 - (50 * 100) / 2; //x
        position[i + 1] = 0; //y
        position[i + 2] = y * 100 - (50 * 100) / 2; //z
        scales[j] = 1;
        i += 3;
        j++;
      }
    }
    spriteGeometry.addAttribute(
      "position",
      new THREE.BufferAttribute(position, 3)
    ); //把数据传入顶点着色器
    spriteGeometry.addAttribute("scale", new THREE.BufferAttribute(scales, 1)); //

    let spriteMaterial = new THREE.ShaderMaterial({
      //自定义着色器
      uniforms: { color: { value: new THREE.Color(0x00ced1) } },
      vertexShader: document.getElementById("vertexshader")
        ?.textContent as string, //顶点着色器属性vertexShader的属性值是顶点着色器代码字符串
      fragmentShader: document.getElementById("fragmentshader")
        ?.textContent as string, //片元着色器属性fragmentShader的属性值是片元着色器代码字符串。
    });

    const sprite = new THREE.Points(spriteGeometry, spriteMaterial);
    scene.add(sprite);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor("rgba(255,255,255,0)"); // 环境背景色
    renderer.setSize(width, height);
    (app as Element).appendChild(renderer.domElement);
    let count = 0;
    run();
    function run() {
      requestAnimationFrame(run);
      let positions: any = sprite.geometry.attributes.position.array;
      let scales: any = sprite.geometry.attributes.scale.array; //BufferGeometry几何体对象具有.attributes属性，BufferGeometry.attributes具有顶点位置、顶点法向量、顶点uv坐标等属性，对应着色器中相应的attribute变量。
      let i = 0,
        j = 0;

      for (let ix = 0; ix < 50; ix++) {
        for (let iy = 0; iy < 50; iy++) {
          positions[i + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50; //y轴上面呈现波浪形

          scales[j] =
            (Math.sin((ix + count) * 0.3) + 1) * 8 +
            (Math.sin((iy + count) * 0.5) + 1) * 8;

          i += 3;
          j++;
        }
      }

      sprite.geometry.attributes.position.needsUpdate = true; //通知顶点位置更新
      sprite.geometry.attributes.scale.needsUpdate = true;

      renderer.render(scene, camera);
      count += 0.1;
    }
  }
}

export default ThreeGis;
