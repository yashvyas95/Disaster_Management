// TODO: Socket.IO client not installed - install with: npm install socket.io-client
// import {io} from 'socket.io-client';
import { Observable } from 'rxjs';

export class ChatService {
    private url = 'http://localhost:3000';
    private socket: any;

    constructor() {
        // this.socket = io(this.url);
    }

    public sendMessage(message:any) {
        // this.socket.emit('new-message', message);
    }

    public getMessages = () => {
        return Observable.create((observer:any) => {
            // this.socket.on('new-message', (message:any) => {
            //     observer.next(message);
            // });
        });
    }
}
