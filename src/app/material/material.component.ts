import { Component, OnInit, ViewChild } from '@angular/core';
import { FetchService } from '../fetch.service';
import { MdcListItemSecondaryTextDirective, MdcSnackbarService } from '@blox/material';
import { MaterialItemData } from '../model/materialitemdata';
import { MaterialInfo } from '../model/materialinfo';
import { MaterialItem } from '../model/materialitem';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit {
  // Options
  options: any;
  chooseStage = false;
  @ViewChild('chooser') chooser;
  // Items data
  items: Array<MaterialInfo>;
  mByLvl: Array<Array<string>>;
  mIdx: { [key: string]: MaterialInfo };
  data: { [key: string]: MaterialItemData };
  planResult: any = {
    cost: 0,
    stages: [],
    syntheses: []
  };
  dialog: any;
  cost = 0;
  stagesText = [];
  synsText = [];
  exportedData = '';
  importedData = '';

  request: any = {
    owned: null,
    required: null,
    exp_demand: false,
    extra_outc: false,
    gold_demand: false,
    exclude: []
  }

  calc(): void {
    const counts = {};
    for (const i of this.items) {
      const need = this.data[i.name].need;
      const have = this.data[i.name].have;
      const diff = need - have;
      counts[i.name] = {
        need,
        have_s: have,
        have,
        upper: 0,
        lack: diff > 0 ? diff : 0
      };
    }
    // 稀有度由高到低，生成所有合成路线
    for (let i = 4; i >= 0; i--) {
      for (let j = this.mByLvl[i].length - 1; j >= 0; j--) {
        const m = this.mIdx[this.mByLvl[i][j]];
        const mm = m.madeof;
        for (const k in mm) {
          if (mm[k]) {
            counts[k].upper += mm[k] * counts[m.name].lack;
            const diff = counts[k].need + counts[k].upper - counts[k].have;
            counts[k].lack = diff > 0 ? diff : 0;
          }
        }
      }
    }
    // 稀有度由低到高，检查现有材料是否能向上合成
    for (let i = 1; i < 5; i++) {
      for (let j = this.mByLvl[i].length - 1; j >= 0; j--) {
        const m = this.mIdx[this.mByLvl[i][j]];
        if (counts[m.name].lack === 0) {
          counts[m.name].canMerge = false;
          continue;
        }
        let maxCompose = Object.keys(m.madeof).length === 0 ? 0 : Number.MAX_SAFE_INTEGER;
        for (const k in m.madeof) {
          if (counts[k]) {
            const cm = counts[k];
            if (cm.have / m.madeof[k] < maxCompose) {
              maxCompose = cm.have / m.madeof[k];
            }
          }
        }
        maxCompose = Math.floor(maxCompose > counts[m.name].lack ? counts[m.name].lack : maxCompose);
        counts[m.name].canMerge = maxCompose > 0;
      }
    }
    const newData = {};
    for (const i of this.items) {
      const name = i.name;
      const newItemData = new MaterialItemData(name);
      newItemData.lack = counts[name].lack;
      newItemData.have = counts[name].have;
      newItemData.need = counts[name].need;
      newItemData.canMerge = counts[name].canMerge;
      newData[name] = newItemData;
    }
    this.data = newData;
    this.fetchService.setLocalStorage('m-data', this.data);
    this.genExportedData();
  }

  onMatMerge(name: string) {
    const m = this.mIdx[name];
    for (const k in m.madeof) {
      if (m.madeof[k]) {
        this.data[k].have -= m.madeof[k];
      }
    }
    this.data[name].have += 1;
    this.calc();
  }

  onDataChange(itemData: MaterialItemData) {
    this.data[itemData.name].have = itemData.have;
    this.data[itemData.name].need = itemData.need;
    this.calc();
  }
  onOptionChange() {
    this.fetchService.setLocalStorage('m-option', this.options);
  }

  constructor(private fetchService: FetchService, private snackbar: MdcSnackbarService) {
    this.options = this.fetchService.getLocalStorage('m-option', {
      showOnly3plus: true,
      filtered: false,
      showMat: true,
      showBook: true,
      showChip: true
    });
  }

  reset(onlyNeed: boolean) {
    for (const i of this.items) {
      this.data[i.name].need = 0;
      if (!onlyNeed) {
        this.data[i.name].have = 0;
      }
    }
    this.options = {
      showOnly3plus: true,
      filtered: false,
      showMat: true,
      showBook: true,
      showChip: true
    };
    this.calc();
    this.exportedData = '';
  }

  ngOnInit() {
    this.fetchService.getJson('./assets/data/material.json').subscribe(data => {
      const items = [];
      this.mByLvl = [];
      this.mIdx = {};
      for (let i = 0; i < 5; i++) {
        this.mByLvl.push([]);
      }
      const ldata = this.fetchService.getLocalStorage('m-data', {});
      for (const k in data) {
        if (data[k]) {
          const item = data[k];
          items.push(item);
          if (!(item.name in ldata)) { ldata[item.name] = new MaterialItemData(item.name); }
          this.mByLvl[data[k].rarity - 1].push(data[k].name);
          this.mIdx[data[k].name] = data[k];
        }
      }
      this.data = ldata;
      this.items = items.sort((a, b) => {
        return a.sort > b.sort ? 1 : (a.sort < b.sort ? -1 : 0);
      });
      this.calc();
    });
  }

  getOrDefault(o: any, k: string, v: any = 0) {
    return k in o ? o[k] : v;
  }

  trackItem(_: any, item: MaterialInfo) {
    return item === null ? null : item.id;
  }

  plan() {
    const owned = {};
    const required = {};
    for (const m in this.data) {
      if (this.data[m]) {
        const mt = this.data[m];
        const mi = this.mIdx[m];
        if (mi.id.startsWith('30') || mi.id.startsWith('31')) {
          if (mt.have !== 0) { owned[m] = mt.have; }
          if (mt.need !== 0) { required[m] = mt.need; }
        }
      }
    }
    this.request.exclude = this.chooser.exclude;
    this.request.owned = owned;
    this.request.required = required;
    this.planResult = this.fetchService.postJson('https://planner.penguin-stats.io/plan/',
      this.request)
      .subscribe(plan => {
        this.cost = plan && plan.cost ? plan.cost : 0;
        const stage = plan && plan.stages && plan.stages.length !== 0 ? [...plan.stages] : [];
        const syns = plan && plan.syntheses && plan.syntheses.length !== 0 ? [...plan.syntheses] : [];
        this.stagesText = [];
        this.synsText = [];
        for (const st of stage) {
          const text = '[' + st.stage + '] x' + st.count + ' - ';
          const itemsText = [];
          for (const it in st.items) {
            if (st.items[it]) {
              itemsText.push(it + ' x' + st.items[it]);
            }
          }
          this.stagesText.push(text + itemsText.join(', '));
        }
        for (const syn of syns) {
          const text = '[' + syn.target + '] x' + syn.count + ' - ';
          const itemsText = [];
          for (const it in syn.materials) {
            if (syn.materials[it]) {
              itemsText.push(it + ' x' + syn.materials[it]);
            }
          }
          this.synsText.push(text + itemsText.join(', '));
        }
      });
  }

  async copyResult() {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText('材料规划路线（试用版）\r\n预计体力消耗: ' + this.cost
          + '\r\n刷图获得：\r\n' + this.stagesText.join('\r\n')
          + '\r\n合成获得：\r\n' + this.synsText.join('\r\n')
          + '\r\n来源：明日方舟工具箱: https://aktools.graueneko.xyz & ArkPlanner: https://github.com/ycremar/ArkPlanner , 结果仅供参考');
        this.snackbar.show({
          message: '已复制到剪切板。',
          actionText: '好的',
          multiline: false,
          actionOnBottom: false
        });
      } catch (err) {
        this.snackbar.show({
          message: '复制失败。',
          actionText: '好吧',
          multiline: false,
          actionOnBottom: false
        });
      }
    }
  }

  genExportedData() {
    const storage = {};
    for (const name in this.data) {
      if (this.data[name]) {
        const d = this.data[name];
        storage[name] = [
          d.have, d.need
        ];
      }
    }
    this.exportedData = JSON.stringify(storage);
  }
  async copyExport() {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(this.exportedData);
        this.snackbar.show({
          message: '已复制到剪切板。',
          actionText: '好的',
          multiline: false,
          actionOnBottom: false
        });
      } catch (err) {
        this.snackbar.show({
          message: '复制失败。',
          actionText: '好吧',
          multiline: false,
          actionOnBottom: false
        });
      }
    }
  }

  getImportedData() {
    const storage = JSON.parse(this.importedData);
    const newData = {};
    for (const name in storage) {
      if (storage[name]) {
        const s = storage[name];
        const d = new MaterialItemData(name);
        d.have = s[0];
        d.need = s[1];
        newData[name] = d;
      }
    }
    this.data = newData;
    this.calc();
  }
}
