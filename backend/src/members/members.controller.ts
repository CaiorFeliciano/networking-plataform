import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post('register/:token')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  register(
    @Param('token') token: string,
    @Body() createMemberDto: CreateMemberDto,
  ) {
    return this.membersService.registerMember(token, createMemberDto);
  }

  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }
}
