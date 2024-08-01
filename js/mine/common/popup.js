var popupObj 	= function()
{
	var main 	= this;
	
	main.drawObj = null;

	this.init 		= function(drawObj)
	{
		this.initEvt();
		this.drawObj = drawObj;
	}

	this.initEvt 	= function()
	{
		$(".overlay_close").click(function()
		{
			$("#overlay").fadeOut();
			$("#over_overlay").css("display","none");
		});

		$("#txt_fbgimage").click(function()
		{
			$(".popup").css("display","none");
			$("#overlay_image").css({"display":""});
			$("#overlay").css("display","inline");
			$("#over_overlay").fadeIn();
		});

		$("#btn_useimage").click(function()
		{
			$(".preview_area").html("<img src='" + $("#img_url").val() + "'>");
		});

		$("#project_list").on("change",function()
		{
			var descr = $(this).children(":selected").attr("descr");

			$("#view_pdescr").html(descr);
		});

		$("#upload_btn").click(function()
		{

			$("#loading").ajaxStart(function(){ $(this).show();	});
			$("#loading").ajaxComplete(function(){ $(this).hide(); });

			$.ajaxFileUpload(
			{
				url:'php/doajaxfileupload.php',
				secureuri:false,
				fileElementId:'fileToUpload',
				dataType: 'json',
				data:{name:'logan', id:'id'},
				success: function (data, status)
				{
					if(typeof(data.error) != 'undefined')
					{
						if(data.error != '')
						{
							alert(data.error);
						}else
						{
							$(".preview_area").html(data.msg);
						}
					}
				},
				error: function (data, status, e)
				{
					alert(e);
				}
			});
			
			return false;
		});

		$("#btn_addimg").click(function()
		{
			var url = $(".preview_area").children("img").attr("src");

			if($(".preview_area").html() == "") 
			{
				alert("Please select one file");
				return;
			}

			$("#txt_fbgimage").val(url);
			$("#overlay").fadeOut();
			$("#over_overlay").css("display","none");

			$("#canvas").css({"background-image":"url(" + url + ")"});
		});

		$("#btn_addprj").click(function()
		{
			var title 	= $("#project_title").val();
			var descr	= $("#project_descr").val();
			var data 	= $(this).data("canv_data");

			$.ajax(
			{
				type: "POST",
				url: "php/ajax.php", 
				data: ({mode:'create_project',title:title,descr:descr,data:data}),
				cache: false,
				success: function(result)
				{
					projectID = result;

					$("#overlay").fadeOut();
					$("#over_overlay").css("display","none");

					alert("Successfullyl Saved!");
				}
			});
		});

		$("#btn_selprj").click(function()
		{
			var data 	= $("#project_list").children(":selected").attr("data");

			var obj 	= JSON.parse(data);
			var size 	= "";
			var url_3d 	= "";
			var url_2d 	= "";
			var unit 	= main.drawObj.unit;
			var rate 	= main.drawObj.prevScale / obj[0]['canvScale'];

			main.drawObj.canvas.clear().renderAll();

			for(var i = 0; i < obj.length; i ++)
			{
				url_3d 	= obj[i]['obj'];
				url_2d 	= obj[i]['url'].replace("img/objs/2d_shape/","");
				size 	= obj[i]['width'] / unit + "," + obj[i]['height'] / unit + "," + obj[i]['depth'] / unit;

				main.drawObj.addObject(obj[i]['type'],obj[i]['x'] * rate,obj[i]['y'] * rate,url_2d,size,url_3d)
			}

			projectID = $("#project_list").children(":selected").val();

			$("#overlay").fadeOut();
			$("#over_overlay").css("display","none");
		});
	}
}