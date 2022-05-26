import service from '../../utils/request';
import Project from '../../interface/Project';
import {getTag, formatDate} from '../../utils/timeOperation'

export const getMyTaskList=async (userId)=>{
    let ans:Project[]=[];
    await service.request({
        method: 'get',
        url: '/task/accepted/'+userId,
    }).then(async res=>{
        // console.log(res.data.data.taskList[0])
        let item
        for(item of res.data.data){
            let tmp:Project
            if(!item.requirement) continue
            tmp={
                projectId: item.task.id,
                projectName: item.task.title,
                creatorName: item.provider.username,
                type: item.requirement.testType,
                startDate: formatDate(item.task.startTime),
                endDate: formatDate(item.task.endTime),
                tag: getTag(item.task.startTime, item.task.endTime),
                // submitted: await querySubmitted(item.task.id),
                submitted:item.finished,
                accepted: item.accepted,
                projectIntro: item.task.introduction,
                testAndAppFile: "https://linzs-upload.oss-cn-shanghai.aliyuncs.com/zip/"+item.task.fileName,
                num:item.task.acceptedPeople,
                sum:item.task.neededPeople,
                // peopleSituation:"0/"+item.task.neededPeopleCount,
                peopleSituation:item.task.acceptedPeople+"/"+item.task.neededPeople,
                device: item.requirement.testDevice,
                environment: item.requirement.testEnvironment,
                language: item.requirement.testLanguage,
                method:item.requirement.testMethod,
                rank:item.requirement.difficulty,
                area:item.requirement.testDomain,
                finishedPeople:item.task.finishedPeople,
            }
            ans.push(tmp)
        }
    }).catch(err=>{
        console.log('Error', err.message)
    })
    // console.log(ans)
    return ans
}

export const submitMyReport=async (data)=>{
    for (var key of data.keys()) {
        console.log(data.get(key));
      }
    let ans:string;
    await service.request({
        method: 'post',
        url: '/report/upload',
        data:data
    }).then(async res=>{
        console.log(res)
        ans="success"
    }).catch(err=>{
        console.log('Error', err.message)
        ans="failed"
    })
    
    return ans
}

export const querySubmitted=(async (taskId)=>{
    let ans=false
    await service.request({
        method: 'get',
        url: '/assignment/isSubmitted/'+taskId,
        // params:{
        //     taskId: taskId,
        // }
    }).then(async res=>{
        console.log(res);
        // if(res.data.)
        console.log(res.data.data.successMessage)
        if(res.data.data.successMessage!=null){
            ans=true
        }else{
            ans=false
        }
        // console.log(ans)
    }).catch(err=>{
        console.log('Error', err.message)
    })
    // console.log(ans)
    return ans
})



