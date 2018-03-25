import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/switchMap';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-edit-menu',
  templateUrl: './edit-menu.component.html',
  styleUrls: ['./edit-menu.component.css']
})
export class EditMenuComponent implements OnInit {

  venue:any;
  venueKey: any;
  menu: any;

  constructor(
  	private location: Location,
    private db: AngularFireDatabase,
    private activeRoute: ActivatedRoute,
    private dialog: MatDialog) { 
      
  }

  ngOnInit() {
    this.activeRoute.paramMap
      .switchMap((params: ParamMap) => 
        this.db.object('/Venues/' + params.get('id')).snapshotChanges())
          .subscribe(res => {
            this.venue = res;
            this.venueKey = this.venue.key;
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
