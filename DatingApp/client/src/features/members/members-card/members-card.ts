import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../../types/member';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { LikesService } from '../../../core/services/likes-service';

@Component({
  selector: 'app-members-card',
  imports: [RouterLink, AgePipe],
  templateUrl: './members-card.html',
  styleUrl: './members-card.css',
})
export class MembersCard {
  member = input.required<Member>();
  private likeService = inject(LikesService);
  protected hasLiked = computed(() => this.likeService.likeIds().includes(this.member().id))

  toggleLike(event: Event) {
    event.stopPropagation();
    this.likeService.toggleLike(this.member().id).subscribe({
      next: () => {
        if (this.hasLiked()) {
          this.likeService.likeIds.update(ids => ids.filter(x => x !== this.member().id))
        } else {
          this.likeService.likeIds.update(ids => [...ids, this.member().id])
        }
      }
    })
  }
}
