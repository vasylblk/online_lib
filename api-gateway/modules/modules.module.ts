import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { BookModule } from './books/book.module';

@Module({
  imports: [UserModule, BookModule],
})
export class ModulesModule {}
