export const ROUTES = {
  HOME: "/",

  // Auth routes
  LOGIN: "/auth/login",
  SIGN_UP: "/auth/sign-up",
  SIGN_UP_SUCCESS: "/auth/sign-up-success",
  FORGOT_PASSWORD: "/auth/forgot-password",
  UPDATE_PASSWORD: "/auth/update-password",
  AUTH_ERROR: "/auth/error",
  AUTH_CONFIRM: "/auth/confirm",

  // Onboarding flow
  PROFILE_SETUP: "/profile-setup",
  TEAMS_SELECT: "/teams-select",
  JOIN_TEAM: "/join-team",
  CREATE_TEAM: "/create-team",
};

export const PRIVATE_ROUTES = [
  ROUTES.HOME,
  ROUTES.SIGN_UP_SUCCESS,
  ROUTES.AUTH_CONFIRM,
  ROUTES.PROFILE_SETUP,
  ROUTES.TEAMS_SELECT,
  ROUTES.JOIN_TEAM,
  ROUTES.CREATE_TEAM,
];
