import React from 'react'
import { Link } from 'react-router-dom';
import { Sparkles, Zap, LayoutTemplate, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button'

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Navigation */}
            <nav className="absolute w-full px-6 py-4 flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Ez-Slide
                    </span>
                </div>
                <div className="hidden md:flex gap-4">
                    <Link to="/login">
                        <Button variant="ghost" className="text-white hover:text-purple-300">
                            Đăng nhập
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                            Bắt đầu ngay
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-block mb-6 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm">
                        <span className="text-purple-300 text-sm font-medium">✨ Công cụ tạo slide thế hệ mới</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                        Tạo Slide Đẹp
                        <br />
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                            Trong Vài Phút
                        </span>
                    </h1>

                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Ez-Slide giúp bạn tạo ra những bài thuyết trình chuyên nghiệp và ấn tượng
                        một cách dễ dàng với giao diện trực quan và hàng trăm mẫu thiết kế đẹp mắt.
                    </p>

                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link to="/register">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/50 group"
                            >
                                Bắt đầu miễn phí
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link to="/templates">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-purple-400 text-purple-300 hover:bg-purple-500/10"
                            >
                                Xem mẫu thiết kế
                            </Button>
                        </Link>
                    </div>

                    {/* Floating Animation Elements */}
                    <div className="relative mt-16 min-h-[300px]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl">
                            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg overflow-hidden group">
                                        <img src="/assets/thumbnail1.png" alt="Template 1" className="w-full h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                    <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg overflow-hidden group">
                                        <img src="/assets/thumbnail2.png" alt="Template 2" className="w-full h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                    <div className="aspect-video bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg overflow-hidden group">
                                        <img src="/assets/thumbnail3.png" alt="Template 3" className="w-full h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16 text-white">
                        Tại sao chọn <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Ez-Slide</span>?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Nhanh chóng</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Tạo slide chuyên nghiệp chỉ trong vài phút với trình soạn thảo trực quan và dễ sử dụng.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group bg-gradient-to-br from-pink-500/10 to-transparent backdrop-blur-sm rounded-2xl p-8 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/20">
                            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <LayoutTemplate className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Nhiều mẫu thiết kế</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Hàng trăm mẫu thiết kế đẹp mắt và chuyên nghiệp cho mọi mục đích sử dụng.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group bg-gradient-to-br from-blue-500/10 to-transparent backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Cộng tác dễ dàng</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Làm việc nhóm hiệu quả với tính năng chia sẻ và chỉnh sửa cùng lúc.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-12">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-bold text-white mb-6">
                                    Mọi thứ bạn cần để tạo slide hoàn hảo
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                                        <p className="text-gray-300">Trình soạn thảo kéo thả trực quan</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                                        <p className="text-gray-300">Thư viện hình ảnh và icon phong phú</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                                        <p className="text-gray-300">Xuất file PowerPoint hoặc PDF</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                                        <p className="text-gray-300">Tương thích mọi thiết bị</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-32 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl flex items-center justify-center">
                                    <img src="/assets/Top_left.png" alt="Trình soạn thảo kéo thả trực quan" className="h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div className="h-32 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl flex items-center justify-center">
                                    <img src="/assets/Top_right.png" alt="Thư viện hình ảnh và icon phong phú" className="h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300" />
                                </div>  
                                <div className="h-32 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-xl flex items-center justify-center">
                                    <img src="/assets/Bottom_left.png" alt="Xuất file PowerPoint hoặc PDF" className="h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div className="h-32 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl flex items-center justify-center">
                                    <img src="/assets/Bottom_right.png" alt="Tương thích mọi thiết bị" className="h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl font-bold text-white mb-6">
                        Sẵn sàng tạo slide đẹp?
                    </h2>
                    <p className="text-xl text-gray-300 mb-10">
                        Bắt đầu miễn phí ngay hôm nay. Không cần thẻ tín dụng.
                    </p>
                    <Link to="/register">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-2xl shadow-purple-500/50 group"
                        >
                            Bắt đầu ngay - Miễn phí
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-purple-500/20 py-8 px-6">
                <div className="max-w-6xl mx-auto text-center text-gray-400">
                    <p>© 2026 Ez-Slide. Tạo slide chuyên nghiệp, dễ dàng hơn bao giờ hết.</p>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage