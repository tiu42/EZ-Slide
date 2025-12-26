import React from 'react'
import { Link } from 'react-router-dom'
import { Layout } from 'lucide-react'
import Button from '../../../components/ui/Button'

const AuthHeader = ({ type }) => {
    return (
        <header className="w-full px-6 py-4 flex justify-between items-center bg-white border-b border-slate-200">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                    <Layout size={20} />
                </div>
                <span className="text-xl font-bold text-slate-800 tracking-tight">EzSlide</span>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500 hidden sm:inline-block">
                    Already have an account?
                </span>

                {(type === "register") ? (
                    <Link to="/login">
                        <Button variant="outline" size="sm">Log in</Button>
                    </Link>) : (
                    <Link to="/register">
                        <Button variant="outline" size="sm">Sign up free</Button>
                    </Link>)}
            </div>
        </header>
    )
}

export default AuthHeader;