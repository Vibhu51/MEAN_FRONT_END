import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { AuthGuard } from "./auth/auth.guard";
import { AuthModule } from './auth/auth.module';

const routes:Routes = [
    {path:'', component:PostListComponent},
    {path:'create', component:PostCreateComponent, canActivate:[AuthGuard]},
    {path:'edit/:postid', component:PostCreateComponent,canActivate:[AuthGuard]},
    {path:'auth', loadChildren:()=> AuthModule}
]

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule],
    providers:[AuthGuard]
})
export class AppRoutingModule{

}