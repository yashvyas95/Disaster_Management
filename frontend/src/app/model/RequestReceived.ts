export class RequestReceived
{
    constructor(
        public requestId: number,
        public name: string,
        public natureOfAssistance: string,
        public location: string,
        public resTeamObj: number,
        public status : boolean 
    ){}
}