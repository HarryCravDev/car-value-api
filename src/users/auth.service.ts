import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private userService: UsersService){}

    async signUp(email: string, password: string){

        const users = await this.userService.find(email);

        if(users.length){
            throw new BadRequestException("Email in use");
        }

        // Generate salt 
        const salt = randomBytes(8).toString('hex');

        // Hash salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // Join the hashed result and salt together
        const result = salt + '.' + hash.toString('hex');

        const user = await this.userService.create(email, result);

        return user;
    }

    async signin(email: string, password: string){
        const [user] = await this.userService.find(email);

        if(!user){
            throw new NotFoundException('user not found');
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if(storedHash !== hash.toString('hex')){
            throw new UnauthorizedException('Unauthorized');
        }

        return user;
    }
}