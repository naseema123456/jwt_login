import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Emitters } from 'src/app/emitters/emitter';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.css']
})
export class UserNavComponent implements OnInit{

  authenticated = false;

  constructor( 
    private http: HttpClient,
    private router:Router
  ){}

  ngOnInit(): void {
    // console.log('OnInit Invoked');
    
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = true;
    });
  }

  logout(){
    this.http.post(`http://localhost:3000/api/user/logout`,{},{ withCredentials: true }).subscribe(
      () => {
        this.authenticated = false;
       // Log the user out
       localStorage.removeItem('isUserLoggedIn');
        this.router.navigate(['/user/login']);
      }
    );
  }

}