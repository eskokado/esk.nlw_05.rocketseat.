import { getCustomRepository, Repository } from "typeorm";
import { Connection } from "../entities/Connection";
import { User } from "../entities/User";
import { ConnectionsRepository } from "../repositories/ConnectionsRepository";

interface IConnectionCreate {
  socket_id: string;
  user: User;
  admin_id?: string;
  id?: string;
}

class ConnectionsService {
  private connectionsRepository: Repository<Connection>;

  constructor() {
    this.connectionsRepository = getCustomRepository(ConnectionsRepository);
  }

  async create({ socket_id, user, admin_id, id }: IConnectionCreate) {
    const connection = this.connectionsRepository.create({
      socket_id,
      user,
      admin_id,
      id,
    });

    await this.connectionsRepository.save(connection);

    return connection;
  }

  async findByUser(user: User) {
    const connection = await this.connectionsRepository.findOne({
      user,
    });
    return connection;
  }
}

export { ConnectionsService };
