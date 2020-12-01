import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function SquarePredefined(props) {
    let cssClassesSelectors = "square predefined " + props.border;
    return (
        <button className={cssClassesSelectors}>
            {props.value}
        </button>
    )
}

function Square(props) {


    let cssClassesSelectors = "square " + props.border;
    return (
        <input 
        type="number" 
        value={props.value} 
        className={cssClassesSelectors}
        onChange={e => props.onChange(props.index, e.target.value)}
        />
    )
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: Array(81).fill(""),
        }
    }

    borders(n){
        let str = "";
        if((n >= 19 && n <= 27) || (n >=46 && n <=54))
            str += "bottom ";

        for(let i = 0; i < 9; i++){
            if(n === 3 + 9*i || n === 6 + 9*i){
                str += " right ";
            }
        }

        return str;
    }

    handleChange = (i , e) => {

        let inpt = e%10;
        if(inpt >= 1 && inpt <= 9 && Number.isInteger(inpt)){
            var boardAux = this.state.board;
            boardAux[i] = e%10;
            this.setState({ board : boardAux});
        }
    };

    renderSquare(i, n) {

        return <Square value = {i} onChange={(a, b) => this.handleChange(a, b)} index={n}  border = {this.borders(n + 1)}  />;
    }

    renderSquarePredefined(i, n) {
        return <SquarePredefined value = {n} border = {this.borders(n + 1)}  />;
    }

    render(){
        let row = [];
        let cell = [];
        
        for(let i = 0; i < 81; i++){
            if(i%4 === 0)
                cell.push(this.renderSquarePredefined(this.state.board[i], i))
            else
                cell.push(this.renderSquare(this.state.board[i], i));
          if((i + 1)%9 === 0){
            row.push(<div  className="board-row" >{cell}</div>);
            cell = [];
          }
        }
  
        return <div  className="board">{row}</div>
    }
}


ReactDOM.render(
    <div className="game"><Board/></div>,
    document.getElementById('root')
);