
import './Chessboard.css';
import Tile from './Tile';


const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8'];

interface Piece{
    image: string;
    x: number;
    y: number;
}

const pieces: Piece[] = [];

for(let i = 0; i < 8; i++){
    pieces.push({image: 'assets/white-pawn.png', x: i, y: 1});
}
for(let i = 0; i < 8; i++){
    pieces.push({image: 'assets/black-pawn.png', x: i, y: 6});
}

for (let i = 0; i < 8; i+=7)
{
    pieces.push({image: 'assets/white-rook.png', x: i, y: 0});
    pieces.push({image: 'assets/black-rook.png', x: i, y: 7});
    
}

for (let i = 1; i < 7; i+=5)
{
    pieces.push({image: 'assets/white-knight.png', x: i, y: 0});
    pieces.push({image: 'assets/black-knight.png', x: i, y: 7});
}

for (let i = 2; i < 6; i+=3)
{
    pieces.push({image: 'assets/white-bishop.png', x: i, y: 0});
    pieces.push({image: 'assets/black-bishop.png', x: i, y: 7});
}

pieces.push({image: 'assets/white-queen.png', x: 3, y: 0});
pieces.push({image: 'assets/black-queen.png', x: 3, y: 7});

pieces.push({image: 'assets/white-king.png', x: 4, y: 0});
pieces.push({image: 'assets/black-king.png', x: 4, y: 7});

export default function Chessboard()
{
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

            board.push(<Tile image={image} number={number}/>);
        }
    }
    return <div id="chessboard">{board}</div>
}