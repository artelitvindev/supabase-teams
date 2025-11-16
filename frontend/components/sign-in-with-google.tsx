import GoogleIcon from "@/assets/google.svg?react";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";

function SignInWithGoogle() {
  const onClick = async () => {
    const supabase = createClient();
    console.log(await supabase.auth.getUser());

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    console.log(data, error);
  };
  return (
    <Button onClick={onClick} className="w-full">
      <GoogleIcon /> Continue with Google
    </Button>
  );
}

export default SignInWithGoogle;
