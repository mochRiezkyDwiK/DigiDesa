import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { EASE_SPRING } from "../constants/animation";
import { Mail, Phone, MapPin, FileText, MessageSquare, Globe, MessageCircle, Camera } from "lucide-react";

const FADE_UP = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: EASE_SPRING }
    })
};

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <motion.footer
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_SPRING }}
            className="bg-slate-900 text-white"
        >
            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Quick Links */}
                    <motion.div custom={0} variants={FADE_UP} initial="hidden" animate="visible" className="space-y-4">
                        <h3 className="text-lg font-semibold mb-4">Layanan Cepat</h3>
                        <div className="space-y-3">
                            <Link to="/layanan" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                                <FileText className="w-4 h-4" />
                                <span>Pembuatan Surat</span>
                            </Link>
                            <Link to="/lapor" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                                <MessageSquare className="w-4 h-4" />
                                <span>Pengaduan</span>
                            </Link>
                            <Link to="/transparansi-anggaran" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                                <MapPin className="w-4 h-4" />
                                <span>Transparansi Anggaran</span>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div custom={1} variants={FADE_UP} initial="hidden" animate="visible" className="space-y-4">
                        <h3 className="text-lg font-semibold mb-4">Hubungi Kami</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-slate-300">
                                <Phone className="w-4 h-4" />
                                <span>(031) 1234-5678</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                                <Mail className="w-4 h-4" />
                                <span>desa@digidesa.id</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                                <MapPin className="w-4 h-4" />
                                <span>Jl. Merdeka No. 123, Desa X</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Social Media */}
                    <motion.div custom={2} variants={FADE_UP} initial="hidden" animate="visible" className="space-y-4">
                        <h3 className="text-lg font-semibold mb-4">Ikuti Kami</h3>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                                <Globe className="w-5 h-5 text-white" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                                <MessageCircle className="w-5 h-5 text-white" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                                <Camera className="w-5 h-5 text-white" />
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-8 mt-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <motion.div custom={3} variants={FADE_UP} initial="hidden" animate="visible" className="text-slate-400">
                            <p>&copy; {currentYear} Pemerintah Desa X. All rights reserved.</p>
                        </motion.div>
                        <div className="flex gap-4">
                            <Link to="/bantuan" className="text-slate-400 hover:text-white transition-colors">
                                Bantuan
                            </Link>
                            <Link to="/kebijakan-privasi" className="text-slate-400 hover:text-white transition-colors">
                                Kebijakan Privasi
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
}

export default Footer;