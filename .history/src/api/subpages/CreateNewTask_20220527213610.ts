import { toRaw } from 'vue';
import service from '../../utils/request.js'
import UploadTask from '../../interface/UploadTask'
import { getTag, formatDate } from '../../utils/timeOperation';

export const createNewTask =async (task:UploadTask)=>{
    console.log(task)
    let ans:string;
    let formdata = new FormData()
    formdata.append("cost", task.costSum+'')
    formdata.append("neededPeople", task.num+'')
    formdata.append("descriptionFile", task.testFile)
    formdata.append("difficulty", task.rank)
    formdata.append("startTime", formatDate(task.startDate).slice(0,11)+formatDate(task.startTime).slice(11))
    formdata.append("endTime", formatDate(task.endDate).slice(0,11)+formatDate(task.endTime).slice(11))
    formdata.append("testDevice", task.device)
    formdata.append("testDomain", task.area)
    formdata.append("testEnvironment", task.environment)
    formdata.append("testMethod", task.method)
    formdata.append("testType", task.type)
    formdata.append("introduction", task.projectIntro)
    formdata.append("testedFile", task.appFile)
    formdata.append("title", task.projectName)
    formdata.append("testLanguage", task.language.join(';'))
    console.log(formatDate)
    await service.request({
        method: 'post',
        url: '/task/submit/'+ localStorage.getItem('userId'),
        data: formdata,
    }).then(async res=>{
        if(res.data.code===-1){
            ans='lack of balance'
        }else{
            ans="success"
        }
        
    }).catch(err=>{
        console.log('Error', err.message)
        ans="failed"
    })
    return ans
}