import { HttpInterceptor, HttpRequest,HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

    constructor(private dialog:MatDialog){}

    intercept(req:HttpRequest<any>, next:HttpHandler){
        return next.handle(req).pipe(
            catchError((error:HttpErrorResponse)=>{
                let errorMessage = "An unknown error occured!"
                if(error){
                    errorMessage = error.error.message
                    if(error.error.message.message){
                        errorMessage = error.error.message.message
                    }
                    
                }

                // if(error.error.messages)
                this.dialog.open(ErrorComponent, {data:{message:errorMessage}})
                console.log(error);
                // alert(error.error.message)
                return throwError(error)
            })
        )
    }
}  