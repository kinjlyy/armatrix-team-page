from fastapi import APIRouter, HTTPException
from typing import List
from models import TeamMember, TeamMemberCreate, TeamMemberUpdate
from database import get_db

router = APIRouter()


def row_to_dict(row) -> dict:
    return dict(row)


@router.get("/", response_model=List[TeamMember])
async def get_all_team_members():
    """Return all team members."""
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM team_members ORDER BY id").fetchall()
        return [row_to_dict(r) for r in rows]


@router.get("/{member_id}", response_model=TeamMember)
async def get_team_member(member_id: int):
    """Return a single team member by ID."""
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM team_members WHERE id = ?", (member_id,)
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Team member not found")
        return row_to_dict(row)


@router.post("/", response_model=TeamMember, status_code=201)
async def create_team_member(member: TeamMemberCreate):
    """Create a new team member."""
    with get_db() as conn:
        cursor = conn.execute(
            """INSERT INTO team_members (name, role, bio, photo_url, linkedin_url, github_url, twitter_url)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (
                member.name,
                member.role,
                member.bio,
                member.photo_url,
                member.linkedin_url,
                member.github_url,
                member.twitter_url,
            ),
        )
        new_id = cursor.lastrowid
        row = conn.execute(
            "SELECT * FROM team_members WHERE id = ?", (new_id,)
        ).fetchone()
        return row_to_dict(row)


@router.put("/{member_id}", response_model=TeamMember)
async def update_team_member(member_id: int, member: TeamMemberUpdate):
    """Update an existing team member."""
    with get_db() as conn:
        existing = conn.execute(
            "SELECT * FROM team_members WHERE id = ?", (member_id,)
        ).fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Team member not found")

        updates = {k: v for k, v in member.dict().items() if v is not None}
        if updates:
            set_clause = ", ".join(f"{k} = ?" for k in updates.keys())
            values = list(updates.values()) + [member_id]
            conn.execute(
                f"UPDATE team_members SET {set_clause} WHERE id = ?", values
            )

        row = conn.execute(
            "SELECT * FROM team_members WHERE id = ?", (member_id,)
        ).fetchone()
        return row_to_dict(row)


@router.delete("/{member_id}", status_code=204)
async def delete_team_member(member_id: int):
    """Delete a team member."""
    with get_db() as conn:
        existing = conn.execute(
            "SELECT * FROM team_members WHERE id = ?", (member_id,)
        ).fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Team member not found")
        conn.execute("DELETE FROM team_members WHERE id = ?", (member_id,))
