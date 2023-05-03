import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.css']
})
export class MessageModalComponent implements OnInit {

  @Input() message : string = '';
  @Output() modalClose = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void{}

  modalCloseClicked(){
    this.modalClose.emit(true);
  }
}
