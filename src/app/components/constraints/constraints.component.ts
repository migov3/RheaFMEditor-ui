import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Constraint } from 'src/app/interfaces/Constraint';
import { FeatureModel } from 'src/app/interfaces/FeatureModel';
import { MainNode, RelationNode } from 'src/app/interfaces/Nodes';
import { UpdateService } from 'src/app/services/update/update.service';
import { filter } from 'rxjs/operators';
import { cloneDeep } from 'lodash-es';
import { FORMULA_FUNCS } from 'src/app/constants';

export interface EditConstraintDialogData {
  constraint: Constraint;
  nodes: string[];
}

@Component({
  selector: 'app-constraints',
  templateUrl: './constraints.component.html',
  styleUrls: ['./constraints.component.css']
})
export class ConstraintsComponent implements OnInit {

  constructor(public dialog: MatDialog, private updateService: UpdateService) { }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  constraints!: Constraint[];
  @Input() fmData!: FeatureModel;
  @Input() uploading?: boolean;
  @Output() fm = new EventEmitter<FeatureModel>();

  length !: number;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 15, 20];
  lowValue = 0;
  highValue = 5;
  nodeList: string[] = [];

  hidePaginator = false;

  getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }

  
  addConstraint() {
    const dialog = this.dialog.open(DialogAddConstraint, {
        width: '1200px',
        height: '850px',
        data: { constraint : "", nodes: this.nodeList }
      });

    dialog.afterClosed().pipe(
        filter(constraint => constraint)
      ).subscribe(constraint => {
        // Hago cosas con la constraint añadida
        console.log(constraint);
    });
  }

  editConstraint(c: Constraint) {
    const dialog = this.dialog.open(DialogAddConstraint, {
        width: '800px',
        height: '650px',
        data: { constraint : c, nodes: this.nodeList }
      });

    dialog.afterClosed().pipe(
        filter(constraints => constraints)
      ).subscribe(constraints => {
        // Hago cosas con la constraint modificada

        console.log(constraints);
    });
  }

  removeConstraint(n: number) {
    console.log(n)
    this.constraints.splice(n + this.lowValue, 1);
    this.length = this.constraints.length;
    if (this.length > 0) {
      if (this.lowValue >= this.length) {
        this.paginator.previousPage();
      }
    } else {
      this.hidePaginator = true;
    }

  }

  ngOnInit(): void {
    this.constraints = this.fmData.constraints;
    this.length = this.constraints.length;
    if (this.length == 0) this.hidePaginator = true;
    else this.hidePaginator = false;
    console.log(this.constraints)
    // TODO Haria falta suscribirse a cambios en los nodos
    // Detectar cambio en nombre de  operandos y modificarlos en
    // todas las ocurrencias en las restricciones
    this.updateService.nodeUpdate.subscribe((nodes: (MainNode | RelationNode)[]) => {
      const oldNode = nodes[0];
      const updatedNode = nodes[1];
      if ('name' in oldNode) {
        
      }
    })
  }

  buildNodeList(n: MainNode) {
    this.nodeList.push(n.name);
    n.relations.forEach(rel => 
      rel.children.forEach(n => 
        this.buildNodeList(n)));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["fmData"] && this.fmData && changes["fmData"].currentValue) {
      this.nodeList = [];
      this.buildNodeList(this.fmData.features);
      this.constraints = this.fmData.constraints;
      this.length = this.constraints.length;
      if (this.length == 0) this.hidePaginator = true;
      else {
        this.hidePaginator = false;
        this.paginator.firstPage();
      }
      //this.hash.emit(this.fmData.hash);
    }
  }  
}

  @Component({
    selector: 'dialog-add-constraint',
    templateUrl: 'dialog-add-constraint.html',
    styleUrls: ['./constraints.component.css']
  })
  export class DialogAddConstraint {
  
    addConstraintForm: FormGroup;
    oldConstraint: Constraint;
    constraint: Constraint;
    expression: string;
    nodeList!: string[];
    readonly funcs = FORMULA_FUNCS;
    @ViewChild('expression') expressionInput!: ElementRef;

    constructor(private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<DialogAddConstraint>,
        @Inject(MAT_DIALOG_DATA) public data: EditConstraintDialogData) {
          this.nodeList = data.nodes;
          this.oldConstraint = cloneDeep(data.constraint);
          this.constraint = data.constraint;
          this.expression = data ? data.constraint.expr : "";
          this.addConstraintForm = this.formBuilder.group({
            expression: [this.expression, [Validators.required, Validators.maxLength(500)]]    
        });
    }


    addFromHighlighted(s: string) {
      const start = this.expressionInput.nativeElement.selectionStart;
      const end = this.expressionInput.nativeElement.selectionEnd;

      const value = this.expressionInput.nativeElement.value;
      const newValue = value.substring(0, start) + s + value.substring(end);

      this.expressionInput.nativeElement.value = newValue;
      this.expressionInput.nativeElement.focus();
      const newPos = start + s.length;
      this.expressionInput.nativeElement.selectionStart = newPos;
      this.expressionInput.nativeElement.selectionEnd = newPos;
    }

    addFunc(f: string) {
      this.addFromHighlighted(f);
    }

    addNode(n: string) {
      this.addFromHighlighted(n);
    }

    onNoClick(): void {
        this.closeDialog();
    }
  
    submitForm(): void {
      this.constraint.expr = this.addConstraintForm.value.expression;
      this.dialogRef.close([this.oldConstraint, this.constraint]);
    }

    closeDialog(): void {
      this.dialogRef.close();
    }
}
