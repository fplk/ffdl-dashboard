/*
 * Copyright 2018. IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from "angular2-notifications";
import { Subscription } from 'rxjs/Subscription';
import { EmitterService } from "../shared/services/emitter.service";
import { AuthService } from "../shared/services/auth.service";
import { DlaasService } from '../shared/services';

@Component({
    selector: 'my-menu',
    templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit, OnDestroy {

  @Input() trainingId: string;

  private searchDisabled: boolean = true;
  private subscription: Subscription;
  showMenu: boolean;

  constructor(private router: Router, private auth: AuthService,
     private notifier: NotificationsService, private dlaas: DlaasService) {
     EmitterService.get('showNavBar').subscribe((mode : boolean) =>{
         this.showMenu = mode;
     });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

  searchTraining() {
    //console.log("search for: ", this.trainingId);
    this.subscription = this.dlaas.getTraining(this.trainingId).subscribe(
      t => {
        // console.log("found training: ", this.trainingId);
        this.router.navigateByUrl('/trainings/' + this.trainingId + '/show');
      },
      t => {
        this.notifier.error('Search failed', 'Training ID does not exist.');
      }
    );
  }

  role() {
    return this.auth.role();
  }

  user() {
    return this.auth.user();
  }

  isAdmin() {
    return this.auth.isAdmin();
  }

  loggedIn() {
    return this.auth.loggedIn();
  }

  logout() {
    this.auth.logout()
  }
}
