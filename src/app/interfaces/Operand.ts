export interface Operand {
    type?: string;
    operands: Operand[] | string[];
}