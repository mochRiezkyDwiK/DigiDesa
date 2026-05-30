import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
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

    @Column({ 
        type: "varchar",
        default: "BARU" 
    }) // BARU, DITUGASKAN, PROSES, SELESAI
    status: string;

    @Column({ type: "varchar", nullable: true })
    bukti_visual: string | null;

    @Column({ type: "text", nullable: true })
    catatan_petugas: string | null;

    @ManyToOne(() => User, (user) => user.id, { nullable: true })
    @JoinColumn({ name: "petugasId" })
    petugas: User | null; // Relasi ke petugas yang ditugaskan

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: "userId" })
    user: User; // Relasi ke warga yang melapor
}