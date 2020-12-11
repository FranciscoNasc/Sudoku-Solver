import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Solver from './Solver.js';

function SquarePredefined(props) {
    let cssClassesSelectors = "square predefined " + props.border;
    return (
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
        type="number"
        value={props.value} 
        className={cssClassesSelectors}
        onChange={e => props.onChange(props.index, e.target.value)}
        />
    )
}

function DelayInput(props) {
    return (
        <div className="speed">
            <input 
            type="number"
            value={props.value}
            className="delay-input"
            onChange={e => props.onChange(e.target.value)}
            />
            <span className="description">
                Intervalo entre ações em ms
            </span>
        </div>
    )
}

class SudokuSolver extends React.Component {

    constructor(props) {
        super(props);
        this.resetBoard();
    }

    resetBoard(){

        console.log("aaabbb");
        let slv = new Solver();

        let aux = slv.getRandomSetUp();

        console.log(aux);

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
            delayTime: 100,
            isCustom: false,
        }
        console.log(this.state.board);
    }

    getNewBoard(custom){
        let slv = new Solver(), aux = [];
        if(!custom)
            aux = slv.getRandomSetUp();
        else    
            aux = Array(81).fill(0);
        
        let markaux = aux.map(x => x === 0 ? true: false);
        let colTemp =  slv.getCols(aux);
        let rowTemp = slv.getRows(aux);
        let gridTemp = slv.getGrid(aux);

        this.setState({
            solver: new Solver(),
            board:aux.map( x => x === 0? "": x),
            mark: markaux,
            col: colTemp,
            row: rowTemp,
            grid: gridTemp,
            steps: [],
            index:0,
            isCustom: custom,
        })
    }

    setDelay(time){
        this.setState({delayTime: time});
    }

    handleDelayChange = (delay) => {
        console.log(delay);
        if(delay === "")
            delay = 0
        this.setState({delayTime: delay});
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
        if(this.state.steps.length < 100000){
            stepsAux.push({"row":rw, "col": cl, "value": i});
        }else{
            console.log("resposta grande demais");
        }
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

    isEmpty(rw, cl, i){
        return (!this.state.row[rw][i] && !this.state.col[cl][i] && !this.state.grid[this.state.solver.belongsTo(rw * 9 + cl)][i]);
    }

    solveRecursion(rw, cl){
        if((cl + 1) % 9 === 0)
            return this.solve(rw + 1, (cl + 1)%9);
    
        return this.solve(rw, (cl + 1)%9);
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
            if(this.isEmpty(rw, cl, i)){
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
        if(ind === this.state.steps.length){
            clearInterval(this.state.interval);
            return;
        }

        let boardtemp = this.state.board;
        let x = this.state.steps[ind];
        boardtemp[x.row*9 + x.col] = x.value;
        this.setState({board: boardtemp, index: ind + 1});
    }

    solveY(){
        if(this.solve(0, 0)) // handle the failure scenarios
            console.log(this.state.steps.length);
        else    
            console.log("n foi");
        let boardtemp = this.state.board;
        for(let i = 0; i < 81; i++){
            if(this.state.mark[i])
                boardtemp[i] = "";
        }
        this.setState({board: boardtemp,index: 0});
        clearInterval(this.state.interval);
        this.state.interval = setInterval( () => {this.sv()}, this.state.delayTime);
    }   

    borders(n){
        let str = "";
        if((n >= 19 && n <= 27) || (n >=46 && n <=54))
            str += " bottom ";
        if((n >= 28 && n <= 36) || (n >=55 && n <=63))
            str += " top ";
        for(let i = 0; i < 9; i++)
            if(n === 3 + 9*i || n === 6 + 9*i)
                str += " right ";
        for(let i = 0; i < 9; i++)
            if(n === 4 + 9*i || n === 7 + 9*i)
                str += " left ";
        return str;
    }

    isValid(i, n){
        return (!this.state.row[Math.floor(i/9)][n] && !this.state.col[i%9][n] && !this.state.grid[this.state.solver.belongsTo(i)][n]);
    }

    handleChange = (i , e) => {

        console.log(e);

        let inpt = e%10;

        if(this.state.isCustom &&  inpt >= 1 && inpt <= 9 && Number.isInteger(inpt)){
            // if(!this.state.row[Math.floor(i/9)][i] && !this.state.col[cl][i] && !this.state.grid[this.state.solver.belongsTo(rw * 9 + cl)][i]);
            let boardAux = this.state.board;
            e %=10;
            if(this.isValid(i, e)){
                let markAux = this.state.mark;
                boardAux[i] = e%10;
                markAux[i] = boardAux[i] === "" ? true: false;

                this.setState({board: boardAux, mark: markAux,
                    row: this.state.solver.getRows(boardAux),
                    col: this.state.solver.getCols(boardAux),
                    grid: this.state.solver.getGrid(boardAux)
                });
                return ;
            }else{
                boardAux[i] = "";
                this.setState({board: boardAux});
                console.log(e)
            }
        }           

        if(isNaN(e)){
            var boardAux = this.state.board;

            if(boardAux[i] != "")
                boardAux[i] = boardAux[i]%10;
            this.setState({board: boardAux});

        }
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
    
    displayBoard(){
        let row = [];
        let cell = [];
        
        for(let i = 0; i < 81; i++){
            cell.push(this.isPredefined(i));
          if((i + 1)%9 === 0){
            row.push(<div  className="board-row" >{cell}</div>);
            cell = [];
          }
        }
        return row;
    }

    customBoard(){
        this.getNewBoard(true);
    }

    render(){
        return (
        <div className="game">
            <div className="board">
                {this.displayBoard()}
                <div className="form-div">
                    <button className="btn get-random-table" onClick={() => this.getNewBoard(false)}>Tabuleiro aleatório</button>
                    <button className="btn custom-board" onClick={() => this.customBoard()} >Crie seu tabuleiro</button>
                    <DelayInput value={this.state.delayTime} className="delay-input" onChange={(a) => this.handleDelayChange(a)}></DelayInput>
                    <button className="btn solve-button" onClick={() => this.solveY()}>Gerar solução</button>
                </div>
            </div>

        </div>
        )
    }
}


ReactDOM.render(
    <SudokuSolver/>,
    document.getElementById('root')
);