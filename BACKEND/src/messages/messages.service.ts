import { Injectable } from "@nestjs/common";
import { PeopleMessageEntity } from "./people-message.entity";
import { AdminMessageEntity } from "./admin-message.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(PeopleMessageEntity)
    private messagesRepo: Repository<PeopleMessageEntity>,
    @InjectRepository(AdminMessageEntity)
    private adminMessageRepo: Repository<AdminMessageEntity>
  ) {
  }

  findActivePeopleMessages() {
    return this.messagesRepo.find({
      where: {
        isAccepted: true
      }
    });
  }

  findActiveAdminMessages() {
    return this.adminMessageRepo.find({
      where: {
        hidden: false
      }
    });
  }
}
