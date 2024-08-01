<?php
    require_once("php/db.php");

    $db = new DBAccess();
    $_SESSION['User']['ID'] = 1;
    $info = $db->get_info_arr("objects","user_id=".$_SESSION['User']['ID']);

    $thumb_path  = "img/objs/2d_icon/";
    $obj_html   = "";

    for($i = 0; $i < count($info); $i++)
    {
        $obj_html .= '<li tool="image" twod="'.$info[$i]['two_obj'].'" thrd="'.$info[$i]['three_obj'].'" size="'.$info[$i]['size'].'">';
        $obj_html .= '<img src="'.$thumb_path.$info[$i]['thumb_img'].'" /></li>';
    }
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>3D Floor Plan Editing Tool</title>
<link rel="stylesheet" type="text/css" href="style/style.css" />
<link rel="stylesheet" type="text/css" href="style/overlay.css" />
<link rel="stylesheet" type="text/css" href="style/jquery-ui.css" />
<link rel="stylesheet" type="text/css" href="style/colorpicker.css" />
</head>

<script type="text/javascript" src="js/library/jquery.min.js"></script>
<script type="text/javascript" src="js/library/jquery-ui.min.js"></script>
<script type="text/javascript" src="js/library/fabric.js"></script>
<script type="text/javascript" src="js/library/colorpicker.js"></script>
<script type="text/javascript" src="js/library/ajaxfileupload.js"></script>


<script type="text/javascript" src="js/library/Three.js"></script>
<script type="text/javascript" src="js/library/Detector.js"></script>
<script type="text/javascript" src="js/library/Stats.js"></script>
<script type="text/javascript" src="js/library/OBJLoader.js"></script>
<script type="text/javascript" src="js/library/OrbitControls.js"></script>

<script type="text/javascript" src="js/mine/common/main.js"></script>
<script type="text/javascript" src="js/mine/common/event.js"></script>
<script type="text/javascript" src="js/mine/common/popup.js"></script>
<script type="text/javascript" src="js/mine/drawing/draw.js"></script>
<script type="text/javascript" src="js/mine/3dmode/3ds.js"></script>

<body>
	<div id="top_area">
        <img src="img/logo.png">
        <!--p id="mode_3d" class="unsel_mode"> 3D </p>
        <p id="mode_2d" class="sel_mode"> 2D </p-->
    </div>

    <div id="overlay"></div>
    <div id="over_overlay">
        <?php require_once("theme/overlay.html"); ?>
    </div>
    
    <div id="area_2d">
        <div id="ctrl_area">
            <ul>
                <li><img src="img/book.gif"></li>
                <li><img src="img/folder.gif"></li>
                <li><img src="img/card.gif"></li>
                <li><img src="img/fax.png"></li>
                <li class="spliter">&nbsp;</li>
                <li><img src="img/close.gif"></li>
                <li><img src="img/copy.gif"></li>
                <li class="spliter">&nbsp;</li>
                <li><img src="img/3D.gif"></li>
                <li class="spliter">&nbsp;</li>
                <li><img src="img/copy 4.gif"></li>
                <li><img src="img/copy 3.gif"></li>
                <li><img src="img/copy 2.gif"></li>
                <li><img src="img/copy 1.gif"></li>
                <li class="spliter">&nbsp;</li>
                <li><img src="img/ring.gif"></li>
                <li><img src="img/star.gif"></li>
            </ul>
        </div>

        <ul id="tool_area">
            <li class="label"><h2>Tools</h2></li>
            <li tool="text"><img src="img/icon_text.png"></li>
            <li tool="line"><img src="img/icon_line.png"></li>
            <li class="parent">
                <img src="img/icon_shape.png" id="btn_shape">
                <dd>
                    <dl tool="rect"><img src="img/icon_rectangle.png"></dl>
                    <dl class="spliter">&nbsp;</dl>
                    <dl tool="triangle"><img src="img/icon_triangle.png"></dl>
                    <dl class="spliter">&nbsp;</dl>
                    <dl tool="circle"><img src="img/icon_circle.png"></dl>
                    <dl class="spliter">&nbsp;</dl>
                    <dl tool="star"><img src="img/icon_star.png"></dl>
                    <dl class="spliter">&nbsp;</dl>
                    <dl tool="ellipse"><img src="img/icon_ellipse.png"></dl>
                </dd>
            </li>
        </ul>

        <div id="canvas_area">
            <center>Move here</center>
            <canvas id="canvas"></canvas>
            <div id="grid_bg"></div>
        </div>
        
        <div id="left_area">
            <div id="left_slider"></div>
            <h2>Please select Objects:</h2>
            
            <div class="category" id="floorArea">
                <ul>
                    <?php echo $obj_html; ?>
                    <!--li tool='image' twod="Chair with cover white map.png" thrd="Chir_whiteMap.obj" size="0.7,0.7,0.5">
                        <img src="img/objs/2d_icon/White_chir.jpeg" />
                    </li>
                    <li tool='image' twod="table_01 top.png" thrd="Table_01.obj" size="2.4,2.4,0.5">
                        <img src="img/objs/2d_icon/table_01.jpg" />
                    </li>
                    <li tool='image' twod="2_4m_SQ_table_black_noMap.png" thrd="TableSq_2_4m_black_noMap.obj" size="2.4,2.4,1.5">
                        <img src="img/objs/2d_icon/TableSq_2_4m_Black_noMap.jpeg" />
                    </li>
                    <li tool='image' twod="TableSq_2m_white_12Chairs.png" thrd="squire table with White map cover 2M with 12 chairs.obj" size="3,3,0.5">
                        <img src="img/objs/2d_icon/squire table with White map cover 2M with 12 chairs.jpg" />
                    </li>
                    <li tool='image' twod="rounded table with white map cover 2M with 11 chairs.png" thrd="rounded table with white map cover 2M with 11 chairs.obj" size="3,3,0.5">
                        <img src="img/objs/2d_icon/rounded table with white map cover 2M with 11 chairs.jpeg" /-->
                    </li>                    
                </ul>
                <div class="clear_both"></div>
            </div>
        </div>

        <img src="img/footer_label.png" id="footer_label">
        
        <div id="right_area">
            <div id="right_slider"></div>
            <h3>Properties</h3>
            <?php require_once("theme/property.html"); ?>
        </div>

        <div id="size_slider">
            <img src="img/zoom-out.png" id="slider_dec"/>
            <div id="slider_body"></div>
            <img src="img/zoom-in.png"  id="slider_inc"/>
        </div>

        <div id="move_controlT"><center><img src="img/icon-arrow-down.png" /></center></div>
   		<div id="move_controlB"><center><img src="img/icon-arrow-projectlist.png" /></center></div>
	</div>
    
    <div id="area_3d"></div>
</body>