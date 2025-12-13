export const ROUTES = {
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

  // Teams
  TEAM: (teamId: string) => `/teams/${teamId}`,
  TEAM_PRODUCTS: (teamId: string) => `/teams/${teamId}/products`,

  // User
  PROFILE: (userId: string) => `/profiles/${userId}`,
};

export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.SIGN_UP,
  ROUTES.SIGN_UP_SUCCESS,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.UPDATE_PASSWORD,
  ROUTES.AUTH_ERROR,
  ROUTES.AUTH_CONFIRM,
];

export const PRIVATE_ROUTES = [
  ROUTES.TEAM,
  ROUTES.PROFILE_SETUP,
  ROUTES.TEAMS_SELECT,
  ROUTES.JOIN_TEAM,
  ROUTES.CREATE_TEAM,
];
