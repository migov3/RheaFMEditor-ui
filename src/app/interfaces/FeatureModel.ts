import { Constraint } from "./Constraint";
import { LanguageConstruct } from "./LanguageConstruct";
import { MainNode } from "./Nodes";
import { SemanticMetric } from "./SemanticMetric";
import { ToolsInfo } from "./ToolsInfo";

export interface FeatureModel {
    name: string; // nombre del modelo
    hash: string; // hash
    constraints: Constraint[]; // restricciones
    features: MainNode; // características
    language_constructs: LanguageConstruct[];
    refactorings: any[];
    semantics_metrics: SemanticMetric[];
    tools_info: ToolsInfo[];
}