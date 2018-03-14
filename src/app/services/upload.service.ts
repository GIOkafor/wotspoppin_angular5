import { Injectable } from '@angular/core';
import { Upload } from '../classes/upload';
import { AngularFireDatabase } from 'angularfire2/database'; 
//import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database-deprecated";
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';
import * as firebase from 'firebase/app';

@Injectable()
export class UploadService {

  constructor(
    private af: FirebaseApp, 
    private db: AngularFireDatabase,
    private authSvc: AuthService) { }

  private basePath:string = '/uploads';
  private profilePath:string = '/profilePics';
  private eventsPath:string = '/eventPics';
  uploads: any;

  pushUpload(upload: Upload) {
    let storageRef = this.af.storage().ref();
    let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success
        upload.url = uploadTask.snapshot.downloadURL
        upload.name = upload.file.name
        upload.userUid = this.authSvc.getCurrentUser().uid;
        upload.displayName = this.authSvc.getCurrentUser().displayName;
        upload.comments = [];
        upload.likes = {};
        upload.likes.count = 0;
        upload.likes.users = '';
        upload.type = upload.file.type;

        this.saveFileData(upload)
      }
    );
  }

  //push profile pic for venues and maybe users
  profileUpload(upload: any, fn) {
    let storageRef = this.af.storage().ref();
    let uploadTask = storageRef.child(`${this.profilePath}/${upload.file.name}`).put(upload.file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success
        upload.url = uploadTask.snapshot.downloadURL
        upload.name = upload.file.name
        upload.userUid = this.authSvc.getCurrentUser().uid;
        upload.displayName = this.authSvc.getCurrentUser().displayName;

        this.saveProfileData(upload);
        
        //console.log(upload.url);
        //callback function for handling response
        fn(upload.url);
      }
    );
  }

  //upload event photo
  eventUpload(upload: any, fn){
    let storageRef = this.af.storage().ref();
    let uploadTask = storageRef.child(`${this.eventsPath}/${upload.file.name}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success
        upload.url = uploadTask.snapshot.downloadURL
        upload.name = upload.file.name
        upload.userUid = this.authSvc.getCurrentUser().uid;
        //upload.displayName = this.authSvc.getCurrentUser().displayName;
        upload.type = upload.file.type;

        this.saveEventData(upload);

        //callback function for handling response and upating form accordingly
        fn(upload.url);
      }
    );
  }
  
  // Writes the file details to the realtime db
  //return image upload url
  private saveFileData(upload: Upload) {
    const promise = this.db.list(`${this.basePath}/`).push(upload);
  }

  //upload profile pic primarily for venues
  public saveProfileData(upload: any) {
    const promise = this.db.list(`${this.profilePath}/`).push(upload);
  }

  //save reference to event info in db
  public saveEventData(upload: any){
    console.log("Saving event photo...");

    const promise = this.db.list(`${this.eventsPath}/`).push(upload);
  }

  deleteUpload(upload: Upload) {
    this.deleteFileData(upload.$key)
    .then( () => {
      this.deleteFileStorage(upload.name)
    })
    .catch(error => console.log(error))
  }

  // Deletes the file details from the realtime db
  private deleteFileData(key: string) {
    return this.db.list(`${this.basePath}/`).remove(key);
  }

  // Firebase files must have unique names in their respective storage dir
  // So the name serves as a unique key
  private deleteFileStorage(name:string) {
    let storageRef = this.af.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete()
  }

  //posts comment on user image
  public postComment(key, comment){
    var currentUser = this.authSvc.getCurrentUser();

    //build comment object
    var comm = {
      displayName: currentUser.displayName,
      userUid: currentUser.uid,
      commentText: comment
    }

    //console.log("Comment object is: ", comm);

    this.db.list('uploads/'+ key + '/comments').push(comm);
  }
}