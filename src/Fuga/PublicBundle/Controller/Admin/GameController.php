<?php

namespace Fuga\PublicBundle\Controller\Admin;


use Fuga\AdminBundle\Controller\AdminController;
use Symfony\Component\HttpFoundation\Response;

class GameController extends AdminController
{
	public function index($state, $module)
	{
		$roles = $this->get('container')->getItems('pirate_prof', '1=1');

		return new Response($this->render('game/admin/index', compact('roles', 'state', 'module')));
	}

	public function task()
	{

	}

	public function pexeso()
	{

	}

	public function map()
	{

	}

	public function labirint()
	{

	}

	public function market()
	{

	}

	public function battle()
	{

	}

	public function duel()
	{

	}
}