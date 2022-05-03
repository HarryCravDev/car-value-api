import { User } from "src/users/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity()
export class Note {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    author: string;

    @Column()
    note: string;

    // @Column()
    // userId: number;

    @ManyToOne(() => User, (user) => user.notes)
    user: User
}