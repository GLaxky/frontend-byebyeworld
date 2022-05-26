import RefRelation from "../../interface/RefRelation";
import service from "../../utils/request";
import { getReportListOfTask, getReportsDetail } from "./ReportList";

export const getreportsRelations=async (taskId: number)=>{
    // let ans:RefRelation[]=[];
    let tmp=[]
    await service.request({
        method: 'get',
        url: '/graph/'+taskId,
    }).then(async res=>{
        
        for(let item of res.data.data){
            let referenceId=item.quoteId
            let citerIdId=item.reportId
            // let relation=(item.relation===1)?"反驳":"拓展"
            tmp.push({
                source: referenceId+'',
                target: citerIdId+'',
                lineStyle: {
                    color: item.relation===2?'#95d475':'#f89898'
                },
            })
        }
    }).catch(err=>{
        console.log('Error', err.message)
    })
    
    return tmp
}

export const getSimilarityRelations=async (taskId: number)=>{
    let tmp=[]
    await service.request({
        method: 'post',
        url: '/report/similarity/'+taskId,
    }).then(async res=>{
        // console.log(res)
        for(let item of res.data.data){
            let referenceId=item.reportId1
            let citerIdId=item.reportId2
            let similarity=item.similarity
            // let relation=(item.relation===1)?"反驳":"拓展"
            tmp.push({
                source: referenceId+'',
                target: citerIdId+'',
                symbol: ['circle', 'circle'],
                symbolSize: [10, 10],
                linkType: 'similarity',
                similarity:Number(similarity.toFixed(4)),
                label: {
                    show: true,
                    formatter:function(params){ 
                        // console.log(params)
                        return (params.data.similarity*100).toFixed(2)+"%";
                    },
                    fontSize: 10
                },
                lineStyle: {
                    type: 'dotted',
                    color: 'black',
                    width: similarity*10,
                    curveness: 0
                }
            })
        }
    }).catch(err=>{
        console.log('Error', err.message)
    })
    // console.log(tmp)
    return tmp
}


export const getReportNodes=async (taskId: number)=>{
    let reportList =await getReportListOfTask(taskId)
    let ans=[]
    for(let report of reportList){
        let tmp={
            name: report.haveSubmittedReport?(report.reportId+''):report.workerName,
            report: report,
            category: report.haveSubmittedReport?0:1
        }
        ans.push(tmp)
    }
    // console.log(ans)
    return ans
}