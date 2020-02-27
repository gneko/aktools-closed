import { Component, OnInit, ElementRef } from '@angular/core';
import { MdcSnackbarService, MdcDialogDirective } from '@blox/material';
import { FetchService } from '../fetch.service';
import { Router } from '@angular/router';
import { doesNotMatch } from 'assert';
import { element } from 'protractor';
@Component({
  selector: 'app-stage-chooser',
  templateUrl: './stage-chooser.component.html',
  styleUrls: ['./stage-chooser.component.scss']
})
export class StageChooserComponent implements OnInit {
  // tslint:disable: all
  constructor(private fetchService: FetchService, private snackbar: MdcSnackbarService, private router: Router, private el: ElementRef) {
  }
  stageList: any = { preset: { zh_CN: [] } }
  get exclude() {
    return this.stageList.preset["zh_CN"].filter(stage => !this.stageList.preset.default.includes(stage))
  }
  presets = [];
  choicePreset = "";
  ngOnInit() {
    this.stageList = this.fetchService.getLocalStorage("stageList", { preset: { zh_CN: [] } });
    if (this.stageList.preset["zh_CN"].length == 0) {
      this.updateStage();
    } else {
      this.initData();
    }
  }
  updateStage() {
    this.fetchService.getJson('./assets/data/StageList.json').subscribe(stageList => {
      this.stageList = stageList;
      this.stageList.preset.default = this.stageList.preset["zh_CN"];
      this.fetchService.setLocalStorage("stageList", stageList);
      this.initData();
    })
  }
  initData() {
    this.presets = Object.keys(this.stageList.preset).filter(v => v != "default");
  }
  change(...e) {
    let IncludePlanStage = [...this.el.nativeElement.querySelectorAll("[data-checkbox='stage']:checked")].map(ele => ele.value);
    this.stageList.preset.default = IncludePlanStage;
    this.fetchService.setLocalStorage("stageList", this.stageList)
  }
  choiceAll() {
    this.el.nativeElement.querySelectorAll("[data-checkbox='stage']").forEach(element => {
      element.checked = true;
    });
    this.change();
  }
  invert() {
    this.el.nativeElement.querySelectorAll("[data-checkbox='stage']").forEach(element => {
      element.checked = !element.checked;
    });
    this.change();
  }
  loadPreset() {
    if (this.choicePreset == "") return;
    this.stageList.preset.default = this.stageList.preset[this.choicePreset];
    this.fetchService.setLocalStorage("stageList", this.stageList)
  }
}
