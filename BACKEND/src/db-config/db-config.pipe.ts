import { Injectable, PipeTransform } from "@nestjs/common";
import { DbConfigEntity } from "./db-config.entity";
import { DbConfigService } from "./db-config.service";

@Injectable()
export class DbConfigPipe implements PipeTransform {
  constructor(private repository: DbConfigService) {
  }

  transform(key, metadata): Promise<DbConfigEntity | null> {
    return this.repository.config(metadata["data"]);
  }
}
