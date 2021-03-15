import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from "src/app/auth/auth.service";
// PageEvent

import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  // @ViewChild('tooltip') tooltip:ElementRef
  isLoading = false;
  posts: Post[] = [];
  private postsSub: Subscription;
  private authSub: Subscription;
  currentUser
  authorized:boolean = false
  totalLength = 0;
  pageSize = 2;
  pageSizeOptions = [1,2,5,10];
  currentPage = 1;
  constructor(public postsService: PostsService, private router:Router, private authService:AuthService) {}

  ngOnInit() {
    this.isLoading = true
    this.postsService.getPosts(this.pageSize, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts) => {
        this.posts = posts.posts;
        this.totalLength = posts.postCount
        // console.log(typeof this.posts);
        this.isLoading = false
      });
    
    this.authorized = this.authService.getAuthStatus();
    this.currentUser = this.authService.currentUser;  
    this.authSub = this.authService.changeAuthStatus().subscribe((dd)=>{
      this.authorized = dd;
    })

  }

  onDelete(id:string){
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe(()=>{
      this.postsService.getPosts(this.pageSize, this.currentPage);
    })
    // this.isLoading = false;
  }

  onEdit(id:string){
    this.router.navigate(['edit/'+id])
  }

  onChangedPage(pageData:PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex+1;
    this.pageSize = pageData.pageSize;
    // console.log(pageData);
    this.postsService.getPosts(this.pageSize, this.currentPage);
  }
  

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authSub.unsubscribe();
  }
}
