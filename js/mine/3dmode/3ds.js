/*
	HTML5 3D Engine for manage various 3D objects.
				-------
	Created by Giryong Jong.
				-------
	Versioin 1.0	Date:2014.2.19
*/

var Obj3D			= function()
{
	var main		= this;

	/* main variables for set up env */

	main.container 	= null;
	main.scene 		= null;
	main.camera 	= null;
	main.renderer	= null;
	main.controls 	= null;

	main.canvID 	= "";
	main.sWidth 	= 0;
	main.sHeight 	= 0;

	main.fWidth 	= 1000;
	main.fHeight 	= 1000;

	main.numTotal	= 0;
	main.numLoaded	= 0;

	main.objArr 	= null;
	main.loadedArr 	= null;
	main.unit 		= 50;

	main.init 		= function(id,unit)
	{
		main.canvID = id;
		main.unit 	= unit;

		main.sWidth = window.innerWidth;
		main.sHeight= window.innerHeight;

		main.init3DEnv();
	}

	main.init3DEnv	= function()
	{
		main.scene 	= new THREE.Scene();

		main.initCamera();
		main.initLights();
		main.initFloor();
		main.initRenderer();
		main.initControls();
		main.loadManager();
	}

	main.animate 	= function()
	{
		requestAnimationFrame( main.animate );
		main.renderer.render( main.scene, main.camera );

		main.scene.traverse (function (object)
		{
			if(object.type == "obj")
			{
				if(object.material)	object.material.dispose();
		    	if(object.geometry) object.geometry.dispose();
		    	if(object.texture) object.texture.dispose();
		    }
		});

		main.controls.update();
	}

	main.initCamera	= function()
	{
		var angle 	= 50;
		var near 	= 1;
		var far 	= 2000;
		var aspect 	= main.sWidth / main.sHeight;

		main.camera	= new THREE.PerspectiveCamera( angle, aspect, near, far);
		main.scene.add(main.camera);

		main.camera.position.set(100,250,300);
		main.camera.lookAt(main.scene.position);
		main.camera.position.z = 1000;
	}

	main.initRenderer 	= function()
	{
		if ( Detector.webgl )
			main.renderer = new THREE.WebGLRenderer( {antialias:true} );
		else
			main.renderer = new THREE.CanvasRenderer(); 

		main.renderer.setSize(main.sWidth, main.sHeight);

		main.renderer.gammaInput = true;
		main.renderer.gammaOutput = true;
		main.renderer.shadowMapEnabled = true;
		main.renderer.shadowMapCascade = true;
		main.renderer.shadowMapType = THREE.PCFSoftShadowMap;

		main.container = document.getElementById(main.canvID);
		main.container.appendChild(main.renderer.domElement);
	}

	main.initControls 	= function()
	{
		main.controls 	= new THREE.OrbitControls( main.camera, main.renderer.domElement );
		main.controls.update();
	}

	main.initLights 	= function()
	{
  		var light 		= new THREE.DirectionalLight( 0xFFFFFF );
		var hemiLight 	= new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.3 );

        hemiLight.color.setHSL( 0.58, 0.16, 0.88 );
        hemiLight.groundColor.setHSL( 0.095, 0.5, 0.5 );
        hemiLight.position.set( 0, main.sWidth / 2, 0 );

		light.position.set( -320, 200, 50 );
		light.target.position.copy( main.scene.position );
		light.castShadow = true;

		main.scene.add( hemiLight );
		main.scene.add( light );

		// main.scene.add( new THREE.DirectionalLightHelper(light, 2.5) );
	}

	main.initFloor 		= function()
	{
		var groundGeo = new THREE.PlaneGeometry( main.fWidth, main.fHeight );
		var groundMat = new THREE.MeshBasicMaterial( { color:0xf0f0f0, overdraw: true, side:THREE.DoubleSide } );

		var ground = new THREE.Mesh( groundGeo, groundMat );
			ground.rotation.x = -Math.PI/2;
			ground.name = "floor";
		
		main.scene.add( ground );

		ground.castShadow 	= true;
		ground.receiveShadow = true;
	}

	main.setFloor 		= function(width,height,color,texture)
	{
		var floorMaterial = null;
		var floorTexture  = null;

		main.fWidth 	= width;
		main.fHeight 	= height;

		if(color == "") color = "#fff";

		if(texture)
		{
			floorTexture = new THREE.ImageUtils.loadTexture(texture);
			floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
			floorTexture.repeat.set( width, height );
			floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
		}
		else
		{
			floorMaterial = new THREE.MeshBasicMaterial( { color:0xf0f0f0, overdraw: true, side:THREE.DoubleSide } );
		}

		main.scene.traverse (function (object)
		{
		    if (object.name == "floor")
		    {
		    	var box  = new THREE.Box3().setFromObject( object );
				var size = box.size();

		    	object.material = floorMaterial;

				object.scale.x = width / size.x;
				object.scale.y = height / size.z;
		    }
		});

		//main.renderer.render( main.scene, main.camera );
	}

	main.loadManager	= function()
	{
		main.manager = new THREE.LoadingManager();
		main.loader  = new THREE.OBJLoader( main.manager );;
		
		main.manager.onProgress = function ( item, loaded, total )
		{
			
		};
	}

	main.initLoad		= function(objArr)
	{
		main.loadedArr	= new Array();
		main.objArr 	= objArr;
		main.numTotal 	= objArr.length;
		main.numLoaded 	= 0;

		$("#s_load").html(main.numLoaded);
		$("#s_total").html(main.numTotal);

		$("#overlay").css("display","inline");
		$(".popup").css("display","none");
		$("#loading_area").css("display","block");
		$("#over_overlay").fadeIn();

		main.placeAllObjs();
	}

	main.placeAllObjs	= function()
	{
		$("#s_load").html(main.numLoaded);
		$("#s_total").html(main.numTotal);

		if(main.numTotal - 1 >= main.numLoaded)
		{
			var type 	= main.objArr[main.numLoaded].type;
			var x 	 	= main.objArr[main.numLoaded].x;
			var y 	 	= main.objArr[main.numLoaded].y;
			var obj 	= main.objArr[main.numLoaded].obj;
			var width 	= main.objArr[main.numLoaded].width;
			var height 	= main.objArr[main.numLoaded].height;
			var depth 	= main.objArr[main.numLoaded].depth;
			var color 	= main.objArr[main.numLoaded].color;
			var angle 	= main.objArr[main.numLoaded].angle;
			var pArr 	= main.objArr[main.numLoaded].points;

			main.numLoaded ++;
			main.placeOBJ(obj,type,x,y,width,height,depth,color,angle,pArr)
		}
		else
		{
			$("#overlay").fadeOut();
			$("#overlay_image").css("display","block");
			$("#loading_area").css("display","none");
			$("#over_overlay").css("display","none");
			$("#area_3d").css("display","block");

			main.animate();
		}
	}

	main.placeOBJ		= function(obj,type,x,y,width,height,depth,obj_color,angle,pointArr)
	{
		console.log(x,y,width,height,depth,obj_color,angle,pointArr);

		if(!obj)
		{
			var object,geometry,cylinder,ratio;
			var material = new THREE.MeshPhongMaterial(
			{
				specular: 0xFFFFFF,	// light
				color: obj_color,		// intermediate
				emissive: '#000000',	// dark
				shininess: 100 
			});

			if(!depth) depth = 5;


			switch(type)
			{
				case "line"	:
					object = new THREE.Mesh(new THREE.CubeGeometry(width,depth,height), material);
					object.overdraw = true;
				break;

				case "rect"	:
					object 	= new THREE.Mesh(new THREE.CubeGeometry(width,depth,height), material);
					object.overdraw = true;
				break;

				case "triangle"	:
					ratio 	 = Math.min(width / 2, height / 2);
					geometry = new THREE.CylinderGeometry( ratio, ratio, depth, 3,false );
					object 	 = new THREE.Mesh( geometry, material );

					object.scale.x = (width / 2) / ratio;
					object.scale.y = (height / 2) /ratio;
				break;

				case "circle" :
					ratio 	 = Math.min(width / 2, height / 2);
					geometry = new THREE.CylinderGeometry( width / 2, width / 2, depth, 30,4 );
					object   = new THREE.Mesh( geometry, material );

					object.scale.x = (width / 2) / ratio;
					object.scale.y = (height / 2) /ratio;
				break;

				case "star" :
					var starPoints = [];

					if(!pointArr || pointArr.length == 0) return;

					for(var i = 0; i < 10; i ++)
					{
						starPoints.push( new THREE.Vector2 (pointArr[i].x, pointArr[i].y ) );
					}

					var starShape = new THREE.Shape( starPoints );
					var extrusionSettings = {amount:depth};
					var starGeometry = new THREE.ExtrudeGeometry( starShape, extrusionSettings );

					object = new THREE.Mesh( starGeometry, material );

					var box  = new THREE.Box3().setFromObject( object );
					var size = box.size();

					object.rotation.x = Math.PI/2;

					object.scale.x = width / size.x;
					object.scale.y = height / size.y;
					object.scale.z = depth / size.z;

					depth = 4;
				break;

				case "ellipse" :
					ratio 	 = Math.min(width / 2, height / 2);
					geometry = new THREE.CylinderGeometry( ratio, ratio, depth, 30,4 );
					object 	 = new THREE.Mesh( geometry, material );

					object.scale.x = (width / 2) / ratio;
					object.scale.y = (height / 2) /ratio;
				break;
			}

			if(!object) 
			{
				main.placeAllObjs();
				return;
			}

			object.position.set(x - main.fWidth / 2 + width / 2, depth / 2,y - main.fHeight / 2 + height / 2);
			object.rotation.y = (angle - 180) * (Math.PI / 180) * (-1);
			object.castShadow 	= true;

			main.scene.add(object);

			object = null;
			delete object;

			if(geometry)
			{
				geometry.dispose();
				geometry = null;
				delete geometry;
			}

			if(material)
			{
				material.dispose();
				material = null;
				delete material;
			}

			if(cylinder)
			{
				cylinder = null;
				delete cylinder;
			}

			main.placeAllObjs();
		}
		else
		{
			var obj_index 	= main.chkObjExist(obj);

			if(obj_index != -1)
			{
				var object 		= main.loadedArr[obj_index].clone();
				var size 		= main.loadedArr[obj_index].size;
				
				object.traverse (function (child)
				{
				    var material = new THREE.MeshPhongMaterial(
					{
						color: obj_color,
						shininess: 2.000,
						ambient: 0x969696,
						side: THREE.FrontSide,
						specular: 0xE5E5E5
					});

					child.material = material;
					child.castShadow 	= true;
					child.receiveShadow = true;

					material.dispose();
					delete material;
				});

				object.castShadow 	= true;
				object.receiveShadow = true;
				object.position.set(x - main.fWidth / 2 + size.x / 2,0,y - main.fHeight / 2 + size.z / 2);
				object.rotation.y = angle * (Math.PI / 180) * (-1);

				main.scene.add(object);

				object = null;
				delete object;

				main.placeAllObjs();
			}
			else
			{
				main.loader.load( obj, function ( object )
				{
					object.traverse (function (child)
					{
					    var material = new THREE.MeshPhongMaterial(
						{
							color: obj_color,
							shininess: 2.000,
							ambient: 0x969696,
							side: THREE.FrontSide,
							specular: 0xE5E5E5
						});

						child.material = material;
						child.castShadow 	= true;
						child.receiveShadow = true;

						material.dispose();
						delete material;
					});

					var box  = new THREE.Box3().setFromObject( object );
					var size = box.size();

					// object.scale.x = width / size.x;
					// object.scale.y = depth / size.y;
					// object.scale.z = height / size.z;

					object.castShadow 	= true;
					object.receiveShadow = true;
					object.position.set(x - main.fWidth / 2 + size.x / 2,0,y - main.fHeight / 2 + size.z / 2);
					object.rotation.y = angle * (Math.PI / 180) * (-1);
					object.size = size;
					object.type = "obj";
					object.path = obj;

					main.scene.add(object);
					main.loadedArr.push(object);
					
					object = null;
					delete object;

					main.placeAllObjs();
				});
			}
		}
	}

	main.chkObjExist	= function(obj_path)
	{
		if(!main.loadedArr)
			return -1;

		for(var i = 0; i < main.loadedArr.length; i ++)
		{
			if(main.loadedArr[i].path == obj_path)
				return i
		}

		return -1;
	}
}
