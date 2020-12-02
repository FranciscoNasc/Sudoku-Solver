
export default class Solver{

    constructor(){   
        this.setup = [
            [ 0, 6, 0, 1, 0, 4, 0, 5, 0, 0, 0, 8, 3, 0, 5, 6, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 8, 0, 0, 4, 0, 7, 0, 0, 6, 0, 0, 6, 0, 0, 0, 3, 0, 0, 7, 0, 0, 9, 0, 1, 0, 0, 4, 5, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 7, 2, 0, 6, 9, 0, 0, 0, 4, 0, 5, 0, 8, 0, 7, 0],
            [ 0, 1, 7, 3, 0, 9, 0, 0, 2, 0, 9, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 2, 0, 0, 7, 0, 0, 0, 0, 6, 8, 0, 4, 0, 7, 3, 0, 0, 0, 0, 8, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 9, 0, 3, 0, 0, 1, 0, 8, 6, 4, 0],
            [ 0, 0, 0, 0, 0, 2, 5, 1, 4, 0, 9, 2, 0, 4, 0, 0, 8, 0, 0, 6, 0, 7, 0, 0, 3, 0, 0, 0, 0, 6, 0, 0, 9, 0, 0, 0, 0, 7, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 8, 6, 0, 7, 0, 0, 6, 0, 3, 0, 0, 7, 0, 5, 1, 7, 8, 0, 0, 0, 0, 4, 3, 0, 5, 0, 0, 0, 0, 0, 9, 0, 0],
            [ 0, 0, 1, 6, 0, 0, 0, 0, 0, 0, 0, 3, 7, 0, 0, 0, 0, 0, 4, 5, 0, 0, 0, 9, 3, 0, 0, 3, 2, 0, 0, 0, 6, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 5, 0, 0, 0, 4, 1, 0, 0, 4, 1, 0, 0, 0, 3, 9, 0, 0, 0, 0, 0, 2, 7, 0, 0, 0, 0, 0, 0, 0, 8, 1, 0, 0]
        ];

        this.grid = [0, 0, 0, 1, 1, 1, 2, 2, 2, 0, 0, 0, 1, 1, 1, 2, 2, 2, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 3, 3, 3, 4, 4, 4, 5, 5, 5, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 6, 6, 6, 7, 7, 7, 8, 8, 8, 6, 6, 6, 7, 7, 7, 8, 8, 8]
    }

    generateRandom(){
        return Math.floor(Math.random() * this.setup.length);
    }

    getRandomSetUp(){
        return this.setup[this.generateRandom()];
    }

    getCols(setp){
        var ans = [];

        for(let i = 0; i < 9; i++){
            var aux = Array(10).fill(false);
            for(let j = 0; j < 9; j++){
                let n = setp[i + j*9]; // maybe delete this "-1"
                if(n !== "" && n !== 0){
                    aux[n]= true;
                }else{
                    aux[n]= false;
                }
            }
            ans.push(aux);
        }
        console.log(ans);   
        return ans;
    }

    getRows(setp){
        var ans = [];

        for(let i = 0; i < 9; i++){
            var aux = Array(10).fill(false);
            for(let j = 0; j < 9; j++){
                let n = setp[i*9 + j]; // maybe delete this "-1"
                if(n !== "" && n !== 0){
                    aux[n]= true;
                }else{
                    aux[n]= false;
                }
            }
            ans.push(aux);
        }

        console.log("aqui");
        console.log(ans);
        return ans;
    }   

    belongsTo(n){
        return this.grid[n];
    }

    getGrid(setp){

        var aux = [];
        for(let i = 0; i < 9; i++)
            aux.push(Array(10).fill(false));
        var ct = 0;
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                let n = setp[i*9 + j];
                if(n !== "" && n !== 0){
                    ct++;
                    aux[this.grid[i*9 + j]][n] = true;
                }
            }
        }

        return (aux);
    }
}