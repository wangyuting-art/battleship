var view={
    displayMessage:function(msg){
        var messageArea =document.getElementById("messageArea");
        messageArea.innerHTML=msg;
    },
    displayHit:function(location){
        var cell=document.getElementById(location);
        cell.setAttribute("class","hit");     
    },
    displayMiss:function(location){
        var cell=document.getElementById(location);
        cell.setAttribute("class","miss");  
    }
};
// view.displayHit("00");
// view.displayMessage("Tap Tap");

var model={
    boardSize:7,
    numShips:0,
    shipsShunk:0,
    shipLength:3,
    ships:[],
    
    fire:function(guess){
        for(var i=0;i<this.numShips;i++){
            var ship=this.ships[i];
            var index=ship.locations.indexOf(guess);
            if(index>=0){
                ship.hits[index]="hit";
                view.displayHit(guess);
                view.displayMessage("击中");
                if(this.isShunk(ship)){
                    this.shipsShunk++;
                    view.displayMessage("你击沉一艘船");
                }
                return true;
            }
        }
        view.displayMessage("没有击中");
        view.displayMiss(guess);
        return false;
    },
    isShunk:function(ship){
        for(var i=0;i<this.shipLength;i++){
            if(ship.hits[i]!=="hit"){
                return false;
            }
        }
        return true;
    },
    generateShipLocations:function(){
        var locations;
        this.numShips = Math.floor(Math.random()*6)+1;
        for(var i=0;i<this.numShips;i++){
        	var count = 60;
            do{
            	count--;
                locations=this.generateShip();
            }while(this.collision(locations) && count > 0);
            if (count <= 0) {
            	this.numShips = this.ships.length;
            	return;
            }
            this.ships.push({locations: locations, hits: ["", "", ""]});
        }
        console.log(this.ships);
    },
    generateShip:function(){
        var direction=Math.floor(Math.random()*2);
        var row;
        var col;
        if(direction===1){//生成横、竖起始位置
            row=Math.floor(Math.random()*this.boardSize);
            col=Math.floor(Math.random()*(this.boardSize-this.shipLength));
        }else{
            row=Math.floor(Math.random()*(this.boardSize-this.shipLength));
            col=Math.floor(Math.random()*this.boardSize);
        }

        var newShipLocation=[];
        for(var i=0;i<this.shipLength;i++){
            if(direction===1){
                newShipLocation.push(row+""+(col+i));//变成字符串相加
            }else{
                newShipLocation.push((row+i)+""+col);
            }
        }
        return newShipLocation;
    },
    collision:function(locations){
        for(var i=0;i<this.ships.length;i++){
            var ship=this.ships[i];
            for(var j=0;j<locations.length;j++){
                if(ship.locations.indexOf(locations[j])>=0){
                    return true;
                }
            }            
        }
    }
}


var controller={
    guesses:0,
    processGuess:function(guess){
        var location=parseGuess(guess);
        if(location){//只要不反回null
            this.guesses++;
            console.log("guess"+this.guesses);
            var hit=model.fire(location);
            if(model.shipsShunk===model.numShips){
                view.displayMessage("游戏结束，你成功击沉"+model.shipsShunk+"艘，共猜测"+this.guesses+"次");
                return false;
            }
        }
    },

}

function parseGuess(guess){
    var alphabet=["A","B","C","D","E","F","G"];
    if(guess===null||guess.length!==2){
        alert("格式错误，请输入一个字母和一个数字");
    }else{
        firstChar=guess.charAt(0);//用于返回指定索引处的字符
        var row=alphabet.indexOf(firstChar);
        var column=guess.charAt(1);

        if(isNaN(row)||isNaN(column)){//检查其参数是否是非数字值
            alert("格式错误，请输入一个字母和一个数字");
        }else if(row<0||row>=model.boardSize||column<0||column>=model.boardSize){
            alert("格式错误，输入的字母和数字不在范围内");
        }else{
            return row+column;//column是字符串，和数字拼接
        }
    }
    return null;
}

function handleFireButton(){//获取猜想
    var guessInput=document.getElementById("guessInput");
    var guess=guessInput.value;
    controller.processGuess(guess);
    guessInput.value="";//再次输入时重置为空字符
}
function handleKeyPress(e){//按键处理
    var fireButton=document.getElementById("fireButton");
    if(e.keyCode===13){//如果是回车，keyCode为13，调用click方法
        fireButton.click();
        return false;
    }
}

window.onload=init;//网页加载完毕后执行
function init(){
    var fireButton=document.getElementById("fireButton");
    fireButton.onclick=handleFireButton;

    var guessInput=document.getElementById("guessInput");
    guessInput.onkeypress=handleKeyPress;

    model.generateShipLocations();
}

