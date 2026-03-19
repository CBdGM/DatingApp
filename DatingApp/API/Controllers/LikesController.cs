using API.Extensions; 
using API.Interfaces;
using API.Entities;   
using Microsoft.AspNetCore.Authorization; 
using Microsoft.AspNetCore.Mvc;
using API.Helpers;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LikesController(ILikesRepository likesRepository, IMemberRepository memberRepository) : BaseApiController
{
    [HttpPost("{targetMemberId}")]
    public async Task<ActionResult> ToggleLike(string targetMemberId)
    {
        var sourceMemberId = User.GetMemberId(); 

        if (sourceMemberId == targetMemberId) 
            return BadRequest("YOu cannot like yourself");

        var existingLike = await likesRepository.GetMemberLike(sourceMemberId, targetMemberId);

        if (existingLike != null)
        {
            likesRepository.DeleteLike(existingLike);
        }
        else
        {
            var targetMember = await memberRepository.GetMemberByIdAsync(targetMemberId);
            if (targetMember == null) return NotFound("Not found");

            likesRepository.AddLike(new MemberLike
            {
                SourceMemberId = sourceMemberId,
                TargetMemberId = targetMemberId
            });
        }

        if (await likesRepository.SaveAllChanges()) return Ok();

        return BadRequest("Failed like");
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<Member>>> GetMemberLikes(
        [FromQuery] LikesParams likesParams
    )
    {
        likesParams.MemberId = User.GetMemberId();
        var members = await likesRepository.GetMemberLikes(likesParams);

        return Ok(members);
    }

    [HttpGet("list")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberLikeIds()
    {
        return Ok(await likesRepository.GetCurrentMemberLikeIds(User.GetMemberId()));
    }
}
