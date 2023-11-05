// Helpers
import io from 'socket.io-client';

// Types
import type {
  $Action,
  $Type,
} from './types';

export type $Config = {
  host: string;
};

class Client<
C extends $Config,
T extends Record<string, $Type>,
P extends Record<string, $Action>,
> {
  host: string;

  connection: {
    id: string;
    on: (type: $Type, action: $Action) => void;
    removeListener: (type: $Type, action: $Action) => void;
  };

  type: T;

  constructor({
    host,
  }: C, type: T) {
    this.host = host;

    if (this.host !== '') {
      this.connection = io(host);

      this.connection.on(
        'connect',
        () => {
        // eslint-disable-next-line no-console
          console.info(
            'Socket new connection',
            this.connection.id,
          );
        },
      );

      this.connection.on(
        'connect_error',
        (error: Error) => {
        // eslint-disable-next-line no-console
          console.info(
            'Socket connection failed',
            error.message,
          );
        },
      );
    }

    this.type = type;
  }

  on<SET extends T[keyof T]>({
    action,
    type,
  }: {
    action: (params: P[SET]) => unknown;
    type: SET;
  }) {
    if (this.host !== '') {
      this.connection.on(
        type,
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
    if (this.host !== '') {
      this.connection.removeListener(
        type,
        action,
      );
    }
  }
}

export default Client;
