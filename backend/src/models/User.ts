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

    @Column({
        type: "enum",
        enum: ["WARGA", "ADMIN"],
        default: "WARGA"
    })
    role!: string;

    // --- RELASI WILAYAH ---
    // Sekarang diletakkan di luar kolom role
    @ManyToOne(() => Wilayah, (wilayah) => wilayah.penduduk)
    @JoinColumn({ name: "wilayahId" }) 
    wilayah!: Wilayah;

    @ManyToOne(() => Keluarga, (keluarga) => keluarga.anggota_keluarga)
    @JoinColumn({ name: "no_kk" }) // Menghubungkan ke PK di tabel Keluarga
    keluarga!: Keluarga;

    @CreateDateColumn()
    created_at!: Date;
}