// index.js
// 获取应用实例
// import drawQrcode from "weapp-qrcode-canvas-2d";
const app = getApp()
let ctx = null;
let canvasCtx = null;
Page({
  data: {
    url: ''
  },

  onLoad() {
    ctx = wx.createCameraContext();
  },

  onShow() {
    this.changeText()
  },

  changeText: function () {
    wx.getSystemInfo({
      success: (result) => {
        console.log('result', result);
      },
    })
  },

  takePhoto: function () {
    const that = this;
    console.log('takePhoto');
    ctx.takePhoto({
      quality: 'heigh',
      success: (res) => {
        if (res.tempImagePath) {
          that.tackCanvas(res.tempImagePath);
        }


      }
    })
  },
  tackCanvas: function (path) {
    const that = this;
    wx.getImageInfo({
      src: path,
      success: (imageInfo) => {
        console.log('imageInfo', imageInfo);
        wx.createSelectorQuery().select('#image-canvas').fields({
          node: true,
          size: true
        }).exec((canRes) => {
          console.log('createSelectorQuery canRes', canRes)
          const canvas = canRes[0].node;
          canvasCtx = canvas.getContext('2d');
          const img = canvas.createImage();
          img.src = path;
          
          img.onload = () => { 
            canvasCtx.drawImage(img, 0, 0);
            canvasCtx.save();
            wx.canvasToTempFilePath({
              width: 260,
              height: 150,
              canvasId: 'canvasId',
              fileType: 'jpg',
              quality:'1',
              canvas: canvas,
              success: (canvasToPathResult) => {
                console.log('canvasToPathResult', canvasToPathResult);
                that.setData({
                  url: canvasToPathResult.tempFilePath
                })
              }
            })
          }
      
          // canvasCtx.beginPath();
          // canvasCtx.arc(260,150)
          // canvasCtx.clip();

          // canvasCtx.draw();
         
        })
      }
    })
  }
})