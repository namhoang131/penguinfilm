"use client"

import { motion } from "framer-motion"
import { Heart, Mail, Phone, MapPin, Facebook, Youtube, Instagram, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import PenguinLogo from "./penguin-logo"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Phim: [
      { name: "Phim mới", href: "/movies?sort=recent" },
      { name: "Phim hot", href: "/movies?sort=trending" },
      { name: "Phim hoàn thành", href: "/movies?status=completed" },
      { name: "Phim đang chiếu", href: "/movies?status=ongoing" },
    ],
    "Thể loại": [
      { name: "Hành động", href: "/movies?genre=action" },
      { name: "Lãng mạn", href: "/movies?genre=romance" },
      { name: "Hài hước", href: "/movies?genre=comedy" },
      { name: "Phiêu lưu", href: "/movies?genre=adventure" },
    ],
    "Hỗ trợ": [
      { name: "Liên hệ", href: "/contact" },
      { name: "Báo lỗi", href: "/report" },
      { name: "Góp ý", href: "/feedback" },
      { name: "FAQ", href: "/faq" },
    ],
    "Về chúng tôi": [
      { name: "Giới thiệu", href: "/about" },
      { name: "Điều khoản", href: "/terms" },
      { name: "Bảo mật", href: "/privacy" },
      { name: "Tuyển dụng", href: "/careers" },
    ],
  }

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#", color: "hover:text-blue-600" },
    { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-600" },
    { name: "Instagram", icon: Instagram, href: "#", color: "hover:text-pink-600" },
    { name: "GitHub", icon: Github, href: "#", color: "hover:text-gray-800" },
  ]

  return (
    <footer className="bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 border-t border-blue-100">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Link href="/movies" className="flex items-center gap-3 mb-4">
                <PenguinLogo size="md" animated={true} />
                <div>
                  <h3 className="text-2xl font-bold text-slate-700 font-['Poppins']">Penguin Film</h3>
                  <p className="text-sm text-slate-500">Donghua Vietsub</p>
                </div>
              </Link>

              <p className="text-slate-600 mb-4 font-['Nunito'] leading-relaxed">
                Trang web chuyên vietsub phim hoạt hình Trung Quốc (donghua) chất lượng cao. Được thực hiện và biên tập
                bởi nhóm Penguin Vietsub với tình yêu dành cho anime.
              </p>

              {/* Contact Info */}
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-blue-500" />
                  <span>contact@penguinfilm.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-blue-500" />
                  <span>+84 123 456 789</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-blue-500" />
                  <span>Hà Nội, Việt Nam</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="font-bold text-slate-700 mb-4 font-['Poppins']">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-['Nunito']"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h4 className="font-bold text-slate-700 mb-2 font-['Poppins']">🎬 Đăng ký nhận thông báo phim mới</h4>
              <p className="text-slate-600 text-sm font-['Nunito']">
                Nhận thông báo khi có phim mới, tập mới và các tin tức hot nhất
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                placeholder="Nhập email của bạn..."
                className="rounded-xl border-blue-200 focus:border-blue-400 min-w-64"
              />
              <Button className="bg-blue-500 hover:bg-blue-600 rounded-xl px-6">Đăng ký</Button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-blue-200">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-slate-600 text-sm font-['Nunito']">
              © {currentYear} Penguin Film. Được tạo với <Heart className="inline w-4 h-4 text-red-500 mx-1" />
              bởi nhóm Penguin Vietsub
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Tất cả nội dung được sử dụng cho mục đích giáo dục và giải trí
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 font-['Nunito']">Theo dõi chúng tôi:</span>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 text-slate-600 ${social.color} transition-colors hover:shadow-lg`}
                  title={social.name}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Development Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center"
        >
          <p className="text-sm text-yellow-700 font-['Nunito']">
            🚧 Website đang trong giai đoạn phát triển - Một số tính năng có thể chưa hoạt động đầy đủ
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
