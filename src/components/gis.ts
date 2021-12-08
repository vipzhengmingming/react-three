var GIO = require("giojs");
class Gis {
  controller: any;
  constructor(domID: string) {
    // 获得用来来承载您的IO地球的容器
    var container = document.getElementById(domID);
    var controller = new GIO.Controller(container);
    controller.configure({
      color: {
        surface: 0xff0000, //地球表面的颜色
        selected: "#0C3859", //选中国家的颜色
        halo: "#012f59", //光晕的颜色
      },
      brightness: {
        mentioned: 1, //被提及国家的亮度
        related: 1, //有关国家的亮度
        ocean: 0.8, //海洋的亮度
      },
    });
    controller.lightenMentioned(true);
    controller.setTransparentBackground(true); //设置背景色为透明色
    // 启用自动旋转功能，将转速设置为1（同时1也是默认的转速）
    controller.setAutoRotation(false, 1);
    controller.init();
    this.controller = controller;
  }
  addData(data: Array<any>) {
    // 添加数据
    // this.controller.addData(data);
  }
}

export default Gis;
