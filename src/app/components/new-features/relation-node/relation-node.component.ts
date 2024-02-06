import { Component, Input, OnInit } from '@angular/core';
import { EXTENSION, IMAGE_URL } from 'src/app/constants';
import { RelationNode } from 'src/app/interfaces/Nodes';

@Component({
  selector: 'app-relation-node',
  templateUrl: './relation-node.component.html',
  styleUrls: ['../new-features.component.css']
})

export class RelationNodeComponent implements OnInit {
  @Input() node!: RelationNode;
  show: boolean = false;
  expanded: boolean = false;
  type!: string;

  imageUrl?: string;
  alt?: string;
  
  ngOnInit() {
    this.type = this.node.type;
    this.show = this.showNode(this.type);
    if (this.show) {
      this.imageUrl = IMAGE_URL + this.type + EXTENSION;
    }
  }

  showNode(type: string) { //XOR, OR, MUTEX, CARDINALITY o FEATURE
    const showTypes = ['XOR', 'OR', 'MUTEX', 'CARDINALITY', 'FEATURE'];
    return showTypes.includes(type);
  }
}
