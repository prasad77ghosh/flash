import { ServerOptions } from 'socket.io';

export const socketConfig: Partial<ServerOptions> = {
  cors: {
    origin: [
      'https://num-tree-frontend.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    // origin: "*",
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
  maxHttpBufferSize: 1e6,
  allowEIO3: true,
  cookie: {
    name: 'quiz-socket',
    httpOnly: true,
    sameSite: 'strict',
  },
};

export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  ERROR: 'error',

  ROOM_CREATE: 'room:create',
  ROOM_CREATED: 'room:created',
  ROOM_JOIN: 'room:join',
  ROOM_JOINED: 'room:joined',
  ROOM_LEAVE: 'room:leave',
  ROOM_LEFT: 'room:left',
  PLAYER_JOINED: 'player:joined',
  PLAYER_LEFT: 'player:left',

  GAME_START: 'game:start',
  GAME_STARTED: 'game:started',
  GAME_QUESTION: 'game:question',
  GAME_ANSWER: 'game:answer',
  GAME_ANSWER_RECEIVED: 'game:answer:received',
  GAME_RESULTS: 'game:results',
  GAME_NEXT: 'game:next',
  GAME_LEADERBOARD: 'game:leaderboard',
  GAME_ENDED: 'game:ended',

  CHAT_MESSAGE: 'chat:message',
  NOTIFICATION: 'notification',
} as const;

export const REDIS_KEYS = {
  ROOM: (roomCode: string) => `room:${roomCode}`,
  ROOM_PLAYERS: (roomCode: string) => `room:${roomCode}:players`,
  USER_SOCKET: (userId: string) => `user:${userId}:socket`,
  ACTIVE_ROOMS: 'rooms:active',
  GAME_STATE: (roomCode: string) => `game:${roomCode}:state`,
} as const;

export const ROOM_CONSTANTS = {
  MAX_PLAYERS: 50,
  CODE_LENGTH: 6,
  ROOM_TTL: 86400,
  ANSWER_GRACE_PERIOD: 1000,
} as const;
