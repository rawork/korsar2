<?php

namespace Fuga\PublicBundle\Controller;

use Fuga\CommonBundle\Controller\PublicController;
use Symfony\Component\HttpFoundation\JsonResponse;

class GameController extends PublicController
{
	public function __construct()
	{
		parent::__construct('game');
	}

	public function indexAction()
	{
		return $this->redirect('/');
	}
	
	public function diceAction()
	{
		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			return $this->render('game/access.html.twig');
		}

		$this->get('container')->setVar('title', 'КОСТИ');
		$this->get('container')->setVar('h1', 'КОСТИ');
		$this->get('container')->setVar('appcss', '<link href="/bundles/public/css/sandbox.dice.css" rel="stylesheet" media="screen">');
		$this->get('container')->setVar('appjs', '<script src="/bundles/public/js/sandbox.dice.js"></script>');

		return $this->render('game/dice.html.twig');
	}

	public function taskAction()
	{
		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			return $this->render('game/access.html.twig');
		}

		$this->get('container')->setVar('title', 'СКОЛЬКО ДЕНЕГ НА ГАЛЕОНЕ?');
		$this->get('container')->setVar('h1', 'СКОЛЬКО ДЕНЕГ<br>НА ГАЛЕОНЕ?');
		$this->get('container')->setVar('appcss', '<link href="/bundles/public/css/sandbox.task.css" rel="stylesheet" media="screen">');
		$this->get('container')->setVar('appjs', '<script src="/bundles/storage/jquery.storageapi.min.js"></script><script src="/bundles/public/js/sandbox.task.js"></script>');

		return $this->render('game/task.html.twig');
	}

	public function pexesoAction()
	{
		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			return $this->render('game/access.html.twig');
		}

		$this->get('container')->setVar('title', 'ПОДГОТОВКА КОРАБЛЯ');
		$this->get('container')->setVar('h1', 'ПОДГОТОВКА КОРАБЛЯ');
		$this->get('container')->setVar('appcss', '<link href="/bundles/public/css/sandbox.pexeso.css" rel="stylesheet" media="screen">');
		$this->get('container')->setVar('appjs', '<script src="/bundles/storage/jquery.storageapi.min.js"></script><script src="/bundles/public/js/sandbox.pexeso.js"></script>');

		return $this->render('game/pexeso.html.twig');
	}

	public function mapAction()
	{
		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			return $this->render('game/access.html.twig');
		}

		$this->get('container')->setVar('title', 'ЛОЦМАНСКАЯ КАРТА');
		$this->get('container')->setVar('h1', 'ЛОЦМАНСКАЯ КАРТА');
		$this->get('container')->setVar('appcss', '<link href="/bundles/public/css/sandbox.map.css" rel="stylesheet" media="screen">');
		$this->get('container')->setVar('appjs', '<script src="/bundles/public/js/sandbox.map.js?20150630"></script>');

		return $this->render('game/map.html.twig');
	}

	public function labirintAction()
	{
		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			return $this->render('game/access.html.twig');
		}

		$this->get('container')->setVar('title', 'АБОРДАЖ ГАЛЕОНА');
		$this->get('container')->setVar('h1', 'АБОРДАЖ ГАЛЕОНА');
		$this->get('container')->setVar('appcss', '<link href="/bundles/public/css/sandbox.labirint.css" rel="stylesheet" media="screen">');
		$this->get('container')->setVar('appjs', '<script src="/bundles/storage/jquery.storageapi.min.js"></script><script src="/bundles/public/js/sandbox.labirint.js"></script>');

		return $this->render('game/labirint.html.twig');
	}

	public function marketAction()
	{
		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			return $this->render('game/access.html.twig');
		}

		$this->get('container')->setVar('title', 'ПРОДАЖА НАГРАБЛЕННОГО');
		$this->get('container')->setVar('h1', 'ПРОДАЖА НАГРАБЛЕННОГО');
		$this->get('container')->setVar('appcss', '<link href="/bundles/public/css/sandbox.market.css" rel="stylesheet" media="screen">');
		$this->get('container')->setVar('appjs', '<script src="/bundles/storage/jquery.storageapi.min.js"></script><script src="/bundles/public/js/sandbox.market.js"></script>');

		return $this->render('game/market.html.twig');
	}

	public function battleAction()
	{
		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			return $this->render('game/access.html.twig');
		}

		$this->get('container')->setVar('title', 'МОРСКОЙ БОЙ');
		$this->get('container')->setVar('h1', 'МОРСКОЙ БОЙ');
		$this->get('container')->setVar('appcss', '<link href="/bundles/public/css/sandbox.battle.css" rel="stylesheet" media="screen">');
		$this->get('container')->setVar('appjs', '<script src="/bundles/storage/jquery.storageapi.min.js"></script><script src="/bundles/public/js/sandbox.battle.js"></script>');

		return $this->render('game/battle.html.twig');
	}

	public function duelAction()
	{
		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			return $this->render('game/access.html.twig');
		}

		$this->get('container')->setVar('title', 'ДУЭЛЬ КАПИТАНОВ');
		$this->get('container')->setVar('h1', 'ДУЭЛЬ КАПИТАНОВ');
		$this->get('container')->setVar('appcss', '<link href="/bundles/public/css/sandbox.duel.css" rel="stylesheet" media="screen">');
		$this->get('container')->setVar('appjs', '<script src="/bundles/storage/jquery.storageapi.min.js"></script><script src="/bundles/public/js/sandbox.duel.js"></script>');

		return $this->render('game/duel.html.twig');
	}


	public function taskdataAction()
	{
		$response = new JsonResponse();

		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			$response->setData(array(
				'error' => 'Access denied',
			));

			return $response;
		}

		if ('POST' == $_SERVER['REQUEST_METHOD']) {
			$answer = $this->get('request')->request->getInt('answer');
			$this->get('container')->updateItem(
				'game_task',
				array('result' => $answer, 'is_answer' => 1),
				array('user_id' => $user['id'])
			);
			$response->setData(array(
				'error' => false,
			));
			return $response;
		}

		$game = $this->get('container')->getItem('game_task', 'publish=1 AND user_id='.$user['id']);
		if (!$game) {
			$response->setData(array(
				'error' => 'Игра не настроена для вашего профиля. Обратитесь к администратору',
			));

			return $response;
		}

		$dt = new \DateTime($game['start']);
		$game['start'] = $dt->getTimestamp();
		$dt = new \DateTime($game['stop']);
		$game['stop'] = $dt->getTimestamp();
		$game['current'] = time();

		$response->setData(array(
			'game' => $game,
		));

		return $response;
	}

	public function pexesodataAction()
	{
		$response = new JsonResponse();

		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			$response->setData(array(
				'error' => 'Access denied',
			));

			return $response;
		}

		if ('POST' == $_SERVER['REQUEST_METHOD']) {
			$step = $this->get('request')->request->getInt('step');
			$money = $this->get('request')->request->getInt('money');
			$this->get('container')->updateItem(
				'game_pexeso',
				array('money' => $money, 'step' => $step),
				array('user_id' => $user['id'])
			);
			$response->setData(array(
				'error' => false,
			));
			return $response;
		}

		$game = $this->get('container')->getItem('game_pexeso', 'publish=1 AND user_id='.$user['id']);
		if (!$game) {
			$response->setData(array(
				'error' => 'Игра не настроена для вашего профиля. Обратитесь к администратору',
			));

			return $response;
		}

		$dt = new \DateTime($game['start']);
		$game['start'] = $dt->getTimestamp();
		$dt = new \DateTime($game['stop']);
		$game['stop'] = $dt->getTimestamp();
		$game['current'] = time();

		$response->setData(array(
			'game' => $game,
		));

		return $response;
	}

	public function mapdataAction()
	{
		$response = new JsonResponse();

		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			$response->setData(array(
				'error' => 'Access denied',
			));

			return $response;
		}

		if ('POST' == $_SERVER['REQUEST_METHOD']) {
			$answers = array(
				"cell179" => 1,
        		"cell41" => 0.5,
        		"cell73" => 0.5,
        		"cell150"=> 0.5,
        		"cell209"=> 0.5
			);

			$cell = $this->get('request')->request->get('cell');
			$isReady = $this->get('request')->request->getInt('is_ready');
			if ($cell && isset($answers[$cell])) {
				$this->get('container')->updateItem(
					'game_map',
					array('cell' => $cell, 'ratio' => $answers[$cell]),
					array('user_id' => $user['id'])
				);
			}
			if ($isReady) {
				$this->get('container')->updateItem(
					'game_map',
					array('is_ready' => $isReady),
					array('user_id' => $user['id'])
				);
			}

			$response->setData(array(
				'error' => false,
			));
			return $response;
		}

		$game = $this->get('container')->getItem('game_map', 'publish=1 AND user_id='.$user['id']);
		if (!$game) {
			$response->setData(array(
				'error' => 'Игра не настроена для вашего профиля. Обратитесь к администратору',
			));

			return $response;
		}

		$dt = new \DateTime($game['start']);
		$game['start'] = $dt->getTimestamp();
		$dt = new \DateTime($game['stop']);
		$game['stop'] = $dt->getTimestamp();
		$game['current'] = time();

		$response->setData(array(
			'error' => false,
			'game' => $game,
		));

		return $response;
	}

	public function marketdataAction()
	{
		$response = new JsonResponse();

		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			$response->setData(array(
				'error' => 'Access denied',
			));

			return $response;
		}

		if ('POST' == $_SERVER['REQUEST_METHOD']) {
			$money = $this->get('request')->request->getInt('money');
			$this->get('container')->updateItem(
				'game_market',
				array('money' => $money),
				array('user_id' => $user['id'])
			);
			$response->setData(array(
				'error' => false,
			));
			return $response;
		}

		$game = $this->get('container')->getItem('game_market', 'publish=1 AND user_id='.$user['id']);
		if (!$game) {
			$response->setData(array(
				'error' => 'Игра не настроена для вашего профиля. Обратитесь к администратору',
			));

			return $response;
		}

		$dt = new \DateTime($game['start']);
		$game['start'] = $dt->getTimestamp();
		$dt = new \DateTime($game['stop']);
		$game['stop'] = $dt->getTimestamp();
		$game['current'] = time();

		$response->setData(array(
			'game' => $game,
		));

		return $response;
	}

	public function marketquestionAction()
	{
		$response = new JsonResponse();

		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			$response->setData(array(
				'error' => 'Access denied',
			));

			return $response;
		}

		if ('POST' == $_SERVER['REQUEST_METHOD']) {
			$questionId = $this->get('request')->request->get('question');
			$table = $this->get('request')->request->get('table');
			$question = $this->get('container')->getItem($table, $questionId);
			if ($question) {
				$response->setData(array(
					'error' => false,
					'question' => $question,
				));

				return $response;
			} else {
				$response->setData(array(
					'error' => 'Вопрос не найден. Обратитесь к администратору.',
				));

				return $response;
			}
		}

	}

	public function dueldataAction()
	{
		$response = new JsonResponse();

		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			$response->setData(array(
				'error' => 'Access denied',
			));

			return $response;
		}

		$response->setData(array(
			'questions' => $this->get('container')->getItem('question_duel'),
		));

		return $response;
	}
	
}