import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FeatureModel } from 'src/app/interfaces/FeatureModel';
import { SemanticMetric } from 'src/app/interfaces/SemanticMetric';

@Component({
  selector: 'app-semantics-metrics',
  templateUrl: './semantics-metrics.component.html',
  styleUrls: ['./semantics-metrics.component.css']
})
export class SemanticsMetricsComponent implements OnInit {

  constructor() { }

  @Input() uploading?: boolean;
  @Input() fmData!: FeatureModel;
  @Output() fm = new EventEmitter<FeatureModel>();
  
  semanticMetrics!: SemanticMetric[];

  ngOnInit(): void {
    this.semanticMetrics = this.fmData.semantics_metrics;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["fmData"] && this.fmData && changes["fmData"].currentValue){
      this.semanticMetrics = this.fmData.semantics_metrics;
      //this.hash.emit(this.fmData.hash);
    }
  }
}
