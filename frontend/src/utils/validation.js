/**
 * Validation utility functions for form inputs
 */

export const validateEmail = (email) => {
    if (!email || email.trim() === '') {
        return 'Email is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }

    return '';
};

export const validatePassword = (password) => {
    if (!password || password.trim() === '') {
        return 'Password is required';
    }

    if (password.length < 6) {
        return 'Password must be at least 6 characters long';
    }

    return '';
};

export const validateName = (name) => {
    if (!name || name.trim() === '') {
        return 'Name is required';
    }

    if (name.trim().length < 2) {
        return 'Name must be at least 2 characters long';
    }

    return '';
};

export const validateRequired = (value, fieldName = 'This field') => {
    if (!value || value.trim() === '') {
        return `${fieldName} is required`;
    }
    return '';
};
