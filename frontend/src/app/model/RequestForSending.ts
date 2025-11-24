export class RequestForSending
{
    constructor(
        public victimName: string,
        public victimPhone: string,
        public location: string,
        public latitude: number,
        public longitude: number,
        public emergencyType: string,
        public priority: string,
        public description: string
    ){}
}
