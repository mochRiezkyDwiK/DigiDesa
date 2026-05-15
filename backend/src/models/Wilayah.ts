import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./User";

@Entity()
export class Wilayah {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    rt: string; // Contoh: "001"

    @Column()
    rw: string; // Contoh: "010"

    @Column({ nullable: true })
    nama_ketua: string; // Opsional, buat pelengkap data desa

    @OneToMany(() => User, (user) => user.wilayah)
    penduduk: User[];
}