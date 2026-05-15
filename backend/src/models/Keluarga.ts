import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { User } from "./User";

@Entity()
export class Keluarga {
    @PrimaryColumn({ length: 16 })
    no_kk!: string; // Dijadikan PK di sini

    @Column({ nullable: true })
    alamat_kk!: string;

    @OneToMany(() => User, (user) => user.keluarga)
    anggota_keluarga!: User[];
}