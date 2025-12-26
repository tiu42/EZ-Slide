import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Layout } from 'lucide-react';

import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import Card from '../components/ui/Card';
import AuthHeader from '../features/auth/components/AuthHeader';

import SocialButtons from '../features/auth/components/SocialButtons';
import Divider from '../features/auth/components/Divider';
import Footer from '../components/ui/Footer';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../utils/validation';

const Login = () => {
    const { login, error } = useAuth();
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Validation errors
    const [validationErrors, setValidationErrors] = useState({
        email: '',
        password: ''
    });

    // Track touched fields
    const [touched, setTouched] = useState({
        email: false,
        password: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate on change if field was touched
        if (touched[name]) {
            validateField(name, value);
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let error = '';

        if (name === 'email') {
            error = validateEmail(value);
        } else if (name === 'password') {
            error = validatePassword(value);
        }

        setValidationErrors(prev => ({
            ...prev,
            [name]: error
        }));

        return error;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const emailError = validateField('email', formData.email);
        const passwordError = validateField('password', formData.password);

        // Mark all as touched
        setTouched({ email: true, password: true });

        // If there are validation errors, don't submit
        if (emailError || passwordError) {
            return;
        }

        const result = await login(formData);
        if (result.success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <AuthHeader type={"login"} />
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md p-8 shadow-md border-slate-200/60">

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome back!</h2>
                        <p className="text-slate-500 text-sm">
                            Enter your information to access your workspace.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <InputField
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="name@example.com"
                            icon={Mail}
                            error={touched.email ? validationErrors.email : ''}
                        />

                        <div className="space-y-1">
                            <InputField
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="••••••••"
                                icon={Lock}
                                error={touched.password ? validationErrors.password : ''}
                            />
                            <div className="flex justify-end">
                                <a href="/forgot-password" className="text-xs font-medium text-emerald-600 hover:text-emerald-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <Button className="w-full" size="lg" type="submit">
                            Log in
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    <Divider text={"Or log in with"} />

                    <SocialButtons />

                </Card>
            </main>

            <Footer />
        </div>
    );
};

export default Login;