import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column("text")
    description: string;

    @Column()
    location: string; // Contoh: RT 01 / RW 10

    @Column({ default: "HIGH" }) // LOW, MEDIUM, HIGH
    priority: string;

    @Column({ default: "BARU" }) // BARU, PROSES, SELESAI
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, (user) => user.id)
    user: User; // Relasi ke warga yang melapor
}