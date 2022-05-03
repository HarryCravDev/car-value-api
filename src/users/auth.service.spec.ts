import { Test, TestingModule } from '@nestjs/testing';
import { ChildEntity } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUserService: Partial<UsersService>;
    
    beforeEach(async () => {
        let users: User[] = [];

        // Fake user service
        fakeUserService = {
            // find: () => Promise.resolve([]),
            find: (email: string) => {
                const fileredUsers = users.filter(user => user.email === email);
                return Promise.resolve(fileredUsers);
            },
            // create: (email: string, password: string) => Promise.resolve({ id: 1, email, password} as User)
            create: (email: string, password: string) => {
                const user = {
                    id: Math.floor(Math.random() * 9999),
                    email,
                    password
                } as User;

                users.push(user);

                return Promise.resolve(user);
            }
        };
        
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUserService
                }
            ]
        }).compile();
    
        service = module.get(AuthService);
    });
    
    it('Can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });
    
    it('Create a new user with a salted and hashed password', async () => {
        const user = await service.signUp('asdf@asdf.com', 'asdf');
        expect(user.password).not.toEqual('asdf');
        
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });
    
    it('Throws an error if user signs up with email that is in use', (done) => {
        fakeUserService.find = () => Promise.resolve([{id:1, email: 'a', password: '1'} as User]);

        service.signUp('asdf@asdf.com', 'asdf').catch(e => done());
    });

    it('Throws an error if user signs in with an unused email', done => {
        service.signin('asdf@asdf.com', 'asdf').catch(() => done());
    });

    it('Throws an error if user signs in with an invalid password', done => {
        fakeUserService.find = () => Promise.resolve([{id:1, email: 'asdf@asdf.com', password: 'asdf'} as User]);

        service.signin('asdf@asdf.com', '1234').catch(() => done());
    });

    it('Returns user is correct password is provided', async () => {
        await service.signUp('asdf@asdf.com', 'password');

        const user = await service.signin('asdf@asdf.com', 'password');

        expect(user).toBeDefined();         
    });

})
