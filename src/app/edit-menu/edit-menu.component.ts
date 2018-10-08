import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/switchMap';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-edit-menu',
  templateUrl: './edit-menu.component.html',
  styleUrls: ['./edit-menu.component.css']
})
export class EditMenuComponent implements OnInit {

  venue:any;
  venueKey: any;
  menu: any;
  minimumSpendPerOrder: number;
  tips: number;
  tablesPerEvent: number;
  spinner: boolean = false;

  constructor(
  	private location: Location,
    private db: AngularFireDatabase,
    private activeRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.activeRoute.paramMap
      .switchMap((params: ParamMap) =>
        this.db.object('/Venues/' + params.get('id')).snapshotChanges())
          .subscribe(res => {
            this.venue = res;
            this.venueKey = this.venue.key;

            //assign minimum spend amount to variable for reflection in the view
            //handle graceful failure for old venues without a specified minimum spend
            this.minimumSpendPerOrder = res.payload.val().minimumSpendPerOrder;
            this.tips = res.payload.val().tips;
            this.tablesPerEvent = res.payload.val().tablesPerEvent;
            this.getMenu(this.venueKey);
          });
  }

  goBack(){
  	this.location.back();
  }

  getMenu(key){
    this.db.list('/Venues/' + key + '/menu').snapshotChanges()
      .subscribe(res => this.menu = res);
  }

  //function for adding new item to venue menu
  addNew(val){
    console.log("Adding new: ", val);

    //db update based on values passed
    let promise = this.db.list('/Venues/' + this.venueKey + '/menu')
      .push(val);

    promise.then(_=>console.log("Added successfully"));
  }

  deleteItem(key){
    console.log("Deleting ", key);

    let itemRef = this.db.object('/Venues/' + this.venueKey + '/menu/' + key);
    itemRef.remove();
  }

  openDelete(key){
    let dialogRef = this.dialog.open(DeleteConfirmDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if(result === 'delete'){
        console.log("Deleting...");
        this.deleteItem(key);
      }
    });
  }

  //update min spend
  updateMinSpend(val){
    console.log("updating minimum spend to: ", val);
    //show spinner
    this.spinner = true;

    this.db.object('/Venues/' + this.venueKey)
      .update({minimumSpendPerOrder: val})
      .then(_ => {
        console.log("success");
        //show resp
        this.snackBar.open('Update successful', '', {duration: 3000});
        //hide spinner
        this.spinner = false;
      })
      .catch(err => {
        console.log(err);
        var message = 'Error: ' + err;
        this.snackBar.open(message, '', {duration: 3000});
        //hide spinner
        this.spinner = false;
      });
  }

  updateTips(val){
    console.log("Updating tips to: ", val);

    //show spinner
    this.spinner = true;

    this.db.object('/Venues/' + this.venueKey)
      .update({tips: val})
      .then(_ => {
        this.snackBar.open('Update successful', '', {duration: 3000});
        //hide spinner
        this.spinner = false;
      })
      .catch(err => {
        console.log(err);
        var message = 'Error: ' + err;
        this.snackBar.open(message, '', {duration: 3000});
        //hide spinner
        this.spinner = false;
      });
  }

  updateTables(val){
    console.log("Updating tips to: ", val);

    //show spinner
    this.spinner = true;

    this.db.object('/Venues/' + this.venueKey)
      .update({tablesPerEvent: val})
      .then(_ => {
        console.log("success");
        //show resp
        this.snackBar.open('Update successful', '', {duration: 3000});
        //hide spinner
        this.spinner = false;
      })
      .catch(err => {
        console.log(err);
        var message = 'Error: ' + err;
        this.snackBar.open(message, '', {duration: 3000});
        //hide spinner
        this.spinner = false;
      });
  }

}


@Component({
  selector: 'delete-confirm-dialog',
  template: `<div>
              <h5>Are you sure?</h5>
              <div>
                <button class="btn" (click)="deleteConfirm();">
                  Yes
                </button>

                <button class="btn" (click)="cancel();">
                  Cancel
                </button>
              </div>
             </div>`,
})
export class DeleteConfirmDialog {

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  cancel(): void {
    this.dialogRef.close();
  }

  deleteConfirm(): void{
    this.dialogRef.close('delete');
  }

}
