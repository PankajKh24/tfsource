<?php
error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);
//error_reporting(E_ALL|E_STRICT);
//date_default_timezone_set('Europe/London');

date_default_timezone_set('America/Chicagos');

//error_reporting(8191);
ini_set("display_errors",0);

ini_set('open_basedir','none');

set_include_path('.' . PATH_SEPARATOR . './ZendFramework/library/'
	 . PATH_SEPARATOR . './library/'
	 . PATH_SEPARATOR . './application/models/'
	 . PATH_SEPARATOR . './admin/application/models/'
	 . PATH_SEPARATOR . './application/lib/'
	 . PATH_SEPARATOR . get_include_path());

require_once "ZendFramework/library/Zend/Loader/Autoloader.php";
$autoloader = Zend_Loader_Autoloader::getInstance();
$autoloader->setFallbackAutoloader(true);

// load configuration
$config = new Zend_Config_Ini('./application/config.ini', 'general');
Zend_Registry::set('config', $config);

// setup database
$db = Zend_Db::factory($config->db->adapter, 
$config->db->config->toArray());
Zend_Db_Table::setDefaultAdapter($db);
Zend_Registry::set('db', $db);

$store_id = 5;
Zend_Registry::set('store_id', $store_id);

// setup controller
require_once 'Zend/Controller/Plugin/Seo.php';
require_once 'Zend/Controller/Plugin/MobileSwitcher.php';

// MEMCACHED SECTION START
// configure caching backend strategy
$oBackend = new Zend_Cache_Backend_Memcached(
	array(
		'servers' => array( array(
			'host' => '127.0.0.1',
			'port' => '11211'
		) ),
		'compression' => true
) );

// configure caching logger
$oCacheLog =  new Zend_Log();
$oCacheLog->addWriter( new Zend_Log_Writer_Stream( 'file:///tmp/pr-memcache.log' ) );

// configure caching frontend strategy
$oFrontend = new Zend_Cache_Core(
	array(
		'caching' => true,
		'cache_id_prefix' => 'myApp',
		'logging' => true,
		'logger'  => $oCacheLog,
		'write_control' => true,
		'automatic_serialization' => true,
		'ignore_user_abort' => true
	) );

// build a caching object
$oCache = Zend_Cache::factory( $oFrontend, $oBackend );
// MEMCACHED SECTION ENDS

$frontController = Zend_Controller_Front::getInstance();
//$frontController->throwExceptions(true);
$frontController->throwExceptions(false);
$frontController->setControllerDirectory('./application/controllers');
$frontController->registerPlugin(new Zend_Controller_Plugin_Seo($frontController->getRouter()));
$frontController->registerPlugin(new Zend_Controller_Plugin_MobileSwitcher($frontController->getRouter()));

// run!
$frontController->dispatch();