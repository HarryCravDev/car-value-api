import { Note } from 'src/notes/note.entity';
import { Report } from 'src/reports/report.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, AfterInsert, AfterUpdate, AfterRemove, getMongoManager } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;
    
    @Column()
    password: string;

    @Column({ default: true })
    admin: boolean;

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];

    @OneToMany(() => Note, (note) => note.user)
    notes: Note[];

    @AfterInsert()
    logInsert(){
        console.log("Inserted user with id ", this.id);
    }

    @AfterUpdate()
    logUpdate(){
        console.log("Updated user with id ", this.id);
    }

    @AfterRemove()
    logRemove(){
        console.log("Removed user with id ", this.id);
    }
   
}
