import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { AppRoutingModule } from './app-routing.module';
import { HoverDirective } from './hover.directive';
import { AuthInterceptor } from "./auth/auth-interceptor";
import { ErrorInterceptor } from "./error-interceptor";
import { ErrorComponent } from "./error/error.component";
import { MaterialModule } from "./angular-material.module";
import { PostsModule } from "./posts/posts.module";
import { CommonModule } from "@angular/common";


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HoverDirective,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    AppRoutingModule,
    PostsModule,
    CommonModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass:AuthInterceptor, multi:true},
    {provide: HTTP_INTERCEPTORS, useClass:ErrorInterceptor, multi:true}],
  bootstrap: [AppComponent],
  entryComponents:[ErrorComponent]
})
export class AppModule {}
