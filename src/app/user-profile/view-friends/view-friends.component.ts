import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-friends',
  templateUrl: './view-friends.component.html',
  styleUrls: ['./view-friends.component.css']
})
export class ViewFriendsComponent implements OnInit {

  buddies: any;

  constructor(
  	private db: AngularFireDatabase,
  	private authSvc: AuthService,
    public activeModal: NgbActiveModal) { 
  		this.buddies = this.db.list('Users/' + this.authSvc.getCurrentUser().uid + '/buddies').snapshotChanges();
  }

  ngOnInit() {
  }

}
