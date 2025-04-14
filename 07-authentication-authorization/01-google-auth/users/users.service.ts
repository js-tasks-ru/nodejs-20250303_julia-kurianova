import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOneByName(username: string) {
    return await this.userRepository.findOneBy({ displayName: username });
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  create(payload: Partial<User>) {
    const user = new User();
    user.id = payload.id;
    user.displayName = payload.displayName;
    user.avatar = payload.avatar;
    return this.userRepository.save(user);
  }

  async saveRefreshToken(id: string, refreshToken: string) {
    await this.userRepository.update(id, {
      refreshToken: refreshToken,
    });
  }
}
