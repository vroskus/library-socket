// Helpers
import {
  Server,
} from 'socket.io';

// Types
export type $Config = {
  origin?: Array<string> | string;
  port: string;
};

const defaultPort: number = 81;

class SocketServer<
C extends $Config,
T extends Record<string, string>,
P extends Record<string, Record<string, unknown>>,
> {
  connection: Server;

  port: number;

  type: T;

  constructor({
    origin,
    port,
  }: C, type: T) {
    this.port = Number(port) || defaultPort;

    this.connection = new Server({
      cors: {
        methods: ['GET', 'POST'],
        origin,
      },
    });

    this.connection.on(
      'connection',
      (socket) => {
        console.info(
          'Socket new connection',
          socket.id,
        );
      },
    );

    this.type = type;
  }

  listen() {
    this.connection.listen(this.port);

    console.info(
      'Socket is listening on',
      this.port,
    );
  }

  emit<SET extends T[keyof T]>({
    params,
    type,
  }: {
    params: P[SET];
    type: SET;
  }) {
    console.info(
      'Socket emit',
      type,
      params,
    );

    this.connection.emit(
      type,
      params,
    );
  }
}

export default SocketServer;
