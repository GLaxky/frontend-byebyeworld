import Report from "./Report";

export default interface RefRelation {
    referenceReport: Report,
    citer:Report,
    relation: string,
}