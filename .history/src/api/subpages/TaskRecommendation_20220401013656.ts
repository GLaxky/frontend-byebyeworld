import Recommandation from "../../interface/Recommandation";
import service from "../../utils/request";
import { formatDate, getTag } from "../../utils/timeOperation";

export const getRecommendations=async (userId: number)=>{
    let ans:Recommandation[]=[]
    await service.request({
        method: 'get',
        url: '/task/recommended/'+userId,
    }).then((res)=>{
        for(let item of res.data.data){
            if(!item.requirement) continue
            let tmp:Recommandation
            let tags=[...item.requirement.testLanguage.split(';'), item.requirement.testType,item.requirement.testDevice,
                item.requirement.testEnvironment,item.requirement.testMethod,item.requirement.testDomain
                ]
            tmp={
                projectId: item.task.id,
                projectName: item.task.title,
                creatorName: item.provider.username,
                startDate: formatDate(item.task.startTime),
                endDate: formatDate(item.task.endTime),
                tags: tags,
                submitted: item.finished,
                accepted: item.accepted,
                projectIntro: item.task.introduction,
                testAndAppFile: "https://linzs-upload.oss-cn-shanghai.aliyuncs.com/zip/"+item.task.fileName,
                num:item.task.acceptedPeople,
                sum:item.task.neededPeople,
                // peopleSituation:"0/"+item.task.neededPeopleCount,
                peopleSituation:item.task.acceptedPeople+"/"+item.task.neededPeople,
                rank:item.requirement.difficulty,
            }
            ans.push(tmp)
        }
    }).catch((err)=>{
        console.log('Error', err.message)
    })

    return ans
}