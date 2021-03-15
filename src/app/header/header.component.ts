import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls:['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  authorized:boolean = false;
  private subscriber:Subscription
  constructor(public authService:AuthService){}

  ngOnInit(){
    this.authorized = this.authService.getAuthStatus();
    this.subscriber = this.authService.changeAuthStatus().subscribe((dd)=>{
      this.authorized = dd
      // console.log(this.authorized);
      
    })
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(){
    this.subscriber.unsubscribe();
  }
}
