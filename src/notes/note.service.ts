import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from 'src/users/user.entity';
import { ChildEntity, Repository } from "typeorm";
import { UpdateNote } from './dtos/update-note-dto';
import { Note } from "./note.entity";

@Injectable()
export class NoteService {
    constructor(@InjectRepository(Note) private repo: Repository<Note>){}

    // create(author: string, note: string, userId: number){
    create(author: string, note: string, user: User){
        // const record = this.repo.create({ author, note, userId });
        const record = this.repo.create({ author, note });
        record.user = user;

        return this.repo.save(record);
    }

    async getNotes(id: number){
        const note = await this.repo.findOne(1);
        console.log("Note: ", {note, id});

        return this.repo.find({
            where: {
                userId: id
            }
        });
    }

    getNoteById(id: number){
        return this.repo.findOne(id);
    }

    async updateNote(id: number, attrs: Partial<Note>){
        const note = await this.repo.findOne(id);

        console.log("Note after DB call", note);

        // if((id !== note.userId) || !note){
        //     console.log("This is not your note, permission not granted");
        //     throw new NotFoundException("note not found.");
        // }

        Object.assign(note, attrs)

        console.log("BEFORE UPDATE COMMIT VALUEL: ", note);
        return this.repo.save(note);
    }

    async deleteNote(id: number){
        const note = await this.repo.findOne(id);
    
        return this.repo.remove(note);
    }
}
