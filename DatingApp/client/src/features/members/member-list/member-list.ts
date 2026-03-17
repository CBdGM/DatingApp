import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { Member, MemberParams } from '../../../types/member';
import { MembersCard } from '../members-card/members-card';
import { PaginatedResult } from '../../../types/pagination';
import { Paginator } from "../../../shared/paginator/paginator";
import { FilterModal } from '../filter-modal/filter-modal';

@Component({
  selector: 'app-member-list',
  imports: [MembersCard, Paginator, FilterModal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList implements OnInit {
  @ViewChild('filterModal') modal!: FilterModal;
  private membersService = inject(MemberService);
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  protected memberParams = new MemberParams();

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.membersService.getMembers(this.memberParams).subscribe({
      next: result => {
        this.paginatedMembers.set(result)
      }
    })
  }

  onPageChange(event: {pageNumber: number, pageSize: number}) {
    this.memberParams.pageSize = event.pageSize;
    this.memberParams.pageNumber = event.pageNumber;
    this.loadMembers();
  }

  openModal() {
    this.modal.open();

  }

  onClose() {
    console.log('Modal closed')
  }

  onFilterChange(data: MemberParams) {
    this.memberParams = data;
    this.loadMembers();
  }

  resertFilters() {
    this.memberParams = new MemberParams();
    this.loadMembers();
  }
}
