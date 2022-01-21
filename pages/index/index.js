const app = getApp()
let ctxWidth = '';
let ctxHeight = '';
let ctx = null; //Camera
let canvaCtx=null;//canvas
Page({
  data: {
 
  },
  changeText() {
    wx.getSystemInfo({
      success: res => {
        let convasX = res.screenWidth / 4; //遮罩层上下的高度(生成canvas的起始横坐标)
        let convasY = res.screenHeight / 5; //遮罩层左右的宽度(生成canvas的起始纵坐标)
        let canvasWidth = convasX * 3; //中间裁剪部位的宽度
        let canvasHeight = convasY * 3; //中间裁剪部位的高度
        let convasXL = convasX / 2;
        ctxWidth = canvasWidth; //canvas的宽度
        ctxHeight = canvasHeight; //canvas的高度
        this.setData({
          info: res,
          canvasWidth,
          canvasHeight,
          convasX,
          convasXL,
          convasY
        })
      }
    })
  },
  onLoad: function () {},
  onShow() {
    this.changeText()
  },
  takePhoto() {
    ctx = wx.createCameraContext(); //初始化camera
    ctx.takePhoto({ //生成图片
      quality: 'high',
      success: (res) => { //得到图片
        this.takeCanvas(res.tempImagePath)
        this.setData({
          baseImg: res.tempImagePath,
          isBaseImg: true,
          isCanvas:true
        })
      }
    })
  },
  takeCanvas(path) { //将拍摄的照片绘制到canvas上
    wx.getImageInfo({
      src: path,
      success: imgInfo => {
        let {info} = this.data;
        let convasX = imgInfo.width / 4;
        let convasY = imgInfo.height / 5;
        let canvasWidth = convasX * 3;
        let canvasHeight = convasY * 5;
        let convasXL = convasX / 2;
        // 我这里宽度和高度都计算了设备比，其实两个值是一样的 ，计算一个就够了
        let prxHeight = info.windowHeight / imgInfo.height;//计算设备比
        let prxWidth = info.windowWidth / imgInfo.width;//计算设备比
        // ctx = wx.createCanvasContext("myCanvas", this);//自定义组件，需要加this
        console.log('imgInfo.height ', imgInfo.height );
        console.log('canvasHeight', canvasHeight);
        canvaCtx = wx.createCanvasContext("myCanvas");//自定义组件，需要加this
        canvaCtx.drawImage(path,convasXL,(convasY-20),canvasWidth,canvasHeight,0,0,(parseInt(canvasWidth) * prxWidth),(parseInt(canvasHeight) * prxHeight) );//绘制到canvas上的位置，canvas的宽高等
        canvaCtx.draw(true, () => {
          wx.canvasToTempFilePath({
            fileType: "png",
            quality: 1,
            canvasId: "myCanvas",
            success: canvasToPath => {
              console.log('canvasToPath', canvasToPath.tempFilePath);
              this.setData({
                isSuccess:true,
                isBaseImg: false,
                isCanvas:false,
                baseImg: canvasToPath.tempFilePath,
                srcCanvasPath: canvasToPath.tempFilePath
              })
            }
          })
          // wx.canvasToTempFilePath({
          //   fileType: "jpg",
          //   quality: 0.3,
          //   canvasId: "myCanvas",
          //   success: canvasToPath => {
          //     this.setData({
          //       isBaseImg: false,
          //       baseImg: canvasToPath.tempFilePath,
          //       srcCanvasPath: canvasToPath.tempFilePath
          //     })
          //   }
          // }, this)//自定义组件需要加this
        })
      }
    })
  },
  clearPhoto(){
    canvaCtx.clearRect(0,0,ctxWidth, ctxHeight)
    canvaCtx.draw()
    this.setData({
        srcCanvasPath:"",
        isCanvas:false,
        isSuccess:false,
        isBaseImg:false
    })
  },
  confirmBack(){//确定绘制成功后的操作，根据自己的需求写即可
 
  }
})