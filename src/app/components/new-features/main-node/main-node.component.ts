import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { EXTENSION, IMAGE_URL, MANDATORY_RELATION, OPTIONAL_RELATION } from 'src/app/constants';
import { MainNode, RelationNode } from 'src/app/interfaces/Nodes';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Attribute } from 'src/app/interfaces/Attribute';
import { filter } from 'rxjs/operators';
import { UpdateService } from 'src/app/services/update/update.service';

export interface MainNodeDialogData {
  node: MainNode;
  hash: string;
}

@Component({
  selector: 'app-main-node',
  templateUrl: './main-node.component.html',
  styleUrls: ['../new-features.component.css']
})
export class MainNodeComponent implements OnInit {

  @Input() node!: MainNode;
  
  constructor(public dialog: MatDialog, private updateService: UpdateService) {}
  
  
  @Output() toParentRelationNode = new EventEmitter();
  @Input() hash?: string;
  @Input() type?: string;

  ngOnInit(): void {
    if (this.type) {
      if (this.type == MANDATORY_RELATION || this.type == OPTIONAL_RELATION) {
        this.imageUrl = IMAGE_URL + this.type + EXTENSION;
      } else {
        this.imageUrl = IMAGE_URL + 'OPTIONAL' + EXTENSION;
      }
    } else { // es raíz
      this.imageUrl = IMAGE_URL + 'featuretree.ico';
      this.expanded = true;
    }
    this.alt = this.type;
  }

  imageUrl?: string;
  alt?: string;
  expanded: boolean = false;

  expandNode() {
    this.expanded = true;
  }

  relationNodeHandler($event: RelationNode) {
    this.node.relations.forEach((rel, i) => {
      console.log("Borra la relacion? "+ (!rel.children || rel.children.length < 1) );
      console.log(rel)
      console.log($event)
      if (!rel.children || rel.children.length < 1) {
        this.node.relations.splice(i, 1);
      } // borra la relacion si ya no eixsten nodos a los que relacionar
    });
  }
  
  openMainNodeDialog(node: MainNode) {
    const dialog = this.dialog.open(DialogEditMainNode, {
        width: '650px',
        data: { node: node }
    });

    dialog.afterClosed().pipe(
        filter(node => node)
      ).subscribe(nodes => {
        // Lanzar el nodo al observer para que se detecten los cambios al nodo
        if (nodes[1] === null) {
          this.toParentRelationNode.emit(nodes[0]);
        }
        this.updateService.nodeUpdate.next([nodes[0], nodes[1]]);
        this.updateService.updating.next(true);
        //console.log(nodes);
    });
  }
}

@Component({
  selector: 'dialog-edit-mainnode',
  templateUrl: 'dialog-edit-mainnode.html',
  styleUrls: ['../dialog-edit.css']
})
export class DialogEditMainNode {

  editForm: FormGroup;

  oldNode!: MainNode;
  node!: MainNode;
  name?: string;
  abstract?: boolean;
  attributes: Attribute[] = ([]);

  constructor(private formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<DialogEditMainNode>,
      @Inject(MAT_DIALOG_DATA) public data: MainNodeDialogData) {
      this.oldNode = cloneDeep(data.node);
      this.node = data.node;
      this.abstract = this.node.abstract;
      this.name = this.node.name;
      this.node.attributes.forEach((v: Attribute) => {
          this.attributes.push(v);
      });

      this.editForm = this.formBuilder.group({
          name: [this.name, [Validators.required, Validators.maxLength(50)]],
          abstract: [this.abstract],
          attributes: this.formBuilder.array(this.attributes.map(attribute =>
              this.formBuilder.group({
                name: [attribute.name, Validators.required],
                value: [attribute.value]
              })
      ))});
  }

  get attributesArray(): FormArray {
      return this.editForm.get('attributes') as FormArray;
  }

  onNoClick(): void {
      this.closeDialog();
  }

  addAttribute() {
      const item = this.formBuilder.group({
          name: ['', Validators.required],
          value: ['']
      });

      this.attributesArray.push(item);
  }

  removeItem(index: number) {
      this.attributesArray.removeAt(index);
  }

  // Elimina caracteres especiales
  // Espacios por guion bajo
  clearSpecialChars(s: string) { 
      return s.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
  }

  submitForm(): void {
      this.node.name = this.clearSpecialChars(this.editForm.value.name);// Limpiamos caracteres especiales para que no falle el upload
      this.node.abstract = this.editForm.value.abstract;
      this.node.attributes = this.attributesArray.value;
      this.dialogRef.close([this.oldNode, this.node]);
  }

  removeNode(): void {
    this.dialogRef.close([this.oldNode, null]);
  }

  closeDialog(): void {
      this.dialogRef.close();
  }
}
