import { Time } from "@angular/common";

export class ChatMessageDto {
    channel: string;
    sender: string;
    timestamp: string;
    content : string;
    receiver : string;
    constructor( channel:string,timestamp:string,sender:string,content:string,receiver : string,){
        this.channel = channel;
        this.sender = sender;
        this.content  = content;
        this.timestamp = timestamp;
        this.receiver = receiver;
    }
}