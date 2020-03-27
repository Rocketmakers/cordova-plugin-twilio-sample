import { SafeLocalStorage } from '../helpers/safeLocalStorage';

const authTokenKey = "auth-token"
export class AuthTokenStore{
    static save(token: string){
        SafeLocalStorage.setItem(authTokenKey, token)
    }

    static get(){
        return SafeLocalStorage.getItem(authTokenKey)
    }

    static clear(){
        return SafeLocalStorage.removeItem(authTokenKey)
    }
}