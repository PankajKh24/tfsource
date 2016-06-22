<?php
class Zend_Controller_Plugin_MobileSwitcher extends Zend_Controller_Plugin_Abstract
{
	
	
	public function __construct($ctrl)
	{
		
 		
		# Check if mobile view exist
		//** GLO_CTRL, GLO_ACT is defined inside SEO controller plugin
		//** some controllers use layouts so this is not 100% valid method
		//$mobileViewFile= $_SERVER['DOCUMENT_ROOT'].'/application/views/mobile-scripts/'.GLO_CTRL.'/'.GLO_ACT.'.phtml';
		//session_start();
	    if ($_COOKIE['siteVer']==2  ){
			define('DEVICE','mobile');
			
		} else if( $_COOKIE['siteVer']!=1 && preg_match( "/Mobile|Android|BlackBerry|iPhone|Windows Phone/", $_SERVER['HTTP_USER_AGENT']) && !preg_match( "/iPad/", $_SERVER['HTTP_USER_AGENT']) ){
			define('DEVICE','mobile');
			
		} else {
			define('DEVICE','default');
		}

		//echo GLO_CTRL;
	}
	

}
?>