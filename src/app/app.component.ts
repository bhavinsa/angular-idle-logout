import { Component } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogBodyComponent } from './dialog-body/dialog-body.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  statusMessage = '';

  constructor(private idle: Idle, private keepalive: Keepalive, private matDialog: MatDialog) {
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(5);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
    });
    idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!';
      this.openDialog(this.idleState = 'You will logged out in');
    });
    idle.onTimeoutWarning.subscribe((countdown) => {
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);
    keepalive.onPing.subscribe(() => this.lastPing = new Date());
    this.reset();
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  openDialog(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = data;
    let dialogRef = this.matDialog.open(DialogBodyComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.statusMessage = `You are : ${result}`;
      this.reset();
      if (result == 'logout') {
        this.idle.ngOnDestroy();
        this.statusMessage == 'Logged Out!';
      } else if (result == 'login') {
        this.statusMessage == 'Logged in!';
      }
    });
  }

}