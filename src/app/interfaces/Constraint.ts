import { Operand } from "./Operand";

export interface Constraint {
    name: string;
    expr: string;
    ast: Operand;
}