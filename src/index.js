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

    let cssClassesSelectors = "square " + props.border;// + props.color;
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
            steps: [],
            index:0,
            interval: clearInterval,
        }
    }

    set(rw, cl, i ){
        let gridtemp = this.state.grid;
        let rowtemp = this.state.row;
        let coltemp = this.state.col;
        let boardtemp = this.state.board;
        boardtemp[rw * 9 + cl] = i;
        gridtemp[this.state.solver.belongsTo(rw * 9 + cl)][i] = true;
        rowtemp[rw][i] = true;
        coltemp[cl][i] = true;
        let stepsAux = this.state.steps;
        stepsAux.push({"row":rw, "col": cl, "value": i});
        this.setState({grid: gridtemp, row: rowtemp, col: coltemp, board: boardtemp, steps: stepsAux});
    }

    reset(rw, cl, i ){
        let gridtemp = this.state.grid;
        let rowtemp = this.state.row;
        let coltemp = this.state.col;
        let boardtemp = this.state.board;
        boardtemp[rw * 9 + cl] = "";
        gridtemp[this.state.solver.belongsTo(rw * 9 + cl)][i] = false;
        rowtemp[rw][i] = false;
        coltemp[cl][i] = false;
        let stepsAux = this.state.steps;
        stepsAux.push({"row":rw, "col": cl, "value": "" })
        this.setState({grid: gridtemp, row: rowtemp, col: coltemp, board: boardtemp, steps: stepsAux});
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

    sv(){
        let ind = this.state.index;
        if(ind == this.state.steps.length){
            clearInterval(this.state.interval);
            //this.setState({steps: [], index: 0});
            return;
        }

        let boardtemp = this.state.board;
        let x = this.state.steps[ind];
        boardtemp[x.row*9 + x.col] = x.value;
        this.setState({board: boardtemp, index: ind + 1});
    }

    solveY(){
        console.log("abcde");
        if(this.solve(0, 0));
            console.log("foi");
        let boardtemp = this.state.board;
        for(let i = 0; i < 81; i++){
            if(this.state.mark[i])
                boardtemp[i] = "";
        }
        this.setState({board: boardtemp});

        let ind = this.state.index;
        ind = 0;
        this.setState({index: ind});

        this.state.interval = setInterval( () => {this.sv()}, 100);

        console.log("consegui");
    }   

    borders(n){
        let str = "";
        if((n >= 19 && n <= 27) || (n >=46 && n <=54))
            str += " bottom ";

        for(let i = 0; i < 9; i++)
            if(n === 3 + 9*i || n === 6 + 9*i)
                str += " right ";
        return str;
    }

    handleChange = (i , e) => {

        if(isNaN(e)){
            var boardAux = this.state.board;

            if(boardAux[i] != "")
                boardAux[i] = boardAux[i]%10;
            this.setState({board: boardAux});

        }
        let inpt = e%10;
        if(inpt >= 1 && inpt <= 9 && Number.isInteger(inpt)){
            var boardAux = this.state.board;
            boardAux[i] = e%10;
            this.setState({ board : boardAux});
        }
    };

    isPredefined(i){
        if(!this.state.mark[i])
            return this.renderSquarePredefined(this.state.board[i], i);
        else
            return this.renderSquare(this.state.board[i], i);
    }

    renderSquare(i, n) {
        return <Square value = {i} onChange={(a, b) => this.handleChange(a, b)} index={n} border = {this.borders(n + 1)}  />;
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

        return <div  className="board">{row}<button className="solveButton" onClick={() => this.solveY()}></button></div>
    }
}


ReactDOM.render(
    <div className="game"><Board/></div>,
    document.getElementById('root')
);