import React, { useEffect, useState } from "react";
import { FileText, Users, TrendingUp } from "lucide-react";
import axios from "axios";

export default function StatsWidget() {
  // State awal diset murni menggunakan status loading "..."
  const [stats, setStats] = useState([
    { key: "pengajuan", icon: FileText, value: "...", label: "Pengajuan aktif", color: "#60A5FA", valueColor: "#F1F5F9" },
    { key: "warga", icon: Users, value: "...", label: "Warga terdata", color: "#34D399", valueColor: "#F1F5F9" },
    { key: "kepuasan", icon: TrendingUp, value: "...", label: "Tingkat kepuasan", color: "#F472B6", valueColor: "#F1F5F9" },
  ]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/surat/dashboard-stats");
        
        if (response.data.success) {
          const dbData = response.data.data;
          
          setStats([
            { key: "pengajuan", icon: FileText, value: dbData.pengajuanAktif, label: "Pengajuan aktif", color: "#60A5FA", valueColor: "#F1F5F9" },
            { key: "warga", icon: Users, value: dbData.wargaTerdata, label: "Warga terdata", color: "#34D399", valueColor: "#F1F5F9" },
            { key: "kepuasan", icon: TrendingUp, value: dbData.tingkatKepuasan || "97%", label: "Tingkat kepuasan", color: "#F472B6", valueColor: "#F1F5F9" },
          ]);
        }
      } catch (error) {
        console.error("Gagal mengambil data statistik untuk widget:", error);
        
        // JIKA ERROR: Tampilkan teks "Err" dengan warna merah cerah (#EF4444) agar langsung ketahuan
        setStats([
          { key: "pengajuan", icon: FileText, value: "Err", label: "Pengajuan aktif", color: "#60A5FA", valueColor: "#EF4444" },
          { key: "warga", icon: Users, value: "Err", label: "Warga terdata", color: "#34D399", valueColor: "#EF4444" },
          { key: "kepuasan", icon: TrendingUp, value: "Err", label: "Tingkat kepuasan", color: "#F472B6", valueColor: "#EF4444" },
        ]);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div style={{ display: "flex", gap: "16px" }}>
      {stats.map((s) => (
        <div
          key={s.key}
          style={{
            flex: 1,
            padding: "16px 20px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(8px)",
          }}
        >
          <s.icon size={18} color={s.color} style={{ marginBottom: "8px" }} />
          {/* Properti color sekarang dinamis menggunakan s.valueColor */}
          <p style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em", margin: 0, color: s.valueColor }}>
            {s.value}
          </p>
          <p style={{ fontSize: "12px", color: "#475569", marginTop: "2px", margin: 0 }}>
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}