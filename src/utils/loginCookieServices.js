import Cookies from 'js-cookie'

let num = 0.5 //失效时间是几小时
let time= new Date(new Date().getTime() + num * 60 * 60 * 1000);

const TokenKey = 'loginToken'

export function getToken() {
    return Cookies.get(TokenKey)
}


export function setToken(token) {
    return Cookies.set(TokenKey, token,{
        expires: time
    })

}

export function removeToken() {
    return Cookies.remove(TokenKey)
}
