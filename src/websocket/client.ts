import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { UsersService } from "../services/UsersService";
import { MessagesService } from "../services/MessagesService";
import { User } from "../entities/User";

interface IParams {
  text: string;
  email: string;
}

io.on("connect", (socket) => {
  const connectionsService = new ConnectionsService();
  const usersService = new UsersService();
  const messagesService = new MessagesService();
  socket.on("client_first_access", async (params: IParams) => {
    const socket_id = socket.id;
    const { text, email } = params;
    let user: User = null;

    const userExists = await usersService.findByEmail(email);

    if (!userExists) {
      user = await usersService.create(email);
    } else {
      user = userExists;
    }
    const connection = await connectionsService.findByUser(user);
    if (!connection) {
      await connectionsService.create({
        socket_id,
        user,
      });
    } else {
      connection.socket_id = socket_id;
      await connectionsService.create(connection);
    }
    await messagesService.create({ text, user_id: user.id });
  });
});
