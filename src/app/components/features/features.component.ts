import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MANDATORY_RELATION, OPTIONAL_RELATION, XOR_RELATION, OR_RELATION, CARDINALITY_RELATION, MUTEX_RELATION, FEATURE_RELATION } from 'src/app/constants';
import { Attribute } from 'src/app/interfaces/Attribute';
import { MainNode, RelationNode, FlatNode } from 'src/app/interfaces/Nodes';
import { RestService } from 'src/app/services/rest/rest.service';
import { DialogEditMainNode } from '../new-features/main-node/main-node.component';

export interface MainNodeDialogData {
    mainNode: MainNode;
    node: FlatNode;
    hash: string;
}

export interface RelationNodeDialogData {
    node: FlatNode;
}

@Component({
    selector: 'app-features',
    templateUrl: './features.component.html',
    styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnChanges {
    @Input() uploading?: boolean;
    @Input() fmData?: any;
    hash?: string;
    featuresTree?: MainNode = // Example feature tree
        {
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
                    "name": "extended__",
                    "value": "test2"
                },
                {
                    "name": "test4"
                }
            ]
        };

    ngOnChanges(changes: SimpleChanges) {
       // console.log("CAMBIO EN EL FM");
        //console.log(changes["fmData"]);
        
        if (changes["fmData"] && this.fmData && changes["fmData"].currentValue){
            this.hash = this.fmData.hash;
            this.featuresTree = this.fmData.features as MainNode;
            this.setDataSource(this.featuresTree);
            this.expandRoot();
        }
    }

    readonly MANDATORY = MANDATORY_RELATION;
    readonly OPTIONAL = OPTIONAL_RELATION;
    readonly XOR = XOR_RELATION;
    readonly OR = OR_RELATION;
    readonly CARDINALITY = CARDINALITY_RELATION;
    readonly MUTEX = MUTEX_RELATION;
    readonly FEATURE = FEATURE_RELATION;

    readonly SEPARATOR: string = ";";
    readonly DEPTH_SEPARATOR: string = ":";

    readonly TYPE_MAINNODE = 'n';
    readonly TYPE_RELATION = 'r';

    // Si el nodo relación es de mapeo
    isMappingRelationNode(node: RelationNode): boolean {
        return node.type.includes(this.MANDATORY) || node.type.includes(this.OPTIONAL);
    }

    // Si el nodo o nodo liso es de mapeo (relación que mapea con el nodo padre)
    isMappingFlatNode(node: FlatNode | MainNode): boolean {
        return node.name.includes(this.MANDATORY) || node.name.includes(this.OPTIONAL);
    }

    // Construye la representación en pantalla del mapeo
    buildFlatNodeNameByNameType(name: string, type: string): string {
        return type + this.SEPARATOR + name;
    }

    // Construye la representación en pantalla de las relaciones que representan un nodo
    buildFlatNodeNameByTypeMinMaxCard(type: string, min_card: number, max_card: number): string {
        return type + this.SEPARATOR + '<' + min_card + '..' + max_card + '>';
    }

    buildChildLevel(childLevel: number, name: string): string {
        return childLevel + this.DEPTH_SEPARATOR + name;
    }

    getLevel(name: string): number {
        const index = name.indexOf(this.DEPTH_SEPARATOR);
        return parseInt(name.substring(0, index)) | 0;
    }

    cleanLevelFromName(name: string): string {
        const index = name.indexOf(this.DEPTH_SEPARATOR);
        return name.substring(index + 1);
    }

    cleanRelationFromName(name: string): string {
        const index = name.indexOf(this.SEPARATOR) + (this.SEPARATOR.length - 1);
        return name.substring(index + 1);
    }

    openMainNodeDialog(node: FlatNode) {
        const dialogRef = this.dialog.open(DialogEditMainNode, {
            width: '650px',
            data: { mainNode: this.featuresTree, node: node, hash: this.hash }
        });
    }

    probar2() {
        console.log(this.treeControl.dataNodes);
        this.featuresTree!.name = "HOLA";
        //this.setDataSource(this.featuresTree!);
        console.log(this.hash);
        this.expandRoot();
    }
    
    private _transformer = (node: MainNode | RelationNode) => {
        if (node instanceof Object && 'name' in node) {
            let formattedName = node.name;
            const actualLevel = this.getLevel(node.name);
            node.name = this.cleanRelationFromName(this.cleanLevelFromName(node.name));
            node.relations.forEach((n): void => {
                n.type = this.buildChildLevel(actualLevel + 1, n.type);
            });
            return {
                nodeType: this.TYPE_MAINNODE,
                expandable: !!node.relations && node.relations.length > 0,
                name: node.name,
                formattedName: formattedName,
                abstract: node.abstract,
                level: actualLevel,
                attributes: node.attributes
            };
        } else {
            const actualLevel = this.getLevel(node.type);
            node.type = this.cleanLevelFromName(node.type);
            if (this.isMappingRelationNode(node)) {
                node.children.forEach((n) => {
                    n.name = this.buildChildLevel(actualLevel, this.buildFlatNodeNameByNameType(n.name, node.type));
                });
            } else {
                node.children.forEach((n): void => {
                    n.name = this.buildChildLevel(actualLevel + 1, this.buildFlatNodeNameByNameType(n.name, node.type));
                });
            }
            return {
                nodeType: this.TYPE_RELATION,
                expandable: !!node.children && node.children.length > 0,
                name: this.buildFlatNodeNameByTypeMinMaxCard(node.type, node.card_min, node.card_max),
                level: actualLevel,
                formattedName: "",
                abstract: false,
                attributes: []
            };
        }
    }

    treeControl = new FlatTreeControl<FlatNode>(
        node => node.level, node => node.expandable);

    treeFlattener = new MatTreeFlattener(
        this._transformer, node => node.level, node => node.expandable, node => (node instanceof Object && 'name' in node) ? node.relations : node.children);

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    setDataSource(root: MainNode) {
        console.log(root);
        this.dataSource.data = [root];
    }

    expandRoot() {
        this.treeControl.expand(this.treeControl.dataNodes[0]);
    }

    constructor(public dialog: MatDialog) {
        if (this.featuresTree) {
            this.setDataSource(this.featuresTree);
            this.expandRoot();
        }
    }

    isNode = (_: number, node: FlatNode) => node.expandable && (node.nodeType == this.TYPE_MAINNODE);

    isRelationNode = (_: number, node: FlatNode) => {
        return node.expandable && (node.nodeType == this.TYPE_RELATION) && !this.isMappingFlatNode(node);
    };

    isHidden = (_: number, node: FlatNode) => {
        return node.expandable && (node.nodeType == this.TYPE_RELATION) && this.isMappingFlatNode(node);
    };

}

@Component({
    selector: 'dialog-edit-relationnode',
    templateUrl: 'dialog-edit-relationnode.html'
})
export class DialogEditRelationNode {

    constructor(
        public dialogRef: MatDialogRef<DialogEditRelationNode>,
        @Inject(MAT_DIALOG_DATA) public data: RelationNodeDialogData) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
