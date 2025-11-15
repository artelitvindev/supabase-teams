CREATE TABLE public.teams (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "name" text NOT NULL,
    "invite_code" text NOT NULL UNIQUE, 
    "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE public.profiles (
    "id" uuid NOT NULL PRIMARY KEY, 
    "name" text,
    "avatar_url" text,
    "team_id" uuid,

    CONSTRAINT profiles_id_fkey FOREIGN KEY (id) 
        REFERENCES auth.users(id) ON DELETE CASCADE,

    CONSTRAINT profiles_team_id_fkey FOREIGN KEY (team_id) 
        REFERENCES public.teams(id) ON DELETE SET NULL
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();