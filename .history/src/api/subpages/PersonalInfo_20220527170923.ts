import Preferences from "../../interface/Preferences";
import service from "../../utils/request";

export const getPreferences=async (userId :number)=>{
    let ans:Preferences=null;
    await service.request({
        method: 'get',
        url: '/preference/detail/'+userId,
    }).then((res)=>{
        let tmp=res.data.data;
        ans={
            userId: userId,
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            userType: getType(tmp.user.type),
            level: tmp.preference.ability,
            activity:tmp.preference.liveness,
            device:tmp.preference.testDevice.split(";"),
            environment:tmp.preference.testEnvironment.split(";"),
            language:tmp.preference.testLanguage.split(";"),
            area:tmp.preference.testDomain.split(";"),
            type:tmp.preference.testType.split(";"),
            method:tmp.preference.testMethod.split(";"),
            balance: Number(tmp.user.money)
        }
    }).catch((err)=>{

    })
    return ans;
}

export const setPreferences=async (preferences: Preferences)=>{
    let ans;
    let formdata=new FormData();
    formdata.append("ability",preferences.level+'')
    formdata.append("liveness",preferences.activity+'')
    formdata.append("testDevice",preferences.device.join(';'))
    formdata.append("testDomain",preferences.area.join(';'))
    formdata.append("testEnvironment",preferences.environment.join(';'))
    formdata.append("testLanguage",preferences.language.join(';'))
    formdata.append("testMethod",preferences.method.join(';'))
    formdata.append("testType",preferences.type.join(';'))
    formdata.append("workerId",preferences.userId+'')
    await service.request({
        method: 'post',
        url: '/preference/modify',
        data: formdata,
    }).then((res)=>{
        if(res.data.code==1)
            ans='success'
        else{
            ans='failed'
        }
    }).catch((err)=>[
        ans=err.message
    ])
    return ans;
}

export async function charge(cash: number){
    let ans;
    let formdata=new FormData()
    formdata.append('money', cash+'')
    await service.request({
        method: 'post',
        url: '/deposit',
        data: formdata
    }).then((res)=>{
        if(res.data.code==1)
            ans='success'
        else{
            ans='failed'
        }
    })
    return ans
}

export async function withdraw(cash: number){
    let ans;
    let formdata=new FormData()
    formdata.append('money', cash+'')
    await service.request({
        method: 'post',
        url: '/deposit',
        data:formdata
    }).then((res)=>{
        if(res.data.code==1)
            ans='success'
        else{
            ans='failed'
        }
    })
    return ans
}

function getType(userType:number){
    if(userType===0){
        return '管理员'
    }else if(userType===1){
        return '发包方'
    }else{
        return '众包工人'
    }
}