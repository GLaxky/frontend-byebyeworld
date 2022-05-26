import Notice from "../../interface/Notice";
import service from "../../utils/request";

export const getNotices=async ()=>{
    let ans;
    await service.request({
        method: 'get',
        url: '/notice'
    }).then((res)=>{

        let tmp=res.data.data;
        ans=tmp;

    }).catch((err)=>[

    ])
    return ans;
}
