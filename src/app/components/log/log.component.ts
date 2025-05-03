import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Action } from 'src/app/interfaces/Action';
import { FeatureModel } from 'src/app/interfaces/FeatureModel';
import { MainNode, RelationNode } from 'src/app/interfaces/Nodes';
import { RestService } from 'src/app/services/rest/rest.service';
import { UpdateService } from 'src/app/services/update/update.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  constructor(public updateService: UpdateService, private http: RestService) { }

  logs: string[] = [];

  @ViewChild('changeLogContainer') changeLogContainer!: ElementRef;
  @Output() fm = new EventEmitter<FeatureModel>();
  @Output() uploading = new EventEmitter<Object>();
  @Input() extUploading?: boolean;

  canUndo: boolean = false;
  canRedo: boolean = false;

  refreshUndoRedo() {
    this.canUndo = this.updateService.undoable();
    this.canRedo = this.updateService.redoable();
  }

  ngOnInit(): void {
    this.addLog("Action log initialized.")
    this.updateService.lastAction.subscribe((action: Action) => {
      if (!action.success) {
        this.logError(action.payload);
      }
      else if (action.name == 'update') {
        this.nodeUpdate(action.payload);
      } else if (action.name == 'upload') {
        this.logUpload(action.payload);
      }
      this.refreshUndoRedo();
    });
  }

  undo() {
    let undoHash = this.updateService.undoHash(); // Si devuelve null no puede hacerse undo
    if (undoHash) {
      const formData: FormData = new FormData();
      formData.append('fm_hash', undoHash);
      this.uploading.emit(true);
      this.http.getCachedFM(formData).subscribe({
        next: (fm: FeatureModel) => {
          this.fm.emit(fm);
          this.addLog('Undo.');
          this.refreshUndoRedo();
          this.uploading.emit(false);
        },
        error: (error: any) => {
          this.addLog('Error undoing. Cached FM expired.');
          console.log(error);
          this.uploading.emit(false);
        }
      })
    }
  }

  redo() {
    let redoHash = this.updateService.redoHash();
    if (redoHash) {
      const formData: FormData = new FormData();
      formData.append('fm_hash', redoHash);
      this.uploading.emit(true);
      this.http.getCachedFM(formData).subscribe({
        next: (fm: FeatureModel) => {
          this.fm.emit(fm);
          this.addLog('Redo.');
          this.refreshUndoRedo();
          this.uploading.emit(false);
        },
        error: (error: any) => {
          this.addLog('Error redoing. Cached FM expired.');
          console.log(error);
          this.uploading.emit(false);
        }
      })
    }
  }

  logUpload(fmName: string) {
    this.addLog('Uploaded ' + fmName);
  }

  logError(n: any) {
    let changesLog = '';
    if ('name' in n[0])
      changesLog = 'Error ' + (n[1] ? 'updating ' : 'removing ') + n[0].name;
    else changesLog = 'Error updating relation'
    this.addLog(changesLog);
  }

  nodeUpdate(nodes: any[]) {
    let changesLog = '';
    const updatedNode = nodes[1];

    if (updatedNode === null) {
      const removedNode = nodes[0] as MainNode;
      changesLog += 'Removed ' + removedNode.name;
    }
    else if ('name' in updatedNode) {
        const mainNode = updatedNode as MainNode;
        const oldNode = nodes[0] as MainNode;

        if (oldNode.name !== mainNode.name) {
          changesLog = `Name changed from ${oldNode.name} to ${mainNode.name}`;
        }

        if (oldNode.abstract !== mainNode.abstract) {
          if (changesLog) {
            changesLog += ', ';
          }
          changesLog += `Abstract: ${oldNode.abstract ? 'true' : 'false'} -> ${mainNode.abstract ? 'true' : 'false'}`;
        }
        // Check if any attribute has changed
        const attributeChanges = mainNode.attributes.filter(attr => {
            const oldAttribute = oldNode.attributes.find(a => a.name === attr.name);
            return !oldAttribute || oldAttribute.value != attr.value;
        });

        if (attributeChanges.length > 0) {
            attributeChanges.forEach(attr => {
              if (changesLog) {
                changesLog += ', ';
              }
              changesLog += `Attribute changed: - ${attr.name}: ${attr.value}`;
            });
        }

        if (changesLog) {
          changesLog = `${oldNode.name}: ` + changesLog;
        }

    } else if ('type' in updatedNode) {
        const relationNode = updatedNode as RelationNode;
        const oldNode = nodes[0] as RelationNode;
        if (changesLog) {
                  changesLog += ', ';
        }

        if (oldNode.type !== relationNode.type) {
          changesLog = `Relation node: type changed from ${oldNode.type} to ${relationNode.type}`;
        }
        
        if (oldNode.card_min !== relationNode.card_min || oldNode.card_max !== relationNode.card_max) {
          changesLog += `Cardinality: Min: ${oldNode.card_min} -> ${relationNode.card_min}, Max: ${oldNode.card_max} -> ${relationNode.card_max}`;
        }
    }

    this.addLog(changesLog);
  }

  appendHash(log: string) {
    return this.updateService.getCurrentHash() ? log + ' {hash: #' + this.updateService.getCurrentHash() +'}' : log;
  }

  addLog(msg: string) {
    if (msg) {
      this.logs.push(msg);
    }
    if (this.changeLogContainer) {
      setTimeout(() => this.changeLogContainer.nativeElement.scrollTop = this.changeLogContainer.nativeElement.scrollHeight, 100);
    }
  }
  
}
