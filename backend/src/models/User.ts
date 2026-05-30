import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { Wilayah } from "./Wilayah";
import { Keluarga } from "./Keluarga";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    nik!: string;

    @Column({ type: "varchar", length: 16, nullable: true })
    no_kk!: string;

    @Column()
    nama_lengkap!: string;

    @Column({ unique: true })
    username!: string;

    @Column()
    password!: string;

    @Column()
    no_hp!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    alamat!: string;

    // Catatan: Jika sudah pakai Wilayah (FK), kolom rt & rw di bawah ini 
    // sebenarnya bisa dihapus agar tidak duplikat data. 
    // Tapi saya biarkan dulu jika kamu masih membutuhkannya.
    @Column({ type: "varchar", length: 5, nullable: true })
    rt!: string;

    @Column({ type: "varchar", length: 5, nullable: true })
    rw!: string;

    @ManyToOne(() => Wilayah, (wilayah) => wilayah.penduduk, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "wilayahId" })
    wilayah?: Wilayah;

    @ManyToOne(() => Keluarga, (keluarga) => keluarga.anggota_keluarga, { nullable: true })
    @JoinColumn({ name: "no_kk", referencedColumnName: "no_kk" })
    keluarga?: Keluarga;

    // ── KOLOM BARU UNTUK SISTEM VERIFICATION GATE ──

    @Column({ type: "varchar", length: 30, default: "INCOMPLETE" })
    status_akun: "INCOMPLETE" | "PENDING" | "REJECTED" | "VERIFIED_TETAP" | "VERIFIED_PENDATANG" | "BANNED";

    @Column({ type: "varchar", length: 30, nullable: true })
    status_hubungan: string; // Contoh: Kepala Keluarga, Istri, Anak

    @Column({ type: "varchar", length: 20, nullable: true })
    status_tinggal: "TETAP" | "PENDATANG";

    @Column({ type: "varchar", length: 255, nullable: true })
    foto_ktp: string;

    @Column({ type: "text", nullable: true })
    alasan_ditolak: string;

    @Column({
        type: "enum",
        enum: ["WARGA", "ADMIN"],
        default: "WARGA"
    })
    role!: string;

    @CreateDateColumn()
    created_at!: Date;
}