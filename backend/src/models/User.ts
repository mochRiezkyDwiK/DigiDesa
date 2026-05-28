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

    @Column({ type: "varchar", length: 5, nullable: true })
    rt!: string;

    @Column({ type: "varchar", length: 5, nullable: true })
    rw!: string;

    @Column({
        type: "enum",
        enum: ["WARGA", "ADMIN"],
        default: "WARGA"
    })
    role!: string;

    // 🔴 TAMBAHAN: Kolom status verifikasi akun warga
    @Column({ type: "boolean", default: false })
    is_verified!: boolean;

    // --- RELASI WILAYAH ---
    @ManyToOne(() => Wilayah, (wilayah) => wilayah.penduduk)
    @JoinColumn({ name: "wilayahId" }) 
    wilayah!: Wilayah;

    @ManyToOne(() => Keluarga, (keluarga) => keluarga.anggota_keluarga)
    @JoinColumn({ name: "no_kk" }) 
    keluarga!: Keluarga;

    @CreateDateColumn()
    created_at!: Date;
}