import { Component, OnInit } from '@angular/core';
import { FeatureModel } from 'src/app/interfaces/FeatureModel';
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
  fmData: FeatureModel = {
    "name": "FM_Pizza",
    "hash": "5423399298739757895",
    "features": {
        "name": "Pizza",
        "abstract": true,
        "relations": [
            {
                "type": "MANDATORY",
                "card_min": 1,
                "card_max": 1,
                "children": [
                    {
                        "name": "Toppings",
                        "abstract": false,
                        "relations": [
                            {
                                "type": "CARDINALITY",
                                "card_min": 2,
                                "card_max": 3,
                                "children": [
                                    {
                                        "name": "Salami",
                                        "abstract": false,
                                        "relations": [],
                                        "attributes": [
                                            {
                                                "name": "cost",
                                                "value": "1.5"
                                            },
                                            {
                                                "name": "price",
                                                "value": "3"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "Ham",
                                        "abstract": false,
                                        "relations": [],
                                        "attributes": [
                                            {
                                                "name": "cost",
                                                "value": "1.25"
                                            },
                                            {
                                                "name": "price",
                                                "value": "2.5"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "Mozzarella",
                                        "abstract": false,
                                        "relations": [],
                                        "attributes": [
                                            {
                                                "name": "price",
                                                "value": "1.75"
                                            },
                                            {
                                                "name": "cost",
                                                "value": "0"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "attributes": [
                            {
                                "name": "1",
                                "value": ""
                            }
                        ]
                    }
                ]
            },
            {
                "type": "MANDATORY",
                "card_min": 1,
                "card_max": 1,
                "children": [
                    {
                        "name": "Size",
                        "abstract": false,
                        "relations": [
                            {
                                "type": "XOR",
                                "card_min": 1,
                                "card_max": 1,
                                "children": [
                                    {
                                        "name": "Normal",
                                        "abstract": false,
                                        "relations": [],
                                        "attributes": [
                                            {
                                                "name": "default"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "Big",
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
                        "name": "Dough",
                        "abstract": false,
                        "relations": [
                            {
                                "type": "XOR",
                                "card_min": 1,
                                "card_max": 1,
                                "children": [
                                    {
                                        "name": "Neapolitan",
                                        "abstract": false,
                                        "relations": [],
                                        "attributes": [
                                            {
                                                "name": "default"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "Sicilian",
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
                        "name": "CheesyCrust",
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
                        "name": "Vegan",
                        "abstract": false,
                        "relations": [
                            {
                                "type": "OR",
                                "card_min": 1,
                                "card_max": 3,
                                "children": [
                                    {
                                        "name": "Tomato",
                                        "abstract": false,
                                        "relations": [],
                                        "attributes": []
                                    },
                                    {
                                        "name": "Pepper",
                                        "abstract": false,
                                        "relations": [],
                                        "attributes": []
                                    },
                                    {
                                        "name": "Corn",
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
                                        "name": "Tomato",
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
                        "name": "Spicy",
                        "abstract": false,
                        "relations": [
                            {
                                "type": "MUTEX",
                                "card_min": 0,
                                "card_max": 1,
                                "children": [
                                    {
                                        "name": "Cayenne",
                                        "abstract": false,
                                        "relations": [],
                                        "attributes": []
                                    },
                                    {
                                        "name": "Jalapino",
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
    },
    "constraints": [
        {
            "name": "CTC1",
            "expr": "(CheesyCrust AND Sicilian) IMPLIES Big",
            "ast": {
                "type": "ImpliesTerm",
                "operands": [
                    {
                        "type": "AndTerm",
                        "operands": [
                            {
                                "type": "FeatureTerm",
                                "operands": [
                                    "CheesyCrust"
                                ]
                            },
                            {
                                "type": "FeatureTerm",
                                "operands": [
                                    "Sicilian"
                                ]
                            }
                        ]
                    },
                    {
                        "type": "FeatureTerm",
                        "operands": [
                            "Big"
                        ]
                    }
                ]
            }
        },
        {
            "name": "CTC2",
            "expr": "Neapolitan IMPLIES (NOT Salami AND NOT Ham)",
            "ast": {
                "type": "ImpliesTerm",
                "operands": [
                    {
                        "type": "FeatureTerm",
                        "operands": [
                            "Neapolitan"
                        ]
                    },
                    {
                        "type": "AndTerm",
                        "operands": [
                            {
                                "type": "NotTerm",
                                "operands": [
                                    {
                                        "type": "FeatureTerm",
                                        "operands": [
                                            "Salami"
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "NotTerm",
                                "operands": [
                                    {
                                        "type": "FeatureTerm",
                                        "operands": [
                                            "Ham"
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    ],
    "refactorings": [
        {
            "id": "CardinalityGroupRefactoring",
            "name": "Cardinality group refactoring",
            "description": "It changes the cardinality group to an and-group where all sub-features are optionals and add a new complex constraint with all feature combinations of the sub-features where each combination has at least 'a' and at most 'b' elements.",
            "type": "Cardinality group",
            "instances": [
                "Topping"
            ],
            "applicable": true
        },
        {
            "id": "EliminationComplexConstraints",
            "name": "Strict-complex constraint refactoring",
            "description": "It transforms a strict-complex constraint by adding additional abstract features and simple constraints without adding or removing products.",
            "type": "Strict-complex constraint",
            "instances": [
                "CTC1",
                "CTC2"
            ],
            "applicable": true
        },
        {
            "id": "EliminationSimpleConstraintsExcludes",
            "name": "Elimination of Constraints from Feature Trees - Excludes",
            "description": "It eliminates de simple constraint with Excludes",
            "type": "Constraint",
            "instances": [],
            "applicable": true
        },
        {
            "id": "EliminationSimpleConstraintsRequires",
            "name": "Elimination of Constraints from Feature Trees - Requires",
            "description": "It eliminates de simple constraint with Requires",
            "type": "Constraint",
            "instances": [],
            "applicable": true
        },
        {
            "id": "MultipleGroupDecompositionRefactoring",
            "name": "Multiple decomposition types refactoring",
            "description": "It substitutes each group in the feature by a mandatory abstract feature which becomes a new group below the original feature.",
            "type": "Multiple decomposition types",
            "instances": [],
            "applicable": true
        },
        {
            "id": "MutexGroupRefactoring",
            "name": "Mutex group refactoring",
            "description": "It changes the mutex group to an and-group with one optional abstract sub-feature f which becomes an alternative-group with the original sub-features.",
            "type": "Mutex group",
            "instances": [
                "Spicy"
            ],
            "applicable": true
        },
        {
            "id": "OrMandatoryRefactoring",
            "name": "Or-group with mandatory subfeature refactoring",
            "description": "It transforms the or-group with mandatory subfeatures into an and-group with mandatory and optional subfeatures.",
            "type": "Or-group with mandatory subfeature",
            "instances": [
                "Vegan"
            ],
            "applicable": true
        },
        {
            "id": "SplitConstraint",
            "name": "Split constraint",
            "description": "It splits a constraint in multiple constraints dividing it by the AND operator when possible.",
            "type": "Constraint",
            "instances": [
                "CTC2"
            ],
            "applicable": true
        },
        {
            "id": "XorMandatoryRefactoring",
            "name": "Xor-group with mandatory subfeature refactoring",
            "description": "It transforms the xor-group with a mandatory subfeature into an or-group with cardinality <0..0> (dead features) and a mandatory subfeature.",
            "type": "Xor-group with mandatory subfeature",
            "instances": [],
            "applicable": true
        }
    ],
    "language_constructs": [
        {
            "id": "LCFeature",
            "name": "Feature",
            "value": 20,
            "refactorings": [],
            "tools": [
                "UVL",
                "FeatureIDE",
                "Glencoe",
                "SPLOT",
                "Rhea"
            ]
        },
        {
            "id": "LCAbstractFeature",
            "name": "Abstract feature",
            "value": 1,
            "refactorings": [],
            "tools": [
                "UVL",
                "FeatureIDE",
                "Rhea"
            ]
        },
        {
            "id": "LCOptionalFeature",
            "name": "Optional feature",
            "value": 3,
            "refactorings": [],
            "tools": [
                "UVL",
                "FeatureIDE",
                "Glencoe",
                "SPLOT",
                "Rhea"
            ]
        },
        {
            "id": "LCMandatoryFeature",
            "name": "Mandatory feature",
            "value": 5,
            "refactorings": [],
            "tools": [
                "UVL",
                "FeatureIDE",
                "Glencoe",
                "SPLOT",
                "Rhea"
            ]
        },
        {
            "id": "LCOrGroupFeature",
            "name": "Or-group",
            "value": 1,
            "refactorings": [],
            "tools": [
                "UVL",
                "FeatureIDE",
                "Glencoe",
                "SPLOT",
                "Rhea"
            ]
        },
        {
            "id": "LCXorGroupFeature",
            "name": "Xor-group",
            "value": 2,
            "refactorings": [],
            "tools": [
                "UVL",
                "FeatureIDE",
                "Glencoe",
                "SPLOT",
                "Rhea"
            ]
        },
        {
            "id": "LCMutexGroupFeature",
            "name": "Mutex group",
            "value": 1,
            "refactorings": [
                "MutexGroupRefactoring"
            ],
            "tools": [
                "Rhea"
            ]
        },
        {
            "id": "LCCardinalityGroupFeature",
            "name": "Cardinality group",
            "value": 1,
            "refactorings": [
                "CardinalityGroupRefactoring"
            ],
            "tools": [
                "Glencoe",
                "Rhea"
            ]
        },
        {
            "id": "LCOrGroupMandatoryFeature",
            "name": "Or-group with mandatory feature",
            "value": 1,
            "refactorings": [
                "OrMandatoryRefactoring"
            ],
            "tools": [
                "Glencoe",
                "Rhea"
            ]
        },
        {
            "id": "LCMultipleGroupDecomposition",
            "name": "Multiple group decomposition",
            "value": 0,
            "refactorings": [
                "MultipleGroupDecompositionRefactoring"
            ],
            "tools": [
                "SPLOT",
                "Rhea"
            ]
        },
        {
            "id": "LCNonUniqueFeature",
            "name": "Non-unique feature",
            "value": 1,
            "refactorings": [],
            "tools": [
                "UVL",
                "Rhea"
            ]
        },
        {
            "id": "LCConstraint",
            "name": "Cross-tree constraint",
            "value": 2,
            "refactorings": [],
            "tools": [
                "UVL",
                "FeatureIDE",
                "Glencoe",
                "SPLOT",
                "Rhea"
            ]
        },
        {
            "id": "LCRequiresConstraint",
            "name": "Requires constraint",
            "value": 0,
            "refactorings": [
                "EliminationSimpleConstraintsRequires"
            ],
            "tools": [
                "UVL",
                "FeatureIDE",
                "Glencoe",
                "SPLOT",
                "Rhea"
            ]
        },
        {
            "id": "LCExcludesConstraint",
            "name": "Excludes constraint",
            "value": 0,
            "refactorings": [
                "EliminationSimpleConstraintsExcludes"
            ],
            "tools": [
                "UVL",
                "FeatureIDE",
                "Glencoe",
                "SPLOT",
                "Rhea"
            ]
        },
        {
            "id": "LCPseudoComplexConstraint",
            "name": "Pseudo-complex constraint",
            "value": 1,
            "refactorings": [
                "SplitConstraint"
            ],
            "tools": [
                "UVL",
                "FeatureIDE",
                "Glencoe",
                "SPLOT",
                "Rhea"
            ]
        },
        {
            "id": "LCStrictComplexConstraint",
            "name": "Strict-complex constraint",
            "value": 2,
            "refactorings": [
                "EliminationComplexConstraints"
            ],
            "tools": [
                "UVL",
                "FeatureIDE",
                "Glencoe",
                "SPLOT",
                "Rhea"
            ]
        }
    ],
    "semantics_metrics": [
        {
            "name": "Valid (not void)",
            "description": "A feature model is valid if it represents at least one configuration.",
            "value": "Yes"
        },
        {
            "name": "Core features",
            "description": "Features that are part of all the configurations (aka 'common features').",
            "value": "5"
        },
        {
            "name": "Dead features",
            "description": "Features that cannot appear in any configuration.",
            "value": "1"
        },
        {
            "name": "Variant features",
            "description": "Features that do not appear in all the configurations.",
            "value": "14"
        },
        {
            "name": "False-optional features",
            "description": "Features defined as optionals the selection of their parents make the feature itself selected as well.",
            "value": "1"
        },
        {
            "name": "Configurations",
            "description": "Number of configurations represented by the feature model. If <= is shown, the number represents an upper estimation bound.",
            "value": "240"
        }
    ],
    "tools_info": [
        {
            "name": "UVL",
            "extension": "uvl"
        },
        {
            "name": "FeatureIDE",
            "extension": "xml"
        },
        {
            "name": "Glencoe",
            "extension": "gfm.json"
        },
        {
            "name": "SPLOT",
            "extension": "sxfm.xml"
        },
        {
            "name": "Rhea",
            "extension": "json"
        }
    ]
  };
  hash?: string;
  fmName?: string;
  uploading?: boolean;

  uploadingHandler($event: any) {
    this.uploading = $event;
  }

  fmDataHandler($event: any) {
    this.fmData = $event;
    this.hash = $event.hash;
    this.fmName = $event.name;
  }

  hashHandler($event: string) {
    this.hash = $event;
  }

  // uploadfmTile: Tile = {text: 'Upload Feature model', cols: 3, rows: 3, color: 'none'};
  // tiles: Tile[] = [
  //   {text: 'Upload Feature model', cols: 3, rows: 3, color: 'none'},
  //   {text: 'Select language to download', cols: 3, rows: 3, color: 'lightgreen'},
  //   {text: 'Log', cols: 4, rows: 4, color: 'lightpink'},
  //   {text: 'Features', cols: 5, rows: 5, color: '#DDBDF1'},
  //   {text: 'Interoperability matrix', cols: 5, rows: 7, color: 'red'},
  //   {text: 'Constraints', cols: 5, rows: 3, color: 'blue'},
  //   {text: 'Constraint Tree', cols: 5, rows: 2, color: 'white'},
  //   {text: 'Semantics metrics', cols: 5, rows: 5, color: 'blackz'}
  // ];
  
  constructor() { }

  ngOnInit(): void {
  }

}
