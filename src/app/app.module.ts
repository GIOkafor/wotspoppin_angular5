import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { ErrorComponent } from './auth-component/error/error.component';

//services
import { AuthService } from './services/auth.service';
import { BuddiesService } from './services/buddies.service';
import { PaymentService } from './services/payment.service';
import { VenuesService } from './services/venues-service.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'venues',
    pathMatch: 'full'
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
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthService,
    BuddiesService,
    PaymentService,
    VenuesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
