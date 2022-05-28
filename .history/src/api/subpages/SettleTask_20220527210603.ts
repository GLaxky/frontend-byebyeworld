import service from "../../utils/request";

type assignment={
    userId:number,
    money:number
}
export async function settleTask(taskId: number, assignments:assignment[]){
    let formData =new FormData()
    assignments.forEach((item)=>{
        formData.append('users', JSON.stringify(item))
    })
    let ans;
    await service.request({
        method: 'post',
        url: '/task/finish/'+taskId,
        data: formData
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