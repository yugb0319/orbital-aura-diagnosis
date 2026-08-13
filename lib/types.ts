export const TYPES = ["強化系","変化系","放出系","操作系","具現化系","特質系"] as const;
export type AuraType = typeof TYPES[number];
export type Scores = Record<AuraType, number>;
export type Option = { id:string; text:string; scores:Scores };
export type Question = { id:number; question:string; options:Option[] };
export type Diagnosis = { answers:string[]; scores:Scores; mainType:AuraType; nickname?:string };
