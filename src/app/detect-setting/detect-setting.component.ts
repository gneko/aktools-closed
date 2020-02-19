import { Component, OnInit, ElementRef } from '@angular/core';
import { MdcSnackbarService, MdcDialogDirective } from '@blox/material';
import { FetchService } from '../fetch.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-detect-setting',
    templateUrl: './detect-setting.component.html',
    styleUrls: ['./detect-setting.component.scss']
})
export class DetectSetttingComponent implements OnInit {
    // tslint:disable: all
    ImageElement: HTMLImageElement;
    ImageLoaded: boolean;
    Canvas: HTMLCanvasElement;
    Ctx: CanvasRenderingContext2D;
    ImageData: ImageData;
    worker: Worker;
    InfoText: '等待处理';
    progress: 0;
    XBound = [];
    YBound = [];
    ItemImages = [];
    ItemImage: string = "";
    NumberImages = [];
    textColor: any;
    MaxFontSize: any;
    FontSize = 0;
    ModifyingItem = null;
    ModifyBuffer: any = { have: 0, delete: false };
    Modifying = { x: 0, y: 0 };
    ItemNames: Object;
    detectedItem = [];
    Lock = false;
    ItemHashList: any = [];
    RecordItemHash = {};
    OriginHash = [];
    ImageDatas: any[];
    constructor(private fetchService: FetchService, private snackbar: MdcSnackbarService, private router: Router, private el: ElementRef) {
    }

