import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  rating: number;
  topSkill?: string;
}

// Static mock data – replace with API call when backend is available
const leaderboardData: LeaderboardEntry[] = [
  {
    id: "1",
    name: "Emily Johnson",
    avatar:
      "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    initials: "EJ",
    rating: 4.9,
    topSkill: "Advanced Excel",
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar:
      "https://images.pexels.com/photos/7697725/pexels-photo-7697725.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    initials: "MC",
    rating: 4.8,
    topSkill: "React.js",
  },
  {
    id: "3",
    name: "Sophia Patel",
    avatar:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    initials: "SP",
    rating: 4.7,
    topSkill: "Data Analysis",
  },
  {
    id: "4",
    name: "Daniel Martinez",
    avatar:
      "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    initials: "DM",
    rating: 4.6,
    topSkill: "Photoshop",
  },
  {
    id: "5",
    name: "Aisha Khan",
    avatar:
      "https://images.pexels.com/photos/10545015/pexels-photo-10545015.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    initials: "AK",
    rating: 4.5,
    topSkill: "Public Speaking",
  },
];

export function Leaderboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Leaderboard</h2>
      <div className="grid gap-4">
        {leaderboardData.map((user, index) => (
          <Card key={user.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="text-xl font-bold w-8 text-center">{index + 1}</div>
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium leading-none">{user.name}</p>
                {user.topSkill && (
                  <p className="text-sm text-muted-foreground">{user.topSkill}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span className="font-medium">{user.rating.toFixed(1)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 