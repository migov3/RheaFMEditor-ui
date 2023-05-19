import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';


interface MainNode {
  name: string;
  abstract: boolean;
  relations: RelationNode[];
  attributes: any[];
}

interface RelationNode {
  type: string;
  card_min: number;
  card_max: number;
  children: MainNode[];
}

interface FlatNode {
  // Si el nodo representa un nodo expandible, relacionado de tipo "MANDATORY" o "OPTIONAL" -> "node".
  // Se representaria: "(simbolo(MANDATORY, OPTIONAL))" + "node.name"
  // Para ello al transformar un nodo RelationNode que llega con "type", debería cambiar el "name" de sus hijos a "type" del padre + "name"
  // Se podría modificar sus propiedades: "name" y "abstract", el tipo de relación con su padre: optional o mandatory, y añadir atributos (map K:V)

  // Si el nodo representa una relación XOR, OR, MUTEX, CARDINALITY o FEATURE:
  // Se representaria: "(simbolo(XOR, OR, MUTEX, CARDINALITY, FEATURE))" + "<node.card_min..node.card_max>"
  nodeType: string;
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent {
  // TODO Llevar las constantes a otro sitio
  // Relaciones que mapean a sus hijos (no son nodos en arbol)
  // Para poder "saltarlas" hay que cambiar la lógica en los niveles
  static MANDATORY_RELATION: string = 'MANDATORY';
  static OPTIONAL_RELATION: string = 'OPTIONAL';

  // Relaciones que representan un nodo
  static CARDINALITY_RELATION: string = 'CARDINALITY';
  static XOR_RELATION: string = 'XOR';
  static OR_RELATION: string = 'OR';
  static MUTEX_RELATION: string = 'MUTEX';
  static FEATURE_RELATION: string = 'MUTEX';

  static SEPARATOR: string = " ";
  static DEPTH_SEPARATOR: string = ":";

  // Si el nodo relación es de mapeo
  isMappingRelationNode(node: RelationNode): boolean {
    return node.type.includes(FeaturesComponent.MANDATORY_RELATION) || node.type.includes(FeaturesComponent.OPTIONAL_RELATION);
  }

  // Si el nodo o nodo liso es de mapeo (relación que mapea con el nodo padre)
  isMappingFlatNode(node: FlatNode | MainNode): boolean {
    return node.name.includes(FeaturesComponent.MANDATORY_RELATION) || node.name.includes(FeaturesComponent.OPTIONAL_RELATION);
  }

  // Construye la representación en pantalla del mapeo
  buildFlatNodeNameByNameType(name: string, type: string): string {
    return type + FeaturesComponent.SEPARATOR + name;
  }

  // Construye la representación en pantalla de las relaciones que representan un nodo
  buildFlatNodeNameByTypeMinMaxCard(type: string, min_card: number, max_card: number): string {
    return type + FeaturesComponent.SEPARATOR + '<' + min_card + '..' + max_card + '>';
  }

  buildChildLevel(childLevel: number, name: string): string {
    return childLevel + FeaturesComponent.DEPTH_SEPARATOR + name;
  }

  getLevel(name: string): number {
    const index = name.indexOf(FeaturesComponent.DEPTH_SEPARATOR);
    return parseInt(name.substring(0, index)) | 0;
  }

  cleanLevelFromName(name: string): string {
    const index = name.indexOf(FeaturesComponent.DEPTH_SEPARATOR);
    return name.substring(index + 1);
  }

  private _transformer = (node: MainNode | RelationNode) => {
    if (node instanceof Object && 'name' in node) {
      const actualLevel = this.getLevel(node.name);
      node.name = this.cleanLevelFromName(node.name);
      node.relations.forEach((n): void => {
        n.type = this.buildChildLevel(actualLevel + 1, n.type);
      });
      return {
        nodeType: "node",
        expandable: !!node.relations && node.relations.length > 0,
        name: node.name,
        level: actualLevel
      };
    } else {
        const actualLevel = this.getLevel(node.type);
        node.type = this.cleanLevelFromName(node.type);
        if (this.isMappingRelationNode(node)) {
          node.children.forEach((n): MainNode => {
            n.name = this.buildFlatNodeNameByNameType(n.name, node.type);
            n.name = this.buildChildLevel(actualLevel, n.name);
            return n;
          });
        } else {
          node.children.forEach((n): void => {
            n.name = this.buildChildLevel(actualLevel + 1, n.name);
        });
      }
      return {
        nodeType: "relation",
        expandable: !!node.children && node.children.length > 0,
        name: this.buildFlatNodeNameByTypeMinMaxCard(node.type, node.card_min, node.card_max),
        level: actualLevel
      };
    }
  }

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => (node instanceof Object && 'name' in node) ? node.relations : node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);



