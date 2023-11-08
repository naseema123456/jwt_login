import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Emitters } from 'src/app/emitters/emitter';
import { User } from 'src/app/models/userModel';
import { Store, select } from '@ngrx/store'
import Swal from 'sweetalert2';
import { retrieveProfile } from 'src/app/components/user/state/user.action';
import {userProfileSelector } from 'src/app/components/user/state/user.selectors';
import { appProfile } from '../state/user.state';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  form: FormGroup;

  public name: string;
  public email: string;
  img?: string;
  selectedFile: File;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<{userdetails:User}>
  ){}

  // userData$ = this.store.pipe(select(userProfileSelector)).subscribe( profileData => {

  //   console.log(profileData,'profileData');
  //   this.name = profileData.name;
  //   this.email = profileData.email;
  //   this.img = profileData?.image;
    
  // })

  userData$ = this.store.pipe(select(userProfileSelector)).subscribe( profileData => {
    console.log('hello');
    
    this.name = profileData.name;
    this.email = profileData.email;
    this.img = profileData?.image;
    console.log(profileData,'profileData');
    
  })
  // userData$ :Observable<User>= this.store.pipe(select(userProfileSelector));

  // userData$=this.store.select(userProfileSelector)

  ngAfterViewInit(): void {
    Emitters.authEmitter.emit(true)
    // console.log(this.userData$, ' userdata$');
  }

  ngOnInit(): void {
    console.log('dispatching profile');
    this.store.dispatch(retrieveProfile());
    
  }

  onSubmit(){
    const formData = new FormData();
    formData.append('image',this.selectedFile,this.selectedFile.name)

    this.http.post(`http://localhost:3000/api/user/profile-upload-single`,formData,{ withCredentials: true })
    .subscribe(
      () => {
        Emitters.authEmitter.emit(true);
        this.store.dispatch(retrieveProfile());
        Swal.fire('Success','Saved','success')
      },
      (err) => {
        Swal.fire("Error",err.error.message,'error');
      }
    )
  }

  // onFileSelected(event:Event){
  //   this.selectedFile = <File>event.target.files[0];
  //   console.log(event);
  // }
  onFileSelected(event: Event): void {
    const inputElement = (event.target as HTMLInputElement)?.files;
    
    if (inputElement && inputElement.length > 0) {
      this.selectedFile = inputElement[0];
      console.log(this.selectedFile);
    }
  }
  
  

}