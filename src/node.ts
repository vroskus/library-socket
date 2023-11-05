// Helpers
import io from 'socket.io';

// Types
import type {
  $Params,
  $Type,
} from './types';

export type $Config = {
  origin?: string | Array<string>;
  port: string;
};

class Server<
C extends $Config,
T extends Record<string, $Type>,
P extends Record<string, Record<string, unknown>>,
> {
  connection: {
    on: (type: $Type, callback: (socket: {
      id: string;
    }) => void) => void;
    listen: (port: number) => void;
    emit: (type: $Type, params: $Params) => void;
  };

  port: number;

  type: T;

  constructor({
    origin,
    port,
  }: C, type: T) {
    this.port = Number(port) || 81;

    // @ts-ignore
    this.connection = io({
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

export default Server;
