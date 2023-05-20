import { Component, OnInit } from '@angular/core';
import { MainNode } from 'src/app/interfaces/Nodes';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-fmeditor',
  templateUrl: './fmeditor.component.html',
  styleUrls: ['./fmeditor.component.css']
})
export class FMEditorComponent implements OnInit {

  // Lo recibe del componente hijo upload-fm
  fmData?: string;
  featuresTree: MainNode | undefined;

  fmDataHandler($event: any) {
    this.fmData = $event;
    this.featuresTree = $event.features;
  }

  uploadfmTile: Tile = {text: 'Upload Feature model', cols: 3, rows: 3, color: 'none'};
  tiles: Tile[] = [
    {text: 'Upload Feature model', cols: 3, rows: 3, color: 'none'},
    {text: 'Select language to download', cols: 3, rows: 3, color: 'lightgreen'},
    {text: 'Log', cols: 4, rows: 4, color: 'lightpink'},
    {text: 'Features', cols: 5, rows: 5, color: '#DDBDF1'},
    {text: 'Interoperability matrix', cols: 5, rows: 7, color: 'red'},
    {text: 'Constraints', cols: 5, rows: 3, color: 'blue'},
    {text: 'Constraint Tree', cols: 5, rows: 2, color: 'white'},
    {text: 'Semantics metrics', cols: 5, rows: 5, color: 'blackz'}
  ];
  
  constructor() { }

  ngOnInit(): void {
  }

}
