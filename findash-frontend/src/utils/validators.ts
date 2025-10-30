// Validation functions - safe, reusable, non-blocking

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validators = {
  email: (email: string): ValidationResult => {
    if (!email.trim()) {
      return { isValid: false, error: 'Email requis' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Email invalide' };
    }
    return { isValid: true };
  },

  password: (password: string): ValidationResult => {
    if (!password) {
      return { isValid: false, error: 'Mot de passe requis' };
    }
    if (password.length < 6) {
      return { isValid: false, error: 'Minimum 6 caractères' };
    }
    return { isValid: true };
  },

  name: (name: string): ValidationResult => {
    if (!name.trim()) {
      return { isValid: false, error: 'Nom requis' };
    }
    if (name.length < 2) {
      return { isValid: false, error: 'Minimum 2 caractères' };
    }
    return { isValid: true };
  },

  symbol: (symbol: string): ValidationResult => {
    if (!symbol.trim()) {
      return { isValid: false, error: 'Symbole requis' };
    }
    if (symbol.length < 1 || symbol.length > 10) {
      return { isValid: false, error: 'Symbole invalide (1-10 caractères)' };
    }
    return { isValid: true };
  },

  quantity: (quantity: string): ValidationResult => {
    if (!quantity) {
      return { isValid: false, error: 'Quantité requise' };
    }
    const num = parseFloat(quantity);
    if (isNaN(num) || num <= 0) {
      return { isValid: false, error: 'Quantité doit être positive' };
    }
    return { isValid: true };
  },

  price: (price: string): ValidationResult => {
    if (!price) {
      return { isValid: false, error: 'Prix requis' };
    }
    const num = parseFloat(price);
    if (isNaN(num) || num <= 0) {
      return { isValid: false, error: 'Prix doit être positif' };
    }
    if (num > 1000000) {
      return { isValid: false, error: 'Prix trop élevé' };
    }
    return { isValid: true };
  },
};
