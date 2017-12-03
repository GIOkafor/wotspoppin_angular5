import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//firebase modules
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

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

//services
import { AuthService } from './services/auth.service';
import { BuddiesService } from './services/buddies.service';
import { PaymentService } from './services/payment.service';
import { VenuesService } from './services/venues-service.service';
import { UploadService } from './services/upload.service';

//pipes
import { ObjToArrayPipe } from './pipes/obj-to-array.pipe';

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
    component: UserProfileComponent
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
    ObjToArrayPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthService,
    BuddiesService,
    PaymentService,
    VenuesService,
    UploadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
