import { Request, Response } from "express";
import { AppDataSource } from "../lib/data-source";
import { Finance } from "../models/Finance";

const financeRepository = AppDataSource.getRepository(Finance);

// 1. AMBIL RINGKASAN & RIWAYAT (READ)
export const getFinanceSummary = async (req: Request, res: Response) => {
    try {
        const data = await financeRepository.find({ order: { id: "DESC" } });
        
        // Kalkulasi Summary
        const income = data
            .filter(f => f.type === "INCOME")
            .reduce((acc, curr) => acc + Number.parseFloat(curr.amount.toString()), 0);

        const expense = data
            .filter(f => f.type === "EXPENSE")
            .reduce((acc, curr) => acc + Number.parseFloat(curr.amount.toString()), 0);

        res.json({ 
            success: true, 
            data: {
                transactions: data,
                summary: {
                    total_income: income,
                    total_expense: expense,
                    balance: income - expense
                }
            }
        });
    } catch (error: any) {
        console.error("DETAIL ERROR:", error); 
        res.status(500).json({ 
            success: false, 
            message: "Gagal ambil data keuangan",
            error: error.message 
        });
    }
};

// 2. CATAT TRANSAKSI BARU (CREATE + TRANSPARANSI)
export const createFinance = async (req: Request, res: Response) => {
    try {
        // Ambil data dari body (ditambahkan transaction_date)
        const { title, type, amount, category, recipient, transaction_date } = req.body;
        
        // Ambil path file kuitansi dari multer (jika ada)
        const evidenceUrl = req.file ? `/uploads/evidence/${req.file.filename}` : undefined;

        // LOGIKA SALDO OTOMATIS: Cari transaksi terakhir berdasarkan ID terbesar
        const lastTrxArray = await financeRepository.find({
            order: { id: "DESC" },
            take: 1
        });
        
        const lastTrx = lastTrxArray[0];
        const lastBalance = lastTrx ? Number.parseFloat(lastTrx.current_balance.toString()) : 0;
        const currentAmount = Number.parseFloat(amount);
        
        // Hitung saldo baru (Saldo Terakhir +/- Nominal Sekarang)
        const newBalance = type === "INCOME" 
            ? lastBalance + currentAmount 
            : lastBalance - currentAmount;

        // Simpan data lengkap
        const newFinancePayload: Partial<Finance> = {
            title,
            type,
            amount: currentAmount,
            category: category || "Lainnya",
            recipient: recipient || "Internal Desa",
            current_balance: newBalance,
            transaction_date: transaction_date || new Date().toISOString().split('T')[0] // Fallback ke tanggal hari ini jika kosong
        };

        if (evidenceUrl) {
            newFinancePayload.evidence_url = evidenceUrl;
        }

        const newFinance = financeRepository.create(newFinancePayload);

        await financeRepository.save(newFinance);
        
        res.status(201).json({ 
            success: true, 
            message: "Transaksi berhasil diverifikasi & dicatat!",
            data: newFinance 
        });
    } catch (error: any) {
        console.error("ERROR CREATE FINANCE:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. EDIT TRANSAKSI (UPDATE)
export const updateFinance = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { title, type, amount, category, recipient, transaction_date } = req.body;

        if (!Number.isFinite(id)) {
            return res.status(400).json({ success: false, message: "ID transaksi tidak valid" });
        }

        // Cari data yang mau diupdate
        const finance = await financeRepository.findOneBy({ id });
        
        if (!finance) {
            return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
        }

        // Update data text dan tanggal kustom
        finance.title = title || finance.title;
        finance.type = type || finance.type;
        finance.category = category || finance.category;
        finance.recipient = recipient || finance.recipient;
        finance.transaction_date = transaction_date || finance.transaction_date;

        if (amount) {
            finance.amount = Number.parseFloat(amount);
        }

        // Update foto HANYA JIKA admin upload foto baru
        if (req.file) {
            finance.evidence_url = `/uploads/evidence/${req.file.filename}`;
        }

        // Simpan perubahan ke DB
        await financeRepository.save(finance);

        res.json({ 
            success: true, 
            message: "Data transaksi berhasil diperbarui!",
            data: finance 
        });
    } catch (error: any) {
        console.error("ERROR UPDATE FINANCE:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. HAPUS TRANSAKSI (DELETE)
export const deleteFinance = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isFinite(id)) {
            return res.status(400).json({ success: false, message: "ID parameter is required" });
        }

        const result = await financeRepository.delete(id);

        if (result.affected === 0) {
            return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
        }

        res.json({ success: true, message: "Transaksi berhasil dihapus" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};