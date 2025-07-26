// https://javascript.plainenglish.io/complete-authentication-guide-using-next-auth-v5-in-next-js-14-70e7630ab1c2

/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/group",
  "/product",
  "/apptype",
  "/app",
  "/guides",
  "/about",
  "/about-zh",
  "/terms",
  "/privacy",
  "/airtable-test",
];

export const restrictedRoutes = [
  "/docs",
  "/blog",
  "/saas",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

// https://javascript.plainenglish.io/complete-authentication-guide-using-next-auth-v5-in-next-js-14-70e7630ab1c2
// The last thing to complete our Credentials Authentication is to set up redirect urls, 
// these will be triggered in middleware.js based on the type of route and if the user session exists or not.

// When user is not logged in and tries to access protected routes redirect to login page
export const DEFAULT_REDIRECT_LOGIN_URL = '/login';

// When user is logged in and tries to access login page redirect to dashboard
export const DEFAULT_REDIRECT_HOME_URL = '/dashboard';