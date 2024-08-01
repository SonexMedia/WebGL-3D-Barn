-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 10, 2014 at 01:51 PM
-- Server version: 5.6.12-log
-- PHP Version: 5.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `floor`
--
CREATE DATABASE IF NOT EXISTS `floor` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `floor`;

-- --------------------------------------------------------

--
-- Table structure for table `objects`
--

CREATE TABLE IF NOT EXISTS `objects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `two_obj` text NOT NULL,
  `three_obj` text NOT NULL,
  `thumb_img` text NOT NULL,
  `size` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `objects`
--

INSERT INTO `objects` (`id`, `user_id`, `two_obj`, `three_obj`, `thumb_img`, `size`) VALUES
(1, 1, 'Chair with cover white map.png', 'Chir_whiteMap.obj', 'White_chir.jpeg', '0.7,0.7,0.5'),
(2, 1, 'table_01 top.png', 'Table_01.obj', 'table_01.jpg', '2.4,2.4,0.5'),
(3, 1, '2_4m_SQ_table_black_noMap.png', 'TableSq_2_4m_black_noMap.obj', 'TableSq_2_4m_Black_noMap.jpeg', '2.4,2.4,1.5'),
(4, 1, 'TableSq_2m_white_12Chairs.png', 'squire table with White map cover 2M with 12 chairs.obj', 'squire table with White map cover 2M with 12 chairs.jpg', '3,3,0.5'),
(5, 1, 'rounded table with white map cover 2M with 11 chairs.png', 'rounded table with white map cover 2M with 11 chairs.obj', 'rounded table with white map cover 2M with 11 chairs.jpeg', '3,3,0.5');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_project`
--

CREATE TABLE IF NOT EXISTS `tbl_project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` text NOT NULL,
  `descr` text NOT NULL,
  `data` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `tbl_project`
--

