import { Component, OnInit, ElementRef } from '@angular/core';
import { MdcSnackbarService } from '@blox/material';
import { FetchService } from '../fetch.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-auto-detect',
  templateUrl: './auto-detect-hash.component.html',
  styleUrls: ['./auto-detect-hash.component.scss']
})
export class AutoDetectHashComponent implements OnInit {
  //tslint:disable: all
  ImageElement: HTMLImageElement; // 源图片
  ImageLoaded: boolean;
  Canvas: HTMLCanvasElement;
  Ctx: CanvasRenderingContext2D;
  worker: Worker; // WebWorker
  InfoText = '等待处理';
  progress: 0;
  XBound = []; // X轴与Y轴方向上的物品边界
  YBound = [];
  ItemImages = []; // 每个物品的图像
  ItemImage: any; // 单个物品的图像
  NumberImages = []; // 数字的图像
  textColor: any;
  MaxFontSize: any;
  FontSize = 0;
  ModifyingItem = null;
  ModifyBuffer: any = { have: 0, delete: false };
  Modifying = { x: 0, y: 0 };
  ItemNames: object;
  detectedItemList = [];
  ItemHashList: any[] = [];
  Lock = false;
  constructor(private fetchService: FetchService, private snackbar: MdcSnackbarService, private router: Router, private el: ElementRef) {
  }

