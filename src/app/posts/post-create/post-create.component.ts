import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { ActivatedRoute, ParamMap } from '@angular/router';
import { title } from 'process';
import { mimeType } from "./mime-type.validator.ts";


import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit{
  mode:string = "create";
  postID:string = null;
  isLoading = false;
  form:FormGroup;
  imagePreview:any
  constructor(public postsService: PostsService, public route:ActivatedRoute) {}

  ngOnInit(){

    this.form = new FormGroup({
      'title': new FormControl(null,{validators: [Validators.required]}),
      'content': new FormControl(null,{validators: [Validators.required]}),
      'image': new FormControl(null, {validators: [Validators.required,], asyncValidators:[mimeType]})
    })

    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has('postid')){
        this.mode ="edit";
        console.log(this.mode);
        this.postID = paramMap.get('postid');
        this.isLoading = true;
        this.postsService.getPost(this.postID).subscribe((temp)=>{
          this.isLoading = false;
          // console.log(temp);
          this.form.setValue({
            title:temp.post.title,
            content:temp.post.content,
            image:temp.post.imagePath
          })
        })

      } else{
        this.mode="create";
        this.postID = null;
      }
    })
  }

  onImagePicked(event:Event){
    const file = (event.target as HTMLInputElement).files[0]
    this.form.patchValue({image:file});
    this.form.get('image').updateValueAndValidity();
    // console.log(file);
    // console.log(this.form);
    const reader = new FileReader()
    reader.onload = () =>{
      this.imagePreview = reader.result
    }
    reader.readAsDataURL(file)
  }

  onAddPost() {
    this.isLoading=true;
    console.log(this.form);
    
    if (this.form.invalid) {
      return;
    }
    if(this.mode === 'create'){
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else if(this.mode === 'edit'){
      this.postsService.editPost(this.postID,this.form.value.title,this.form.value.content, this.form.value.image)
    } 
    this.form.reset(); 
  }
}
