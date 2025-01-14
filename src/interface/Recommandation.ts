export default interface Recommandation {
    projectId: number,
    rank:number,
    projectName: String,
    creatorName: String,
    startDate: String,
    endDate: String,
    tags: Array<String>,
    submitted: boolean,
    accepted:boolean,
    projectIntro: String,
    testAndAppFile: String,
    num:number,
    sum:number,
    peopleSituation:string,
}