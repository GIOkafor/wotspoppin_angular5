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
import { NguiMapModule} from '@ngui/map';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxStripeModule } from 'ngx-stripe';
import { PopoverModule } from 'ng2-pop-over';

//angular material modules
import { MatProgressSpinnerModule, MatAutocompleteModule, MatInputModule, MatRadioModule } from '@angular/material';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

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
import { MyPhotosComponent } from './user-profile/my-photos/my-photos.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { InviteFriendsComponent } from './invite-friends/invite-friends.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageDetailsComponent } from './messages/message-details/message-details.component';
import { GuestlistComponent } from './guestlist/guestlist.component';
import { OtherProfileComponent } from './other-profile/other-profile.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { ActionConfirmDialog } from './event-details/event-details.component';
import { DeleteUpcomingNotifDialog } from './upcoming-events/upcoming-events.component';
import { SearchUsersComponent } from './search-users/search-users.component';
import { MapLegendComponent } from './search/map-legend/map-legend.component';
import { VenueSignupComponent } from './venue-signup/venue-signup.component';
import { ErrorComponent } from './error/error.component';
import { EditMenuComponent } from './edit-menu/edit-menu.component';
import { AttendingNotificationComponent } from './attending-notification/attending-notification.component';
import { VenueEventListComponent } from './venue-event-list/venue-event-list.component';
import { ViewFriendsComponent } from './user-profile/view-friends/view-friends.component';
import { DeleteConfirmDialog } from './edit-menu/edit-menu.component';
import { BottleServiceComponent } from './bottle-service/bottle-service.component';
import { StripeTestComponent } from './stripe-test/stripe-test.component';

//services
import { AuthService } from './services/auth.service';
import { BuddiesService } from './services/buddies.service';
import { PaymentService } from './services/payment.service';
import { VenuesService } from './services/venues-service.service';
import { UploadService } from './services/upload.service';
import { UserMediaService } from './services/user-media.service';
import { MessagingService } from './services/messaging.service';
import { ReservationService } from './services/reservation.service';

//pipes
import { ObjToArrayPipe } from './pipes/obj-to-array.pipe';
import { UserImageUrlPipe } from './pipes/user-image-url.pipe';
import { TimeAgoCPipe } from './pipes/time-ago-c.pipe';
import { VenueInfoPipe } from './pipes/venue-info.pipe';
import { UserDisplayNamePipe } from './pipes/user-display-name.pipe';
import { InviteFilterPipe } from './pipes/invite-filter.pipe';
import { EventInfoFilterPipe } from './pipes/event-info-filter.pipe';

//guards
import { PendingChangesGuard } from './guards/pending-changes.guard';

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
    path: 'venue-signup',
    component: VenueSignupComponent
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    children: [
      {path: 'my-photos', component: MyPhotosComponent},
      {path: 'notifications', component: NotificationsComponent},
      {path: 'upcoming-events', component: UpcomingEventsComponent},
      {path: 'my-events', component: MyEventsComponent},
      { path: '', redirectTo: '/profile/my-photos', pathMatch: 'full'}
    ]
  },
  {
    path: 'user-profile/:id',
    component: OtherProfileComponent
  },
  {
    path: 'edit-profile/:id',
    component: OtherProfileComponent
  },
  {
    path: 'search-users',
    component: SearchUsersComponent
  },
  {
    path: 'messages', component: MessagesComponent
  },
  {
    path: 'messages/:id', component: MessageDetailsComponent
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
    path: 'venue/:id/edit-menu',
    component: EditMenuComponent
  },
  {
    path: 'create-venue',
    component: CreateVenueComponent,
    canDeactivate: [PendingChangesGuard]
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
    component: EventDetailsComponent
  },
  {
    path: 'stripe-test',
    component: StripeTestComponent
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
    FeedComponent,
    FeedItemComponent,
    ObjToArrayPipe,
    UserImageUrlPipe,
    TimeAgoCPipe,
    MyPhotosComponent,
    NotificationsComponent,
    VenueInfoPipe,
    InviteFriendsComponent,
    UserDisplayNamePipe,
    InviteFilterPipe,
    EventInfoFilterPipe,
    StripeTestComponent,
    MessagesComponent,
    MessageDetailsComponent,
    GuestlistComponent,
    OtherProfileComponent,
    MyEventsComponent,
    ActionConfirmDialog,
    DeleteUpcomingNotifDialog,
    SearchUsersComponent,
    MapLegendComponent,
    VenueSignupComponent,
    ErrorComponent,
    EditMenuComponent,
    AttendingNotificationComponent,
    VenueEventListComponent,
    ViewFriendsComponent,
    DeleteConfirmDialog,
    BottleServiceComponent
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
    NgxStripeModule.forRoot('pk_test_49r5jeY7QLUH52AyvJG2KX3t'),
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    PopoverModule
  ],
  entryComponents: [
    InviteFriendsComponent,
    GuestlistComponent,
    ActionConfirmDialog,
    DeleteUpcomingNotifDialog,
    ErrorComponent,
    ViewFriendsComponent,
    DeleteConfirmDialog,
    BottleServiceComponent
  ],
  providers: [
    AuthService,
    BuddiesService,
    PaymentService,
    VenuesService,
    UploadService,
    UserMediaService,
    MessagingService,
    ReservationService,
    PendingChangesGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
