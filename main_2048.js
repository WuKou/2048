var board=new Array();
var score=0;
var hasConflicted=new Array();

//手指在手机上移动时的开始位置和结束位置
var startX=0;
var startY=0;
var endX=0;
var endY=0;

$(document).ready(function(){
  prepareForMobile();
  newGame();
});

function prepareForMobile(){
	if(documentWidth>500){
		gridContainerWidth=500;   //为什么这里是500 而不是460
		cellSpace=20;
		cellSideLength=100;
	}
	$('#grid-container').css('width',gridContainerWidth-2*cellSpace);
	$('#grid-container').css('height',gridContainerWidth-2*cellSpace);
	$('#grid-container').css('padding',cellSpace);
	$('#grid-container').css('border-radius',0.02*gridContainerWidth);
	$('.grid-cell').css('width',cellSideLength);
	$('.grid-cell').css('height',cellSideLength);
	$('.grid-cell').css('border-radius',0.02*cellSideLength);

}
function newGame(){
	init();
	generateOneNumber();
	generateOneNumber();
	
}

function init(){
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			var gridCell = $('#grid-cell-' + i + '-' + j);
			gridCell.css('top',getPosTop(i,j));
			gridCell.css('left',getPosLeft(i,j));
		}
	}
	for(var i=0;i<4;i++){
		board[i]=new Array();
		hasConflicted[i]=new Array();
		for(var j=0;j<4;j++){
			board[i][j]=0;
			hasConflicted[i][j]=false;
		}
	}
	updateBoardView();
	score=0;
	updateScore(score);
}

//updateBoardView()是将后台数据和前台显示做一个同步
function updateBoardView(){
	$(".number-cell").remove();
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell=$("#number-cell-"+i+"-"+j);
			if(board[i][j]==0){
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
				theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
			}
			else{
				theNumberCell.css('width',cellSideLength);
				theNumberCell.css('height',cellSideLength);
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color',getNumberColor(board[i][j]));
				theNumberCell.text( board[i][j] );
			}
			 hasConflicted[i][j]=false;
		}
		$('.number-cell').css('line-height',cellSideLength+'px');
		$('.number-cell').css('font-size',cellSideLength*0.6+'px');
	}
}


function generateOneNumber(){
	if(nospace(board)){
       return false;
	}
	//随机一个位置
	var randx=parseInt(Math.floor(Math.random()*4));
	var randy=parseInt(Math.floor(Math.random()*4));
	
	var times=0;
	while(times<50){
		if(board[randx][randy]==0){break;}
		randx=parseInt(Math.floor(Math.random()*4));
		randy=parseInt(Math.floor(Math.random()*4));
		times++;
	}
	if(times==50){
		for(var i=0;i<4;i++){
		   for(var j=0;j<4;j++){
			   if(board[i][j]==0){
				   randx=i;
				   randx=j;
				   break;
			   }
		   }
		}
	}
	//随机一个数字
	var randNumber=Math.random()<0.5?2:4;
	//在随机的位置显示随机的数字
	board[randx][randy]=randNumber;
	showNumberWithAnimation(randx,randy,randNumber);
	return true;
}

$(document).keydown(function(event){
	switch(event.keyCode){
		case 37://left
		if(moveLeft()){
		   setTimeout("generateOneNumber()",210);
		   setTimeout("isGameOver()",300);
		}
		break;
		case 38://up
		if(moveUp()){
			//preventDefault() 方法阻止元素发生默认的行为（例如，当点击提交按钮时阻止对表单的提交）。
			//这个 event 参数来自事件绑定函数
			event.preventDefault();
		   setTimeout("generateOneNumber()",210);
		   setTimeout("isGameOver()",300);
		}
		break;
		case 39://right
		if(moveRight()){
		   setTimeout("generateOneNumber()",210);
		   setTimeout("isGameOver()",300);
		}
		break;
		case 40://down
		if(moveDown()){
		   event.preventDefault();
		   setTimeout("generateOneNumber()",210);
		   setTimeout("isGameOver()",300);
		}
		break;
		default:break;
	}
});

// 监听触碰事件
document.addEventListener('touchstart',function(event){
	startX=event.touches[0].pageX;
	startY=event.touches[0].pageY;
});

