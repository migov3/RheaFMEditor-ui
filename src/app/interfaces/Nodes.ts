import { Attribute } from "./Attribute";

export interface MainNode {
  name: string;
  abstract: boolean;
  relations: RelationNode[];
  attributes: Attribute[];
}

export interface RelationNode {
  type: string;
  card_min: number;
  card_max: number;
  children: MainNode[];
}
