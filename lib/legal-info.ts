/**
 * Datos legales del prestador de servicios turísticos.
 * Fuente única de verdad: el número RNT es de exhibición obligatoria en el
 * medio web (normativa colombiana de turismo). Cualquier sitio que muestre
 * identificación legal debe importar desde aquí, nunca hardcodear valores.
 */
export const LEGAL_INFO = {
  razonSocial: "EL HIGUERON CHOACHI S.A.S",
  nombreComercial: "CAMPING EL HIGUERON",
  nit: "902095612",
  rnt: "298927",
  rntVerificationUrl: "https://rnt.confecamaras.co",
} as const
