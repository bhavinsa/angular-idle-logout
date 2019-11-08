import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import {
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { timer, Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyComponent implements OnInit {
  private myTimerSub: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogBodyComponent>) { }
  timerInt = 5; // This is default 5 seconds

  ngOnInit() {
    const ti = timer(1000, 1000);
    this.myTimerSub = ti.subscribe(t => {
      this.timerInt = this.timerInt - 1;
      if (this.timerInt == 1) {
        this.onCloseCancel();
        this.myTimerSub.unsubscribe();
      }
    });
  }

  onCloseConfirm() {
    this.dialogRef.close('login');
  }
  onCloseCancel() {
    this.dialogRef.close('logout');
  }

  ngOnDestroy() {
    this.myTimerSub.unsubscribe();
  }

}
