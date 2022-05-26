import service from "../../utils/request";

export const getMdFiles=async ()=>{
    let ans;
    await service.request({
        method: 'get',
        url: '/help.md'
    }).then((res)=>{
        // console.log(res)

         let tmp=res.data;
         ans=tmp;

    }).catch((err)=>[

    ])
    return ans;
}
