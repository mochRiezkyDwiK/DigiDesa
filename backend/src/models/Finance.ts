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

        // Tambahkan field ini di dalam class Finance
    @Column({ nullable: true })
    recipient: string;

    @Column({ nullable: true })
    evidence_url: string;

    @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
    current_balance: number;

    @Column({ type: "date", nullable: true })
    transaction_date: string;
}