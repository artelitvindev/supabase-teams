"use client";

import useProfileStore from "@/zustand/useProfileStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Calendar, Hash } from "lucide-react";

function TeamPage() {
  const { profile, isLoading } = useProfileStore();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-gray-500">No team data available</p>
      </div>
    );
  }

  const { team } = profile;
  const teamCreatedDate = new Date(team.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Team Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{team.name}</h1>
        <p className="text-muted-foreground">Welcome to your team dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Slug</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.slug}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Unique team identifier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active team members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(team.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {teamCreatedDate}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current user as a member */}
            <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <Avatar className="h-12 w-12">
                <AvatarImage src={profile.avatar_url} alt={profile.name} />
                <AvatarFallback>
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{profile.name}</p>
                <p className="text-sm text-muted-foreground">You</p>
              </div>
            </div>
            {/* TODO: Fetch and display other team members */}
          </div>
        </CardContent>
      </Card>

      {/* Team Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Team Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Team ID
              </h3>
              <p className="text-sm font-mono bg-muted p-2 rounded">
                {team.id}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Invite Code
              </h3>
              <p className="text-sm font-mono bg-muted p-2 rounded">
                {team.invite_code}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TeamPage;
