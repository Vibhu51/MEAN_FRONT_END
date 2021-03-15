import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
const BACKEND_URL = environment.APIURL + "/user";

@Injectable({
    providedIn:'root'
})
export class AuthService{
    private token:string;
    authStatusListener = new Subject<boolean>();
    private isAuthenticated = false;
    private expiresInDuration:number;
    private tokenTimer:any;
    currentUser:string = null
    constructor(private http:HttpClient, private router:Router){}

    getToken(){
        return this.token;
    }

    changeAuthStatus(){
        return this.authStatusListener.asObservable();
    }

    getAuthStatus(){
        return this.isAuthenticated;
    }
    
    createUser(email:string, password:string){
        const authData:AuthData = {email,password};
        this.http.post(BACKEND_URL +"/signup",authData)
        .subscribe((res)=>{
            console.log(res);
            this.router.navigate([""])
            
        },error=>{
            this.authStatusListener.next(false);
            // this.router.navigate([""])
        })
    }

    login(email:string, password:string){   
        const authData:AuthData = {email,password};
        this.http.post<{token:string, expiresIn:number, id:string}>(BACKEND_URL+ "/login",authData)
        .subscribe((res)=>{
            console.log(res);
            this.token = res.token;
            this.expiresInDuration = res.expiresIn
            if(this.token){
                this.setAuthTimer(this.expiresInDuration);
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                const current = new Date();
                this.currentUser = res.id
                const expirationDate = new Date(current.getTime() + this.expiresInDuration*1000)
                console.log(expirationDate); 
                this.saveAuthData(this.token, expirationDate, this.currentUser)
                this.router.navigate([''])
            }
        })
    }

    logout(){
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.router.navigate([''])
        this.clearAuthData()
        clearTimeout(this.tokenTimer)
    }

    autoAuthUser(){
        const authInformation = this.getAuthData();
        if(!authInformation){
            return
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if(expiresIn > 0){
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.currentUser = authInformation.currentUser;
            this.authStatusListener.next(true);
            this.setAuthTimer(expiresIn / 1000);
        }
    }

    private saveAuthData(token:string, expirationDate:Date, currentUser){
        localStorage.setItem('token',token);
        localStorage.setItem('currentuser',currentUser);
        localStorage.setItem('expiration',expirationDate.toISOString());
    }

    private setAuthTimer(duration:number){
        this.tokenTimer = setTimeout(()=>{
            this.logout()
        },duration*1000)
    }

    private clearAuthData(){
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('currentuser');
    }

    private getAuthData(){
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        const activeUser = localStorage.getItem("currentuser")
        if(!token && !expirationDate){
            return
        }
        return {
            token:token,
            expirationDate : new Date(expirationDate),
            currentUser: activeUser
        }
    }
}