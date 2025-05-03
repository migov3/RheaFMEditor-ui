import { Injectable } from '@angular/core';
import { MainNode, RelationNode } from '../../interfaces/Nodes';
import { Subject } from 'rxjs';
import { FeatureModel } from 'src/app/interfaces/FeatureModel';
import { Action } from 'src/app/interfaces/Action';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  nodeUpdate: Subject<(MainNode | RelationNode)[]> = new Subject<(MainNode | RelationNode)[]>(); // Actualizacion de nodo (nodo antiguo, nodo actualizado)
  fmUpdate: Subject<FeatureModel> = new Subject<FeatureModel>(); // TODO Actualizacion del FM??
  updating: Subject<boolean> = new Subject<boolean>();
  lastAction: Subject<Action> = new Subject<Action>();
  hashList: string[] = []; // Cada actualizacion genera un nuevo hash
  currentPos: number = -1; // posicion en la hashList

  getCurrentHash(): string {
    return this.hashList[this.currentPos];
  }

  addHash(hash: string): void {
    if (!this.hashList.includes(hash)) { // el hash al modificar un atributo no cambia ?? limitacion
      this.currentPos++;
      this.hashList.splice(this.currentPos); // si se realiza un cambio -> no permitir que se rehaga, el ultimo cambio sería el ultimo hash
      this.hashList.push(hash);
    }
  }

  undoable(): boolean {
    return this.currentPos > 0;
  }
  
  redoable(): boolean {
    return this.currentPos < this.hashList.length - 1;
  }

  undoHash() {
    if (this.undoable()) {
      this.currentPos--;
      return this.hashList[this.currentPos];
    } else return null;
  }

  redoHash() {
    if (this.redoable()) {
      this.currentPos++;
      return this.hashList[this.currentPos];
    } else return null;
  }

  getHashList(): string[] {
    return this.hashList;
  }

  constructor() { }
  
}
