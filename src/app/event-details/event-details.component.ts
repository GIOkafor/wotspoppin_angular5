import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../services/auth.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InviteFriendsComponent } from '../invite-friends/invite-friends.component';
import { GuestlistComponent } from '../guestlist/guestlist.component';
import 'rxjs/add/operator/switchMap';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {

  event: any;
  attending: boolean = false;
  maybe: boolean;
  guestsCount: number = 0;
  currentUserUid: any;

  constructor(
  	private db: AngularFireDatabase,
  	private route: ActivatedRoute,
  	private location: Location,
  	private authSvc: AuthService,
  	private router: Router,
    private modalSvc: NgbModal,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) { 
      this.currentUserUid = authSvc.getCurrentUser().uid;
  }

  ngOnInit() {
  	this.route.paramMap
	  	.switchMap((params: ParamMap) => 
	        this.db.object('Events/'+params.get('id')).snapshotChanges())
	        .subscribe(
	          (event: any) => {
	            this.event = event;

              //check if event still exists, if not deprecate gracefully
	            if(event.key !== null){
                console.log("Event exists: ", event);
                this.checkIfAttending();
              }else{
                this.event = null;
              }              
	          });
  }

  goBack(){
  	this.location.back();
  }

  //checks guest list to see if user is attending event
  //also calculates number of people that have rsvp'd
  checkIfAttending(){
  	//console.log(this.event.payload.val().guestlist);

    //check if guestlist exists first, new events don't have guestlist object yet because no one has rsvpd
    if(!this.event.payload.val().guestlist){
      console.log("No guest list for event");
      return;
    }

  	for(var user in this.event.payload.val().guestlist){
  		this.guestsCount++;
      if (this.event.payload.val().guestlist[user] === this.authSvc.getCurrentUser().uid)
  			this.attending = true;
  	}
  }

  attendEvent(){
  	
    //check if user is authenticated first
    if(this.authSvc.checkUserAuth()){ 
      console.log("Adding you to guest list");

      //process payment and

      //add user to guestlist in db
      this.db.list('Events/' + this.event.payload.key + '/guestlist').push(this.authSvc.getCurrentUser().uid);

      //remove useless bits of info before adding event details to user portion of db
      let ev = {
        name: this.event.payload.val().name,
        date: this.event.payload.val().date
      };

      //add event to user upcoming events
      this.db.object('Users/' + this.authSvc.getCurrentUser().uid + '/upcoming-events/' + this.event.payload.key).update(ev);

      this.maybe = false;
      this.attending = true;
    }
  }

  mayBe(){
    if(this.authSvc.checkUserAuth()){	
      console.log("Adding you to maybe list");
    	this.maybe = true;
    }
  }

  //change to modal toggle
  inviteFriends(){
  	if(this.authSvc.checkUserAuth()){
      const modalRef = this.modalSvc.open(InviteFriendsComponent);
      modalRef.componentInstance.event = this.event;
    }
  }

  showGuestList(){
    console.log("Showing guest list");

    const guestListRef = this.modalSvc.open(GuestlistComponent);
    guestListRef.componentInstance.event =  this.event;
  }

  showDeleteEventDialog(){
    //console.log("Deleting event...");

    let dialogRef = this.dialog.open(ActionConfirmDialog, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed: ', result);

      if(result === 'delete')
        this.deleteEvent(this.event);
    });
  }

  deleteEvent(event){
    //console.log("Deleting event: ", event);

    let snackBarRef = this.snackBar.open("Deleted successfully, redirecting you...", "", {duration: 3000});
      snackBarRef.afterDismissed().subscribe(() => {
        this.db.list('Events/' + this.event.key).remove();
        this.router.navigate(['/profile/my-events']);
      })

  }

}

@Component({
  selector: 'action-confirm-dialog',
  template: `
    <div>
      <h4>Are you sure you want to delete this event?</h4>

      <p>This cannot be undone!</p>

      <div class="btn_container">
        <span class="btn btn-primary" (click)="deleteEvent();">Yes</span>
        <span class="btn btn-danger" (click)="onNoClick();">No</span>
      </div>
    </div>
   `,
   styles: [`
     .btn_container {
        display: flex;
        justify-content: space-around;
     }

     .btn{
       width: 40%;
     }
     `
   ]
})

export class ActionConfirmDialog {

  constructor(
    public dialogRef: MatDialogRef<ActionConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteEvent(): void{
    this.dialogRef.close('delete');
  }

}