document.addEventListener('touchend',function(event){
	endX=event.changedTouches[0].pageX;
	endY=event.changedTouches[0].pageY;
	
	var deltaX=endX-startX;
	var deltaY=endY-startY;
	
	if(Math.abs(deltaX)<0.3*documentWidth&&Math.abs(deltaY)<0.3*documentWidth){
		return;
	}
	
	//手指在x轴方向移动
	if(Math.abs(deltaX)>=Math.abs(deltaY)){
		if(deltaX>0){
			//手指向右移动
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);  //为什么要加这句
			}
		}
			else{
				//手指向左移动
				if(moveLeft()){
					setTimeout("generateOneNumber()",210);
					setTimeout("isGameOver()",300);
				}
			}
	}
	//手指在y轴方向移动
	else{
		if(deltaY<0){
			//在屏幕坐标系y轴是竖直向下
			//手指向上移动
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
		}
			else{
				//手指向下移动
				if(moveDown()){
					setTimeout("generateOneNumber()",210);
					setTimeout("isGameOver()",300);
				}
			}
	}
});

function isGameOver(){
	if(nospace(board)&&nomove(board)){
		gameOver();
	}
}
function gameOver(){
	alert('gameover!');
}

function moveLeft(){
	if(!canMoveLeft(board)){
		return false;
	}
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){
		 if(board[i][j]!=0){
			 for(var k=0;k<j;k++){
			if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
				showMoveAnimation( i , j , i , k );
				board[i][k]=board[i][j];
				board[i][j]=0;
			}
			else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board)&&!hasConflicted[i][k]){
				showMoveAnimation( i , j , i , k );
				board[i][k]+=board[i][j];
				board[i][j]=0;
				//add score
				score+=board[i][k];
				updateScore(score);
				hasConflicted[i][k]=true;
				continue;
			}
		}
	}
  }
}
            setTimeout("updateBoardView()",200);
            return true;
}

function moveRight(){
	if(!canMoveRight(board)){
		return false;
	}
	for(var i=0;i<4;i++){
		for( var j = 2 ; j >= 0 ; j --){
			if(board[i][j]!=0){
				for(var k=3;k>j;k--){
					if(board[i][k]==0&&noBlockHorizontal(i,j,k,board)){
						showMoveAnimation(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
					}
					else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,j,k,board)&&!hasConflicted[i][k]){
						showMoveAnimation(i,j,i,k);
						board[i][k]+=board[i][j];
						board[i][j]=0;
						score+=board[i][k];
						updateScore(score);
						hasConflicted[i][k]=true;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);
    return true;
}
function moveUp(){
	if(!canMoveUp(board)){
			return false;
		}
		for(var j=0;j<4;j++){
			for(var i=1;i<4;i++){
				if(board[i][j]!=0){
					for(var k=0;k<i;k++){
						if(board[k][j]==0&&noBlockVertical(j,k,i,board)){
							showMoveAnimation(i,j,k,j);
							board[k][j]=board[i][j];
							board[i][j]=0;
						}
						// else if(board[k][j]==board[i][j]&&noBlockVertical(j,k,i,board)){
						else if(board[k][j]==board[i][j]&&noBlockVertical(j,k,i,board)&&!hasConflicted[k][j]){
							showMoveAnimation(i,j,k,j);
							board[k][j]+=board[i][j];
							board[i][j]=0;
							score+=board[k][j];
							updateScore(score);
							hasConflicted[k][j]=true;
						}
					}
				}
			}
		}
		setTimeout("updateBoardView()",200);
	    return true;
	}
function moveDown(){
	if(!canMoveDown(board)){
			return false;
		}
		for(var j=0;j<4;j++){
			// for(var i=0;i<3;i++){
				for( var i = 2 ; i >= 0 ; i -- ){
				if(board[i][j]!=0){
					for(var k=3;k>i;k--){
						if(board[k][j]==0&&noBlockVertical(j,i,k,board)){
							showMoveAnimation(i,j,k,j);
							board[k][j]=board[i][j];
							board[i][j]=0;
						}
						else if(board[k][j]==board[i][j]&&noBlockVertical(j,i,k,board)&&!hasConflicted[k][j]){
							showMoveAnimation(i,j,k,j);
							board[k][j]+=board[i][j];
							board[i][j]=0;
							score+=board[k][j];
							updateScore(score);
							hasConflicted[k][j]=true;
							continue;
						}
					}
				}
			}
		}
		setTimeout("updateBoardView()",200);
	    return true;
	}
