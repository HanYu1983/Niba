export default interface IUnit{
    key:string;
    position: number[];
    type: string;
    state: {
        robot: string
        pilot: string
        hp: number
        mp: number
        component: any[]
        weapon: any[]
        tag: any[]
    }
}