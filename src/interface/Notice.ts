export default interface Notice{
    id: number,
    userId: number,
    type: number,
    targetId: number,
    taskId: number,
    detail: string,
    createTime: number,
    state: number

}
