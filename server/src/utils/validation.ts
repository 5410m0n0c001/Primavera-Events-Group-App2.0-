interface ValidationResult {
    valid: boolean;
    error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
        return { valid: false, error: 'Formato de email inválido' };
    }
    return { valid: true };
};

export const validatePassword = (password: string): ValidationResult => {
    if (password.length < 8) {
        return { valid: false, error: 'La contraseña debe tener al menos 8 caracteres' };
    }
    // Add more complexity checks here if needed
    return { valid: true };
};

export const validatePhone = (phone: string): ValidationResult => {
    const re = /^\d{10}$/; // Simple 10 digit check
    if (!re.test(phone.replace(/\D/g, ''))) {
        return { valid: false, error: 'El teléfono debe tener 10 dígitos' };
    }
    return { valid: true };
};