  async ngOnInit() {
    this.fetchService.getJson('./assets/data/detectdata.json').subscribe(Hashdata => {
      this.ItemHashList = [...Hashdata];
      this.fetchService.getJson('./assets/data/material.json').subscribe(data => {
        const idata = this.fetchService.getLocalStorage('m-data', {});
        const initIdata = Object.keys(idata).length === 0;
        this.ItemNames = { '0000': '该位置无物品' };
        for (const i in data) {
          if (initIdata) {
            idata[data[i].name] = {
              have: 0, need: 0, lack: 0, canMerge: false, name: data[i].name
            }
          }
          if (data[i]) {
            this.ItemNames[data[i].id] = data[i].name;
          }
        }
        if (initIdata) {
          this.fetchService.setLocalStorage('m-data', idata);
        }
        this.registerWorker();
      });
    });
    this.ImageElement = document.createElement('img');
    this.Canvas = this.el.nativeElement.getElementsByTagName('canvas')[0];
    this.Ctx = this.Canvas.getContext('2d');
    this.MaxFontSize = this.fetchService.getLocalStorage('detect-mfs', true);
    this.textColor = this.fetchService.getLocalStorage('detect-tclr', '#00ff00');
    this.onPasteImage();
  }
  ModifyData(dialog: any, e: MouseEvent) {
    if (this.detectedItemList.length === 0) { return; }
    const rect = this.Canvas.getBoundingClientRect();
    const clickY = e.offsetY * (this.Canvas.height / rect.height); // 换算物品位置
    const clickX = e.offsetX * (this.Canvas.width / rect.width);
    let x: number;
    let y: number;
    for (let ya = 0, YAll = this.YBound.length; ya < YAll; ya++) {
      if (this.YBound[ya].length !== 2) { continue; }
      if (clickY >= this.YBound[ya][0] && clickY <= this.YBound[ya][1]) {
        y = ya;
        break;
      }
    }
    for (let xa = 0, XAll = this.XBound.length; xa < XAll; xa++) {
      if (this.XBound[xa].length !== 2) { continue; }
      if (clickX >= this.XBound[xa][0] && clickX <= this.XBound[xa][1]) {
        x = xa;
        break;
      }
    }
    if (typeof x === 'undefined' || typeof y === 'undefined') { return; }
    this.ItemImage = this.ItemImages[this.XBound.length * y + x].toDataURL();
    this.ModifyingItem = this.detectedItemList[y][x]; // 确定正在修改的物品
    for (const id of Object.keys(this.ItemNames)) {
      if (!this.ModifyingItem.item.some(a => {
        return a.id == id;
      })) {
        this.ModifyingItem.item.push({
          id,
          hash: new Array(144).fill(0),
          count: 0
        });
      }
    }
    if (!this.ModifyingItem.delete) {
      this.ModifyingItem.delete = false;
    }
    for (const key of Object.keys(this.ModifyingItem)) {
      if (typeof this.ModifyingItem[key] !== 'object') {
        this.ModifyBuffer[key] = this.ModifyingItem[key]; // 深拷贝
      }
    }
    this.Modifying.y = y;
    this.Modifying.x = x;
    // //console.dir(dialog);
    dialog.open();
  }
  AcceptModify() {
    const y = this.Modifying.y;
    const x = this.Modifying.x;
    if (this.ModifyBuffer.id !== this.ModifyingItem.id || this.ModifyBuffer.have !== this.ModifyingItem.have || this.ModifyBuffer.delete !== this.ModifyingItem.delete) {
      for (const key of Object.keys(this.ModifyBuffer)) {
        this.ModifyingItem[key] = this.ModifyBuffer[key];
      }
      this.Ctx.drawImage(this.ImageElement, this.XBound[x][0] + 1, this.YBound[y][0] + 1, this.XBound[x][1] - this.XBound[x][0] - 1, this.YBound[y][1] - this.YBound[y][0] - 1, this.XBound[x][0] + 1, this.YBound[y][0] + 1, this.XBound[x][1] - this.XBound[x][0] - 1, this.YBound[y][1] - this.YBound[y][0] - 1);
      this.drawText(x, y);
    }
    if (this.ModifyingItem.delete) {
      this.Ctx.drawImage(this.ImageElement, this.XBound[x][0] + 1, this.YBound[y][0] + 1, this.XBound[x][1] - this.XBound[x][0] - 1, this.YBound[y][1] - this.YBound[y][0] - 1, this.XBound[x][0] + 1, this.YBound[y][0] + 1, this.XBound[x][1] - this.XBound[x][0] - 1, this.YBound[y][1] - this.YBound[y][0] - 1);
      return;
    }
  }
  toggleItem() {
    this.ModifyBuffer.delete = !this.ModifyBuffer.delete;
  }
  choiceImage(event) {
    const ImageContainer = event.target;
    const Reader = new FileReader();
    Reader.onload = e => {
      this.LoadImage(Reader.result.toString());
    };
    Reader.readAsDataURL(ImageContainer.files[0]);
  }
  onPasteImage() {
    document.addEventListener('paste', event => {
      const items = event.clipboardData && event.clipboardData.items;
      if (items && items.length) {
        if (items[0].type.indexOf('image') !== -1) {
          const file = items[0].getAsFile();
          const Reader = new FileReader();
          Reader.onload = e => {
            this.LoadImage(Reader.result.toString());
          };
          Reader.readAsDataURL(file);
        }
      }
    });
  }
  async toMaterialCalc() {
    if (!this.detectedItemList || this.detectedItemList.length === 0) {
      this.snackbar.show({
        message: '材料为空，请先输入需求。',
        actionText: '好的',
        multiline: false,
        actionOnBottom: false
      });
      return;
    }
    const data = this.fetchService.getLocalStorage('m-data', {});
    for (let y = 0, Yall = this.detectedItemList.length; y < Yall; y++) {
      for (let x = 0, Xall = this.detectedItemList[y].length; x < Xall; x++) {
        if (this.ItemNames[this.detectedItemList[y][x].id] in data && !isNaN(this.detectedItemList[y][x].have) && this.detectedItemList[y][x].have !== 0 && !this.detectedItemList[y][x].delete) {
          data[this.ItemNames[this.detectedItemList[y][x].id]].have = this.detectedItemList[y][x].have;
        }
      }
    }
    this.fetchService.setLocalStorage('m-data', data);
    this.snackbar.show({
      message: '导入成功',
      actionText: '好的',
      multiline: false,
      actionOnBottom: false
    });
  }
  LoadImage(src: string) {
    this.reset();
    this.ImageElement.onload = e => {
      this.ImageLoaded = true;
      this.Canvas.width = this.ImageElement.width;
      this.Canvas.height = this.ImageElement.height;
      this.Ctx.drawImage(this.ImageElement, 0, 0);
    };
    this.ImageElement.src = src;
  }
  reset() {
    this.InfoText = '等待处理';
    this.progress = 0;
    this.XBound = []; // X轴与Y轴方向上的物品边界
    this.YBound = [];
    this.ItemImages = []; // 每个物品的图像
    this.NumberImages = []; // 数字的图像
    this.ModifyingItem = null;
    this.ModifyBuffer = { have: 0, delete: false };
    this.Modifying = { x: 0, y: 0 };
    this.detectedItemList = [];
    this.ItemHashList = [];
    this.Lock = false;
  }
  registerWorker() {
    this.worker = new Worker('./detect.worker', { type: 'module' });
    this.worker.onmessage = this.MessageDeal.bind(this);
    let ItemHashList = JSON.parse(localStorage.getItem('detect-setting')) || (Boolean(localStorage.setItem('detect-setting', JSON.stringify(this.ItemHashList))) || this.ItemHashList);
    if (ItemHashList !== this.ItemHashList) {
      const sl = ItemHashList.length;
      for (let i = 0; i < this.ItemHashList.length; i++) {
        if (!ItemHashList.some(v => {
          return v.id == this.ItemHashList[i].id;
        })) {
          ItemHashList.push(this.ItemHashList[i])
        }
      }
      if (sl != ItemHashList.length) {
        localStorage.setItem('detect-setting', JSON.stringify(this.ItemHashList));
      }
      this.ItemHashList = ItemHashList;
    }
    this.worker.postMessage({ method: 'LoadHashData', Data: this.ItemHashList });
  }
  objectRegonition() {
    this.Lock = true;
    this.worker.postMessage({ method: 'ImageDataLoad', data: this.Ctx.getImageData(0, 0, this.Canvas.width, this.Canvas.height) });
  }
  MessageDeal(message: MessageEvent) {
    switch (message.data.method) {
      case 'status':
        this.InfoText = message.data.text;
        this.progress = message.data.progress;
        break;
      case 'clipImage':
        // 根据识别的边界切割图片数据
        this.XBound = message.data.XBound;
        this.YBound = message.data.YBound;
        const ImageDatas = [];
        for (let y = 0; y < this.YBound.length; y++) {
          for (let x = 0; x < this.XBound.length; x++) {
            const Canvas = document.createElement('canvas');
            Canvas.width = this.XBound[x][1] - this.XBound[x][0];
            Canvas.height = this.YBound[y][1] - this.YBound[y][0];
            const ctx = Canvas.getContext('2d');
            ctx.drawImage(this.ImageElement, this.XBound[x][0], this.YBound[y][0], Canvas.width, Canvas.height, 0, 0, Canvas.width, Canvas.height);
            this.ItemImages.push(Canvas);
            const DhashCanvas = document.createElement('canvas');
            DhashCanvas.width = 13;
            DhashCanvas.height = 12;
            const DhashCtx = DhashCanvas.getContext('2d');
            DhashCtx.drawImage(Canvas, 0, 0, Canvas.width, Canvas.height, 0, 0, DhashCanvas.width, DhashCanvas.height);
            ImageDatas.push(DhashCtx.getImageData(0, 0, DhashCanvas.width, DhashCanvas.height));
            this.Ctx.strokeRect(this.XBound[x][0], this.YBound[y][0], Canvas.width, Canvas.height);
          }
        }
        this.worker.postMessage({ method: 'calcDhash', ImageDatas }); // 请求生成物品dHash
        break;
      case 'getNumberData':
        const NumberTop = 0.705;
        const NumberHeight = 0.235;
        const NumberLeft = 0.405;
        // 切割数字
        const SingleNumberClipImageDatas: Array<Array<ImageData>> = [];
        for (let y = 0; y < this.YBound.length; y++) {
          for (let x = 0; x < this.XBound.length; x++) {
            const Canvas = document.createElement('canvas');
            Canvas.width = (this.XBound[x][1] - this.XBound[x][0]) * (1 - NumberLeft);
            Canvas.height = (this.YBound[y][1] - this.YBound[y][0]) * NumberHeight;
            const ctx = Canvas.getContext('2d');
            ctx.drawImage(this.ImageElement, this.XBound[x][0] + (this.XBound[x][1] - this.XBound[x][0]) * NumberLeft, this.YBound[y][0] + (this.YBound[y][1] - this.YBound[y][0]) * NumberTop, Canvas.width, Canvas.height, 0, 0, Canvas.width, Canvas.height);
            const allNumberImageData = ctx.getImageData(0, 0, Canvas.width, Canvas.height);
            const data = allNumberImageData.data;
            const [...backupdata] = data;
            const SData = [];
            const SameSets = {};
            for (let yh = 0; yh < allNumberImageData.height; yh++) {
              SData.push([]);
            }
            // 预处理图像
            for (let i = 0; i < data.length; i += 4) {
              const grey = (backupdata[i] + backupdata[i + 1] + backupdata[i + 2]) / 3;
              const xa = Math.floor(i / 4) % allNumberImageData.width, ya = Math.floor(Math.floor(i / 4) / allNumberImageData.width);
              if (grey >= 120) {
                SData[ya][xa] = 1;
              } else if (grey < 120 && grey > 105) {
                const left = (backupdata[i - 4] + backupdata[i - 3] + backupdata[i - 2]) / 3;
                const right = (backupdata[i + 4] + backupdata[i + 5] + backupdata[i + 6]) / 3;
                const TopIndex = (i + allNumberImageData.width * 4);
                const BottemIndex = (i + allNumberImageData.width * 4);
                const top = (backupdata[TopIndex] + backupdata[TopIndex + 1] + backupdata[TopIndex + 2]) / 3;
                const bottom = (backupdata[BottemIndex] + backupdata[BottemIndex + 1] + backupdata[BottemIndex + 2]) / 3;
                if ((xa !== 0 && left > 120) || (xa !== allNumberImageData.width - 1 && right > 120) || (ya !== 0 && top > 120) || (ya !== allNumberImageData.height - 1 && bottom > 120)) {
                  SData[ya][xa] = 1;
                } else {
                  SData[ya][xa] = 0;
                }
              } else {
                SData[ya][xa] = 0;
              }
            }
            // 二次扫描检查连通区域
            let Label = 0;
            for (let yb = 0; yb < SData.length; yb++) {
              for (let xb = 0; xb < SData[yb].length; xb++) {
                if (SData[yb][xb]) {
                  const NearPoints = [
                    (yb === 0 || xb === 0) ? 0 : SData[yb - 1][xb - 1],
                    (yb === 0) ? 0 : SData[yb - 1][xb],
                    (yb === 0 || xb === SData[yb].length - 1) ? 0 : SData[yb - 1][xb + 1],
                    (xb === 0) ? 0 : SData[yb][xb - 1],
                  ]; // 左上 上 右上 左
                  if (NearPoints.reduce((a, b) => a + b) === 0) {
                    SData[yb][xb] = ++Label;
                    continue;
                  }
                  const NotZeroPoints = NearPoints.filter(v => v);
                  if (NotZeroPoints.every((v, index, arr) => {
                    return index === 0 || v === arr[index - 1];
                  })) {
                    SData[yb][xb] = NotZeroPoints[0];
                  } else {
                    if (!(NotZeroPoints[0] in SameSets)) {
                      SameSets[NotZeroPoints[0]] = new Set();
                    }
                    if (!(NotZeroPoints[1] in SameSets)) {
                      SameSets[NotZeroPoints[1]] = new Set();
                    }
                    SameSets[NotZeroPoints[0]].add(NotZeroPoints[1]);
                    SameSets[NotZeroPoints[1]].add(NotZeroPoints[0]);
                    SData[yb][xb] = Math.min(...NotZeroPoints);
                  }
                }
              }
            }
            //  重新分配Label
            const NewLabel: Array<Array<number>> = [];
            for (let LabelIndex = 1; LabelIndex <= Label; LabelIndex++) {
              if (LabelIndex in SameSets) {
                const Sets = [...SameSets[LabelIndex]];
                Sets.push(LabelIndex);
                let LIndex: number;
                for (const set of Sets) {
                  LIndex = NewLabel.findIndex((v: Array<number>) => {
                    return v.includes(set);
                  });
                  if (LIndex !== -1) { break; }
                }
                if (LIndex !== -1) {
                  NewLabel[LIndex] = [...new Set(NewLabel[LIndex].concat(Sets))];
                } else {
                  NewLabel.push(Sets);
                }
                continue;
              } else {
                NewLabel.push([LabelIndex]);
              }
            }
            const Bounds: Array<Array<number>> = [];
            for (let i = 0; i < NewLabel.length; i++) {
              Bounds.push([Infinity/* 左 */, Infinity/* 上 */, -Infinity/* 右 */, -Infinity/* 下 */]);
            }
            for (let yb = 0; yb < SData.length; yb++) {
              for (let xb = 0; xb < SData[yb].length; xb++) {
                if (SData[yb][xb] !== 0) {
                  const Label = NewLabel.findIndex((v) => {
                    return v.includes(SData[yb][xb]);
                  });
                  SData[yb][xb] = Label + 1;
                  Bounds[Label][0] = Math.min(Bounds[Label][0], xb);
                  Bounds[Label][1] = Math.min(Bounds[Label][1], yb);
                  Bounds[Label][2] = Math.max(Bounds[Label][2], xb);
                  Bounds[Label][3] = Math.max(Bounds[Label][3], yb);
                }
              }
            }
            let SingleNumberImageDatas = [];
            for (const Bound of Bounds) {
              const isInf = Math.abs(Bound.reduce((a, b) => {
                return a + b;
              }));
              if (isInf === Infinity || Bound[0] <= 2 || allNumberImageData.width - Bound[2] <= 2 || Bound[1] < 2 || allNumberImageData.height - Bound[3] <= 2) {
                SingleNumberImageDatas.push(false);
                continue;
              }
              const width = Bound[2] - Bound[0] + 1, height = Bound[3] - Bound[1] + 1;
              if (width > height || width < 5 || height < 9) {
                SingleNumberImageDatas.push(false);
                continue;
              }
              SingleNumberImageDatas.push(new ImageData(new Uint8ClampedArray(width * height * 4).fill(255), width, height));
            }
            // 重新绘制数字便于识别
            for (let yb = 0; yb < SData.length; yb++) {
              for (let xb = 0; xb < SData[yb].length; xb++) {
                if (SData[yb][xb] !== 0) {
                  if (SingleNumberImageDatas[SData[yb][xb] - 1] === false) { continue; }
                  const yc = yb - Bounds[SData[yb][xb] - 1][1], xc = xb - Bounds[SData[yb][xb] - 1][0];
                  const index = (yc * SingleNumberImageDatas[SData[yb][xb] - 1].width + xc) * 4;
                  SingleNumberImageDatas[SData[yb][xb] - 1].data.fill(0, index, index + 3);
                }
              }
            }
            SingleNumberImageDatas = SingleNumberImageDatas.map((v, i) => [Bounds[i][0], v]).sort((a, b) => a[0] - b[0]).map(v => v[1]);
            const SingleNumberCtx: Array<CanvasRenderingContext2D> = [];
            const ImageIndex = SingleNumberClipImageDatas.push([]) - 1;
            for (const SingleNumberImageData of SingleNumberImageDatas) {
              if (SingleNumberImageData == false) { continue; }
              const Canvas = document.createElement('canvas');
              Canvas.width = SingleNumberImageData.width;
              Canvas.height = SingleNumberImageData.height;
              const Ctx = Canvas.getContext('2d');
              Ctx.putImageData(SingleNumberImageData, 0, 0);
              SingleNumberCtx.push(Ctx);
              const ClipCanvas = document.createElement('canvas');
              ClipCanvas.width = 9;
              ClipCanvas.height = 10;
              const ClipCtx = ClipCanvas.getContext('2d');
              ClipCtx.drawImage(Canvas, 0, 0, Canvas.width, Canvas.height, 0, 0, ClipCanvas.width, ClipCanvas.height);
              SingleNumberClipImageDatas[ImageIndex].push(ClipCtx.getImageData(0, 0, ClipCanvas.width, ClipCanvas.height));
            }
          }
        }
        this.worker.postMessage({ method: 'getItemCount', ImageDatas: SingleNumberClipImageDatas }); // 请求识别数字
        break;
      case 'DetectResult':
        for (let y = 0; y < this.YBound.length; y++) {
          this.detectedItemList.push([]);
        }
        for (let y = 0; y < this.YBound.length; y++) {
          for (let x = 0; x < this.XBound.length; x++) {
            this.detectedItemList[y][x] = {
              id: message.data.Items[y * this.XBound.length + x][0].id,
              name: this.ItemNames[message.data.Items[y * this.XBound.length + x][0].id],
              have: message.data.NumberResult[y * this.XBound.length + x],
              item: message.data.Items[y * this.XBound.length + x].filter(a => a.id in this.ItemNames),
              delete: !(message.data.Items[y * this.XBound.length + x][0].id in this.ItemNames)
            };
          }
        }
        this.drawText();
        break;
    }
  }

