export function formatDate(value: string|number|Date) {
    let date = new Date(value);
    let y = date.getFullYear();
    let MM = date.getMonth() + 1 as number;
    MM = MM < 10 ? ('0'+MM) as unknown as number : MM;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) as unknown as number : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) as unknown as number : h;
    let m = date.getMinutes();
    m = m < 10 ? ('0' + m) as unknown as number : m;
    let s = date.getSeconds();
    s = s < 10 ? ('0' + s) as unknown as number : s;
    return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
};

export function getTag(startTime:number, endTime: number){
    let current = new Date()
    let start=new Date(startTime)
    let end=new Date(endTime)

    if(current>=end){
        return "已截止"
    }else if(current>start){
        return "正在进行"
    }else{
        return "未开始"
    }
}