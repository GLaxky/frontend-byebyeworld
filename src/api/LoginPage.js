import service from '../utils/request';

export const post_to_login=()=>{
    service.request({
        method: 'post',
        url: '/task/getSubmittedTaskList',
    }).then()
}