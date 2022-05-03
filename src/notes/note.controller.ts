import { Body, Controller, Get, Param, Post, Delete, Session, UseGuards, UnauthorizedException, Patch } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateNoteDto } from './dtos/create-note.dto';
import { NoteService } from './note.service';
import { NoteDto } from './dtos/note.dto';
import { parse } from 'path/posix';
import { UpdateNote } from './dtos/update-note-dto';
import { CurrentUser } from 'src/users/decorators/current-user-decorator';
import { User } from 'src/users/user.entity';

@Controller('notes')
@Serialize(NoteDto)
@UseGuards(AuthGuard)
export class NoteController {

    constructor(private noteService: NoteService){}

    @Post()
    createNote(@Body() body: CreateNoteDto, @CurrentUser() user: User){
        this.noteService.create(body.author, body.note, user);
    }
    

    @Get()
    // async getNotesByUserId(@Param('name') name: string, @Session() session: any){
    async getNotesByUserId(@CurrentUser() user: User){
        // const { userId } = session;
        // if(!userId){
        //     throw new UnauthorizedException("Unauthorized");
        // }
        // const notes = await this.noteService.getNotes(userId);
        // return notes;

        return await this.noteService.getNotes(user.id);
    }

    @Get(':id')
    async getNotesById(@Param('id') id: string, @Session() session: any){
        const { userId } = session;

        if(!userId){
            throw new UnauthorizedException("Unauthorized");
        }

        const note = await this.noteService.getNoteById(parseInt(id));

        console.log("Note by id value: ", note);
    }

    @Patch(':id')
    async updateNoteById(@Param('id') id: string, @Body() body: UpdateNote, @Session() session: any){
        const { userId } = session;

        if(!userId){
            throw new UnauthorizedException("Unauthorized");
        }

        return await this.noteService.updateNote(parseInt(id), body);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string){
        return this.noteService.deleteNote(parseInt(id));
    }
}
