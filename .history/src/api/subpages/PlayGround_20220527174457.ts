import service from '../../utils/request';
import Project from '../../interface/Project'
import {getTag, formatDate} from '../../utils/timeOperation'

export const getTheWholeList=async ()=>{
    let ans:Project[]=[];
    await service.request({
        method: 'get',
        url: '/task/all',
    }).then(async res=>{
        let item
        for(item of res.data.data){
            if(!item.requirement) continue
            let tmp:Project
            tmp={
                projectId: item.task.id,
                projectName: item.task.title,
                creatorName: item.provider.username,
                // 记得改
                type: item.requirement.testType,
                startDate: await formatDate(item.task.startTime),
                endDate: await formatDate(item.task.endTime),
                tag: await getTag(item.task.startTime, item.task.endTime),
                submitted: item.finished,
                accepted: item.accepted,
                projectIntro: item.task.introduction,
                testAndAppFile: "https://linzs-upload.oss-cn-shanghai.aliyuncs.com/zip/"+item.task.fileName,
                num:item.task.acceptedPeople,
                sum:item.task.neededPeople,
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
        console.log('Error', err.message)
    })
    return ans
}

export const acceptAssignment=async (taskId)=>{
    let formData=new FormData();
    formData.append('taskId', taskId)
    let ans:string;
    await service.request({
        method: 'post',
        url: '/assignment/accept',
        data: formData
    }).then(async res=>{
        ans="success"
    }).catch(err=>{
        console.log('Error', err.message)
        ans="failed"
    })
    return ans
}


export async function getFilteredTaskList(data){
    let ans=[]
    await service.request({
        method: 'post',
        url: '/task/specific',
        params: {
            difficulty: data.difficulty=='all'?null:data.difficulty,
            testDevice: data.testDevice=='all'?null:data.testDevice,
            testDomain: data.testDomain=='all'?null:data.testDomain,
            testEnvironment: data.testEnvironment=='all'?null:data.testEnvironment,
            testLanguage: data.testLanguage=='all'?null:data.testLanguage,
            testMethod: data.testMethod=='all'?null:data.testMethod,
            testType: data.testType=='all'?null:data.testType
        }
    }).then(res=>{
        for(let item of res.data.data){
            if(!item.requirement) continue
            let tmp:Project
            tmp={
                projectId: item.task.id,
                projectName: item.task.title,
                creatorName: item.provider.username,
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
        console.log('Error', err.message)
    })
    // console.log(ans)
    return ans
}

// 有问题！！！
export const downLoadFile= async (taskId)=>{
    let ans:string;
    await service.request({
        method: 'get',
        url: '/task/download/'+taskId,
    }).then(async res=>{
        
        console.log(res.data.stateCode)
        if(res.data.stateCode===200){
            window.location.href = "apis/task/download/"+taskId
            ans="success"
        }else{
            ans=res.data.data.errorMessage
        }
        
    }).catch(err=>{
        console.log('Error', err.message)
        ans="failed"
    })
    setTimeout(() => {
    }, 2000);
    return ans
}
