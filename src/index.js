import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Solver from './Solver.js';

function SquarePredefined(props) {
    let cssClassesSelectors = "square predefined " + props.border;
    return (
        /*<button className={cssClassesSelectors}>
            {props.value}
        </button>*/
        <input 
        type="button" 
        value={props.value} 
        className={cssClassesSelectors}
        />
    )
}

function Square(props) {

    let cssClassesSelectors = "square " + props.border + props.color;
    //console.log(cssClassesSelectors);
    return (
        <input 
        type="text"
        value={props.value} 
        className={cssClassesSelectors}
        onChange={e => props.onChange(props.index, e.target.value)}
        />
    )
}

class Board extends React.Component {

    constructor(props) {
        super(props);
        let slv = new Solver();

        let aux = slv.getRandomSetUp();
        let markaux = aux.map(x => x === 0 ? true: false);
        let colTemp =  slv.getCols(aux);
        let rowTemp = slv.getRows(aux);
        let gridTemp = slv.getGrid(aux);
        this.state = {
            solver: new Solver(),
            board:aux.map( x => x === 0? "": x),
            mark: markaux,
            col: colTemp,
            row: rowTemp,
            grid: gridTemp,
        }
    }

    set(rw, cl, i ){
        let gridtemp = this.state.grid.slice();
        let rowtemp = this.state.row.slice();
        let coltemp = this.state.col.slice();
        let boardtemp = this.state.board.slice();
        boardtemp[rw * 9 + cl] = i;
        //window.setTimeout(boardtemp[rw * 9 + cl] = i, 1000000000000000000);

        gridtemp[this.state.solver.belongsTo(rw * 9 + cl)][i] = true;
        rowtemp[rw][i] = true;
        coltemp[cl][i] = true;
        this.setState({grid: gridtemp, row: rowtemp, col: coltemp, board: boardtemp});

        //this.handleChange(rw*9 + cl, i);
        //setTimeout( () => console.log(i), 100);
    }

    reset(rw, cl, i ){
        let gridtemp = this.state.grid.slice();
        let rowtemp = this.state.row.slice();
        let coltemp = this.state.col.slice();
        let boardtemp = this.state.board.slice();
        boardtemp[rw * 9 + cl] = "";
        gridtemp[this.state.solver.belongsTo(rw * 9 + cl)][i] = false;
        rowtemp[rw][i] = false;
        coltemp[cl][i] = false;
        this.setState({grid: gridtemp, row: rowtemp, col: coltemp, board: boardtemp});
    }

    solveRecursion(rw, cl){
        if((cl + 1) % 9 === 0){
            return this.solve(rw + 1, (cl + 1)%9);
        }else{
            return this.solve(rw, (cl + 1)%9);
        }
    }


    solve(rw, cl){
        
        if(rw === 9 && cl === 0){
            return true;
        }

        if(!this.state.mark[rw*9 + cl]){ // predefined cell
            //console.log(rw*9 + cl);
            if(this.solveRecursion(rw, cl))
                return true;

            return false;
        }


        for(let i = 1; i <= 9; i++){
            if(!this.state.row[rw][i] && !this.state.col[cl][i] && !this.state.grid[this.state.solver.belongsTo(rw * 9 + cl)][i]){
                this.set(rw, cl, i);

                if(this.solveRecursion(rw, cl))
                    return true;

                this.reset(rw, cl, i);
            }
        }
        return false;
    }

    solveY(){
        console.log("abcde");
        if(this.solve(0, 0));
            console.log("foi");
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

        if(isNaN(e)){
            var boardAux = this.state.board;

            if(boardAux[i] != "")
                boardAux[i] = this.renderSquareGreen(boardAux[i]%10, i);
            this.setState({board: boardAux});

        }
        let inpt = e%10;
        if(inpt >= 1 && inpt <= 9 && Number.isInteger(inpt)){
            var boardAux = this.state.board;
            boardAux[i] = e%10;
            this.setState({ board : boardAux});
            this.renderSquareGreen(e, i);
        }
    };

    isPredefined(i){
        if(!this.state.mark[i])
            return this.renderSquarePredefined(this.state.board[i], i);
        else
            return this.renderSquare(this.state.board[i], i);
    }

    renderSquareGreen(i, n) {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        return <Square value = {i} onChange={(a, b) => this.handleChange(a, b)} index={n} color={" inserted"} border = {this.borders(n + 1)}  />;
    }

    renderSquare(i, n) {
        return <Square value = {i} onChange={(a, b) => this.handleChange(a, b)} index={n}  color={""} border = {this.borders(n + 1)}  />;
    }

    renderSquarePredefined(i, n) {
        return <SquarePredefined value = {i} border = {this.borders(n + 1)}  />;
    }
    
    render(){
        let row = [];
        let cell = [];
        
        for(let i = 0; i < 81; i++){
            cell.push(this.isPredefined(i));
          if((i + 1)%9 === 0){
            row.push(<div  className="board-row" >{cell}</div>);
            cell = [];
          }
        }
  
        //

        return <div  className="board">{row}<button className="solveButton" onClick={() => setTimeout(() => this.solveY(), 1000)}></button></div>
    }
}


ReactDOM.render(
    <div className="game"><Board/></div>,
    document.getElementById('root')
);