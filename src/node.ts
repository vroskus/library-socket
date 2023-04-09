// Helpers
import io from 'socket.io';

// Types
export type $Config = {
  origin?: string | Array<string>;
  port: string;
};

class Server<C extends $Config, T extends Record<string, any>, P extends Record<string, any>> {
  connection: {
    on: (arg0: string, arg1: (arg0: {
      id: string;
    }) => void) => void;
    listen: (arg0: number) => void;
    emit: (arg0: string, arg1: Record<string, any>) => void;
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
