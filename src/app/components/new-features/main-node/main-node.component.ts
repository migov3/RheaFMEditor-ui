import { Component, Inject, Input, OnInit } from '@angular/core';
import { EXTENSION, IMAGE_URL, MANDATORY_RELATION, OPTIONAL_RELATION } from 'src/app/constants';
import { FlatNode, MainNode } from 'src/app/interfaces/Nodes';
import { MainNodeDialogData } from '../../features/features.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Attribute } from 'src/app/interfaces/Attribute';
import { FeatureModel } from 'src/app/interfaces/FeatureModel';
import { filter } from 'rxjs';

@Component({
  selector: 'app-main-node',
  templateUrl: './main-node.component.html',
  styleUrls: ['../new-features.component.css']
})
export class MainNodeComponent implements OnInit {
  @Input() fm!: FeatureModel;
  @Input() node!: MainNode;
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

  constructor(public dialog: MatDialog) {}
  
  openMainNodeDialog(node: MainNode) {
    const dialog = this.dialog.open(DialogEditMainNode, {
        width: '650px',
        data: { node: node }
    });

    dialog.afterClosed().pipe(
        filter(node => node)
      ).subscribe(node => {
      console.log(node);
      this.node = node;
    })
}

  
}

@Component({
  selector: 'dialog-edit-mainnode',
  templateUrl: 'dialog-edit-mainnode.html',
  styleUrls: ['../dialog-edit.css']
})
export class DialogEditMainNode {

  editForm: FormGroup;

  node!: FlatNode;
  name?: string;
  abstract?: boolean;
  attributes: Attribute[] = ([]);

  constructor(private formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<DialogEditMainNode>,
      @Inject(MAT_DIALOG_DATA) public data: MainNodeDialogData) {
      this.node = data.node;
      this.abstract = this.node.abstract;
      this.name = this.node.name;
      this.node.attributes.forEach((v: Attribute) => {
          this.attributes.push(v);
      });

      this.editForm = this.formBuilder.group({
          name: [this.name, [Validators.required, Validators.maxLength(30)]],
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

  submitForm(): void {
      this.node.name = this.editForm.value.name;
      this.node.abstract = this.editForm.value.abstract;
      this.node.attributes = this.attributesArray.value;
      this.closeDialog();
      //formData.append('file', )
      //this.http.updateFM();
      this.dialogRef.close(this.node);
  }

  closeDialog(): void {
      this.dialogRef.close();
  }

}
