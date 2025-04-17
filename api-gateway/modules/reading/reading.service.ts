import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { patterns } from '../patterns';

@Injectable()
export class ReadingService {
    constructor(@Inject('READING_SERVICE') private client: ClientProxy) {}

    async createProgress(data: any) {
        return firstValueFrom(this.client.send(patterns.READING.CREATE, data));
    }

    async getUserProgress(userId: string) {
        return firstValueFrom(this.client.send(patterns.READING.GET_BY_USER, userId));
    }

    async updateProgress(id: string, data: any) {
        return firstValueFrom(
            this.client.send(patterns.READING.UPDATE, { id, data }),
        );
    }
}
