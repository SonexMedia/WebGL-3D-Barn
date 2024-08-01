//***************************************************************************************//
//
//	FabricJS Object Drawing file
//	Created By Giryong Jong. 1/23/2014
//
//***************************************************************************************//

var drawObj 		= function()
{
	var main 		= this;

	main.canvasID 	= "canvas";
	main.canvWidth	= 300;
	main.canvHeight	= 300;
	main.canvas 	= null;
	
	main.prevScale	= 1;
	main.unit 		= 50; 	// 1 metre = 50pixel;
	main.sel_obj 	= null;

	main.init 		= function(width,height)
	{
		main.canvWidth 	= width;
		main.canvHeight = height;

		main.canvasCSS();
		main.initFabric();
		main.drawEvent();
		main.objectEvent();	
	}

	main.canvasCSS	= function()
	{
		$("#" + main.canvasID).attr("width",main.canvWidth);
		$("#" + main.canvasID).attr("height",main.canvHeight);
		$("#" + main.canvasID).css("width",main.canvWidth);
		$("#" + main.canvasID).css("height",main.canvHeight);

		if(main.canvas)
		{
			main.canvas.setWidth(main.canvWidth);
			main.canvas.setHeight(main.canvHeight);
			main.canvas.renderAll();
			main.canvas.calcOffset();
		}
	}

	main.initFabric	= function()
	{
		main.canvas = new fabric.Canvas(main.canvasID);
	}

	main.objectEvent = function()
	{
		main.setObjProperty();
		main.getObjProperty();
	}

	main.canvasToJson	= function()
	{
		var objArr 	= new Array();
		var rate 	= main.prevScale;

		main.canvas.forEachObject(function(object,i) 
		{
			var obj_path 	= "";
			var type 		= object.get("type");
			var x 			= object.get("left") * (1 / rate);
			var y 			= object.get("top") * (1 / rate);
			var width 		= object.getWidth() * (1 / rate);
			var height 		= object.getHeight() * (1 / rate);
			var depth 		= object.get("depth");
			var color 		= object.backgroundColor;
			var angle 		= object.get("angle");
			var orgPos 		= null;
			var points		= object.get("points");
			var imgUrl	 	= object.get("url");

			if(angle != 0)
			{
				orgPos = main.getOrgPos(object);
				x = orgPos.x;
				y = orgPos.y;
			}

			if(object.type == 'image')
			{
				obj_path = "img/objs/3d_objs/" + object.get("obj3d");
				objArr.push({obj:obj_path,type:type,x:x, y:y, width:width, height:height,depth:depth,color:color,angle:angle, points:null,url:imgUrl,canvScale:main.prevScale});
			}
			else
			{
				objArr.push({obj:null,type:type,x:x, y:y, width:width, height:height,depth:depth,color:color,angle:angle, points:points,url:imgUrl,canvScale:main.prevScale});
			}
		});

		return JSON.stringify(objArr);
	}

	main.jsonToCanvas	= function(json)
	{
		var obj = JSON.parse(json);
	}

	main.getObjProperty = function()
	{
		main.canvas.on("selection:cleared",function(options)
		{
			main.sel_obj = null;

			$("#txt_descr").val("Floor");
			$("#txt_depth").val("0");
			$("#txt_width").val("0");
			$("#txt_height").val("0");
			$("#txt_angle").val("0");

			$("#obj_prop").css("display","none");
			$("#floor_prop").css("display","block");
		});

		main.canvas.on("object:selected",function(options)
		{
			var obj 	= options.target;
			var descr 	= obj.get("descr");
			var depth 	= obj.get("depth");

			var width 	= obj.getWidth();
			var height 	= obj.getHeight();
			var angle 	= obj.getAngle();
			var color 	= obj.backgroundColor;

			main.sel_obj = obj;

			if(!depth) depth = 0;

			$("#txt_descr").val(descr);
			$("#txt_depth").val(height / main.unit / main.prevScale);
			$("#txt_width").val(width / main.unit / main.prevScale);
			$("#txt_height").val(depth);
			$("#txt_angle").val(angle);
			$("#txt_bgcolor").css("background-color",color);

			$("#obj_prop").css("display","block");
			$("#floor_prop").css("display","none");
		});
	}

	main.setObjProperty = function()
	{
		$("#txt_descr").keyup(function()
		{
			if(!main.sel_obj) return;

			main.sel_obj.set("descr",$(this).val());
		});

		$("#txt_height").keyup(function()
		{
			if(!main.sel_obj) return;

			main.sel_obj.set("depth",$(this).val());
		});

		$("#txt_width").keyup(function()
		{
			if(!main.sel_obj) return;

			main.sel_obj.width = $(this).val() * main.unit;
			main.sel_obj.setCoords();
			main.canvas.renderAll();
			main.canvas.calcOffset();
		});

		$("#txt_depth").keyup(function()
		{
			if(!main.sel_obj) return;

			main.sel_obj.height = $(this).val() * main.unit;
			main.sel_obj.setCoords();
			main.canvas.renderAll();
			main.canvas.calcOffset();
		});

		$("#txt_angle").keyup(function()
		{
			if(!main.sel_obj) return;

			main.sel_obj.angle = $(this).val() * 1;
			main.sel_obj.setCoords();
			main.canvas.renderAll();
			main.canvas.calcOffset();
		});
	}

	main.areaScale 	= function(rate)
	{
		var scaleN 	= rate / main.prevScale;
		var scaleX 	= 1;
		var scaleY 	= 1;

		main.canvas.forEachObject(function(object,i) 
		{
			scaleX = object.scaleX;
			scaleY = object.scaleY;

			object.top 		= object.top * scaleN;
			object.left 	= object.left * scaleN;
			object.scaleX  	= scaleX * scaleN;
			object.scaleY  	= scaleY * scaleN;

			object.setCoords();
		});


		main.prevScale = rate;
		main.canvasCSS();
	}

	main.drawEvent	= function()
	{
		$("#" + main.canvasID).droppable(
		{
			drop: function(event,ui)
			{
				var tool 	= $(ui.draggable).attr('tool');
				var tleft 	= $("#canvas_area").css('left').replace("px","") * 1;
				var ttop 	= $("#canvas_area").css('top').replace("px","") * 1;
				
				var left 	= ui.helper.offset().left - tleft;
				var top 	= ui.helper.offset().top  - ttop - 50;

				var twod 	= $(ui.draggable).attr('twod');
				var size 	= $(ui.draggable).attr('size');
				var thrd 	= $(ui.draggable).attr('thrd');

				main.addObject(tool,left,top,twod,size,thrd);
			}
		});
	}

	main.addObject 	= function(tool,left,top,twod,size,thrd)
	{
		switch(tool)
		{
			case "text" :
				main.canvas.add(new fabric.Text('Add Text',
				{ 
				    left: left,
				    top: top, 
				    fill: 'black',
				    scaleX : main.prevScale,
				    scaleY : main.prevScale
				}));
			break;

			case "line" :
				main.canvas.add(new fabric.Rect(
				{
					type : "rect",
					left: left,
					top: top,
					width: 150,
					height: 10,
					fill: "white",
					stroke : 1,
					borderColor : "black",
					hasBorders  : true,
					scaleX : main.prevScale,
					scaleY : main.prevScale
				}));
			break;

			case "rect" :
				main.canvas.add(new fabric.Rect(
				{
					type : "rect",
					left: left,
					top: top,
					width: 150,
					height: 100,
					fill: "white",
					stroke : 2,
					borderColor : "black",
					hasBorders  : true,
					scaleX : main.prevScale,
					scaleY : main.prevScale
				}));
			break;

			case "triangle" :
				main.canvas.add(new fabric.Triangle(
				{
					type : "triangle",
					left: left,
					top: top,
					width: 100,
					height: 100,
					fill: "white",
					stroke : 2,
					borderColor : "black",
					hasBorders  : true,
					scaleX : main.prevScale,
					scaleY : main.prevScale
				}));
			break;

			case "circle" :
				main.canvas.add(new fabric.Circle(
				{
					type : "circle",
					left: left,
					top: top,
					radius: 50,
					fill: "white",
					stroke : 2,
					borderColor : "black",
					hasBorders  : true,
					scaleX : main.prevScale,
					scaleY : main.prevScale
				}));
			break;

			case "star"	:
				var lwidth 	= 100;
				var swidth 	= 40;
				var length 	= 0;
				var angle 	= 0;
				var x,y;
				var starPoints = [];

				for(var i = 0; i < 10; i ++)
				{
					if(i % 2 == 0)	length = lwidth;
					else length = swidth;

					angle = 2 * Math.PI / 10 * i;
					
					x = left  - Math.sin(angle) * length;
					y = top - Math.cos(angle) * length;

					starPoints.push({x:x, y:y});
				}

				main.canvas.add(new fabric.Polygon(starPoints, {
					type:"star",
					left: left,
					top: top,
					fill: 'purple',
					fill: "white",
					stroke : 2,
					borderColor : "black",
					hasBorders  : true,
					points : starPoints,
					scaleX : main.prevScale,
					scaleY : main.prevScale
				}));
			break;

			case "ellipse" :
				main.canvas.add(new fabric.Ellipse(
				{
					type:"ellipse",
					left: left,
					top: top,
					rx: 50,
					ry: 30,
					fill: "white",
					stroke : 2,
					borderColor : "black",
					hasBorders  : true,
					scaleX : main.prevScale,
					scaleY : main.prevScale
				}));
			break;

			case "image" :
				var url 	= "img/objs/2d_shape/" + twod;
				var size 	= size.split(",");
				var obj3d 	= thrd;

				fabric.Image.fromURL(url, function(img)
				{
					main.canvas.add(img.set(
					{
						top 	: top, 
						left 	: left, 
						url 	: url,
						width 	: size[0] * main.unit,
						height 	: size[1] * main.unit,
						depth 	: size[2],
						obj3d	: obj3d,
						scaleX 	: main.prevScale, 
						scaleY 	: main.prevScale 
					}));
				});
			break;
		}

		main.getOrgPos		= function(object)
		{
			var x 			= object.get("left");
			var y 			= object.get("top");
			var width 		= object.getWidth();
			var height 		= object.getHeight();
			var mangle 		= object.get("angle") * (Math.PI / 180) * (-1);

			var angle1		= Math.atan(width / height);
			var angle2 		= (180 * (Math.PI / 180) - mangle) / 2;
			var radian 		= angle2 - angle1;

			var r1 			= Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
			var l1 			= Math.sin(mangle / 2) * r1;
			var r2 			= l1 * 2;

			var dy 			= Math.cos(radian) * r2;
			var dx 			= Math.sin(radian) * r2;

			var nx 			= x + dx;
			var ny 			= y - dy;

			return ({x:nx, y:ny});
		}
	}
}