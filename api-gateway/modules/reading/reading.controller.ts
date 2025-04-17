import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Put,
    UseGuards,
} from '@nestjs/common';
import { ReadingService } from './reading.service';
import { JwtAuthGuard } from '../../guards/auth.guard';

@Controller('reading-progress')
@UseGuards(JwtAuthGuard)
export class ReadingController {
    constructor(private readonly service: ReadingService) {}

    @Post()
    create(@Body() dto: any) {
        return this.service.createProgress(dto);
    }

    @Get(':userId')
    getUserProgress(@Param('userId') userId: string) {
        return this.service.getUserProgress(userId);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: any) {
        return this.service.updateProgress(id, dto);
    }
}