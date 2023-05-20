
export interface MainNode {
    name: string;
    abstract: boolean;
    relations: RelationNode[];
    attributes: any[];
  }

  export interface RelationNode {
    type: string;
    card_min: number;
    card_max: number;
    children: MainNode[];
  }

  export interface FlatNode {
    // Si el nodo representa un nodo expandible, relacionado de tipo "MANDATORY" o "OPTIONAL" -> "node".
    // Se representaria: "(simbolo(MANDATORY, OPTIONAL))" + "node.name"
    
    // Para ello al transformar un nodo RelationNode que llega con "type", debería cambiar el "name" de sus hijos a "type" del padre + "name"
    // Se podría modificar sus propiedades: "name" y "abstract", el tipo de relación con su padre: optional o mandatory, y añadir atributos (map K:V)

    // Si el nodo representa una relación XOR, OR, MUTEX, CARDINALITY o FEATURE:
    // Se representaria: "(simbolo(XOR, OR, MUTEX, CARDINALITY, FEATURE))" + "<node.card_min..node.card_max>"
    nodeType: string;
    expandable: boolean;
    attributes: any[];
    abstract: boolean;
    formattedName: string;
    name: string;
    level: number;
}