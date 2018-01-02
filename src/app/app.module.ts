import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//firebase modules
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

//3rd party modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimeAgoPipe } from 'time-ago-pipe';
import { NguiMapModule} from '@ngui/map';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//angular material modules
import { MatProgressSpinnerModule } from '@angular/material';
import { MatSnackBarModule } from '@angular/material/snack-bar';

//app components
import { AppComponent } from './app.component';
import { AuthComponentComponent } from './auth-component/auth-component.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { CreateVenueComponent } from './create-venue/create-venue.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { FooterComponent } from './footer/footer.component';
import { MyVenuesComponent } from './my-venues/my-venues.component';
import { UpcomingEventsComponent } from './upcoming-events/upcoming-events.component';
import { SearchComponent } from './search/search.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { VenueComponent } from './venue/venue.component';
import { VenueDetailsComponent } from './venue-details/venue-details.component';
import { VenueInformationComponent } from './venue-information/venue-information.component';
import { FeedComponent } from './feed/feed.component';
import { FeedItemComponent } from './feed-item/feed-item.component';
import { ErrorComponent } from './auth-component/error/error.component';
import { MyPhotosComponent } from './user-profile/my-photos/my-photos.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { InviteFriendsComponent } from './invite-friends/invite-friends.component';

//services
import { AuthService } from './services/auth.service';
import { BuddiesService } from './services/buddies.service';
import { PaymentService } from './services/payment.service';
import { VenuesService } from './services/venues-service.service';
import { UploadService } from './services/upload.service';
import { UserMediaService } from './services/user-media.service';

//pipes
import { ObjToArrayPipe } from './pipes/obj-to-array.pipe';
import { UserImageUrlPipe } from './pipes/user-image-url.pipe';
import { TimeAgoCPipe } from './pipes/time-ago-c.pipe';
import { VenueInfoPipe } from './pipes/venue-info.pipe';
import { UserDisplayNamePipe } from './pipes/user-display-name.pipe';
import { InviteFilterPipe } from './pipes/invite-filter.pipe';
import { EventInfoFilterPipe } from './pipes/event-info-filter.pipe';

//environment access
import { environment } from './../environments/environment';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'venues',
    pathMatch: 'full'
  },
  {
    path: 'feed',
    component: FeedComponent
  },
  {
    path: 'feed-item/:id',
    component: FeedItemComponent
  },
  {
    path: 'authenticate',
    component: AuthComponentComponent
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    children: [
      {path: 'my-photos', component: MyPhotosComponent},
      {path: 'notifications', component: NotificationsComponent},
      {path: 'upcoming-events', component: UpcomingEventsComponent},
      { path: '', redirectTo: '/profile/my-photos', pathMatch: 'full'}
    ]
  },
  {
    path: 'venues',
    component: SearchComponent
  },
  {
    path: 'venue/:id',
    component: VenueComponent,
    children: [
      {path: '', component: VenueInformationComponent},
      {path: 'event/:id/event-details', component: EventDetailsComponent}
    ]
  },
  {
    path: 'create-venue',
    component: CreateVenueComponent
  },
  {
    path: 'create-event',
    component: CreateEventComponent
  },
  {
    path: 'my-venues',
    component: MyVenuesComponent
  },
  {
    path: 'upcoming-events',
    component: UpcomingEventsComponent
  },
  {
    path: 'event-details/:id',
    component: EventDetailsComponent,
    children: [
      {
        path: 'invite-friends',
        component: InviteFriendsComponent
      }
    ]
  },
  {
    path: '**',
    component: SearchComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    AuthComponentComponent,
    CreateEventComponent,
    CreateVenueComponent,
    EventDetailsComponent,
    FooterComponent,
    MyVenuesComponent,
    UpcomingEventsComponent,
    SearchComponent,
    UserProfileComponent,
    VenueComponent,
    VenueDetailsComponent,
    VenueInformationComponent,
    ErrorComponent,
    FeedComponent,
    FeedItemComponent,
    ObjToArrayPipe,
    UserImageUrlPipe,
    TimeAgoPipe,
    TimeAgoCPipe,
    MyPhotosComponent,
    NotificationsComponent,
    VenueInfoPipe,
    InviteFriendsComponent,
    UserDisplayNamePipe,
    InviteFilterPipe,
    EventInfoFilterPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    RouterModule.forRoot(routes),
    NgbModule.forRoot(),
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyARTN-va2Lc0dgJKUkwk1-c9hRBwxk47Uc'}),
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  providers: [
    AuthService,
    BuddiesService,
    PaymentService,
    VenuesService,
    UploadService,
    UserMediaService
  ],
  entryComponents: [
    InviteFriendsComponent
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
