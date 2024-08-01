
jQuery(document).ready(function(){
								
	var initObj		= new initEnv();
	
	initObj.init();
});

var projectID = "";

var initEnv			= function()
{
	var main		= this;

	main.canvWidth 	= 800;
	main.canvHeight	= 600;

	main.drawObj 	= null;
	main.rate 		= 1;
	main.gridSize 	= 50;
	main.initGSize 	= 50;
	main.unit 		= 50;

	this.init		= function()
	{
		this.initCSS();
		this.initSlider();
		this.initMode();
		this.initDraw();
		this.initEvent();
		this.initPopup();

		$(window).resize(main.initCSS);
	};

	this.initCSS	= function()
	{
		var left		= ($(window).width() - main.canvWidth * main.rate) / 2;
		var top 		= Math.max(85,($(window).height() - main.canvHeight * main.rate) / 2);
		var sTop	 	= $(window).height() * 0.45;
		var footer_left = ($(window).width() - 601) / 2;

		$("#canvas_area").css('left',left);
		$("#canvas_area").css('top',top);
		$("#canvas_area").css("width",main.canvWidth * main.rate);
		$("#canvas_area").css("height",main.canvHeight * main.rate);

		$("#grid_bg").css("width", main.canvWidth * main.rate);
		$("#grid_bg").css("height",main.canvWidth * main.rate);

		$("body").css("height",$(window).height());		
		$("#footer_label").css("left",footer_left);
		$("#size_slider").css("left",($(window).width() - 180) / 2);
		$("#move_controlB").css("top",$(window).height() - 29);

		$("#txt_fwidth").val(main.canvWidth / main.unit);
		$("#txt_fdepth").val(main.canvHeight / main.unit);

		if(main.drawObj) 
		{
			main.drawObj.canvWidth 	= main.canvWidth * main.rate;
			main.drawObj.canvHeight = main.canvHeight * main.rate;
			main.drawObj.canvasCSS();
			main.drawObj.canvas.calcOffset();
		}

		main.initGrid();
	};

	this.initGrid 	= function()
	{
		var ratioW = Math.ceil($("#grid_bg").width() / main.gridSize),
			ratioH = Math.ceil($("#grid_bg").height()/ main.gridSize);

		$("#grid_bg").html("");

		var parent = $('<div />', 
		{
			class: 'grid', 
			width: ratioW  * main.gridSize, 
			height: ratioH  * main.gridSize
		}).addClass('grid').appendTo('#grid_bg');

		for (var i = 0; i < ratioH; i++)
		{
			for(var p = 0; p < ratioW; p++)
			{
				$('<div />', {
				    width: main.gridSize - 1, 
				    height: main.gridSize - 1
				}).appendTo(parent);
			}
		}
	}
	
	this.initMode	= function()
	{
		$("#canvas_area").draggable(
		{
			handle	: "center",
			stop 	: function()
			{
				main.drawObj.canvas.calcOffset();
			}
		});

		$("#txt_bgcolor").ColorPicker(
		{
			color: '#0000ff',
			onShow: function (colpkr) 
			{
				$(colpkr).fadeIn(500);
				return false;
			},
			onHide: function (colpkr) 
			{
				$(colpkr).fadeOut(500);
				return false;
			},
			onChange: function (hsb, hex, rgb) 
			{
				//$('#txt_bgcolor').val(hex);
				$('#txt_bgcolor').css('backgroundColor', '#' + hex);

				if(main.drawObj.sel_obj)
				{
					if(main.drawObj.sel_obj.type == "image")
					{
						main.drawObj.sel_obj.filters.push(new fabric.Image.filters.Tint({
			                color: "#" + hex,
			                opacity: 0.6
			            }));

						main.drawObj.sel_obj.applyFilters(main.drawObj.canvas.renderAll.bind(main.drawObj.canvas));
						main.drawObj.sel_obj.filters.length = 0;
					}
					
					main.drawObj.sel_obj.setColor("#" + hex);
					main.drawObj.sel_obj.backgroundColor = "#" + hex;

					main.drawObj.canvas.renderAll();
					main.drawObj.canvas.calcOffset();
				}
			}
		});

		$("#txt_fbgcolor").ColorPicker(
		{
			color: '#0000ff',
			onShow: function (colpkr) 
			{
				$(colpkr).fadeIn(500);
				return false;
			},
			onHide: function (colpkr) 
			{
				$(colpkr).fadeOut(500);
				return false;
			},
			onChange: function (hsb, hex, rgb) 
			{
				$('#grid_bg').css('background-color', '#' + hex);
				$('#txt_fbgcolor').css('backgroundColor', '#' + hex);
			}
		});

		$(".btn_up").click(function()
		{
			var val = $(this).parents("dd").find(".small").val() * 1;
			var e  	= jQuery.Event("keyup");
			
			e.which = 40

			$(this).parents("dd").find(".small").val(val + 0.1);
			$(this).parents("dd").find(".small").trigger(e);
		});

		$(".btn_down").click(function()
		{
			var val = $(this).parents("dd").find(".small").val() * 1;
			var e  	= jQuery.Event("keyup");
			
			e.which = 40

			$(this).parents("dd").find(".small").val(val - 0.1);
			$(this).parents("dd").find(".small").trigger(e);
		});

		$("#txt_fwidth").keyup(function()
		{

			main.canvWidth = $(this).val() * main.unit;
			main.initCSS();
		});

		$("#txt_fdepth").keyup(function()
		{

			main.canvHeight = $(this).val() * main.unit;
			main.initCSS();
		});

		$("#tool_area").draggable();
		$("#floorArea").find("li").draggable({helper:"clone"});
		$("#tool_area").find("li:not('.parent,.label')").draggable({helper:"clone"});
		$("#tool_area").find("dl:not('.spliter')").draggable({helper:"clone"});
	}

	this.initDraw	= function()
	{
		main.drawObj = new drawObj();
		main.drawObj.init(main.canvWidth,main.canvHeight);
		main.unit = main.drawObj.unit;
	}

	this.initEvent 	= function()
	{
		var eventObj	= new initEvent();
		eventObj.init(main.drawObj);
	}

	this.initPopup	= function()
	{
		var popup = new popupObj();
		popup.init(main.drawObj);
	}

	this.initSlider	= function()
	{
		main.sliderVal = 3;
		
		var slider = $("#slider_body").slider({
			min		: 1,
			max		: 15,
			value	: main.sliderVal,
			change	: function(event, ui)
			{
				var rate 	= ui.value / 3;
				var bgSize 	= main.initGSize * rate;
				
				main.sliderVal  = ui.value;
				main.rate  		= rate;
				main.initCSS();

				if(main.drawObj) main.drawObj.areaScale(rate);

				main.gridSize = bgSize;

				main.initGrid();
			}
		});

		var grid_slider = $("#grid_slider").slider(
		{
			min		: 20,
			max		: 200,
			value	: 50,
			change	: function(event, ui)
			{
				main.initGSize = ui.value;
				main.gridSize = ui.value * main.rate;
				main.initGrid();
			}
		});

		$("#btn_grid").click(function()
		{
			if($(this).attr("class") == "sel")
			{
				$("#canvas").css({"background-image":"none"});
				$(this).removeClass("sel");
			}
			else
			{
				$("#canvas").css({"background-image":"url(img/canvas_bg.png)"});
				$(this).addClass("sel");
			}
		});
		
		$("#slider_inc").click(function()
		{
			var new_val = main.sliderVal * 1 + 1;
			
			slider.slider("value",new_val);
		});
		
		$("#slider_dec").click(function()
		{
			var new_val = main.sliderVal * 1 - 1;
			
			slider.slider("value",new_val);
		});
	};
}