// JavaScript Document
var ctx,bg;
var lastPt=null;
var canvas = document.getElementById("draw");
	canvas.width  = $(window).width();
	canvas.height = $(window).height()-60;
var sheet = document.getElementById("sheet");
	sheet.width  = window.innerWidth;
	sheet.height = window.innerHeight-60;
var _back = document.getElementById("back");
	_next = document.getElementById("next");
	_clear = document.getElementById("clearcanvas");
	_save = document.getElementById("savefile");
	_s_size = document.getElementById("s_size");
	_s_alpha = document.getElementById("s_alpha");
var canvas_status = [];
	canvas_status[0] = 'canvas.toDataURL()';
var bgcolor_status = [];
	bgcolor_status [0]= '#FFFFFF';
var color_status = 0;
var status_now = 0;
var img = new Image();
var step_temp = 30;
img.src = canvas_status[status_now];
function init() {
		canvas.addEventListener("touchmove", draw, false);
		canvas.addEventListener("touchend", end, false);
		_clear.addEventListener("click", wipescreen, false);
		_back.addEventListener("click", status_back, false);
		_next.addEventListener("click", status_next, false);
		_save.addEventListener("click", rend, false);
        ctx = canvas.getContext("2d");
		ctx.lineWidth = 3;
        bg = sheet.getContext("2d");
		bg.fillStyle = "#FFFFFF";
		bg.fillRect(0, 0, window.innerWidth, window.innerHeight-60);
		add_colortab();
		setTimeout('bind_colorpicker();bind_bgpicker();',100);
}
//---for Mobile (start)---
function draw(e) {
	e.preventDefault();
	if(lastPt!=null) {
		ctx.beginPath();
		ctx.moveTo(lastPt.x, lastPt.y-60);
		ctx.lineTo(e.touches[0].pageX, e.touches[0].pageY-60);
		ctx.stroke();
	}
	lastPt = {x:e.touches[0].pageX, y:e.touches[0].pageY};
}
function end(e) {
	e.preventDefault();
	lastPt=null;
	status_now++;
	if( status_now < step_temp+1 ){
		for( k=0 ; k<step_temp+1 ; k++ ){
			if( k>=status_now ){
				canvas_status[k] = null;
			}
		};
	}else{
		for( k=0 ; k<step_temp ; k++ ){
			canvas_status[k]=canvas_status[k+1]
			bgcolor_status[k]=bgcolor_status[k+1]
		};
		status_now = step_temp;
	}
	canvas_status[status_now] = canvas.toDataURL();
	bgcolor_status[status_now] = bgcolor_status[status_now-1];
}
//---for Mobile (end)---

//---for Desktop (start)---
$("#draw").mousedown(function(event) {
	$(this).addClass("paint");
	lastPt = {x:event.pageX, y:event.pageY};
	$("#draw").mousemove(function(event) {
		if( $(this).attr("class") == "paint" ) {
			ctx.beginPath();
			ctx.moveTo(lastPt.x, lastPt.y-60);
			ctx.lineTo(event.pageX, event.pageY-60);
			ctx.stroke();
		}
		lastPt = {x:event.pageX, y:event.pageY};
	});
});

$("#draw").mouseup(function(event) {
	$(this).removeClass("paint");
	ctx.closePath();
	status_now++;
	if( status_now < step_temp+1 ){
		for( k=0 ; k<step_temp+1 ; k++ ){
			if( k>=status_now ){
				canvas_status[k] = null;
			}
		};
	}else{
		for( k=0 ; k<step_temp ; k++ ){
			canvas_status[k]=canvas_status[k+1]
			bgcolor_status[k]=bgcolor_status[k+1]
		};
		status_now = step_temp;
	}
	canvas_status[status_now] = canvas.toDataURL();
	bgcolor_status[status_now] = bgcolor_status[status_now-1];
});
//---for Desktop (end)---

//---Menu (start)---
	//---Main menu---
$(".menu_btn").click(function() {
	var menu_num = $(".menu_btn").index(this);
	if( $(this).attr("class").search("menu_active") == -1 ){
		$(".menu_btn").removeClass("menu_active");
		$(this).addClass("menu_active");
		$(".sub_menu").slideUp(100);
		$(".sub_menu").eq(menu_num).slideDown(100);
	}else{
	$(".menu_btn").removeClass("menu_active");
	$(".sub_menu").slideUp(100);
	}
});
	//---Color picker---
var colortab_r = [0,128,128,255,240,255,161,222,255,230,255,255,255,204,140,0,107,102,77,0,102,32,0,0,0,71,30,0,0,25,92,80,139,217,221,255,255,255]
	colortab_g = [0,128,0,0,128,69,107,184,235,184,215,255,255,255,230,255,142,255,230,250,255,178,255,191,128,125,144,0,71,25,80,0,0,77,160,0,105,255]
	colortab_b = [0,128,0,0,128,0,71,135,205,0,0,0,153,0,0,0,35,89,128,154,230,170,255,255,140,100,255,255,171,112,230,184,255,255,221,255,180,255]
	colortab_a = 1;
