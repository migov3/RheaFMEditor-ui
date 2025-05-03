import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FeatureModel } from 'src/app/interfaces/FeatureModel';
import { LanguageConstruct } from 'src/app/interfaces/LanguageConstruct';
import { RestService } from 'src/app/services/rest/rest.service';
import { UpdateService } from 'src/app/services/update/update.service';

@Component({
  selector: 'app-interop-matrix',
  templateUrl: './interop-matrix.component.html',
  styleUrls: ['./interop-matrix.component.css']
})
export class InteropMatrixComponent implements OnInit, OnChanges {

  constructor(private http: RestService, private updateService: UpdateService) { }

  @Input() extUploading?: boolean;
  @Input() fmData!: FeatureModel;
  @Output() fm = new EventEmitter<FeatureModel>();
  @Output() uploading = new EventEmitter<Object>();
  
  languageConstructs!: LanguageConstruct[];

  ngOnInit(): void {
    this.languageConstructs = this.fmData.language_constructs;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["fmData"] && this.fmData && changes["fmData"].currentValue){
      this.languageConstructs = this.fmData.language_constructs;
    }
  }

  refactoring(refactorId: string) {
    const formData: FormData = new FormData();
    formData.append('fm_hash', this.fmData.hash);
    formData.append('refactoring_id', refactorId);
    this.uploading.emit(true);
    this.http.refactor(formData).subscribe({
      next: (fmData: FeatureModel) => {
        this.updateService.addHash(fmData.hash);
        this.fm.emit(fmData);
        this.uploading.emit(false);
      },
      error: (error: any) => {
        console.log(error);
        this.uploading.emit(false);
      }
    });
  }
}
