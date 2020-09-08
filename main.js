var start = document.getElementById('start');
var title= document.getElementById('title');
var flyBird= document.getElementById('flyBird');
var box = document.getElementById('box');
var downTimer = null;
var upTimer = null;
var speed = 0;
var maxSpeed = 8;
function downBird(){
	flyBird.src = 'img/down_bird0.png';
	speed += .3;
	if (speed >= maxSpeed) {
		speed = maxSpeed;
	}
	flyBird.style.top = flyBird.offsetTop + speed +"px";
}

function gameStart(){
	start.style.display = 'none';
	title.style.display = 'none';

	// 出现鸟
	flyBird.style.display = 'block';
	downTimer = setInterval(function(){
		downBird();
	},30)
}

start.onclick = function(event){
	var ev = event||window.event;  //兼容性判断浏览器
	if(ev.stopPropagation){
		ev.stopPropagation()
	}else{
		ev.cancelable=true;
	}
	gameStart();
	box.onclick = function(){
		// 停止小鸟下降
		clearInterval(downTimer);
		clearInterval(upTimer);
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