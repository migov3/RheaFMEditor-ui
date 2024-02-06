import { Constraint } from "./Constraint";
import { MainNode } from "./Nodes";
import { ToolsInfo } from "./ToolsInfo";

export interface FeatureModel {
    name: string; // nombre del modelo
    hash: string; // hash
    constraints: Constraint[]; // restricciones
    features: MainNode; // características
    language_constructs: any[];
    refactorings: any[];
    semantics_metrics: any[];
    tools_info: ToolsInfo[];
}