import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

// Definisi ENUM untuk Jenis Surat sesuai Blueprint
export enum JenisSurat {
    SKD = "SKD",
    SKU = "SKU",
    SKTM = "SKTM"
}

// Definisi ENUM untuk Alur Status Surat
export enum StatusSurat {
    PENDING = "PENDING",
    REJECTED = "REJECTED",
    PROSES = "PROSES",
    SELESAI = "SELESAI"
}

@Entity({ name: "surat" })
export class Surat {
    @PrimaryGeneratedColumn()
    id: number;

    // Relasi ManyToOne: Satu warga bisa mengajukan banyak surat
    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column({ type: "varchar", length: 100, nullable: true })
    no_surat: string;

    @Column({ type: "enum", enum: JenisSurat })
    jenis_surat: JenisSurat;

    @Column({ type: "text" })
    keperluan: string;

    @Column({ type: "enum", enum: StatusSurat, default: StatusSurat.PENDING })
    status: StatusSurat;

    @Column({ type: "text", nullable: true })
    alasan_ditolak: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    token_qr: string;

    @CreateDateColumn({ type: "timestamp" })
    tgl_diajukan: Date;

    @Column({ type: "timestamp", nullable: true })
    tgl_disetujui: Date;
}