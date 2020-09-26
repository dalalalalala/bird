var start = document.getElementById('start');
var title= document.getElementById('title');
var flyBird= document.getElementById('flyBird');
var box = document.getElementById('box');
var ul = document.getElementsByTagName('ul')[0];
var audios = document.getElementsByTagName('audio');
var scoreBoard = document.getElementById('scoreBoard');
var downTimer = null;
var upTimer = null;
// var moveTimer = null;
var pipeTimer = null;
var crashTimer = null;
var speed = 0;
var maxSpeed = 8;
var scoreNum = 0;

function downBird(){
	flyBird.src = 'img/down_bird0.png';
	speed += .3;
	if (speed >= maxSpeed) {
		speed = maxSpeed;
	}
	flyBird.style.top = flyBird.offsetTop + speed +"px";
}
function random(min,max){
	return Math.random()*(max-min)+min;
}
function gameStart(){
	start.style.display = 'none';
	title.style.display = 'none';

	// 放背景音乐
	audios[1].play();
	// 出现鸟

	flyBird.style.display = 'block';
	downTimer = setInterval(function(){
		downBird();
	},30);
	pipeTimer =setInterval(createPipe,3000);
	// console.log(ul);
	// console.log(ul.childNodes[0]);
	crashTimer = setInterval(function(){
		if (flyBird.offsetTop<=0||flyBird.offsetTop+flyBird.offsetHeight>=422) {
			gameOver();
		}
	},30)
	//游戏结束
}

// 加分
function addScore(){
	scoreNum++;
	var scoreNumStr = scoreNum +"";
	console.log(scoreNumStr);
	scoreBoard.innerHTML="";
	for(var i=0;i<scoreNumStr.length;i++){
		var img=document.createElement("img");
		img.src=`img/${scoreNumStr[i]}.jpg`
		scoreBoard.appendChild(img);
	}
}
function crash(a,b){
	var aPar = a.parentNode;
	// 左没撞
	var leftNoCrash = aPar.offsetLeft>b.offsetWidth+b.offsetLeft;
	// 右没撞
	var rightNoCrash = b.offsetLeft>a.offsetWidth+aPar.offsetLeft;
	// 上没撞
	var topNoCrash = a.offsetTop>b.offsetHeight+b.offsetTop;
	// 下没撞
	var bottomNoCrash = b.offsetTop>a.offsetHeight+a.offsetTop;

	return !(leftNoCrash||topNoCrash||bottomNoCrash);
}
// 游戏结束
function gameOver(){
	console.log('游戏结束');
	clearInterval(downTimer);
	clearInterval(upTimer);
	clearInterval(pipeTimer);
	clearInterval(crashTimer);
	audios[1].pause();
	audios[2].play();
	var lis = document.getElementsByTagName('li');
	for(var i=0;i<lis.length;i++){
		clearInterval(lis[i].moveTimer)
	}
	box.onclick = null;
}

function createPipe(){
	// 生成管道
	var li = document.createElement('li');
	var topHeight = random(70,230);
	var bottomHeight = 300-topHeight;
	li.innerHTML = `<div class="pipeTop" style="height:${topHeight}px">
						<img src="img/up_pipe.png" alt="">
					</div>
					<div class="pipeBottom" style="height:${bottomHeight}px">
						<img src="img/down_pipe.png" alt="">
					</div>`;
	li.lock =false;
	ul.appendChild(li);
	var pipeTop=document.getElementsByClassName("pipeTop")[0];
	var pipeBottom=document.getElementsByClassName("pipeBottom")[0];
	li.moveTimer = setInterval(function(){
		// li.style.left = li.offsetLeft-3+"px";
		li.style.left = `${li.offsetLeft-3}px`;
		// 判断管道是否移出去
		if(li.offsetLeft<-70){
			ul.removeChild(li);
		};
		// 判断是否加分
		if(flyBird.offsetLeft>li.offsetLeft+li.offsetWidth&&li.lock==false){
			addScore();
			li.lock =true;
		}
		// 发生管道碰撞

		if(crash(pipeTop,flyBird)||crash(pipeBottom,flyBird)){
			gameOver();
		}
	},30)
	
}

start.onclick = function(event){
	var ev = event||window.event;  //兼容性判断浏览器
	if(ev.stopPropagation){
		ev.stopPropagation()
	}else{
		ev.cancelBubble=true;
	}
	gameStart();
	box.onclick = function(){
		// 停止小鸟下降
		clearInterval(downTimer);
		clearInterval(upTimer);
		audios[0].pause();
		audios[0].play();
		flyBird.src = "img/up_bird1.png";
		speed = maxSpeed;

		upTimer = setInterval(function(){
			speed -= 0.7;
			if (speed <=0) {
				clearInterval(upTimer);
				downTimer = setInterval(function(){
					downBird();
				},30);	
			}
			flyBird.style.top = flyBird.offsetTop - speed +"px";
		},30);
		
	}
}