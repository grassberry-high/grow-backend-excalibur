import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketIOMessengerService {

  sendLog(type, payload) {
    // TODO
  }

  sendMessage() {
    return;
  }
  
  initSocketListener(io) {
    return;
  }

}
