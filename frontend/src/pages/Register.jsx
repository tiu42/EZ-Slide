import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
// Import các component UI đã tạo
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import Card from '../components/ui/Card';
import AuthHeader from '../features/auth/components/AuthHeader';
import SocialButtons from '../features/auth/components/SocialButtons';
import Divider from '../features/auth/components/Divider';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/ui/Footer';
import { validateEmail, validatePassword, validateName } from '../utils/validation';

const Register = () => {
    const { register, error } = useAuth();
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    // Validation errors
    const [validationErrors, setValidationErrors] = useState({
        name: '',
        email: '',
        password: ''
    });

    // Track touched fields
    const [touched, setTouched] = useState({
        name: false,
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

        if (name === 'name') {
            error = validateName(value);
        } else if (name === 'email') {
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
        const nameError = validateField('name', formData.name);
        const emailError = validateField('email', formData.email);
        const passwordError = validateField('password', formData.password);

        // Mark all as touched
        setTouched({ name: true, email: true, password: true });

        // If there are validation errors, don't submit
        if (nameError || emailError || passwordError) {
            return;
        }

        const result = await register(formData);
        if (result.success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <AuthHeader type={"register"} />
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md p-8 shadow-md border-slate-200/60">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Create new account</h2>
                        <p className="text-slate-500 text-sm">
                            Start creating professional presentations with AI for free.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>

                        <InputField
                            label="Display name"
                            placeholder="e.g. John Doe"
                            icon={User}
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.name ? validationErrors.name : ''}
                        />

                        <InputField
                            label="Email"
                            type="email"
                            placeholder="name@example.com"
                            icon={Mail}
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.email ? validationErrors.email : ''}
                        />

                        <InputField
                            label="Password"
                            type="password"
                            placeholder="Create a strong password"
                            icon={Lock}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.password ? validationErrors.password : ''}
                        />

                        <Button className="w-full" size="lg" type="submit">
                            Sign up
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    {/* Divider */}
                    <Divider text={"Or sign up with"} />

                    <SocialButtons />

                </Card>
            </main>
            <Footer />
        </div>
    );
};

export default Register;