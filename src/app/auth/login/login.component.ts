import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";




@Component({
    templateUrl:'./login.component.html',
    styleUrls:['./login.component.css']
}) export class LoginComponent {
     isLoading = false

    constructor(public AuthService:AuthService){}

    onLogin(form:NgForm){
        // console.log(form);
        this.AuthService.login(form.value.email, form.value.password);
        form.resetForm();
    }
}