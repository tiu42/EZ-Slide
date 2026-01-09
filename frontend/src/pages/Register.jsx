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
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/ui/Footer';
import Logo from '../components/ui/Logo';
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col font-sans">
            {/* Logo/Brand */}
            <Logo className="absolute top-6 left-6 z-10" size="md" />

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Glassmorphism Card */}
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Tạo tài khoản mới</h2>
                            <p className="text-gray-300 text-sm">
                                Bắt đầu tạo bài thuyết trình chuyên nghiệp miễn phí
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm backdrop-blur-sm">
                                {error}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit}>

                            <InputField
                                label="Tên hiển thị"
                                placeholder="Ví dụ: Nguyễn Văn A"
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
                                label="Mật khẩu"
                                type="password"
                                placeholder="Tạo mật khẩu mạnh"
                                icon={Lock}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.password ? validationErrors.password : ''}
                            />

                            <Button
                                className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/30"
                                size="lg"
                                type="submit"
                            >
                                Đăng ký
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>

                        {/* Divider */}
                        {/* <Divider text={"Hoặc đăng ký với"} />

                        <SocialButtons /> */}

                        <div className="mt-6 text-center">
                            <p className="text-gray-400 text-sm">
                                Đã có tài khoản?{' '}
                                <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                    Đăng nhập ngay
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-6 text-center text-gray-500 text-sm">
                <p>© 2026 Ez-Slide. Tạo slide chuyên nghiệp, dễ dàng hơn bao giờ hết.</p>
            </footer>
        </div>
    );
};

export default Register;