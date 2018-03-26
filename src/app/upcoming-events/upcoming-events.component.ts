import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../services/auth.service';
import { ReservationService } from '../services/reservation.service';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-upcoming-events',
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.css']
})
export class UpcomingEventsComponent implements OnInit {

  userEvents: any;
  userReservations: any;

  constructor(
  	private router: Router,
  	private authSvc: AuthService,
    private rsrvSvc: ReservationService,
  	private db: AngularFireDatabase,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) { 
  		this.userEvents = db.list('Users/'+ authSvc.getCurrentUser().uid + '/upcoming-events').snapshotChanges();
      this.getReservations(); 
  }

  ngOnInit() {
  }

  getEventDetails(key){
  	//console.log(key);

  	this.router.navigate(['event-details', key]);
  }

  openDeleteDialog(key){
    //console.log(key);

    const dialogRef = this.dialog.open(DeleteUpcomingNotifDialog, {
      data: {eventKey: key}
    });

    dialogRef.afterClosed().subscribe(res => {
      //console.log(res);

      if(res === 'delete')
        this.deleteNotif(key);
    });
  }

  deleteNotif(key){
    //console.log(key);

    this.db.list('Users/'+ this.authSvc.getCurrentUser().uid + '/upcoming-events/' + key).remove();
  }

  getReservations(){
    this.rsrvSvc.getUserReservations(this.authSvc.getCurrentUser().uid)
      .subscribe(res => this.userReservations = res);
  }

}

@Component({
  selector: 'delete-upcoming-confirm-dialog',
  template: `
    <div>
      <h5>Are you sure you want to delete this notification?</h5>

      <p>This only removes the notification and cannot be undone!</p>

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

export class DeleteUpcomingNotifDialog {

  constructor(
    public dialogRef: MatDialogRef<DeleteUpcomingNotifDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteEvent(): void{
    this.dialogRef.close('delete');
  }

}
