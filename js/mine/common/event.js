
var initEvent		= function()
{
	var main		= this;

	main.drawObj 	= null

	this.init		= function(drawObj)
	{
		this.eventLeft();
		this.initShowMore();
		this.sliderEvent();
		this.shapeEvent();
		this.menuEvent();

		main.drawObj = drawObj;
	};
	
	this.eventLeft	= function()
	{
		var TimerT = 0;
		var TimerB = 0;
		
		$("#move_controlT").mouseover(function()
		{
			TimerT = setInterval(function()
					{
						var mTop = $("#left_area").css("margin-top").replace("px","") * 1 + 10;
						$("#left_area").css("margin-top",mTop + "px");
						main.initShowMore();
					},50);
		});
		
		$("#move_controlB").mouseover(function()
		{
			TimerB = setInterval(function()
					{
						var mTop = $("#left_area").css("margin-top").replace("px","") * 1 - 10;
						$("#left_area").css("margin-top",mTop + "px");
						main.initShowMore();
					},50);
		});
		
		$("#move_controlT").mouseout(function(){clearInterval(TimerT);});
		$("#move_controlB").mouseout(function(){clearInterval(TimerB);});
	};

	this.shapeEvent 	= function()
	{
		$("#btn_shape").click(function()
		{
			$(this).next("dd").toggle();
		});
	}
	
	this.initShowMore	= function()
	{
		var tHeight	= $(window).height() - 40;
		var lHeight = $("#left_area").height();
		var mTop	= $("#left_area").css("margin-top").replace("px","") * 1;
		var tTop	= $(window).height() - 29;

		if(lHeight + mTop > tHeight)
		{
			$("#move_controlB").css("display","block");
		}
		else
		{
			$("#move_controlB").trigger("mouseout");
			$("#move_controlB").css("display","none");
		}
		
		if(mTop < 0)
			$("#move_controlT").css("display","block");
		else
		{
			$("#move_controlT").trigger("mouseout");
			$("#move_controlT").css("display","none");
		}
	};
	
	this.sliderEvent	= function()
	{
		$("#left_slider").click(function()
		{
			if($("#left_area").css("left").replace("px","") == 0)
				$("#left_area,#move_controlT,#move_controlB").animate({left:-210});
			else
				$("#left_area,#move_controlT,#move_controlB").animate({left:0});
		});
		
		$("#right_slider").click(function()
		{
			if($("#right_area").css("right").replace("px","") == 0)
				$("#right_area").animate({right:-200});
			else
				$("#right_area").animate({right:0});
		});
	}

	this.menuEvent 		= function()
	{
		$("#ctrl_area").find("li").click(function()
		{
			var index = $(this).index();

			switch(index)
			{
				case 0 :
					$(".popup").css({"display":"none"});
					$("#creat_project").css({"display":"block"});
					$("#overlay").css("display","inline");
					$("#over_overlay").fadeIn();

					$("#btn_addprj").data("canv_data",main.drawObj.canvasToJson());
				break;
				case 1 :
					$(".popup").css({"display":"none"});
					$("#open_project").css({"display":"block"});
					$("#overlay").css("display","inline");
					$("#over_overlay").fadeIn();

					$.ajax(
					{
						type: "POST",
						url: "php/ajax.php", 
						data: ({mode:'get_projectlist'}),
						cache: false,
						success: function(result)
						{
							$("#project_list").html(result);

							var descr = $("#project_list").children(":selected").attr("descr");

							$("#view_pdescr").html(descr);
						}
					});
				break;
				case 2 :
					var data 	= main.drawObj.canvasToJson();

					$.ajax(
					{
						type: "POST",
						url: "php/ajax.php", 
						data: ({mode:'update_project',proID:projectID, data:data}),
						cache: false,
						success: function(result)
						{
							alert("Successfully Saved!");
						}
					});
				break;
				case 8 :
					var obj_3d 		= new Obj3D();
					var unit 		= main.drawObj.unit;
					var fWidth 		= $("#txt_fwidth").val() * unit;
					var fHeight 	= $("#txt_fdepth").val() * unit;
					var rate 		= main.drawObj.prevScale;
					var objArr 		= new Array();

					main.drawObj.canvas.forEachObject(function(object,i) 
					{
						var obj_path 	= "";
						var type 		= object.get("type");
						var x 			= object.get("left") * (1 / rate);
						var y 			= object.get("top") * (1 / rate);
						var width 		= object.getWidth() * (1 / rate);
						var height 		= object.getHeight() * (1 / rate);
						var depth 		= object.get("depth") * unit;
						var color 		= object.backgroundColor;
						var angle 		= object.get("angle");
						var orgPos 		= null;
						var points		= object.get("points");

						if(angle != 0)
						{
							orgPos = main.drawObj.getOrgPos(object);
							x = orgPos.x;
							y = orgPos.y;
						}

						if(object.type == 'image')
						{
							obj_path = "img/objs/3d_objs/" + object.get("obj3d");
							objArr.push({obj:obj_path,type:type,x:x, y:y, width:width, height:height,depth:depth,color:color,angle:angle, points:null});
						}
						else
						{
							objArr.push({obj:null,type:type,x:x, y:y, width:width, height:height,depth:depth,color:color,angle:angle, points:points});
						}
					});

					obj_3d.init("area_3d",unit);
					obj_3d.setFloor(fWidth,fHeight);
					obj_3d.initLoad(objArr);

				break;
			}
		});
	}
}