INSERT INTO `tbl_project` (`id`, `user_id`, `title`, `descr`, `data`) VALUES
(7, 0, 'new', 'testing', '[{"obj":"img/objs/3d_objs/squire table with White map cover 2M with 12 chairs.obj","type":"image","x":384,"y":249.21875,"width":150,"height":150,"depth":"0.5","color":"","angle":0,"points":null,"url":"img/objs/2d_shape/TableSq_2m_white_12Chairs.png","canvScale":1},{"obj":"img/objs/3d_objs/rounded table with white map cover 2M with 11 chairs.obj","type":"image","x":373,"y":99.21875,"width":150,"height":150,"depth":"0.5","color":"","angle":0,"points":null,"url":"img/objs/2d_shape/rounded table with white map cover 2M with 11 chairs.png","canvScale":1},{"obj":"img/objs/3d_objs/TableSq_2_4m_black_noMap.obj","type":"image","x":217,"y":230.21875,"width":120,"height":120,"depth":"1.5","color":"","angle":0,"points":null,"url":"img/objs/2d_shape/2_4m_SQ_table_black_noMap.png","canvScale":1},{"obj":"img/objs/3d_objs/Table_01.obj","type":"image","x":255,"y":89.21875,"width":120,"height":120,"depth":"0.5","color":"","angle":0,"points":null,"url":"img/objs/2d_shape/table_01 top.png","canvScale":1}]'),
(8, 0, 'Hello', 'This is good', '[{"obj":"img/objs/3d_objs/rounded table with white map cover 2M with 11 chairs.obj","type":"image","x":200.49999904632568,"y":222.1640625,"width":150,"height":150,"depth":"0.5","color":"","angle":0,"points":null,"url":"img/objs/2d_shape/rounded table with white map cover 2M with 11 chairs.png","canvScale":1.3333333333333333},{"obj":"img/objs/3d_objs/squire table with White map cover 2M with 12 chairs.obj","type":"image","x":402.2499990463257,"y":172.6640625,"width":150,"height":150,"depth":"0.5","color":"","angle":0,"points":null,"url":"img/objs/2d_shape/TableSq_2m_white_12Chairs.png","canvScale":1.3333333333333333},{"obj":"img/objs/3d_objs/Chir_whiteMap.obj","type":"image","x":300.9999990463257,"y":159.1640625,"width":35,"height":35,"depth":"0.5","color":"","angle":0,"points":null,"url":"img/objs/2d_shape/Chair with cover white map.png","canvScale":1.3333333333333333},{"obj":"img/objs/3d_objs/TableSq_2_4m_black_noMap.obj","type":"image","x":312.9999990463257,"y":9.9140625,"width":120,"height":120,"depth":"1.5","color":"","angle":0,"points":null,"url":"img/objs/2d_shape/2_4m_SQ_table_black_noMap.png","canvScale":1.3333333333333333},{"obj":"img/objs/3d_objs/Table_01.obj","type":"image","x":158,"y":55.21875,"width":120,"height":120,"depth":"0.5","color":"","angle":0,"points":null,"url":"img/objs/2d_shape/table_01 top.png","canvScale":1.3333333333333333}]'),
(9, 0, 'Chairs arround table', 'Chairs arround table with 4 chairs', ''),
(10, 0, 'saving', '', '[{"obj":"img/objs/3d_objs/TableSq_2_4m_black_noMap.obj","type":"image","x":215,"y":226.21875,"width":120,"height":120,"depth":"1.5","color":"","angle":0,"points":null,"url":"img/objs/2d_shape/2_4m_SQ_table_black_noMap.png","canvScale":1},{"obj":"img/objs/3d_objs/Table_01.obj","type":"image","x":351,"y":88.21875,"width":120,"height":120,"depth":"0.5","color":"","angle":0,"points":null,"url":"img/objs/2d_shape/table_01 top.png","canvScale":1}]'),
(11, 0, 'New Table with chairs', 'New table', ''),
(12, 0, 'Real Rotation', 'rotation', '[{"obj":"img/objs/3d_objs/TableSq_2_4m_black_noMap.obj","type":"image","x":594,"y":167.21875,"width":120,"height":120,"depth":"1.5","color":"","angle":0,"points":null,"url":"img/objs/2d_shape/2_4m_SQ_table_black_noMap.png","canvScale":1},{"obj":"img/objs/3d_objs/img/objs/3d_objs/Table_01.obj","type":"image","x":331,"y":154.21875,"width":120,"height":120,"depth":"0.01","color":"","angle":0,"points":null,"url":"img/objs/2d_shape/table_01 top.png","canvScale":1},{"obj":"img/objs/3d_objs/img/objs/3d_objs/Chir_whiteMap.obj","type":"image","x":375,"y":98.21875,"width":35,"height":35,"depth":"0.01","color":"","angle":0,"points":null,"url":"img/objs/2d_shape/Chair with cover white map.png","canvScale":1},{"obj":"img/objs/3d_objs/img/objs/3d_objs/Chir_whiteMap.obj","type":"image","x":260,"y":192.21875,"width":35,"height":35,"depth":"0.01","color":"","angle":0,"points":null,"url":"img/objs/2d_shape/Chair with cover white map.png","canvScale":1},{"obj":"img/objs/3d_objs/img/objs/3d_objs/Chir_whiteMap.obj","type":"image","x":472,"y":198.21875,"width":35,"height":27.00954861111111,"depth":"0.01","color":"","angle":0,"points":null,"url":"img/objs/2d_shape/Chair with cover white map.png","canvScale":1},{"obj":"img/objs/3d_objs/img/objs/3d_objs/Chir_whiteMap.obj","type":"image","x":367.00000000000006,"y":295.21875000000006,"width":35,"height":35,"depth":"0.01","color":"","angle":0,"points":null,"url":"img/objs/2d_shape/Chair with cover white map.png","canvScale":1}]');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