var color_status = 0;
function add_colortab(){
	for( c=0 ; c<colortab_r.length ; c++ ){
		$("#stroke_colortab").append('<div class="colortable"></div)')
		$(".colortable").eq(c).css("background-color","rgba("+colortab_r[c]+", "+colortab_g[c]+", "+colortab_b[c]+", 1)")
		}
	for( c=0 ; c<bgcolortab.length ; c++ ){
			$("#bg_colortab").append('<div class="bgcolortable"></div)')
		if(bgcolortab[c]=="transparent"){
			$(".bgcolortable").eq(c).css("background-image","url(images/transbg.png)")
		}else{
			$(".bgcolortable").eq(c).css("background-color",bgcolortab[c])
		}
	}
}
function bind_colorpicker(){
	$(".colortable").bind('click',function() {
		color_status = $(".colortable").index(this)
		colortab = "rgba("+colortab_r[color_status]+","+colortab_g[color_status]+","+colortab_b[color_status]+","+colortab_a+")"
		$(".colorpicked").css("background-color",colortab)
		ctx.strokeStyle = colortab;
		$(".menu_btn").removeClass("menu_active");
		$(".sub_menu").slideUp(100);
	});
}

	//---Bgcolor picker---
var bgcolortab = ["#FFFFFF","#000000","#FF0000","#00FF00","#0000FF","#FFFF00","#00FFFF","transparent",]
function bind_bgpicker(){
	$(".bgcolortable").bind('click',function(e) {
		var _color = $(".bgcolortable").index(this)
		if( _color == bgcolortab.length-1 ){
			bg.clearRect(0, 0, window.innerWidth, window.innerHeight-60);
			$("#draw, #bgcolor").css("background-image","url(images/transbg.png)");
			}else{
			bg.fillStyle = bgcolortab[_color];
			setTimeout('bg.fillRect(0, 0, window.innerWidth, window.innerHeight-60);',50);
			$("#draw, #bgcolor").css("background-image","none");
			$("#draw, #bgcolor").css("background-color",bgcolortab[_color]);
			}
		status_now++;
		if( status_now < step_temp+1 ){
			for( k=0 ; k<step_temp+1 ; k++ ){
				if( k>=status_now ){
					canvas_status[k] = null;
				}
			};
		}else{
			for( k=0 ; k<step_temp ; k++ ){
				canvas_status[k]=canvas_status[k+1]
				bgcolor_status[k]=bgcolor_status[k+1]
			};
			status_now = step_temp;
		}
		canvas_status[status_now] = canvas.toDataURL();
		bgcolor_status[status_now] = bgcolortab[_color];
		$(".menu_btn").removeClass("menu_active");
		$(".sub_menu").slideUp(100);
		
	});
}
	//---Stroke size---
function change_s_size(val) {
	document.getElementById('size_text').innerHTML=val+"pt"; 
	var s_size_val = val.replace(/[^-\d\.]/g, '');
	ctx.lineWidth = s_size_val;
}

	//---Stroke alpha---
function change_s_alpha(val){
	document.getElementById('alpha_text').innerHTML=val+"%"; 
	var s_alpha_val = val.replace(/[^-\d\.]/g, '');
	colortab_a = s_alpha_val*0.01;
	colortab = "rgba("+colortab_r[color_status]+","+colortab_g[color_status]+","+colortab_b[color_status]+","+colortab_a+")"
    $(".colorpicked").css("background-color",colortab)
	ctx.strokeStyle = colortab;

}



	//---Clear---
function wipescreen(e) {
	if( confirm("Clear the sheet?") ){
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight-60);
	status_now++;
	if( status_now < step_temp+1 ){
		for( k=0 ; k<step_temp+1 ; k++ ){
			if( k>=status_now ){
				canvas_status[k] = null;
			}
		};
	}else{
		for( k=0 ; k<step_temp ; k++ ){
			canvas_status[k]=canvas_status[k+1]
			bgcolor_status[k]=bgcolor_status[k+1]
		};
		status_now = step_temp;
	}
	canvas_status[status_now] = canvas.toDataURL();
	}
}



	//---Save file---
function rend(e){
	if(bgcolor_status[status_now]=="transparent"){
		bg.clearRect(0, 0, window.innerWidth, window.innerHeight-60);
		img.src = canvas_status[status_now];
		setTimeout('bg.drawImage(img,0,0);',50);
		}else{
		bg.fillStyle = bgcolor_status[status_now];
		bg.fillRect(0, 0, window.innerWidth, window.innerHeight-60);
		img.src = canvas_status[status_now];
		setTimeout('bg.drawImage(img,0,0);',50);
		}
	setTimeout('if( confirm("This will open in a new tab...") ){ window.open(sheet.toDataURL()); }',100);
	
}


//---Menu (end)---
//---Save status---
function status_back(e){
	if( status_now != 0 ){
		img.src = canvas_status[status_now-1];
		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight-60);
		setTimeout('sta_rec(); ',1)
		setTimeout('img.src = canvas_status[status_now];',2);
		status_now--;
	}else{
		return false;	
	}
}
function status_next(e){
	if( canvas_status[status_now+1] != null ){
		img.src = canvas_status[status_now+1];
		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight-60);
		setTimeout('sta_rec(); ',1)
		setTimeout('img.src = canvas_status[status_now];',2);
		status_now++;
	}else{
		return false;	
	}
}
function sta_rec(){
	ctx.drawImage(img,0,0);
	$("#draw").css("background-color",bgcolor_status[status_now]);
	if(bgcolortab[status_now]=="transparent"){
		bg.clearRect(0, 0, window.innerWidth, window.innerHeight-60);
	}else{
		bg.fillStyle = bgcolortab[status_now-1];
		bg.fillRect(0, 0, window.innerWidth, window.innerHeight-60);
	}; 
}
//---Disable text select---
function disableselect(e){
return false
}
function reEnable(){
return true
}
document.onselectstart=new Function ("return false")
