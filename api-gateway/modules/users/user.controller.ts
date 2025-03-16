import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { User } from './dto';

@Controller('users')
export class UserController {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  @Post()
  register(@Body() userDto: User): Observable<any> {
    return this.client.send({ cmd: 'create_user' }, userDto);
  }

  @Post('login')
  login(
    @Body() credentials: { email: string; password: string },
  ): Observable<any> {
    return this.client.send({ cmd: 'login_user' }, credentials);
  }

  @Get()
  getUsers(): Observable<any> {
    return this.client.send({ cmd: 'get_users' }, {});
  }

  @Get(':id')
  getUserById(@Param('id') id: string): Observable<any> {
    return this.client.send({ cmd: 'get_user_by_id' }, id); // Убираем { id }
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() userDto: User): Observable<any> {
    return this.client.send({ cmd: 'update_user' }, { id, dto: userDto });
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Observable<any> {
    return this.client.send({ cmd: 'delete_user' }, { id });
  }

  @Get('email/:email')
  findUserByEmail(@Param('email') email: string): Observable<any> {
    return this.client.send({ cmd: 'get_user_by_email' }, { email });
  }

  @Post('reset-password')
  resetPassword(@Body('email') email: string): Observable<any> {
    return this.client.send({ cmd: 'reset_password' }, { email });
  }
}
