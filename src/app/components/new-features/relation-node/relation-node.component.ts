import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { cloneDeep } from 'lodash-es';
import { filter } from 'rxjs/operators';
import { EXTENSION, IMAGE_URL, NODE_RELATION_TYPES } from 'src/app/constants';
import { MainNode, RelationNode } from 'src/app/interfaces/Nodes';
import { UpdateService } from 'src/app/services/update/update.service';

export interface RelationNodeDialogData {
  node: RelationNode;
  hash: string;
}

@Component({
  selector: 'app-relation-node',
  templateUrl: './relation-node.component.html',
  styleUrls: ['../new-features.component.css']
})

export class RelationNodeComponent implements OnInit {

  constructor(public dialog: MatDialog, private updateService: UpdateService) {}

  @Input() node!: RelationNode;
  @Output() toParentMainNode = new EventEmitter();
  show: boolean = false;
  expanded: boolean = false;
  type!: string;

  imageUrl?: string;
  alt?: string;

  ngOnInit() {
    this.type = this.node.type;
    this.show = (this.showNode(this.type) && this.node.children.length > 0);
    if (this.show) {
      this.imageUrl = IMAGE_URL + this.type + EXTENSION;
      this.expanded = true;
    }
  }

  mainNodeHandler($event: MainNode) { // siempre que salte, es para borrar
    this.node.children.forEach((node, i) => {
      if (node.name == $event.name) { // El nombre es identificador
        this.node.children.splice(i, 1);
      }
    });
    if (!this.node.children || this.node.children.length < 1) { // lo mismo, manejador solo para borrar
      this.toParentMainNode.emit(this.node);
    }
  }

  showNode(type: string) { //XOR, OR, MUTEX, CARDINALITY o FEATURE
    const showTypes = ['XOR', 'OR', 'MUTEX', 'CARDINALITY', 'FEATURE'];
    return showTypes.includes(type);
  }

  openRelationNodeDialog(node: RelationNode) {
    const dialog = this.dialog.open(DialogEditRelationNode, {
        width: '650px',
        data: { node: node }
    });

    dialog.afterClosed().pipe(
        filter(node => node)
      ).subscribe(node => {
        // Lanzar el nodo al observer para que se detecten los cambios al nodo
        this.updateService.nodeUpdate.next([node[0], node[1]]);
        this.updateService.updating.next(true);
    })
  }
}

@Component({
  selector: 'dialog-edit-relationnode',
  templateUrl: 'dialog-edit-relationnode.html',
  styleUrls: ['../dialog-edit.css']
})
export class DialogEditRelationNode {

  editForm: FormGroup;

  oldNode: RelationNode;
  node!: RelationNode;
  type?: string;
  card_min?: number;
  card_max?: number;

  readonly types = NODE_RELATION_TYPES;

  constructor(private formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<DialogEditRelationNode>,
      @Inject(MAT_DIALOG_DATA) public data: RelationNodeDialogData) {
        this.oldNode = cloneDeep(data.node);
        this.node = data.node;
        this.type = this.node.type;
        this.card_min = this.node.card_min;
        this.card_max = this.node.card_max;

        this.editForm = this.formBuilder.group({
            type: [this.type],
            card_min: [this.card_min],
            card_max: [this.card_max]
        });
  }

  onNoClick(): void {
      this.closeDialog();
  }

  showCardMinMax(): boolean {
    return this.editForm.value.type == 'CARDINALITY';
  }

  submitForm(): void {
      this.node.type = this.editForm.value.type;
      if (this.showCardMinMax()) {
        this.node.card_min = this.editForm.value.card_min;
        this.node.card_max = this.editForm.value.card_max;
      } else {
        this.node.card_min = 1;
        this.node.card_max = 1;
      }
      this.dialogRef.close([this.oldNode, this.node]);
  }

  closeDialog(): void {
      this.dialogRef.close();
  }
}
