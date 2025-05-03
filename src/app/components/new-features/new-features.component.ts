import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FeatureModel } from 'src/app/interfaces/FeatureModel';
import { Action } from 'src/app/interfaces/Action';
import { MainNode, RelationNode } from 'src/app/interfaces/Nodes';
import { RestService } from 'src/app/services/rest/rest.service';
import { UpdateService } from 'src/app/services/update/update.service';

@Component({
  selector: 'app-new-features',
  templateUrl: './new-features.component.html',
  styleUrls: ['./new-features.component.css']
})
export class NewFeaturesComponent implements OnInit, OnChanges {

  constructor(private http: RestService, private updateService: UpdateService) {
    
  }

  @Input() extUploading?: boolean;
  @Output() uploading = new EventEmitter<Object>();
  @Input() fmData!: FeatureModel;
  @Output() fm = new EventEmitter<FeatureModel>();
  
  lastValidFm!: FeatureModel;
  error = false;

  rootNode!: MainNode;

  ngOnInit(): void {
    this.updateService.nodeUpdate.subscribe((nodes: (MainNode | RelationNode)[]) => { // Al iniciar el componente, subscribe a los cambios en los nodos.
      const formData: FormData = new FormData();
      formData.append('file', new Blob([JSON.stringify(this.fmData, null, 2)], { type : 'application/json'}), this.fmData.name+'.json');
      this.uploading.emit(true);
      console.log("FM enviado: ");
      console.log(this.fmData);
      // Cuando detecta un cambio en nodo -> Update para obtener el nuevo hash y emitir el fm recibido del servidor al componente padre FMEditor
      this.http.updateFM(formData).subscribe({
        next: (fm: FeatureModel) => {
          this.updateService.addHash(fm.hash);
          this.updateService.lastAction.next({name: "update", success: true, payload: nodes});
          this.fm.emit(fm);
          console.log("FM recibido: ");
          console.log(fm);
          this.uploading.emit(false);
        },
        error: (error: any) => {
          this.updateService.lastAction.next({name: "update", success: false, payload: nodes});
          this.fm.emit(this.lastValidFm);
          this.uploading.emit(false);
        }
      });
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    let fm = changes["fmData"];
    if (fm && this.fmData && fm.currentValue){
      //console.log(fm);
      this.lastValidFm = cloneDeep(this.fmData);
      this.rootNode = this.fmData.features;
      
      //this.hash.emit(this.fmData.hash);
    }
  }
}
