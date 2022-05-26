import ReportWithTime from "../../interface/ReportWithTime";
import service from "../../utils/request";

export type OrderBy='average_score'|'start_time'|'finish_time'
export async function getOlderedReportList(taskId: number, orderBy: OrderBy, isAsc: boolean){
    // const formData =new FormData()
    // formData.append('field', orderBy)
    // formData.append('order', isAsc?'asc':'desc')
    let ans:ReportWithTime[]=[]
    await service.request({
        method: 'get',
        url: '/report/sort/'+taskId,
        params: {
            field: orderBy,
            order: isAsc?'asc':'desc'
        }
    }).then((res)=>{
        for(let item of res.data.data){
            let tmp:ReportWithTime={
                projectId: 0,
                referenceReportId: 0,
                refRelation: 0,
                reportId: 0,
                haveSubmittedReport: false,
                workerId: 0,
                workerName: "",
                bugImgs: [],
                bugDescription: "",
                revealSteps: "",
                devices: "",
                score: 0,
                averageScore: 0,
                assessPeople: 0,
                acceptTime: "",
                submitTime: ""
            }
            let description=item.report.description.split('~~')
            tmp.referenceReportId=item.quoteId
            tmp.refRelation=item.relation
            tmp.reportId=item.report.id
            tmp.haveSubmittedReport=true
            tmp.workerId=item.accepter.id
            tmp.workerName=item.accepter.username
            tmp.bugImgs=item.report.fileName.split(';').map((element)=>{ return 'https://linzs-upload.oss-cn-shanghai.aliyuncs.com/img/'+element})
            tmp.bugDescription=description[0]
            tmp.revealSteps=description.length > 1 ? description[1] : '无复现步骤'
            tmp.devices=description.length > 2 ? description[2] : '无测试设备信息'
            tmp.score=0
            tmp.averageScore=Number(item.report.averageScore.toFixed(2))
            tmp.assessPeople=item.report.scoreCount
            tmp.acceptTime=item.acceptTime.replace('T',' ').slice(0, 19)
            tmp.submitTime=item.submittedTime.replace('T',' ').slice(0, 19)

            ans.push(tmp)
        }
    })
    return ans

}