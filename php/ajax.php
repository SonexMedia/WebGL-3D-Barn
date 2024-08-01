<?php
	session_start();

	$mode 	= $_POST['mode'];
	$db 	= new DBAccess();
	$uid 	= $_SESSION['User']['ID'];

	switch ($mode)
	{
		case 'create_project':

			$sql  = "INSERT INTO tbl_project SET ";
			$sql .= " user_id='".$uid."'";
			$sql .= ", title='".$_POST['title']."'";
			$sql .= ", descr='".$_POST['descr']."'";
			$sql .= ", data='".$_POST['data']."'";

			$db->run_sql($sql);

			echo mysql_insert_id();

			break;

		case "get_projectlist":
			$html 	= "";
			$arr 	= $db->get_info_arr("tbl_project","user_id='".$uid."'");

			for($i = 0; $i < count($arr); $i++)
			{
				$html .= "<option value='".$arr[$i]['id']."' descr='".$arr[$i]['descr']."' data='".$arr[$i]['data']."'>".$arr[$i]['title']."</option>";
			}

			echo $html;
		break;

		case "update_project":

			$sql  = "UPDATE tbl_project SET";
			$sql .= " data='".$_POST['data']."'";
			$sql .= " WHERE id=".$_POST['proID'];

			$db->run_sql($sql);
		break;
		
		default:
			# code...
			break;
	}
?>