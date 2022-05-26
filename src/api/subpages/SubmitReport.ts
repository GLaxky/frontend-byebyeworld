import Report from "../../interface/Report";
import UploadReport from "../../interface/UploadReport";
import service from "../../utils/request";

export const submitMyReport=async (data:UploadReport)=>{
    let formData=new FormData();
    formData.append('quoteId', data.referenceReportId+'')
    formData.append('description', data.bugDescription+"~~"+data.revealSteps+"~~"+data.devices)
    formData.append('relation', data.refRelation+'')
    formData.append('taskId', data.projectId+'')
    data.bugImgs.forEach((item)=>{
        formData.append('screenshots', item.raw)
    })
    let ans;
    await service.request({
        method: 'post',
        url: '/report/upload',
        data:formData
    }).then(async res=>{
        console.log(res.data)
        if(res.data.code===1){
            ans="success"
        }else if(res.data.code===-1){
            ans={
                list:[],
                message: res.data.message
            }
            for(let report of res.data.data){
                let tmp:Report;
                let words=report.report.description.split('~~')
                tmp={
                    reportId: report.report.id,
                    haveSubmittedReport: true,
                    workerId: report.user.id,
                    workerName: report.user.username,
                    bugImgs: report.report.fileName.split(';').map((element, index, arr) => {
                        arr[index]='https://linzs-upload.oss-cn-shanghai.aliyuncs.com/img/' +element
                        return arr[index]
                    }),
                    bugDescription: words[0],
                    revealSteps: words.length >= 1 ? words[1] : '无复现步骤',
                    devices: words.length >= 2 ? words[2] : '无测试设备信息',
                    referenceReportId: report.quote.quoteId,
                    score: 0,
                    projectId: data.projectId,
                    refRelation: report.quote.relation,
                    averageScore: report.report.averageScore,
                    assessPeople: 0,
                }
                ans.list.push(tmp)
            }
        }
    }).catch(err=>{
        console.log('Error', err.message)
        ans="failed"
    })
    
    return ans
}