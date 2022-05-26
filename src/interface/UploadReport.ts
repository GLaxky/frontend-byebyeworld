import { UploadFile } from "element-plus/es/components/upload/src/upload.type";

export default interface UploadReport{
    projectId:number,
    referenceReportId: number,
    refRelation: number,
    // refType:number;
    workerId: number,
    workerName: string,
    bugImgs: Array<UploadFile>,
    bugDescription: string,
    revealSteps: string,
    devices: string,
}