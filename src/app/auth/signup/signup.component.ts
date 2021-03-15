import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
    templateUrl:'./signup.component.html',
    styleUrls:['./signup.component.css']
}) export class SignupComponent implements OnInit {
    isLoading = false
    constructor(public AuthService:AuthService){}

    ngOnInit(){
        this.AuthService.changeAuthStatus().subscribe((dd)=>{
            this.isLoading = false
        })
    }

    onLogin(form:NgForm){
        this.AuthService.createUser(form.value.email, form.value.password) 
        form.resetForm(); 
    }
}