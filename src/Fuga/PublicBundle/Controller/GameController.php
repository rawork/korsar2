<?php

namespace Fuga\PublicBundle\Controller;

use Fuga\CommonBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class GameController extends Controller
{
	public function index()
	{
		return $this->redirect('/');
	}
	
	public function dice()
	{
		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			return $this->render('game/access');
		}

		$this->get('container')->setVar('title', 'КОСТИ');
		$this->get('container')->setVar('h1', 'КОСТИ');
		$this->addCss('/bundles/public/css/sandbox.dice.css');
		$this->addJs('/bundles/public/js/sandbox.dice.js');

		return $this->render('game/dice');
	}

	public function task()
	{
		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			return $this->render('game/access');
		}

		$this->get('container')->setVar('title', 'СКОЛЬКО ДЕНЕГ НА ГАЛЕОНЕ?');
		$this->get('container')->setVar('h1', 'СКОЛЬКО ДЕНЕГ<br>НА ГАЛЕОНЕ?');
		$this->addCss('/bundles/public/css/sandbox.task.css');
		$this->addJs('/bundles/storage/jquery.storageapi.min.js');
		$this->addJs('/bundles/public/js/sandbox.task.js');

		return $this->render('game/task');
	}

	public function pexeso()
	{
		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			return $this->render('game/access');
		}

		$this->get('container')->setVar('title', 'ПОДГОТОВКА КОРАБЛЯ');
		$this->get('container')->setVar('h1', 'ПОДГОТОВКА КОРАБЛЯ');
		$this->addCss('/bundles/public/css/sandbox.pexeso.css');
		$this->addJs('/bundles/storage/jquery.storageapi.min.js');
		$this->addJs('/bundles/public/js/sandbox.pexeso.js');

		return $this->render('game/pexeso');
	}

	public function map()
	{
		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			return $this->render('game/access');
		}

		$this->get('container')->setVar('title', 'ЛОЦМАНСКАЯ КАРТА');
		$this->get('container')->setVar('h1', 'ЛОЦМАНСКАЯ КАРТА');
		$this->addCss('/bundles/public/css/sandbox.map.css');
		$this->addJs('/bundles/public/js/sandbox.map.js');

		return $this->render('game/map');
	}

	public function labirint()
	{
		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			return $this->render('game/access');
		}

		$this->get('container')->setVar('title', 'АБОРДАЖ ГАЛЕОНА');
		$this->get('container')->setVar('h1', 'АБОРДАЖ ГАЛЕОНА');
		$this->addCss('/bundles/public/css/sandbox.labirint.css');
		$this->addJs('/bundles/storage/jquery.storageapi.min.js');
		$this->addJs('/bundles/public/js/sandbox.labirint.js');

		return $this->render('game/labirint');
	}

	public function market()
	{
		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			return $this->render('game/access');
		}

		$this->get('container')->setVar('title', 'ПРОДАЖА НАГРАБЛЕННОГО');
		$this->get('container')->setVar('h1', 'ПРОДАЖА НАГРАБЛЕННОГО');
		$this->addCss('/bundles/public/css/sandbox.market.css');
		$this->addJs('/bundles/storage/jquery.storageapi.min.js');
		$this->addJs('/bundles/public/js/sandbox.market.js');

		return $this->render('game/market');
	}

	public function battle()
	{
		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			return $this->render('game/access');
		}

		$this->get('container')->setVar('title', 'МОРСКОЙ БОЙ');
		$this->get('container')->setVar('h1', 'МОРСКОЙ БОЙ');
		$this->addCss('/bundles/public/css/sandbox.battle.css');
		$this->addJs('/bundles/storage/jquery.storageapi.min.js');
		$this->addJs('/bundles/public/js/sandbox.battle.js');

		return $this->render('game/battle');
	}

	public function duel()
	{
		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			return $this->render('game/access');
		}

		$this->get('container')->setVar('title', 'ДУЭЛЬ КАПИТАНОВ');
		$this->get('container')->setVar('h1', 'ДУЭЛЬ КАПИТАНОВ');
		$this->addCss('/bundles/public/css/sandbox.duel.css');
		$this->addJs('/bundles/storage/jquery.storageapi.min.js');
		$this->addJs('/bundles/public/js/sandbox.duel.js');

		return $this->render('game/duel');
	}


	public function taskdata()
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

		$testMode = $this->getManager('Fuga:Common:Param')->findByName('game', 'test_mode');
		$start = $this->getManager('Fuga:Common:Param')->findByName('game', 'task_start');
		$duration = $this->getManager('Fuga:Common:Param')->findByName('game', 'task_duration');

		$game = $this->get('container')->getItem('game_task', 'publish=1 AND user_id='.$user['id']);
		if ($testMode) {

			// В тестовом режиме игра начинается с текущего момента
			$start = date('Y-m-d H:i:s');

			// В тестовом режиме всегда начинаем с начала при перезагрузке страницы
			if (!$game) {
				$this->get('container')->addItem(
					'game_task',
					[
						'user_id' => $user['id'],
						'start' => $start,
						'duration' => $duration,
						'created' => date('Y-m-d H:i:s'),
						'publish' => 1,
					]
				);
			} else {
				$this->get('container')->updateItem(
					'game_task',
					[
						'start' => $start,
						'duration' => $duration,
						'updated' => date('Y-m-d H:i:s'),
						'result' => 0,
						'is_answer' => 0,
						'publish' => 1,
					],
					['id' => $game['id']]
				);

				$game = $this->get('container')->getItem('game_task', 'publish=1 AND user_id='.$user['id']);
			}

		} elseif (!$game) {
			/*
			 *  При отсутствии игры для текущего игрока создаем ее в тестовом режиме для всех,
			 *  в боевом режиме для Капитанов, Помощников и юнг
			 */
			if  ($user['group_id'] == 1 || in_array($user['role_id'], [CAPTAIN_ROLE, SHIPBOY_ROLE, HELPER_ROLE])){
				$this->get('container')->addItem(
					'game_task',
					[
						'user_id' => $user['id'],
						'start' => $start,
						'duration' => $duration,
						'created' => date('Y-m-d H:i:s'),
						'publish' => 1,
					]
				);

				$game = $this->get('container')->getItem('game_task', 'publish=1 AND user_id='.$user['id']);
			}
		}

		if(!$game) {
			$response->setData(array(
				'error' => 'У вас нет доступа к данной игре. Обратитесь к администратору',
			));

			return $response;
		}

		$game['start'] = strtotime($game['start']);
		$game['current'] = time();

		$response->setData(array(
			'game' => $game,
		));

		return $response;
	}

	public function pexesodata()
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

		$testMode = $this->getManager('Fuga:Common:Param')->findByName('game', 'test_mode');
		$start = $this->getManager('Fuga:Common:Param')->findByName('game', 'pexeso_start');
		$duration = $this->getManager('Fuga:Common:Param')->findByName('game', 'pexeso_duration');

		$game = $this->get('container')->getItem('game_pexeso', 'publish=1 AND user_id='.$user['id']);
		if ($testMode) {

			// В тестовом режиме игра начинается с текущего момента
			$start = date('Y-m-d H:i:s');

			// В тестовом режиме всегда начинаем с начала при перезагрузке страницы
			if (!$game) {
				$this->get('container')->addItem(
					'game_pexeso',
					[
						'user_id' => $user['id'],
						'start' => $start,
						'duration' => $duration,
						'created' => date('Y-m-d H:i:s'),
						'publish' => 1,
					]
				);
			} else {
				$this->get('container')->updateItem(
					'game_pexeso',
					[
						'start' => $start,
						'duration' => $duration,
						'updated' => date('Y-m-d H:i:s'),
						'money' => 0,
						'step' => 1,
						'publish' => 1,
					],
					['id' => $game['id']]
				);

				$game = $this->get('container')->getItem('game_pexeso', 'publish=1 AND user_id='.$user['id']);
			}

		} elseif (!$game) {
			/*
			 *  При отсутствии игры для текущего игрока создаем ее в тестовом режиме для всех,
			 *  в боевом режиме для Капитанов, Помощников и юнг
			 */
			if  ($user['group_id'] == 1 || in_array($user['role_id'], [CARPENTER_ROLE, GUNNER_ROLE, DOCTOR_ROLE, COOK_ROLE])){
				$this->get('container')->addItem(
					'game_pexeso',
					[
						'user_id' => $user['id'],
						'start' => $start,
						'duration' => $duration,
						'created' => date('Y-m-d H:i:s'),
						'publish' => 1,
					]
				);

				$game = $this->get('container')->getItem('game_pexeso', 'publish=1 AND user_id='.$user['id']);
			}
		}

		if (!$game) {
			$response->setData(array(
				'error' => 'У вас нет доступа к данной игре. Обратитесь к администратору',
			));

			return $response;
		}

		$game['start'] = strtotime($game['start']);
		$game['current'] = time();

		$response->setData(array(
			'game' => $game,
		));

		return $response;
	}

	public function mapdata()
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
			if ($cell) {
				$this->get('container')->updateItem(
					'game_map',
					array('cell' => $cell, 'ratio' => isset($answers[$cell]) ? $answers[$cell] : 0),
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

		$testMode = $this->getManager('Fuga:Common:Param')->findByName('game', 'test_mode');
		$start = $this->getManager('Fuga:Common:Param')->findByName('game', 'map_start');
		$duration = $this->getManager('Fuga:Common:Param')->findByName('game', 'map_duration');

		$game = $this->get('container')->getItem('game_map', 'publish=1 AND user_id='.$user['id']);
		if ($testMode) {

			// В тестовом режиме игра начинается с текущего момента
			$start = date('Y-m-d H:i:s');

			// В тестовом режиме всегда начинаем с начала при перезагрузке страницы
			if (!$game) {
				$this->get('container')->addItem(
					'game_map',
					[
						'user_id' => $user['id'],
						'start' => $start,
						'duration' => $duration,
						'created' => date('Y-m-d H:i:s'),
						'is_hunter' => 1,
						'publish' => 1,
					]
				);
			} else {
				$this->get('container')->updateItem(
					'game_map',
					[
						'start' => $start,
						'duration' => $duration,
						'updated' => date('Y-m-d H:i:s'),
						'ratio' => 0,
						'cell' => '',
						'is_ready' => 0,
						'is_hunter' => 1,
						'publish' => 1,
					],
					['id' => $game['id']]
				);

				$game = $this->get('container')->getItem('game_map', 'publish=1 AND user_id='.$user['id']);
			}

		} elseif (!$game) {
			/*
			 *  При отсутствии игры для текущего игрока создаем ее в тестовом режиме для всех,
			 *  в боевом режиме для Капитанов, Помощников и юнг
			 */
			if  ($user['group_id'] == 1 || in_array($user['role_id'], [QUARTERMASTER_ROLE, NAVIGATOR_ROLE, BOATSWAIN_ROLE, SAILMASTER_ROLE])){
				$this->get('container')->addItem(
					'game_map',
					[
						'user_id' => $user['id'],
						'start' => $start,
						'duration' => $duration,
						'created' => date('Y-m-d H:i:s'),
						'is_hunter' => $user['role_id'] == NAVIGATOR_ROLE ? 1 : 0,
						'publish' => 1,
					]
				);

				$game = $this->get('container')->getItem('game_map', 'publish=1 AND user_id='.$user['id']);
			}
		}

		if (!$game) {
			$response->setData(array(
				'error' => 'У вас нет доступа к данной игре. Обратитесь к администратору',
			));

			return $response;
		}

		$dt = new \DateTime($game['start']);
		$game['start'] = $dt->getTimestamp();
		$game['current'] = time();

		$response->setData(array(
			'error' => false,
			'game' => $game,
		));

		return $response;
	}

	public function labirintdata()
	{
		$response = new JsonResponse();

		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			$response->setData(array(
				'error' => 'Access denied',
			));

			return $response;
		}

//		$testMode = $this->getManager('Fuga:Common:Param')->findByName('game', 'test_mode');
//		$duration = $this->getManager('Fuga:Common:Param')->findByName('game', 'labirint_duration');

		if ('POST' == $_SERVER['REQUEST_METHOD']) {
			$state = $this->get('request')->request->get('state');

			$this->log(serialize($state));
			$this->get('container')->updateItem(
				'game_labirint',
				array('state' => json_encode($state)),
				array('ship_id' => $user['ship_id'])
			);

			$response->setData(array(
				'error' => false,
				'message' => 'state updated',
			));

			return $response;
		}

		$game = $this->get('container')->getItem('game_labirint', 'publish=1 AND ship_id='.$user['ship_id']);

		if(!$game) {
			$response->setData(array(
				'error' => 'У вас нет доступа к данной игре. Обратитесь к администратору',
			));

			return $response;
		}

		$game['start'] = strtotime($game['start']);
		$this->log('start='.strtotime($game['start']));
		$game['current'] = time();
		$game['user'] = $user['id'];
		$game['ship'] = $user['ship_id'];
		$game['state'] = json_decode($game['state'], true);

		$response->setData(array(
			'game' => $game,
		));

		return $response;
	}

	public function marketdata()
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

		$testMode = $this->getManager('Fuga:Common:Param')->findByName('game', 'test_mode');
		$duration = $this->getManager('Fuga:Common:Param')->findByName('game', 'market_duration');
		$dates = array(
			$this->getManager('Fuga:Common:Param')->findByName('game', 'market_date1'),
			$this->getManager('Fuga:Common:Param')->findByName('game', 'market_date2'),
			$this->getManager('Fuga:Common:Param')->findByName('game', 'market_date3'),
			$this->getManager('Fuga:Common:Param')->findByName('game', 'market_date4')
		);
		$tables = array('question_quiz_coffee', 'question_quiz_fabric', 'question_quiz_spice', 'question_quiz_stone');

		$game = $this->get('container')->getItem('game_market', 'publish=1 AND user_id='.$user['id']);
		if ($testMode) {

			// В тестовом режиме игра начинается с текущего момента
			$start = date('Y-m-d H:i:s');

			// В тестовом режиме всегда начинаем с начала при перезагрузке страницы
			if (!$game) {
				$this->get('container')->addItem(
					'game_market',
					[
						'user_id' => $user['id'],
						'start' => $start,
						'duration' => $duration,
						'created' => date('Y-m-d H:i:s'),
						'money' => 0,
						'question' => $tables[rand(0,3)],
						'publish' => 1,
					]
				);
			} else {
				$this->get('container')->updateItem(
					'game_market',
					[
						'start' => $start,
						'duration' => $duration,
						'updated' => date('Y-m-d H:i:s'),
						'money' => 0,
						'question' => $tables[rand(0,3)],
						'publish' => 1,
					],
					['id' => $game['id']]
				);

				$game = $this->get('container')->getItem('game_market', 'publish=1 AND user_id='.$user['id']);
			}

		} elseif (!$game) {
			/*
			 *  При отсутствии игры для текущего игрока создаем ее
			 */

			$ships = $this->get('container')->getItems('crew_ship');
			$groups = array();
			$i = 0;
			$j = 0;
			foreach ($ships as $ship) {
				$groups[$ship['id']] = $i;
				$j++;

				if (2 < $j) {
					$j = 0;
					$i++;
				}

			}

			if  ($user['group_id'] == 1 || $user['group_id'] == GAMER_GROUP){
				$this->get('container')->addItem(
					'game_market',
					[
						'user_id' => $user['id'],
						'start' => $dates[$groups[$user['ship_id']]], // todo by ship
						'duration' => $duration,
						'created' => date('Y-m-d H:i:s'),
						'question' => $tables[$groups[$user['ship_id']]], // todo by ship
						'publish' => 1,
					]
				);

				$game = $this->get('container')->getItem('game_market', 'publish=1 AND user_id='.$user['id']);
			}
		}

		if (!$game) {
			$response->setData(array(
				'error' => 'Игра не настроена для вашего профиля. Обратитесь к администратору',
			));

			return $response;
		}

		$game['start'] = strtotime($game['start']);
		$game['current'] = time();
		$game['testmode'] = $testMode;

		$response->setData(array(
			'game' => $game,
		));

		return $response;
	}

	public function marketquestion()
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

	public function dueldata()
	{
		$response = new JsonResponse();

		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			$response->setData(array(
				'error' => 'Access denied',
			));

			return $response;
		}

//		$testMode = $this->getManager('Fuga:Common:Param')->findByName('game', 'test_mode');

		if ('POST' == $_SERVER['REQUEST_METHOD']) {
			$step = $this->get('request')->request->getInt('step');
			$answer1 = $this->get('request')->request->getInt('answer1');
			$answer2 = $this->get('request')->request->getInt('answer2');
			$this->get('container')->updateItem(
				'game_task',
				array('step' => $step, 'user1_answer' => $answer1, 'user2_answer' => $answer2),
				array('table' => 1)
			);

			$response->setData(array(
				'error' => false,
			));

			return $response;
		}

		$game = $this->get('container')->getItem('game_labirint', 'publish=1 AND (user1_id='.$user['id'].' OR user2_id='.$user['id'].')');

		if(!$game) {
			$response->setData(array(
				'error' => 'У вас нет доступа к данной игре. Обратитесь к администратору',
			));

			return $response;
		}

		$game['start'] = strtotime($game['start']);
		$game['current'] = time();

		$response->setData(array(
			'game' => $game,
		));

		return $response;
	}

	public function duelquestion()
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
			$question = $this->get('container')->getItem('question_duel', $questionId);
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
	
}