  constructor() {
    this.dataSource.data = [this.pizza];
  }

  isNode = (_: number, node: FlatNode) => node.expandable && (node.nodeType == 'node');

  isRelationNode = (_: number, node: FlatNode) => {
    return node.expandable && (node.nodeType == 'relation') && !this.isMappingFlatNode(node);
  };

  isHidden = (_: number, node: FlatNode) => {
    return node.expandable && (node.nodeType == 'relation') && this.isMappingFlatNode(node);
  };

  pizza = {
    "name": "JHipster",
    "abstract": true,
    "relations": [
        {
            "type": "MANDATORY",
            "card_min": 1,
            "card_max": 1,
            "children": [
                {
                    "name": "Generator",
                    "abstract": true,
                    "relations": [
                        {
                            "type": "XOR",
                            "card_min": 1,
                            "card_max": 1,
                            "children": [
                                {
                                    "name": "Server",
                                    "abstract": true,
                                    "relations": [
                                        {
                                            "type": "XOR",
                                            "card_min": 1,
                                            "card_max": 1,
                                            "children": [
                                                {
                                                    "name": "MicroserviceApplication",
                                                    "abstract": false,
                                                    "relations": [],
                                                    "attributes": []
                                                },
                                                {
                                                    "name": "UaaServer",
                                                    "abstract": false,
                                                    "relations": [],
                                                    "attributes": []
                                                }
                                            ]
                                        }
                                    ],
                                    "attributes": []
                                },
                                {
                                    "name": "Application",
                                    "abstract": true,
                                    "relations": [
                                        {
                                            "type": "XOR",
                                            "card_min": 1,
                                            "card_max": 1,
                                            "children": [
                                                {
                                                    "name": "MicroserviceGateway",
                                                    "abstract": false,
                                                    "relations": [],
                                                    "attributes": []
                                                },
                                                {
                                                    "name": "Monolithic",
                                                    "abstract": false,
                                                    "relations": [],
                                                    "attributes": []
                                                }
                                            ]
                                        }
                                    ],
                                    "attributes": []
                                }
                            ]
                        }
                    ],
                    "attributes": []
                }
            ]
        },
        {
            "type": "MANDATORY",
            "card_min": 1,
            "card_max": 1,
            "children": [
                {
                    "name": "Authentication",
                    "abstract": true,
                    "relations": [
                        {
                            "type": "XOR",
                            "card_min": 1,
                            "card_max": 1,
                            "children": [
                                {
                                    "name": "HTTPSession",
                                    "abstract": false,
                                    "relations": [],
                                    "attributes": []
                                },
                                {
                                    "name": "OAuth2",
                                    "abstract": false,
                                    "relations": [],
                                    "attributes": []
                                },
                                {
                                    "name": "Uaa",
                                    "abstract": false,
                                    "relations": [],
                                    "attributes": []
                                },
                                {
                                    "name": "JWT",
                                    "abstract": false,
                                    "relations": [],
                                    "attributes": []
                                }
                            ]
                        }
                    ],
                    "attributes": []
                }
            ]
        },
        {
            "type": "OPTIONAL",
            "card_min": 0,
            "card_max": 1,
            "children": [
                {
                    "name": "SocialLogin",
                    "abstract": false,
                    "relations": [],
                    "attributes": []
                }
            ]
        },
        {
            "type": "OPTIONAL",
            "card_min": 0,
            "card_max": 1,
            "children": [
                {
                    "name": "Database",
                    "abstract": true,
                    "relations": [
                        {
                            "type": "XOR",
                            "card_min": 1,
                            "card_max": 1,
                            "children": [
                                {
                                    "name": "SQL",
                                    "abstract": true,
                                    "relations": [
                                        {
                                            "type": "OPTIONAL",
                                            "card_min": 0,
                                            "card_max": 1,
                                            "children": [
                                                {
                                                    "name": "Hibernate2ndLvlCache",
                                                    "abstract": true,
                                                    "relations": [
                                                        {
                                                            "type": "XOR",
                                                            "card_min": 1,
                                                            "card_max": 1,
                                                            "children": [
                                                                {
                                                                    "name": "HazelCast",
                                                                    "abstract": false,
                                                                    "relations": [],
                                                                    "attributes": []
                                                                },
                                                                {
                                                                    "name": "EhCache",
                                                                    "abstract": false,
                                                                    "relations": [],
                                                                    "attributes": []
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "attributes": []
                                                }
                                            ]
                                        },
                                        {
                                            "type": "MANDATORY",
                                            "card_min": 1,
                                            "card_max": 1,
                                            "children": [
                                                {
                                                    "name": "Development",
                                                    "abstract": true,
                                                    "relations": [
                                                        {
                                                            "type": "XOR",
                                                            "card_min": 1,
                                                            "card_max": 1,
                                                            "children": [
                                                                {
                                                                    "name": "H2",
                                                                    "abstract": true,
                                                                    "relations": [
                                                                        {
                                                                            "type": "XOR",
                                                                            "card_min": 1,
                                                                            "card_max": 1,
                                                                            "children": [
                                                                                {
                                                                                    "name": "DiskBased",
                                                                                    "abstract": false,
                                                                                    "relations": [],
                                                                                    "attributes": []
                                                                                },
                                                                                {
                                                                                    "name": "InMemory",
                                                                                    "abstract": false,
                                                                                    "relations": [],
                                                                                    "attributes": []
                                                                                }
                                                                            ]
                                                                        }
                                                                    ],
                                                                    "attributes": []
                                                                },
                                                                {
                                                                    "name": "PostgreSQLDev",
                                                                    "abstract": false,
                                                                    "relations": [],
                                                                    "attributes": []
                                                                },
                                                                {
                                                                    "name": "MariaDBDev",
                                                                    "abstract": false,
                                                                    "relations": [],
                                                                    "attributes": []
                                                                },
                                                                {
                                                                    "name": "MySql",
                                                                    "abstract": false,
                                                                    "relations": [],
                                                                    "attributes": []
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "attributes": []
                                                }
                                            ]
                                        },
                                        {
                                            "type": "MANDATORY",
                                            "card_min": 1,
                                            "card_max": 1,
                                            "children": [
                                                {
                                                    "name": "Production",
                                                    "abstract": true,
                                                    "relations": [
                                                        {
                                                            "type": "XOR",
                                                            "card_min": 1,
                                                            "card_max": 1,
                                                            "children": [
                                                                {
                                                                    "name": "MySQL",
                                                                    "abstract": false,
                                                                    "relations": [],
                                                                    "attributes": []
                                                                },
                                                                {
                                                                    "name": "MariaDB",
                                                                    "abstract": false,
                                                                    "relations": [],
                                                                    "attributes": []
                                                                },
                                                                {
                                                                    "name": "PostgreSQL",
                                                                    "abstract": false,
                                                                    "relations": [],
                                                                    "attributes": []
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "attributes": []
                                                }
                                            ]
                                        },
                                        {
                                            "type": "OPTIONAL",
                                            "card_min": 0,
                                            "card_max": 1,
                                            "children": [
                                                {
                                                    "name": "ElasticSearch",
                                                    "abstract": false,
                                                    "relations": [],
                                                    "attributes": []
                                                }
                                            ]
                                        }
                                    ],
                                    "attributes": []
                                },
                                {
                                    "name": "Cassandra",
                                    "abstract": false,
                                    "relations": [],
                                    "attributes": []
                                },
                                {
                                    "name": "MongoDB",
                                    "abstract": false,
                                    "relations": [],
                                    "attributes": []
                                }
                            ]
                        }
                    ],
                    "attributes": []
                }
            ]
        },
        {
            "type": "OPTIONAL",
            "card_min": 0,
            "card_max": 1,
            "children": [
                {
                    "name": "SpringWebSockets",
                    "abstract": false,
                    "relations": [],
                    "attributes": []
                }
            ]
        },
        {
            "type": "OPTIONAL",
            "card_min": 0,
            "card_max": 1,
            "children": [
                {
                    "name": "Libsass",
                    "abstract": false,
                    "relations": [],
                    "attributes": []
                }
            ]
        },
        {
            "type": "OPTIONAL",
            "card_min": 0,
            "card_max": 1,
            "children": [
                {
                    "name": "ClusteredSession",
                    "abstract": false,
                    "relations": [],
                    "attributes": []
                }
            ]
        },
        {
            "type": "MANDATORY",
            "card_min": 1,
            "card_max": 1,
            "children": [
                {
                    "name": "BackEnd",
                    "abstract": true,
                    "relations": [
                        {
                            "type": "XOR",
                            "card_min": 1,
                            "card_max": 1,
                            "children": [
                                {
                                    "name": "Gradle",
                                    "abstract": false,
                                    "relations": [],
                                    "attributes": []
                                },
                                {
                                    "name": "Maven",
                                    "abstract": false,
                                    "relations": [],
                                    "attributes": []
                                }
                            ]
                        }
                    ],
                    "attributes": []
                }
            ]
        },
        {
            "type": "OPTIONAL",
            "card_min": 0,
            "card_max": 1,
            "children": [
                {
                    "name": "InternationalizationSupport",
                    "abstract": false,
                    "relations": [],
                    "attributes": []
                }
            ]
        },
        {
            "type": "OPTIONAL",
            "card_min": 0,
            "card_max": 1,
            "children": [
                {
                    "name": "Docker",
                    "abstract": false,
                    "relations": [],
                    "attributes": []
                }
            ]
        },
        {
            "type": "MANDATORY",
            "card_min": 1,
            "card_max": 1,
            "children": [
                {
                    "name": "TestingFrameworks",
                    "abstract": true,
                    "relations": [
                        {
                            "type": "OPTIONAL",
                            "card_min": 0,
                            "card_max": 1,
                            "children": [
                                {
                                    "name": "Protractor",
                                    "abstract": false,
                                    "relations": [],
                                    "attributes": []
                                }
                            ]
                        },
                        {
                            "type": "MANDATORY",
                            "card_min": 1,
                            "card_max": 1,
                            "children": [
                                {
                                    "name": "Gatling",
                                    "abstract": false,
                                    "relations": [],
                                    "attributes": []
                                }
                            ]
                        },
                        {
                            "type": "MANDATORY",
                            "card_min": 1,
                            "card_max": 1,
                            "children": [
                                {
                                    "name": "Cucumber",
                                    "abstract": false,
                                    "relations": [],
                                    "attributes": []
                                }
                            ]
                        }
                    ],
                    "attributes": []
                }
            ]
        }
    ],
    "attributes": [
        {
            "name": "extended__"
        }
    ]
};
}
