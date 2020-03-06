/// <reference lib="webworker" />
let ItemHashList = [];
let NumbersHashList: Array<any> = [{
  "number": 0,
  "hash": [2, 9, 8, 3, 0, 0, 0, 0, 10, 2, 0, 0, 10, 10, 1, 0, 10, 0, 0, 0, 0, 10, 8, 0, 3, 0, 0, 0, 0, 6, 10, 2, 0, 0, 0, 0, 0, 4, 10, 3, 0, 0, 0, 0, 0, 4, 10, 3, 3, 0, 0, 0, 0, 5, 10, 2, 9, 0, 0, 0, 0, 9, 9, 0, 10, 3, 0, 0, 10, 10, 1, 0, 3, 9, 10, 3, 0, 0, 0, 0],
  "count": 10
}, {
  "number": 1,
  "hash": [51, 47, 37, 22, 0, 0, 0, 0, 54, 25, 46, 29, 0, 0, 0, 0, 0, 6, 45, 43, 0, 0, 0, 0, 0, 1, 45, 43, 0, 0, 0, 0, 0, 1, 45, 43, 0, 0, 0, 0, 0, 2, 45, 43, 0, 0, 0, 0, 0, 2, 45, 43, 0, 0, 0, 0, 0, 1, 45, 43, 0, 0, 0, 0, 3, 6, 48, 44, 0, 0, 0, 0, 16, 1, 1, 0, 0, 0, 0, 0],
  "count": 60
}, {
  "number": 2,
  "hash": [35, 33, 14, 2, 1, 1, 0, 0, 9, 0, 0, 3, 33, 33, 3, 0, 0, 0, 0, 0, 24, 36, 13, 0, 0, 0, 0, 0, 23, 36, 14, 0, 0, 0, 0, 0, 29, 36, 3, 0, 0, 0, 0, 14, 36, 12, 1, 0, 0, 4, 28, 36, 4, 1, 0, 0, 15, 32, 31, 5, 0, 0, 0, 0, 36, 24, 3, 0, 1, 2, 0, 0, 9, 0, 1, 1, 0, 1, 1, 0],
  "count": 36
}, {
  "number": 3,
  "hash": [31, 28, 14, 6, 0, 0, 0, 0, 27, 1, 0, 0, 29, 30, 6, 0, 0, 0, 0, 0, 13, 31, 16, 0, 0, 0, 0, 0, 23, 29, 8, 0, 3, 25, 32, 10, 6, 0, 0, 0, 2, 19, 25, 14, 23, 11, 1, 0, 0, 0, 0, 0, 5, 28, 29, 2, 0, 0, 0, 0, 1, 23, 31, 5, 1, 0, 0, 1, 17, 32, 25, 2, 32, 21, 6, 2, 1, 0, 0, 0],
  "count": 32
}, {
  "number": 4,
  "hash": [0, 0, 0, 12, 30, 17, 0, 0, 0, 0, 16, 30, 15, 0, 0, 0, 0, 2, 30, 26, 0, 13, 0, 0, 1, 30, 29, 0, 18, 30, 0, 0, 27, 30, 1, 0, 24, 30, 0, 0, 30, 4, 0, 0, 24, 30, 0, 0, 12, 0, 0, 2, 11, 9, 0, 0, 3, 0, 0, 3, 29, 27, 0, 0, 0, 0, 0, 0, 22, 30, 0, 0, 0, 0, 0, 0, 22, 30, 0, 0],
  "count": 30
}, {
  "number": 5,
  "hash": [34, 11, 2, 0, 0, 0, 0, 0, 33, 1, 0, 0, 1, 1, 0, 0, 32, 1, 0, 0, 0, 0, 0, 0, 31, 0, 1, 5, 0, 0, 0, 0, 33, 0, 0, 0, 21, 18, 1, 0, 10, 0, 0, 0, 20, 35, 33, 2, 0, 0, 0, 0, 0, 25, 35, 6, 0, 0, 0, 0, 2, 29, 34, 4, 0, 0, 0, 3, 30, 36, 23, 0, 36, 25, 8, 1, 3, 0, 0, 0],
  "count": 36
}, {
  "number": 6,
  "hash": [3, 10, 13, 8, 2, 0, 0, 0, 13, 9, 0, 0, 1, 9, 7, 0, 13, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 3, 1, 0, 0, 0, 0, 0, 6, 3, 2, 3, 0, 0, 0, 0, 0, 0, 6, 13, 10, 0, 2, 0, 0, 0, 0, 9, 13, 1, 10, 0, 0, 0, 0, 10, 13, 1, 13, 3, 0, 0, 5, 13, 9, 0, 7, 11, 12, 5, 0, 0, 0, 0],
  "count": 13
}, {
  "number": 7,
  "hash": [5, 1, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 12, 19, 8, 0, 0, 0, 0, 1, 18, 18, 1, 0, 0, 0, 0, 4, 19, 0, 0, 0, 0, 0, 2, 19, 7, 0, 0, 0, 0, 0, 8, 19, 0, 0, 0, 0, 0, 1, 18, 17, 0, 0, 0, 0, 0, 1, 19, 14, 0, 0, 0, 0, 0, 2, 19, 12, 0, 0, 0, 0, 0, 3, 19, 10, 0, 0, 0, 0],
  "count": 19
}, {
  "number": 8,
  
  "hash": [12, 18, 18, 8, 1, 0, 0, 0, 19, 3, 0, 0, 13, 19, 8, 0, 16, 0, 0, 0, 3, 17, 17, 1, 19, 1, 0, 0, 3, 19, 17, 0, 13, 19, 8, 0, 3, 8, 0, 0, 19, 12, 0, 5, 16, 6, 0, 0, 9, 0, 0, 0, 5, 18, 19, 5, 1, 0, 0, 0, 0, 6, 19, 11, 13, 0, 0, 0, 6, 18, 17, 4, 17, 19, 13, 5, 3, 3, 0, 0],
  "count": 19
}, {
  "number": 9,
  "hash": [14, 17, 11, 2, 1, 0, 0, 0, 13, 0, 0, 0, 14, 16, 4, 0, 1, 0, 0, 0, 4, 14, 16, 1, 0, 0, 0, 0, 0, 10, 17, 3, 8, 0, 0, 0, 8, 16, 16, 0, 17, 8, 1, 0, 7, 2, 10, 2, 0, 3, 3, 0, 0, 11, 17, 2, 0, 0, 0, 0, 4, 16, 15, 0, 12, 2, 0, 1, 17, 17, 1, 0, 17, 10, 5, 3, 0, 0, 0, 0],
  "count": 17
}];
//转换dHash
for (let hash of NumbersHashList) {
  if (hash.hash instanceof Array) {
    hash.hash = hash.hash.map(v => v / hash.count);
  }
}
for (let hash of ItemHashList) {
  if (hash.hash instanceof Array) {
    hash.hash = hash.hash.map(v => v / hash.count);
  }
}
let BoundDatas = [
  { R: [225, 255], G: [175, 205], B: [0, 10] },
  { R: [208, 222], G: [185, 205], B: [208, 222] },
  { R: [0, 5], G: [170, 190], B: [240, 255] },
  { R: [215, 245], G: [225, 240], B: [50, 60] },
  { R: [0, 10], G: [0, 4], B: [0, 4] },
  { R: [200, 220], G: [165, 179], B: [0, 4] }
];
let XPoint: Uint16Array; //Y轴方向上的匹配点计数
let YPoint: Uint16Array; //X轴方向上的匹配点计数
let XBound = [[]];
let YBound = [[]];
let HashList = [];
let NumberHashList = [];
let OriginHashList = [];
function fillPixelData(ImageData) {
  for (let index = 0; index < ImageData.data.length; index += 4) {
    const r = ImageData.data[index], g = ImageData.data[index + 1], b = ImageData.data[index + 2];
    const x = Math.floor(index / 4) % ImageData.width, y = Math.floor(Math.floor(index / 4) / ImageData.width)
    if (BoundDatas.some((val) => {
      return val.R[0] <= r && val.R[1] >= r && val.G[0] <= g && val.G[1] >= g && val.B[0] <= b && val.B[1] >= b;
    })) {
      XPoint[x]++;
      YPoint[y]++;
    }
  }
}
function analyzeBound() {
  for (let x = 0, WhiteSpace = 0, LastBlank = 0; x < XPoint.length; x++) {
    if (XPoint[x] > 8) {
      if (XBound[XBound.length - 1].length == 0) {
        XBound[XBound.length - 1][0] = x;
        WhiteSpace = 0;
      }
      LastBlank = x;
      WhiteSpace = 0;
    } else if (XPoint[x] > 2 && XPoint[x] <= 8) {
      //给色彩识别打个补丁(避免噪点)
      if (XPoint[x - 1] > 8 || XPoint[x + 1] > 8) {
        if (XBound[XBound.length - 1].length == 0) {
          XBound[XBound.length - 1][0] = x;
          WhiteSpace = 0;
        }
        LastBlank = x;
        WhiteSpace = 0;
      }
    } else if (XBound[XBound.length - 1].length == 1 && WhiteSpace >= 10) {
      XBound[XBound.length - 1][1] = LastBlank;
      XBound.push([])
      WhiteSpace = 0;
    } else if (XBound[XBound.length - 1].length == 1) {
      WhiteSpace++;
    }
  }
  if (XBound[XBound.length - 1].length == 1) {
    if (Math.abs(((XPoint.length - 1) - XBound[XBound.length - 1][0]) - (XBound[XBound.length - 2][1] - XBound[XBound.length - 2][0])) < 5) {
      XBound[XBound.length - 1][1] = XPoint.length - 1
    } else {
      XBound.pop();
    }
  } else {
    XBound.pop();
  }
  let MaxWidthinLine = [];
  for (let x = 0; x < XBound.length; x++) {
    MaxWidthinLine.push(XBound[x][1] - XBound[x][0]);
  }
  let mw = Math.round(MaxWidthinLine.reduce((a, b) => a + b) / MaxWidthinLine.length);
  for (let x = 0; x < XBound.length; x++) {
    if (XBound[x][1] - XBound[x][0] < 50) {
      XBound.splice(x, 1)
      x--;
    } else {
      if (Math.abs((XBound[x][1] - XBound[x][0]) - mw) > 20) {
        XBound[x][1] = XBound[x][0] + Math.max(...MaxWidthinLine);
      }
    }
  }
  // 纵向的数据量大，不用考虑噪点问题
  for (let y = 0, WhiteSpace = 0, LastBlank = 0; y < YPoint.length; y++) {
    if (YPoint[y] > 8) {
      if (YBound[YBound.length - 1].length == 0) {
        YBound[YBound.length - 1][0] = y;
        WhiteSpace = 0;
      }
      LastBlank = y;
    } else if (YBound[YBound.length - 1].length == 1 && WhiteSpace >= 10) {
      YBound[YBound.length - 1][1] = LastBlank;
      YBound.push([])
      WhiteSpace = 0;
    } else if (YBound[YBound.length - 1].length == 1) {
      WhiteSpace++;
    }
  }
  if (YBound[YBound.length - 1].length == 1) {
    YBound[YBound.length - 1][1] = YPoint.length - 1
  } else {
    YBound.pop();
  }
  for (let y = 0; y < YBound.length; y++) {
    if (YBound[y][1] - YBound[y][0] < 50) {
      YBound.splice(y, 1)
      y--;
    }
  }
}
addEventListener('message', (message) => {
  switch (message.data.method) {
    case "LoadHashData":
      ItemHashList = message.data.Data;
      for (let hash of ItemHashList) {
        if (hash.hash instanceof Array) {
          hash.hash = hash.hash.map(v => v / hash.count);
        }
      }
      break;
    case "ImageDataLoad":
      postMessage({ text: "图像数据预处理 - 边界识别", progress: 0.1 });
      XPoint = new Uint16Array(message.data.data.width);
      YPoint = new Uint16Array(message.data.data.height);
      XBound = [[]];
      YBound = [[]];
      HashList = [];
      NumberHashList = []
      fillPixelData(message.data.data);
      postMessage({ method: "status", text: "分析图像边界", progress: 0.2 });
      analyzeBound();
      postMessage({ method: "status", text: "主线程切图(页面可能暂时卡死)", progress: 0.35 });
      postMessage({ method: "clipImage", XBound: XBound, YBound: YBound });
      break;
    case "calcDhash":
      HashList = message.data.ImageDatas.map((item: ImageData) => {
        let HashString = "";
        for (let index = 0; index < item.data.length; index += 4) {
          if (Math.floor(index / 4) % item.width == 0) continue;
          if (Math.floor((item.data[index - 4] + item.data[index - 3] + item.data[index - 2]) / 3) > Math.floor((item.data[index] + item.data[index + 1] + item.data[index + 2]) / 3)) {
            HashString += 1
          } else {
            HashString += 0
          }
        }
        return HashString
      });
      OriginHashList = [...HashList];
      postMessage({ method: "status", text: "正在判断图像对应的物品", progress: 0.45 });
      HashList = HashList.map((hash: String) => {
        const ConfidenceFilter = ItemHashList.map((hashs) => {
          let Confidence = 0;
          let AllLength = 144;
          for (let i = 0; i < hash.length; i++) {
            if (hash[i] == "1") { Confidence += hashs.hash[i]; } else { Confidence += 1 - hashs.hash[i]; }
          }
          Confidence /= AllLength;
          return {
            id:hashs.id,
            hash:hashs.hash,
            confidence:Confidence,
            count:hashs.count
          }; // 深拷贝
        }).sort((a, b) => {
          return b.confidence - a.confidence
        })
        if (ConfidenceFilter[0].confidence <= 0.75) {
          ConfidenceFilter.unshift({
            id: "0000",
            hash: "",
            count: 0,
            confidence: 1
          });
        }
        return ConfidenceFilter;
      });
      postMessage({ method: "status", text: "主线程切割数字(页面可能暂时卡死)", progress: 0.57 });
      postMessage({ method: "getNumberData" });
      break;
    case "getItemCount":
      postMessage({ method: "status", text: "正在识别物品数量", progress: 0.6 });
      NumberHashList = message.data.ImageDatas.map((v) => {
        return v.map((item: ImageData) => {
          let HashString = "";
          for (let index = 0; index < item.data.length; index += 4) {
            if (Math.floor(index / 4) % item.width == 0) continue;
            if (Math.floor((item.data[index - 4] + item.data[index - 3] + item.data[index - 2]) / 3) > Math.floor((item.data[index] + item.data[index + 1] + item.data[index + 2]) / 3)) {
              HashString += 1
            } else {
              HashString += 0
            }
          }
          return HashString
        });
      });
      let Numbers = NumberHashList.map((Items) => {
        return Number(Items.map((hash) => {
          let MaybeNumbers = NumbersHashList.map((hashs) => {
            let Confidence = 0;
            let AllLength = 80;
            for (let i = 0; i < hash.length; i++) {
              if (hash[i] == "1") { Confidence += hashs.hash[i] } else { Confidence += 1 - hashs.hash[i] }
            }
            Confidence /= AllLength;
            hashs.confidence = Confidence;
            return hashs;
          }).sort((a, b) => {
            return b.confidence - a.confidence
          })
          if (MaybeNumbers[0].confidence > 0.785) {
            return MaybeNumbers[0].number;
          } else {
            return null;
          }
        }).join(""))
      });
      postMessage({ method: "status", text: "识别完成，点击下方物品可以进行修改。", progress: 1 });
      postMessage({ method: "DetectResult", NumberResult: Numbers, Items: HashList });
      break;
    case "getItemHashs":
      postMessage({ method: "SingleItemHash", Item: HashList[message.data.index], OriginHash: OriginHashList[message.data.index] });
  }
});
