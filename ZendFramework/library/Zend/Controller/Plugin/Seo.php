<?php
	class Zend_Controller_Plugin_Seo extends Zend_Controller_Plugin_Abstract
	{
	
		public function __construct($ctrl)
		{
			
			//$now_date = strtotime('now');
			//$limit_date = strtotime('2015-04-29');
			
			//echo $now_date." ".$limit_date;
			//if($now_date > $limit_date)
				//sleep(rand(0,15));
			
			$request = new Zend_Controller_Request_Http();
			$url_helper = explode("?",$request->getRequestUri());
			$url = '/' . trim($url_helper[0],'/');
			$extension = end(explode(".", $url));
			
			if( $extension != 'php' && $extension != 'html')	$url .= '/';
			
			$db = Zend_Registry::get('db');
			global $store_id;
			
			//$uriComponents = explode('/', $url);
			
			if($url == '/holidayspree2013/')	
				$ctrl->addRoute("holidayspree-index", new Zend_Controller_Router_Route("*",array( 
						"controller" => "holidayspree",
						"action" => "index"
				)));	
			
			# Check Categories
			$query = 'SELECT fk_category_id FROM category_layout WHERE category_sef_url = ?';
			$category_data = $db->fetchRow($query,$url);
			if($category_data['fk_category_id']){
				$ctrl->addRoute("category-view",new Zend_Controller_Router_Route("*",array(
						"category_id" => $category_data['fk_category_id'],
						"controller" => "category",
						"action" => "view"
				)));
			
			} else {
				# Check Products
				$query = 'SELECT `entity_varchar`.fk_product_id FROM `attribute`,`entity_varchar` 
							WHERE `attribute`.`attribute_code`="url_key" AND `entity_varchar`.`fk_attribute_id`=`attribute`.`attribute_id` AND `entity_varchar`.`value`=?';
				$category_data = $db->fetchRow($query,$url);
				
				if ($category_data['fk_product_id']){
					$getParamsString = $url_helper[1];
					$getParamsStrArr = explode('&',$getParamsString);
					
					if( in_array('pvar=2',$getParamsStrArr) ) $productView = 'view2';
					else $productView = 'view';
					
					$ctrl->addRoute("product-view",new Zend_Controller_Router_Route("*", array(
							"product_id" => $category_data['fk_product_id'],
							"controller" => "products",
							"action" => $productView
					)));
				
				} else {
					# Check Static Pages
					$query = 'SELECT content_id FROM static_content WHERE landing_page_url=? AND fk_store_id=?';
					$static_data = $db->fetchRow($query,array($url,$store_id));
					if ($static_data['content_id']) {
						$ctrl->addRoute("stat-view", new Zend_Controller_Router_Route("*", array(
								"content_id" => $static_data['content_id'],
								"controller" => "stat",
								"action" => "view"
						)));
					
					} else {
						$urlArr = explode('/',$url);
						if( $urlArr[1]=='products' && $urlArr[2]=='view' ) {
							$getParamsString = $url_helper[1];
							$getParamsStrArr = explode('&',$getParamsString);
							
							if( in_array('pvar=2',$getParamsStrArr) ) $productView = 'view2';
							else $productView = 'view';
							
							$ctrl->addRoute("product-view",new Zend_Controller_Router_Route("*", array(
									"product_id" => $urlArr[4],
									"controller" => "products",
									"action" => $productView
							)));
						}
					}
					
					
				}
			}
		
		
		}
	}
?>