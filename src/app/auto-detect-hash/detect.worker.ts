/// <reference lib="webworker" />
// tslint:disable: all
let ItemHashList = [];
let NumbersHashList: Array<any> = [
    {
        number: 5,
        hash: [6, 3, 0, 0, 1, 1, 0, 0, 6, 1, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 1, 0, 0, 2, 3, 1, 0, 1, 0, 0, 0, 4, 6, 6, 0, 0, 0, 0, 0, 0, 5, 6, 2, 0, 0, 0, 0, 0, 6, 6, 0, 1, 0, 0, 0, 5, 6, 6, 0, 6, 4, 1, 1, 0, 0, 0, 0],
        count: 6
    },
    {
        number: 4,
        hash: [0, 0, 0, 11, 13, 5, 0, 0, 0, 0, 11, 13, 5, 0, 0, 0, 0, 3, 13, 8, 0, 0, 0, 0, 3, 12, 13, 1, 10, 10, 0, 0, 13, 11, 0, 0, 13, 13, 0, 0, 13, 2, 0, 0, 12, 13, 0, 0, 1, 0, 0, 3, 6, 2, 0, 0, 0, 0, 1, 3, 13, 13, 0, 0, 0, 0, 0, 0, 12, 13, 0, 0, 0, 0, 0, 0, 12, 13, 0, 0],
        count: 13
    },
    {
        number: 0,
        hash: [7, 9, 8, 2, 0, 0, 0, 0, 9, 5, 0, 1, 9, 8, 2, 0, 7, 0, 0, 0, 2, 8, 6, 0, 3, 0, 0, 0, 2, 7, 6, 1, 2, 0, 0, 0, 2, 7, 8, 2, 1, 0, 0, 0, 1, 7, 8, 2, 3, 0, 0, 0, 1, 9, 8, 2, 5, 0, 0, 0, 2, 8, 6, 0, 8, 4, 1, 0, 6, 8, 2, 0, 5, 9, 7, 3, 0, 0, 0, 0],
        count: 9
    },
    {
        number: 3,
        hash: [8, 6, 4, 1, 0, 0, 0, 0, 4, 0, 0, 0, 8, 8, 2, 0, 0, 0, 0, 0, 5, 9, 4, 0, 0, 0, 0, 2, 9, 7, 3, 0, 3, 9, 9, 2, 1, 0, 0, 0, 0, 6, 8, 5, 7, 4, 1, 0, 0, 0, 0, 0, 3, 8, 7, 4, 0, 0, 0, 0, 1, 5, 8, 4, 0, 0, 0, 2, 5, 8, 6, 2, 9, 6, 4, 2, 1, 0, 0, 0],
        count: 9
    },
    {
        number: 1,
        hash: [11, 8, 6, 3, 0, 0, 0, 0, 10, 4, 10, 4, 1, 1, 0, 0, 0, 1, 7, 10, 1, 1, 0, 0, 0, 0, 6, 10, 0, 1, 1, 0, 0, 0, 6, 10, 1, 1, 1, 0, 1, 1, 7, 10, 0, 0, 1, 0, 0, 1, 8, 7, 0, 1, 1, 0, 0, 1, 8, 7, 1, 1, 0, 0, 1, 2, 9, 8, 1, 1, 0, 0, 2, 1, 1, 0, 0, 1, 1, 0],
        count: 12
    },
    {
        number: 2,
        hash: [9, 7, 5, 1, 0, 0, 0, 0, 1, 0, 0, 0, 8, 9, 3, 0, 0, 0, 0, 0, 5, 9, 4, 0, 0, 0, 0, 0, 5, 9, 4, 0, 0, 0, 0, 0, 9, 9, 3, 0, 0, 0, 0, 6, 9, 4, 0, 0, 0, 2, 8, 9, 2, 0, 0, 0, 4, 9, 8, 1, 0, 0, 0, 0, 9, 7, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        count: 9
    },
    {
        number: 6,
        hash: [2, 5, 5, 4, 0, 0, 0, 0, 5, 4, 0, 0, 0, 4, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 3, 0, 0, 0, 0, 0, 0, 5, 5, 1, 4, 0, 0, 0, 0, 5, 5, 1, 5, 0, 0, 0, 3, 5, 4, 0, 5, 5, 5, 2, 1, 1, 0, 0],
        count: 5
    },
    {
        number: 7,
        hash: [3, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 3, 1, 0, 1, 0, 0, 0, 3, 3, 0, 0, 1, 0, 0, 1, 3, 0, 0, 0, 1, 0, 1, 3, 1, 0, 0, 0, 1, 0, 3, 3, 1, 1, 1, 0, 0, 0, 3, 3, 0, 1, 1, 0, 0, 0, 3, 2, 0, 1, 1, 0, 0, 0, 3, 2, 1, 1, 1, 0, 1, 1, 3, 2, 0, 0, 0, 0],
        count: 4
    },
    {
        number: 8,
        hash: [5, 6, 6, 1, 0, 0, 0, 0, 6, 3, 0, 0, 4, 6, 3, 0, 5, 0, 0, 0, 0, 6, 5, 0, 6, 3, 0, 0, 2, 6, 4, 0, 6, 6, 3, 0, 1, 1, 0, 0, 6, 5, 0, 0, 6, 2, 0, 0, 4, 0, 0, 0, 3, 6, 6, 1, 0, 0, 0, 0, 0, 5, 6, 2, 3, 0, 0, 0, 2, 6, 6, 1, 6, 6, 4, 0, 1, 0, 0, 0],
        count: 6
    },
    {
        number: 9,
        hash: [6, 6, 2, 0, 0, 0, 0, 0, 4, 0, 0, 1, 6, 5, 1, 0, 0, 0, 0, 0, 3, 6, 3, 0, 0, 0, 0, 0, 0, 6, 6, 0, 2, 0, 0, 0, 5, 6, 6, 0, 6, 5, 0, 0, 1, 3, 4, 0, 1, 0, 1, 1, 1, 6, 6, 0, 1, 0, 0, 0, 4, 6, 3, 0, 4, 1, 1, 1, 5, 5, 0, 0, 5, 5, 2, 1, 0, 0, 0, 0],
        count: 6
    }
];
//转换dHash
for (let hash of NumbersHashList) {
    if (hash.hash instanceof Array) {
        hash.hash = hash.hash.map(v => v / hash.count).map(v => (v == 0.5 ? 2 : ((v < 0.5) ? 0 : 1))).join('')
    }
}
for (let hash of ItemHashList) {
    if (hash.hash instanceof Array) {
        hash.hash = hash.hash.map(v => v / hash.count).map(v => (v == 0.5 ? 2 : ((v < 0.5) ? 0 : 1))).join('')
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
        } else if(XPoint[x]>2&&XPoint[x]<=8){
            //给色彩识别打个补丁(避免噪点)
            if(XPoint[x - 1]>8||XPoint[x + 1]>8){
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
                    hash.hash = hash.hash.map(v => v / hash.count).map(v => (v == 0.5 ? 2 : ((v < 0.5) ? 0 : 1))).join('')
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
                        if (hash[i] == hashs.hash[i]) Confidence++;
                        if (hashs.hash[i] == 2) AllLength--;
                    }
                    Confidence /= AllLength;
                    hashs.confidence = Confidence;
                    return hashs;
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
                            if (hash[i] == hashs.hash[i]) Confidence++;
                            if (hashs.hash[i] == 2) AllLength--;
                        }
                        Confidence /= AllLength;
                        hashs.confidence = Confidence;
                        return hashs;
                    }).sort((a, b) => {
                        return b.confidence - a.confidence
                    })
                    return MaybeNumbers[0].confidence > 0.75 ? MaybeNumbers[0].number : null;
                }).join(""))
            })
            postMessage({ method: "status", text: "识别完成，点击下方物品可以进行修改。", progress: 1 });
            postMessage({ method: "DetectResult", NumberResult: Numbers, Items: HashList });
            break;
        case "getItemHashs":
            postMessage({ method: "SingleItemHash", Item: HashList[message.data.index], OriginHash: OriginHashList[message.data.index] });
    }
});
