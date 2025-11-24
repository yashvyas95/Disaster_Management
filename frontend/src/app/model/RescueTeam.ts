export class RescueTeam{
    constructor(
        public members : number[],
        public requestIdAssigned: number,
        public location: string,
        public nature: string,
        public status: string 
    ){}
}