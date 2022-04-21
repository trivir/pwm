import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';

@Component({
    selector: 'app-user-agreement-dialog',
    templateUrl: './user-agreement-dialog.component.html',
})
export class UserAgreementDialogComponent {

    window: Window | null;

    constructor(@Inject(DOCUMENT) private document: Document) {
        this.window = this.document.defaultView;
    }

}
