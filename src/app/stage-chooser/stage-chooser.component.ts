import { Component, OnInit } from '@angular/core';
import { MdcSnackbarService, MdcDialogDirective } from '@blox/material';
import { FetchService } from '../fetch.service';
import { Router } from '@angular/router';
import { doesNotMatch } from 'assert';
@Component({
  selector: 'app-stage-chooser',
  templateUrl: './stage-chooser.component.html',
  styleUrls: ['./stage-chooser.component.scss']
})
export class StageChooserComponent implements OnInit {
  // tslint:disable: all
  constructor(private fetchService: FetchService, private snackbar: MdcSnackbarService, private router: Router) {
  }
  stageList = [];
  ngOnInit(): void {
    let stageList = this.fetchService.getLocalStorage("stageList", {});
    if (!("time" in stageList) || new Date().getTime() - stageList > 12 * 3600) {
      this.fetchService.getJson("https://penguin-stats.io/PenguinStats/api/stages").subscribe(data => {
        let NotMainStage = []
        stageList.List = data.filter(value => {
          if (value.stageType == "MAIN" || value.stageType == "SUB") {
            return true;
          }
          NotMainStage.push(value);
          return false;
        });
        NotMainStage=NotMainStage.filter(v => v.stageType!="DAILY");
        //stageList.List = stageList.List.concat(NotMainStage).map(v => v.code);
      })
      console.log(stageList)
    }
  }

}
