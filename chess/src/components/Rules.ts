import { PieceType, TeamType, Piece } from "./Chessboard";

export default class Rules{

    tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean{
       //console.log("Checking if tile is occupied"); 
        const piece = boardState.find((p) => p.x === x && p.y === y);

        if(piece){
            //console.log("Tile is occupied");
            return true;
        }
        else{
            //console.log("Tile is not occupied");
            return false;
        }
    }

    tileIsOccupiedByOpponent(x: number, y: number, team: TeamType, boardState: Piece[]): boolean{
        console.log("Checking if tile is occupied by opponent");
        const piece = boardState.find((p) => p.x === x && p.y === y && p.team !== team);

        if(piece){
            console.log("Tile is occupied by opponent");
            return true;
        }
        else{
            console.log("Tile is not occupied by opponent");
            return false;
        }
    }

    isEnPassantMove(px: number, py: number, x: number, y: number, type: PieceType, team: TeamType, boardState: Piece[]){
        const pawnDirection = (team === TeamType.our) ? 1 : -1;
        

        if((x-px === -1 || x-px === 1)&& y-py === pawnDirection){
            const piece = boardState.find((p) => p.x === x && p.y === y - pawnDirection && p.type === PieceType.Pawn && p.team !== team && p.enPassant === true);

            if(piece){
                return true;
            }

        }
        
        return false;
    }

    isValidMove(px: number, py:number , x: number , y: number , type: PieceType, team: TeamType, boardState: Piece[]){
       // console.log("Checking if move is valid");
        //console.log(`previous location: (${px}, ${py})`);
        //console.log(`Piece x: ${x}`); 
        //console.log(`Piece y: ${y}`);
        //console.log(`Piece type: ${type}`);
        //console.log(`Piece team: ${team}`);

        if(type === PieceType.Pawn){
            const specialRow = (team === TeamType.our) ? 1 : 6;
            const pawnDirection = (team === TeamType.our) ? 1 : -1;

            //movement logic for pawns
            if (px === x && py === specialRow && y-py === 2*pawnDirection){
                if(!this.tileIsOccupied(x, y, boardState) && !this.tileIsOccupied(x, y-pawnDirection, boardState)){
                    return true;
                }
            }
            else if (px === x && y-py === pawnDirection){
                    if(!this.tileIsOccupied(x, y, boardState)){
                        return true;
                    }
            }

            //attacking logic for pawns
            else if(x-px === -1 && y-py === pawnDirection){
                console.log("upper / bottom left");
                if(this.tileIsOccupiedByOpponent(x, y, team, boardState)){
                    return true;
                }
            }
            else if(x-px === 1 && y-py === pawnDirection){
                console.log("upper / bottom right");
                if(this.tileIsOccupiedByOpponent(x, y, team, boardState)){
                    return true;
                }
            }
        }

        return false;
    }
}
