/**
 * User-facing messages and text constants
 * Centralized for consistency and easier i18n implementation
 */

export const MESSAGES = {
  // Listing creation
  LISTING_LIMIT_REACHED: (limit: number) => 
    `Limite de ${limit} publications atteinte pour la période bêta.`,
  LISTING_PUBLISHED_FREE: (remaining: number) => 
    `Annonce publiée gratuitement ! ${remaining} publication(s) restante(s).`,
  LISTING_FIRST_FREE: "Votre première annonce a été publiée gratuitement !",
  LISTING_CREDIT_USED: "Annonce publiée ! 1 crédit consommé.",
  LISTING_ERROR: "Erreur lors de la création de l'annonce",
  
  // Photos
  PHOTO_REQUIRED: "Veuillez ajouter au moins une photo",
  PHOTO_TOO_LARGE: "Image trop volumineuse (max 5MB)",
  PHOTO_MAX_LIMIT: "Maximum 5 photos autorisées",
  
  // Auth
  LOGIN_SUCCESS: "Connexion réussie",
  LOGOUT_SUCCESS: "Déconnexion réussie",
  
  // General
  ERROR_GENERIC: "Une erreur est survenue",
  SUCCESS_GENERIC: "Opération réussie",
};
