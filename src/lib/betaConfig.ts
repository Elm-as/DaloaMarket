/**
 * Configuration for the beta period
 * 
 * During the beta phase:
 * - Payment for listings is disabled
 * - Each user can publish up to MAX_FREE_LISTINGS ads for free
 * - Credit purchase functionality is hidden but not deleted
 * 
 * To re-enable payments after beta:
 * - Set BETA_FREE_MODE to false
 */

export const BETA_FREE_MODE = true;
export const MAX_FREE_LISTINGS = 10;
