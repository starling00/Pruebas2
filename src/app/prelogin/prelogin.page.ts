import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prelogin',
  templateUrl: './prelogin.page.html',
  styleUrls: ['./prelogin.page.scss'],
})
export class PreloginPage implements OnInit {
 

  constructor(private router: Router,) { }

  ngOnInit() {
  }

  login() {
    this.router.navigateByUrl('/login');
  }


}//fin d la class
