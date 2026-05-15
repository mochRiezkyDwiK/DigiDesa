import { Request, Response } from "express";
import { AppDataSource } from "../lib/data-source";
import { Finance } from "../models/Finance";

const financeRepository = AppDataSource.getRepository(Finance);

export const getFinanceSummary = async (req: Request, res: Response) => {
    try {
        const data = await financeRepository.find({ order: { created_at: "DESC" } });
        
        // Perbaikan: Gunakan parseFloat karena decimal dari DB sering datang sebagai string
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
        // Tampilkan error detail di console biar ketahuan kalau ada typo kolom
        console.error("DETAIL ERROR:", error); 
        res.status(500).json({ 
            success: false, 
            message: "Gagal ambil data keuangan",
            error: error.message // Biar Thunder Client kasih tau error aslinya
        });
    }
};
// Tambahkan deleteFinance di baris export
export const createFinance = async (req: Request, res: Response) => {
    try {
        const { title, type, amount, category } = req.body;
        
        // Buat data baru
        const newFinance = financeRepository.create({
            title,
            type,
            amount,
            category: category || "Lainnya"
        });

        await financeRepository.save(newFinance);
        
        res.status(201).json({ 
            success: true, 
            message: "Transaksi berhasil dicatat!",
            data: newFinance 
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteFinance = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "ID parameter is required" });
        }

        const result = await financeRepository.delete(id as string);

        if (result.affected === 0) {
            return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
        }

        res.json({ success: true, message: "Transaksi berhasil dihapus" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};