import { Socket as SocketIOSocket } from "socket.io";

export interface IUser {
  id: string;
  username: string;
  email: string;
  avatar?: string | undefined;
}

export interface ISocketData {
  userId: string;
  username: string;
  roomCode?: string;
  role?: 'host' | 'player';
}

export interface IAuthenticatedSocket extends SocketIOSocket {
  user?: IUser;
  roomCode?: string;
}

export interface IServerToClientEvents {
  "room:created": (data: { roomCode: string; hostId: string }) => void;
  "room:joined": (data: { roomCode: string; players: IPlayer[] }) => void;
  "room:left": (data: { userId: string; playersCount: number }) => void;
  "player:joined": (data: { player: IPlayer; playersCount: number }) => void;
  "player:left": (data: { userId: string; username: string }) => void;

  "game:started": (data: { startTime: number }) => void;
  "game:question": (data: IQuestionData) => void;
  "game:answer:received": (data: {
    success: boolean;
    timeSpent: number;
  }) => void;
  "game:results": (data: IQuestionResults) => void;
  "game:leaderboard": (data: ILeaderboardUpdate) => void;
  "game:ended": (data: IGameEndData) => void;

  error: (data: { message: string; code?: string }) => void;
  notification: (data: {
    message: string;
    type: "info" | "success" | "warning";
  }) => void;
}

export interface IClientToServerEvents {
  "room:create": (
    data: { quizId: string },
    callback: (response: IResponse) => void
  ) => void;
  "room:join": (
    data: { roomCode: string },
    callback: (response: IResponse) => void
  ) => void;
  "room:leave": (callback: (response: IResponse) => void) => void;

  "game:start": (callback: (response: IResponse) => void) => void;
  "game:answer": (
    data: { questionIndex: number; answer: number; timeSpent: number },
    callback: (response: IResponse) => void
  ) => void;
  "game:next": (callback: (response: IResponse) => void) => void;

  "chat:message": (
    data: { message: string },
    callback: (response: IResponse) => void
  ) => void;
}
