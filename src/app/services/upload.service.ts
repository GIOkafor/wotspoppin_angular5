import { Injectable } from '@angular/core';
import { Upload } from '../classes/upload';
import { AngularFireDatabase } from 'angularfire2/database'; 
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
  uploads: FirebaseListObservable<Upload[]>;

  pushUpload(upload: Upload) {
    let storageRef = this.af.storage().ref();
    let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
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

        this.saveFileData(upload)
      }
    );
  }
  
  // Writes the file details to the realtime db
  private saveFileData(upload: Upload) {
    this.db.list(`${this.basePath}/`).push(upload);
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
}