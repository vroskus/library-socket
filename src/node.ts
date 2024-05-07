// Helpers
import {
  Server,
} from 'socket.io';

// Types
import type {
  $Type,
} from './types';

export type $Config = {
  origin?: Array<string> | string;
  port: string;
};

class SocketServer<
C extends $Config,
T extends Record<string, $Type>,
P extends Record<string, Record<string, unknown>>,
> {
  connection: Server;

  port: number;

  type: T;

  constructor({
    origin,
    port,
  }: C, type: T) {
    this.port = Number(port) || 81;

    this.connection = new Server({
      cors: {
        methods: ['GET', 'POST'],
        origin,
      },
    });

    this.connection.on(
      'connection',
      (socket) => {
        // eslint-disable-next-line no-console
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

    // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
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
