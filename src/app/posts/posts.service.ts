import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs';
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
const BACKEND_URL = environment.APIURL + "/posts";
import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts:Post[], postCount:number}>();

  constructor(private http:HttpClient, private router:Router){}

  getPosts(postsPerPage:number, currentPage:number) {
    const queryParams = `?pagesize=${postsPerPage}&currentpage=${currentPage}`
    this.http.get<{message:string, posts:any, maxPosts:any }>(BACKEND_URL + queryParams)
    .pipe(map(responseData=>{
     return { posts: responseData.posts.map((post)=>{
        return {id:post._id,
        title:post.title,
        content:post.content,
        imagePath:post.imagePath,
        creator:post.creator}
      }), maxPosts:responseData.maxPosts}
    }))
    .subscribe((postsData)=>{
      console.log();
      
      this.posts = postsData.posts;
      this.postsUpdated.next({posts:[...this.posts], postCount:postsData.maxPosts})
    })
    // return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image:File) {
    const post = new FormData();
    post.append("title",title);
    post.append("content",content);
    post.append("image",image, title);
    this.http.post<{message:String, post:Post}>(BACKEND_URL ,post).subscribe(
      (data)=>{
        console.log(data);
        this.router.navigate(['/']);
      }
    )
  }

  getPost(id:string){
    return this.http.get<{post:{_id: string, title:string, content:String, imagePath:string}}>(BACKEND_URL + "/"+id)
  }

  editPost(id:string, title:string, content:string, image:File|string ){
    let postData
    if(typeof(image) === 'object' ){
       postData = new FormData();
      postData.append("title",title);
      postData.append("content",content);
      postData.append("image",image, title);
    } else{
       postData={
        id, title, content,imagePath:image
      }
    }
    this.http.put(BACKEND_URL + "/"+id, postData).subscribe((data)=>{
      this.router.navigate(['/']);
      console.log(data);
    })
  }

  deletePost(id:string){
    return this.http.delete(BACKEND_URL + '/'+id)
  }
}
