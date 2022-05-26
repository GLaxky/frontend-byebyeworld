import service from "../../utils/request";
import ConfigParams from "../../interface/ConfigParams";

export const getWeight=async ()=>{
    let ans: ConfigParams;
    await service.request({
        method: 'get',
        url: '/admin/weight',
    }).then((res)=>{
        ans=res.data.data
    }).catch((err)=>{
        
    })
    return ans
}

export const setWeight=async (params: ConfigParams)=>{
    let ans
    let formData=new FormData()
    formData.append("ability",params.ability+"")
    formData.append("domain",params.domain+"")
    formData.append("language",params.language+"")
    formData.append("method",params.method+"")
    formData.append("type",params.type+"")
    await service.request({
        method: 'post',
        url: '/admin/weight',
        data: formData
    }).then((res)=>{
        if(res.data.code==1)
            ans='success'
    }).catch((err)=>{
        ans='fail'
    })
    return ans
}

export const getSimilarityMethod=async ()=>{
    let ans;
    await service.request({
        method: 'get',
        url: '/admin/strategy',
    }).then((res)=>{
        
        ans={
            img:res.data.data.img.toFixed(2),
            txt:res.data.data.txt.toFixed(2),
        }
        console.log(ans)
    }).catch((err)=>{
        
    })
    return ans
}

export const setSimilarityMethod=async (params)=>{
    let ans
    let formData =new FormData()
    formData.append('img', params.img)
    formData.append('txt', params.txt)
    await service.request({
        method: 'post',
        url: '/admin/strategy',
        data: formData
    }).then((res)=>{
        if(res.data.code==1)
            ans='success'
    }).catch((err)=>{
        ans='failed'
    })
    return ans
}