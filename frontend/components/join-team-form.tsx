"use client";

import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

function JoinTeamForm() {
  const [invitationCode, setInvitationCode] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (invitationCode.trim()) {
    } else {
      setErrorMessage("Invitation code field is required");
    }
  };

  return (
    <Card className="min-w-[400px] px-4 pb-10">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Join a Team</CardTitle>
        <CardDescription>
          Join an existing team using an invitation code
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="invitation-code">Invitation code</Label>
          <Input
            id="invitation-code"
            type="invitation-code"
            placeholder="agh4367hgd"
            value={invitationCode}
            onChange={(e) => {
              setErrorMessage(null);
              setInvitationCode(e.target.value);
            }}
          />
          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}
        </div>
        <div className="mt-4">
          <Button className="w-full">Join team</Button>
        </div>
      </form>
    </Card>
  );
}

export default JoinTeamForm;
