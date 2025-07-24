import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { BookModule } from '../book/book.module';
import { TestStrategy } from './test.strategy';


@Module({
  imports: [
    JwtModule.register({
      secret: '1234', // Use env variable in production
      signOptions: { expiresIn: '1h' },
    }),
    BookModule,
  ],
  providers: [AuthService, TestStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
