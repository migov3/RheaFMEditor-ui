import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FeatureModel } from 'src/app/interfaces/FeatureModel';
import { MainNode } from 'src/app/interfaces/Nodes';
import { RestService } from 'src/app/services/rest/rest.service';

@Component({
  selector: 'app-new-features',
  templateUrl: './new-features.component.html',
  styleUrls: ['./new-features.component.css']
})
export class NewFeaturesComponent implements OnInit, OnChanges {

  constructor(private http: RestService) {}

  @Input() uploading?: boolean;
  @Input() fmData!: FeatureModel;
  @Output() hash = new EventEmitter<string>();

  rootNode!: MainNode;

  ngOnInit(): void {
    this.rootNode = this.fmData.features;
  }

  a(){
    console.log(this.fmData);
    const formData: FormData = new FormData();
    formData.append('file', new Blob([JSON.stringify(this.fmData, null, 2)], { type : 'application/json'}), this.fmData.name+'.json');
    this.http.updateFM(formData).subscribe(
      (fm: FeatureModel) => {
        this.hash?.emit(fm.hash);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("CAMBIO EN EL FM");
    console.log(changes["fmData"]);
    if (changes["fmData"] && this.fmData && changes["fmData"].currentValue){
      this.rootNode = this.fmData.features;
      this.hash.emit(this.fmData.hash);
    }
  }
}
