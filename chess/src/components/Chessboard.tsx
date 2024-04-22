
import { act } from 'react-dom/test-utils';
import './Chessboard.css';
import Tile from './Tile';
import { useEffect, useRef, useState } from 'react';
import Rule from './Rules';


const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8'];

export interface Piece{
    image: string;
    x: number;
    y: number;
    type: PieceType;
    team: TeamType;
}

export enum PieceType{
    Pawn,
    Rook,
    Knight,
    Bishop,
    Queen,
    King 
}

export enum TeamType{
   opponent,
   our 
}

const initialBoardState: Piece[] = [];

for (let p=0; p<2; p++)
    {
        const teamType = p === 0 ? TeamType.our: TeamType.opponent;
        const type = (teamType === TeamType.our) ? 'white' : 'black';
        const y = (teamType === TeamType.our) ? 0 : 7;

        initialBoardState.push({image: `assets/${type}-rook.png`, x: 0, y, type: PieceType.Rook, team: teamType});
        initialBoardState.push({image: `assets/${type}-rook.png`, x: 7, y, type: PieceType.Rook, team: teamType});
        initialBoardState.push({image: `assets/${type}-knight.png`, x: 1, y, type: PieceType.Knight, team: teamType});
        initialBoardState.push({image: `assets/${type}-knight.png`, x: 6, y, type: PieceType.Knight, team: teamType});
        initialBoardState.push({image: `assets/${type}-bishop.png`, x: 2, y, type: PieceType.Bishop, team: teamType});
        initialBoardState.push({image: `assets/${type}-bishop.png`, x: 5, y, type: PieceType.Bishop, team: teamType});
        initialBoardState.push({image: `assets/${type}-queen.png`, x: 3, y, type: PieceType.Queen, team: teamType});
        initialBoardState.push({image: `assets/${type}-king.png`, x: 4, y, type: PieceType.King, team: teamType});
        
    }

for(let i = 0; i < 8; i++){
    initialBoardState.push({image: 'assets/white-pawn.png', x: i, y: 1, type: PieceType.Pawn, team: TeamType.our});
    initialBoardState.push({image: 'assets/black-pawn.png', x: i, y: 6, type: PieceType.Pawn, team: TeamType.opponent});
}

export default function Chessboard()
{
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const chessboardref = useRef<HTMLDivElement>(null);
    const rule = new Rule();

    function grabPiece(e: React.MouseEvent)
    {
        const element = e.target as HTMLElement;
        const chessboard = chessboardref.current;
        if(element.classList.contains('chess-piece') && chessboard)
        {
            setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 75));
            setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 600) / 75)));
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            element.style.position = 'absolute';
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            setActivePiece(element);
        }
    
    }

    function movePiece(e: React.MouseEvent)
    {
        const chessboard = chessboardref.current;
        if(activePiece && chessboard)
        {
            const minX = chessboard.offsetLeft-25;
            const minY = chessboard.offsetTop-25;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            activePiece.style.position = 'absolute';

            //Making sure pieces stay within the board
            if (x < minX)
                {
                    activePiece.style.left = `${minX}px`;
                }
            else if (x > maxX)
                {
                    activePiece.style.left = `${maxX}px`;
                }
            else{
                activePiece.style.left = `${x}px`;
            }
            if (y < minY)
                {
                    activePiece.style.top = `${minY}px`;
                }
            else if (y > maxY)
                {
                    activePiece.style.top = `${maxY}px`;
                }
            else{
                activePiece.style.top = `${y}px`;
            }
        }
    }

    function dropPiece(e: React.MouseEvent)
    {
        const chessboard = chessboardref.current;
        if(activePiece && chessboard)
        {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / 75);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 600) / 75));

            const currentPiece = pieces.find(p => p.x === gridX && p.y === gridY);
            const attackedPiece = pieces.find(p => p.x === x && p.y === y);

            if (currentPiece){
                const isValidMove = rule.isValidMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces);

                if (isValidMove){
                    //move piece to new position

                    const updatedPieces = pieces.reduce((results,piece) => {
                        if (piece.x === gridX && piece.y === gridY){
                            piece.x = x;
                            piece.y = y;
                            results.push(piece);
                        } else if (!(piece.x === x && piece.y === y)){
                            results.push(piece);
                        }
                        

                    return results;
                    }, [] as Piece[]);

                    setPieces(updatedPieces);

                }
                else{
                    //reset piece to original position
                    activePiece.style.position = 'relative';
                    activePiece.style.removeProperty('top');
                    activePiece.style.removeProperty('left');
                }
            }

            //console.log(currentPiece);
            //console.log(attackedPiece)

            setActivePiece(null); 
        }

    }

    let board = [];
    for (let j = verticalAxis.length-1; j >= 0; j--)
    {
        for (let i = 0; i < horizontalAxis.length; i++)
        {
            const number = i + j +2;
            let image = undefined;

            pieces.forEach(p => {
                if (p.x === i && p.y === j)
                    image = p.image;
            })

            board.push(<Tile key={`${j},${i}`} image={image} number={number}/>);
        }
    }
    return(
        <div 
            onMouseMove={(e) => movePiece(e)}
            onMouseDown={(e) => grabPiece(e)}
            onMouseUp = {(e) => dropPiece(e)}
            id="chessboard"
            ref={chessboardref}
            >{board}
        </div>
    );
}