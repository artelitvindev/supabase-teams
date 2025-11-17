"use client";

import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

function CreateTeamForm() {
  const [teamName, setTeamName] = React.useState("");
  const [teamSlug, setTeamSlug] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (teamName.trim()) {
      console.log("submit", {
        teamName: teamName.trim(),
        teamSlug: teamSlug.trim() || null,
      });
    } else {
      setErrorMessage("Team name is required");
    }
  };

  return (
    <Card className="min-w-[400px] px-4 pb-10">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Create a Team</CardTitle>
        <CardDescription className="text-center">
          Start a new team and invite members to collaborate
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="team-name">Team Name</Label>
            <Input
              id="team-name"
              type="text"
              placeholder="My Awesome Team"
              value={teamName}
              onChange={(e) => {
                setErrorMessage(null);
                setTeamName(e.target.value);
              }}
            />
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="team-slug">Team Slug (optional)</Label>
            <Input
              id="team-slug"
              type="text"
              placeholder="my-awesome-team"
              value={teamSlug}
              onChange={(e) => {
                setErrorMessage(null);
                setTeamSlug(e.target.value);
              }}
            />
            <p className="text-xs text-muted-foreground">
              If empty, we will create one automatically from your team name
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Button className="w-full">Create team</Button>
        </div>
      </form>
    </Card>
  );
}

export default CreateTeamForm;