  drawText(...pos: number[]) {
    this.Ctx.fillStyle = this.textColor;
    this.Ctx.textAlign = 'center';
    if (pos.length === 0) {
      for (let y = 0, Yall = this.detectedItemList.length; y < Yall; y++) {
        for (let x = 0, Xall = this.detectedItemList[y].length; x < Xall; x++) {
          if (this.detectedItemList[y][x].id == '0000' || !(this.detectedItemList[y][x].id in this.ItemNames)) { continue; }
          const width = this.XBound[x][1] - this.XBound[x][0];
          const height = this.YBound[y][1] - this.YBound[y][0];
          const NumberString = this.detectedItemList[y][x].have.toString();
          const fontSize = Math.min(this.getSuitFontSize(this.ItemNames[this.detectedItemList[y][x].id], width, height), this.getSuitFontSize(NumberString, width, height));
          this.Ctx.font = fontSize + 'px serif';
          this.Ctx.fillText(this.ItemNames[this.detectedItemList[y][x].id], Math.floor(this.XBound[x][0] + (width) / 2), Math.floor(this.YBound[y][0] + (height) / 2));
          this.Ctx.fillText(NumberString, Math.floor(this.XBound[x][0] + (width) / 2), Math.floor(this.YBound[y][0] + (height) / 2) + fontSize);
        }
      }
    } else {
      const x = pos[0];
      const y = pos[1];
      if (this.detectedItemList[y][x].id == '0000' || !(this.detectedItemList[y][x].id in this.ItemNames)) { return void 0; }
      const width = this.XBound[x][1] - this.XBound[x][0];
      const height = this.YBound[y][1] - this.YBound[y][0];
      const NumberString = this.detectedItemList[y][x].have.toString();
      // this.Ctx.font = this.getSuitFontSize(NumberString, width) + 'px serif';
      const fontSize = Math.min(this.getSuitFontSize(this.ItemNames[this.detectedItemList[y][x].id], width, height), this.getSuitFontSize(NumberString, width, height));
      this.Ctx.font = fontSize + 'px serif';
      this.Ctx.fillText(this.ItemNames[this.detectedItemList[y][x].id], Math.floor(this.XBound[x][0] + (width) / 2), Math.floor(this.YBound[y][0] + (height) / 2));
      this.Ctx.fillText(NumberString, Math.floor(this.XBound[x][0] + (width) / 2), Math.floor(this.YBound[y][0] + (height) / 2) + fontSize);
    }
  }
  Route() {
    this.router.navigateByUrl('/detect-setting');
  }
  getSuitFontSize(text: string, width: number, height: number): number {
    if (!this.MaxFontSize) {
      if (this.FontSize === 0) {
        this.MaxFontSize = true;
        this.FontSize = this.getSuitFontSize('技能概要·卷3', width, height);
        this.MaxFontSize = false;
      }
      return this.FontSize;
    }
    let BaseFontSize = 10;
    while (true) {
      this.Ctx.font = BaseFontSize + 'px serif';
      if (this.Ctx.measureText(text).width > width || BaseFontSize * 2 + 10 > height) {
        return BaseFontSize - 1;
      }
      BaseFontSize++;
    }
  }
}

