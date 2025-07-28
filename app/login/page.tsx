"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate login/register
    const userData = {
      email: formData.email,
      name: formData.name || formData.email.split("@")[0],
      loginTime: Date.now(),
    }

    localStorage.setItem("penguin-user", JSON.stringify(userData))

    // Redirect to movies page
    window.location.href = "/movies"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {/* Back Link */}
        <Link href="/movies" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
          ← Quay lại trang chủ
        </Link>

        {/* Login Form */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🐧</div>
            <h1 className="text-2xl font-bold text-slate-700 font-['Poppins']">{isLogin ? "Đăng nhập" : "Đăng ký"}</h1>
            <p className="text-slate-500 mt-2 font-['Nunito']">
              {isLogin ? "Chào mừng bạn quay lại Penguin Film" : "Tạo tài khoản mới để trải nghiệm tốt hơn"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700">
                  Tên hiển thị
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nhập tên của bạn"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 rounded-xl border-blue-200 focus:border-blue-400"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 rounded-xl border-blue-200 focus:border-blue-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">
                Mật khẩu
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 rounded-xl border-blue-200 focus:border-blue-400"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl py-3 font-['Poppins']"
            >
              {isLogin ? "Đăng nhập" : "Đăng ký"}
            </Button>
          </form>

          {/* Toggle Form */}
          <div className="text-center mt-6">
            <p className="text-slate-600 font-['Nunito']">
              {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 p-0 ml-1"
              >
                {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
              </Button>
            </p>
          </div>

          {/* Development Notice */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-700 text-center font-['Nunito']">
              🚧 Tính năng đang phát triển - Dữ liệu được lưu tạm thời trên thiết bị
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
