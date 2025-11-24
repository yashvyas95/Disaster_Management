
export enum Messagetype{
    JOIN,LEAVE,CHAT
}

export class chatMessage{
    messagetype : Messagetype;
    content : string;
    sender : string;
   constructor(messageType:Messagetype,content:string,sender:string){
        this.messagetype=messageType,
        this.content = content;
        this.sender = sender;
    }
        
}

