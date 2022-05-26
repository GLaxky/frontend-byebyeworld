import service from '../utils/request';

export const getTheWholeList=()=>{
    service.request({
        method: 'get',
        url: '/task/getSubmittedTaskList',
    }).then()
}