    async ngOnInit() {
        this.fetchService.getJson('./assets/data/material.json').subscribe(data => {
            this.ItemNames = { "0000": "该位置无物品" };
            for (const i in data) {
                if (data[i]) {
                    this.ItemNames[data[i].id] = data[i].name;
                }
            }
            this.registerWorker();
        });
        this.ImageElement = document.createElement('img');
        this.Canvas = this.el.nativeElement.getElementsByTagName('canvas')[0];
        this.Ctx = this.Canvas.getContext('2d');
        this.MaxFontSize = this.fetchService.getLocalStorage('detect-mfs', true);
        this.textColor = this.fetchService.getLocalStorage('detect-tclr', '#00ff00');
        this.onPasteImage();
    }
    Copy(input) {
        input.select();
        if (document.execCommand('copy')) {
            this.snackbar.show({
                message: '复制成功',
                actionText: '好的',
                multiline: false,
                actionOnBottom: false
            });
        }
    }
    Import(input) {
        localStorage.setItem("detect-setting", input.value);
        this.ItemHashList = JSON.parse(localStorage.getItem("detect-setting")) || (Boolean(localStorage.setItem("detect-setting", JSON.stringify(this.ItemHashList))) || this.ItemHashList);
        this.ImageDatas.length == 0 ? this.resetAll() : this.EditGuiReset();
        this.snackbar.show({
            message: '导入成功',
            actionText: '好的',
            multiline: false,
            actionOnBottom: false
        });
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
    LoadImage(src: string) {
        this.ImageElement.onload = e => {
            this.ImageLoaded = true;
            this.Canvas.width = this.ImageElement.width;
            this.Canvas.height = this.ImageElement.height;
            this.Ctx.drawImage(this.ImageElement, 0, 0);
            this.resetAll();
            this.objectRegonition()
        };
        this.ImageElement.src = src;
    }
    mergeHash(...arg) {
        let ArrSame = [...arg]
        let count = 0;
        ArrSame = ArrSame.map(value => {
            if (typeof value == "string") {
                count++;
                return value.split("").map(value => Number(value))
            } else {
                count += value.count;
                return value.hash;
            }
        });
        return {
            hash: (function () {
                return new Array(ArrSame[0].length).fill(0).map((val, i) => {
                    for (let sval of ArrSame) {
                        val += sval[i];
                    }
                    return val;
                }).map(v => v)
            })(), count: count, id: null
        }
    }
    registerWorker() {
        this.worker = new Worker('../auto-detect-hash/detect.worker', { type: 'module' });
        this.worker.onmessage = this.MessageDeal.bind(this);
        this.ItemHashList = JSON.parse(localStorage.getItem("detect-setting")) || (Boolean(localStorage.setItem("detect-setting", JSON.stringify(this.ItemHashList))) || this.ItemHashList);
        this.resetAll();
    }
    resetAll() {
        this.XBound = [];
        this.YBound = [];
        this.ItemImages = [];
        this.EditGuiReset()
    }
    EditGuiReset() {
        this.ItemImage = "";
        this.NumberImages = [];
        this.FontSize = 0;
        this.ModifyingItem = null;
        this.ModifyBuffer = {};
        this.Modifying = { x: 0, y: 0 };
        this.detectedItem = [];
        this.Lock = false;
        this.RecordItemHash = {};
        this.OriginHash = [];
        this.ItemHashList = this.ItemHashList;
        this.worker.postMessage({ method: "LoadHashData", Data: this.ItemHashList });
        for (let item of this.ItemHashList) {
            this.RecordItemHash[item.id] = {
                hash: item.hash.map(v => v / item.count).map(v => (v == 0.5 ? 2 : ((v < 0.5) ? 0 : 1))),
                count: item.count
            }
        }
        for (const id in this.ItemNames) {
            if (this.ItemNames[id]) {
                if (!(id in this.RecordItemHash)) {
                    this.RecordItemHash[id] = {
                        id: id,
                        hash: new Array(144).fill(0),
                        count: 0
                    }
                }
            }
        }
    }
    objectRegonition() {
        this.worker.postMessage({ method: 'ImageDataLoad', data: this.Ctx.getImageData(0, 0, this.Canvas.width, this.Canvas.height) });
    }
    MessageDeal(message: MessageEvent) {
        switch (message.data.method) {
            case 'status':
                this.InfoText = message.data.text;
                this.progress = message.data.progress;
                break;
            case 'clipImage':
                this.XBound = message.data.XBound;
                this.YBound = message.data.YBound;
                this.ImageDatas = [];
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
                        this.ImageDatas.push(DhashCtx.getImageData(0, 0, DhashCanvas.width, DhashCanvas.height));
                        this.Ctx.strokeRect(this.XBound[x][0], this.YBound[y][0], Canvas.width, Canvas.height);
                    }
                }
                this.worker.postMessage({ method: 'calcDhash', ImageDatas: this.ImageDatas });
                break;
            case "SingleItemHash":
                this.detectedItem = message.data.Item;
                for (let id of Object.keys(this.ItemNames)) {
                    if (!this.detectedItem.some(a => {
                        return a.id == id
                    })) {
                        this.detectedItem.push({
                            id: id,
                            hash: new Array(144).fill(0),
                            count: 0
                        })
                    }
                }
                this.OriginHash = message.data.OriginHash.split('').map(a => Number(a));
                this.ModifyingItem = {
                    id: this.detectedItem[0].id,
                    name: this.ItemNames[this.detectedItem[0].id],
                    item: this.detectedItem
                };
                for (const key of Object.keys(this.ModifyingItem)) {
                    if (typeof this.ModifyingItem[key] !== 'object') {
                        this.ModifyBuffer[key] = this.ModifyingItem[key];
                    }
                }
                break;
        }
    }
    Merge() {
        if (this.ModifyBuffer.id.toString() == "0000") {
            return;
        }
        let HashList = this.ItemHashList.findIndex(a => a.id == this.ModifyBuffer.id);
        if (HashList === -1) {
            HashList = this.ItemHashList.push({
                id: this.ModifyBuffer.id,
                hash: new Array(144).fill(0),
                count: 0
            }) - 1;
        }
        let NewHashList = this.mergeHash(this.ItemHashList[HashList], this.OriginHash.join(''))
        NewHashList.id = this.ItemHashList[HashList].id;
        this.ItemHashList[HashList] = NewHashList;
        localStorage.setItem("detect-setting", JSON.stringify(this.ItemHashList));
        this.EditGuiReset();
        this.worker.postMessage({ method: 'calcDhash', ImageDatas: this.ImageDatas }); //重算dHash
    }
    Replace() {
        if (this.ModifyBuffer.id.toString() == "0000") {
            return;
        }
        let HashList = this.ItemHashList.find(a => a.id == this.ModifyBuffer.id);
        if (!HashList) {
            HashList = this.ItemHashList[this.ItemHashList.push({
                id: this.ModifyBuffer.id,
                hash: new Array(144).fill(0),
                count: 0
            }) - 1];
        }
        HashList.count = 1;
        HashList.hash = this.OriginHash;
        localStorage.setItem("detect-setting", JSON.stringify(this.ItemHashList));
        this.EditGuiReset();
        this.worker.postMessage({ method: 'calcDhash', ImageDatas: this.ImageDatas }); //重算dHash
    }
    ChoiceItem(e: MouseEvent, dialog: MdcDialogDirective) {
        const rect = this.Canvas.getBoundingClientRect();
        const clickY = e.offsetY * (this.Canvas.height / rect.height);
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
        this.worker.postMessage({ method: 'getItemHashs', index: this.XBound.length * y + x });
        dialog.open();
    }
    Data() {
        return localStorage.getItem('detect-setting');
    }
}