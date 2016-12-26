<?php

namespace Fuga\PublicBundle\Controller;

use Fuga\CommonBundle\Controller\PublicController;

class TavernController extends PublicController
{
	public function __construct()
	{
		parent::__construct('tavern');
	}

	public function indexAction()
	{
		$news = $this->get('container')->getItem('tavern_news', 'publish=1');
		$this->get('container')->setVar('appcss', '<link href="/bundles/public/css/app.chat.css" rel="stylesheet" media="screen">');
		$this->get('container')->setVar('appjs', '<script src="/bundles/public/js/app.chat.js"></script>');

		return $this->render('tavern/index.html.twig', compact('news'));
	}
	
}