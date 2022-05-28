import service from '../../utils/request';
import { getTag, formatDate } from '../../utils/timeOperation';
import Project from '../../interface/Project';
import Report from '../../interface/Report'
import {ref} from 'vue'

// export const getReportListOfTask=async (data)=>{
//     let ans=[] 
//     await service.request({
//         method: 'get',
//         url: '/assignment/list/'+data,
//         // params: {
//         //     taskId: data
//         // },
//     }).then(async res=>{
//         // console.log("getReportListOfTask: "+res.data.data.assignmentList);
        
//         for(let report of res.data.data){
//             let workerId=report.accepter.id
//             let workerName=report.accepter.username
//             let bugScreenshots=[]
//             let bugDescription=''
//             let revealSteps=''
//             let devices=''
//             if(report.assignment.reportId===0) continue
//             let group= await getReportsDetail(report.assignment.reportId).then((res1)=>{
//                 // console.log(res1);
//                 // if(res1!=undefined){
//                     let words=res1.bugDescription.split('~~')
//                     let tmp={
//                         workerId:workerId,
//                         workerName:workerName,
//                         bugImgs:bugScreenshots,
//                         bugImgsDownloadApi: 'https://linzs-upload.oss-cn-shanghai.aliyuncs.com/zip/'+res1.bugScreenshots,
//                         bugDescription:words[0] ,
//                         revealStep:words.length>=1?words[1]:revealSteps,
//                         devices:words.length>=2?words[2]:devices ,
//                     }
//                     ans.push(tmp)
//                     console.log(ans)
//                 // }
                
//             })

//             // console.log(group)
//         }
        
//     })
//     .catch(err=>{
//         console.log('Error', err.message)
//     })
//     return ans
// }

// export const getReportsDetail=async (data)=>{
//     let ans 
//     await service.request({
//         method: 'get',
//         url: '/report/detail/'+data,
//         // params: {
//         //     taskId: data
//         // },
//     }).then(res=>{
//         console.log(res)
//         ans={
//             bugDescription: res.data.data.description,
//             bugScreenshots: res.data.data.fileName,
//         }
//     })
//     .catch(err=>{
//         // console.log('Error', err.errMessage)
//     })
//     return ans
// }


export const getTaskListReleasedByMe=async (userId)=>{
    let ans:Project[]=[];
    await service.request({
        method: 'get',
        url: '/task/submitted/'+userId,
    }).then(async res=>{
        // console.log(res)
        let item
        for(item of res.data.data){
            let tmp:Project
            // console.log(item)
            if(!item.requirement) continue
            tmp={
                projectId: item.task.id,
                projectName: item.task.title,
                creatorName: "我",
                type: item.requirement.testType,
                startDate: formatDate(item.task.startTime),
                endDate: formatDate(item.task.endTime),
                tag: getTag(item.task.startTime, item.task.endTime),
                submitted: item.finished,
                accepted: item.accepted,
                projectIntro: item.task.introduction,
                testAndAppFile: "https://linzs-upload.oss-cn-shanghai.aliyuncs.com/zip/"+item.task.fileName,
                num:item.task.acceptedPeople,
                sum:item.task.neededPeople,
                // peopleSituation:"0/"+item.neededPeopleCount,
                peopleSituation:item.task.acceptedPeople+"/"+item.task.neededPeople,
                device: item.requirement.testDevice,
                environment: item.requirement.testEnvironment,
                language: item.requirement.testLanguage,
                method:item.requirement.testMethod,
                rank:item.requirement.difficulty,
                area:item.requirement.testDomain,
                finishedPeople:item.task.finishedPeople,
                costSum: item.requirement.cost,
            }
            
            ans.push(tmp)
        }
    }).catch(err=>{
        console.log('Error', err)
    })
    // console.log(ans)
    return ans
}
