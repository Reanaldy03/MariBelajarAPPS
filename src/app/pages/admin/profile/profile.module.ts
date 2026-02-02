import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AdminProfilePageRoutingModule } from './profile-routing.module';
import { AdminProfilePage } from './profile.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AdminProfilePageRoutingModule
    ],
    declarations: [AdminProfilePage]
})
export class AdminProfilePageModule { }
