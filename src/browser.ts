// Global Types
import type {
  Socket,
} from 'socket.io-client';

// Helpers
import io from 'socket.io-client';

// Types
import type {
  $Type,
} from './types';

export type $Config = {
  host: string;
};

type $Connection = Socket;

class SocketClient<
C extends $Config,
T extends Record<string, $Type>,
P extends Record<string, Record<string, unknown>>,
> {
  connection: $Connection | null;

  type: T;

  constructor({
    host,
  }: C, type: T) {
    this.connection = null;

    this.type = type;

    this.init(host);
  }

  init(host: string) {
    if (host !== '') {
      this.connection = io(host) as unknown as $Connection;

      this.connection.on(
        'connect',
        () => {
          if (this.connection !== null) {
            // eslint-disable-next-line no-console
            console.info(
              'Socket new connection',
              this.connection.id,
            );
          }
        },
      );

      this.connection.on(
        'connect_error',
        (err) => {
          const error = err as Error | undefined;

          if (error) {
            // eslint-disable-next-line no-console
            console.info(
              'Socket connection failed',
              error.message,
            );
          }
        },
      );
    }
  }

  on<SET extends T[keyof T]>({
    action,
    type,
  }: {
    action: (params: P[SET]) => unknown;
    type: SET;
  }) {
    if (this.connection !== null) {
      this.connection.on(
        type,
        // @ts-expect-error no idea
        action,
      );
    }
  }

  off<SET extends T[keyof T]>({
    action,
    type,
  }: {
    action: (params: P[SET]) => unknown;
    type: SET;
  }) {
    if (this.connection !== null) {
      this.connection.removeListener(
        type,
        // @ts-expect-error no idea
        action,
      );
    }
  }
}

export default SocketClient;
