import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  constructor() { }

  getCurrentUser(){
  	var currentUser = localStorage.getItem('currentUser');

  	return JSON.parse(currentUser);
  }

}
