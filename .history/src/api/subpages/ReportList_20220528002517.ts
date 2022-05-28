import service from '../../utils/request';
import Report from '../../interface/Report';

export const getReportListOfTask=async (taskId: number)=>{
    let ans:Report[] =[]
    await service.request({
        method: 'get',
        url: '/assignment/list/'+taskId,
        
    }).then(async res=>{
        for(let report of res.data.data){
            if(report.assignment.reportId===0) {
                let tmp:Report={
                    reportId: report.assignment.reportId,
                    haveSubmittedReport: false,
                    workerId: report.accepter.id,
                    workerName: report.accepter.username,
                    bugImgs: [],
                    bugDescription: null,
                    revealSteps: null,
                    devices: null,
                    referenceReportId: 0,
                    score: -1,
                    projectId: report.assignment.taskId,
                    refRelation: -1,
                    averageScore: -1,
                    assessPeople: 0
                }
                ans.push(tmp)
            }else{
                await getReportsDetail(report.assignment.reportId).then((res1)=>{
                let tmp:Report={
                    reportId: report.assignment.reportId,
                    haveSubmittedReport: true,
                    workerId: report.accepter.id,
                    workerName: report.accepter.username,
                    bugImgs: res1.bugImgs,
                    bugDescription: res1.bugDescription,
                    revealSteps: res1.revealSteps,
                    devices: res1.devices,
                    referenceReportId: res1.referenceReportId,
                    score: Number(parseFloat(report.myScore).toFixed(2)),
                    projectId: report.assignment.taskId,
                    refRelation: res1.refRelation,
                    averageScore: res1.averageScore,
                    assessPeople: res1.assessPeople
                }
                ans.push(tmp)
                })
            }
        }
        
    })
    .catch(err=>{
        console.log('Error')
    })
    // console.log(ans)
    return ans
}

export const getReportsDetail=async (reportId: number)=>{
    let ans :Report
    await service.request({
        method: 'get',
        url: '/report/detail/'+reportId,
    }).then(res=>{
        // console.log(res.data.data)
        let words=res.data.data.report.description.split('~~')
        ans={
            referenceReportId:res.data.data.quoteId,
            bugDescription: words[0],
            revealSteps: words.length > 1 ? words[1] : '无复现步骤',
            devices: words.length > 2 ? words[2] : '无测试设备信息',
            averageScore: Number(parseFloat(res.data.data.report.averageScore).toFixed(2)),
            bugImgs: res.data.data.report.fileName.split(';').map((element: string, index: string | number, arr: { [x: string]: any; }) => {
                arr[index]='https://linzs-upload.oss-cn-shanghai.aliyuncs.com/img/' +element
                return arr[index]
            }),
            assessPeople:res.data.data.report.scoreCount,
            refRelation:res.data.data.relation,
            workerName: res.data.data.accepter.username,
            haveSubmittedReport: true,
            workerId: res.data.data.accepter.id,
            score:0,
            projectId:0,
            reportId: reportId,
        }
    })
    .catch(err=>{
        console.log('Error')
    })
    // console.log(ans)
    return ans
}

export const assessReport=async (reportId:number, score: number, comment:string)=>{
    let ans: string
    let formData = new FormData();
    // formData.append("reportId",reportId+'')
    console.log(comment)
    formData.append('score', score+"")
    formData.append('comment', comment+"")
    await service.request({
        method: 'post',
        url: '/report/update/'+reportId,
        data: formData,
    }).then(async res=>{
        if (res.data.code==1){
            ans="success"
        }
    })
    .catch(err=>{
        ans="failed"
    })
    return ans
}