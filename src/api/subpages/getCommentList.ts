import service from "../../utils/request";
import Comment from '../../interface/Comment'
export async function getCommentList(reportId: number){
    let ans:Comment[]=[]
    await service.request({
        method: 'get',
        url:'/report/score_comment/'+reportId
    }).then((res)=>{
        for(let item of res.data.data){
            let tmp: Comment={
                userName: item.commenter,
                comment: item.comment,
                score: item.score
            }
            ans.push(tmp)
        }
    }).catch((err)=>{

    })
    return ans
}