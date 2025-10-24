'use client'

interface TeamMember {
  id: string
  name: string
  color: string
  role: string
}

interface TeamPresenceProps {
  members: TeamMember[]
}

export default function TeamPresence({ members }: TeamPresenceProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Avatar Stack */}
      <div className="flex -space-x-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
            style={{ backgroundColor: member.color }}
            title={`${member.name} (${member.role})`}
          >
            {member.name.charAt(0)}
          </div>
        ))}
      </div>

      {/* Member Count */}
      <span className="text-sm text-gray-600">
        {members.length} online
      </span>
    </div>
  )
}
