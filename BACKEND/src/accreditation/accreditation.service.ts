import { Injectable } from "@nestjs/common";
import { CreateUpdateAccreditationDto } from "./dto/create-update-accreditation.dto";
import { Accreditation } from "./entities/accreditation.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AccreditationService {
  constructor(
    @InjectRepository(Accreditation)
    private accRepository: Repository<Accreditation>
  ) {
  }

  async create(createAccreditationDto: CreateUpdateAccreditationDto) {
    return this.accRepository.save(createAccreditationDto).catch((reason) => {
      console.error(reason);
      return false;
    });
  }

  async findAll(): Promise<object[]> {
    return this.accRepository.find().then((items) => {
      return items.map((item) => {
        const { id, name, surname, nickname, ...rest } = item;
        return { id: id, name: name, surname: surname, nickname: nickname };
      });
    });
  }

  findOne(id: number) {
    return this.accRepository.findOneBy({ id: id }).then(async (it) => {
      if (it !== null) {
        if (it.roomNumber != undefined)
          it.keysFree = !await this.getKeyStatus(it.roomNumber);

      }

      return it;
    });
  }

  update(id: number, updateAccreditationDto: CreateUpdateAccreditationDto) {
    return `This action updates a #${id} accreditation`;
  }

  remove(id: number) {
    return `This action removes a #${id} accreditation`;
  }

  clear() {
    return this.accRepository.delete({});
  }

  async getKeyStatus(room: number) {
    return this.accRepository
      .findBy({ roomNumber: room })
      .then((items) => items.some((it) => it.checkIn));
  }

  async checkInUser(id: number) {
    return this.findOne(id).then(async (it) => {
      if (it !== null) {
        it.checkIn = true;
        await this.accRepository.save(it);
        return true;
      }
      return false;
    });
  }
}
