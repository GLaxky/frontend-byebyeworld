import service from "../../utils/request";

type assignment={
    userId:number,
    money:number
}
export async function settleTask(taskId: number, assignments:assignment[]){
    let formData =new FormData()
    let userIds=[]
    let moneys=[]
    assignments.forEach((item)=>{
        userIds.push(item.userId)
        moneys.push(item.money)
    })
    formData.append('userIds',JSON.stringify(userIds) )
    formData.append('moneys',JSON.stringify(moneys) )
    let ans;
    await service.request({
        method: 'post',
        url: '/task/finish/'+taskId,
        data: {
            userIds: userIds,
            moneys:moneys
        }
    }).then((res)=>{
        console.log(res)
        if(res.data.code==1){
            ans='success'
        }else{
            ans='failed'
        }
    }).catch(err=>{
        console.log(err)
        ans='failed'
    })

    return ans
}