import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("finances")
export class Finance {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string; // Contoh: "Dana Desa Tahap 1" atau "Beli Semen RT 01"

    @Column()
    type: "INCOME" | "EXPENSE"; // Pemasukan atau Pengeluaran

    @Column("decimal", { precision: 12, scale: 2 })
    amount: number;

    @Column()
    category: string; // Infrastruktur, Sosial, Operasional, dll.

    @CreateDateColumn()
    created_at: Date;
}