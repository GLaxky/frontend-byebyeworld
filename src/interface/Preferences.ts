export default interface Preferences{
    userId: number,
    username: string,
    email: string,
    userType: string,
    level: string,
    activity:string,
    device:Array<string>,
    environment:Array<string>,
    language:Array<string>,
    area:Array<string>,
    type:Array<string>,
    method:Array<string>,
}