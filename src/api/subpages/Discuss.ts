import service from "../../utils/request";

export const getQuestion=async (taskId:number)=>{
    let ans;
    await service.request({
        method: 'get',
        url: '/discuss/list/'+taskId
    }).then((res)=>{

        let tmp=res.data.data;
        ans=tmp;

    }).catch((err)=>[

    ])
    return ans;
}

export const submitQuestion=async (taskId:number,question:string)=>{
    let ans: string
    let formData = new FormData();
    // formData.append("reportId",reportId+'')
    formData.append('question', question)
    await service.request({
        method: 'post',
        url: '/discuss/create/'+taskId,
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
export const submitAnswer=async (taskId:number,discussid:number,answer:string)=>{
    let ans: string
    let formData = new FormData();
    // formData.append("reportId",reportId+'')
    formData.append('answer', answer)
    await service.request({
        method: 'post',
        url: '/discuss/update/'+taskId+'/'+discussid,
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
