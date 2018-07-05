import { Component, OnInit } from '@angular/core'
import { ToastController } from 'ionic-angular'
import { Observable } from 'rxjs'

import { Lead } from '../crm/lead.model'
import { Note } from '../crm/note.model'
import { SalesService } from '../crm/sales.service'
import { showToast } from '../utils/toast'
import { TabService } from './tab.service'

@Component({
  selector: 'tab-notes',
  templateUrl: 'tab-notes.component.html'
})
export class TabNotesComponent implements OnInit {
  public notes: Note[]
  public newNote: string
  public contactObs: Observable<Lead>
  public contact: Lead

  constructor(
    public salesService: SalesService,
    private toastController: ToastController,
    public tabService: TabService
  ) {
    this.contactObs = this.tabService.getContact()
  }

  async ngOnInit(): Promise<void> {
    this.contactObs.subscribe((contact) => {
      this.contact = contact
      this.salesService.notes(contact.id).subscribe((notes) => {
        this.notes = notes.reverse()
      })
    })
  }

  addNote(): void {
    this.salesService
      .createNote(this.contact.id, { content: this.newNote })
      .subscribe((note) => {
        this.notes.push(note)
        showToast(this.toastController, 'Note Added', 2000)
      })
  }
}
