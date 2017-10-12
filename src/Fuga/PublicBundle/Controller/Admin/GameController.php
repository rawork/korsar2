<?php

namespace Fuga\PublicBundle\Controller\Admin;


use Fuga\AdminBundle\Controller\AdminController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class GameController extends AdminController
{
	public function index($state, $module)
	{
		$roles = $this->get('container')->getItems('pirate_prof', '1=1');
		$teams = $this->get('container')->getItems('crew_ship', 'is_over=0');

        $numbers =  [1,2,3,4,5,6,7,8,9,10];
        $letters =  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        $games = array_values($this->get('container')->getItems('game_battle'));

        $types = array(
            'empty' => array('value' => 'empty', 'image' => '/bundles/admin/img/0.gif'),
            'red'   => array('value' => 'red', 'image' => '/bundles/public/img/battle/ship_red.png'),
            'brown' => array('value' => 'brown', 'image' => '/bundles/public/img/battle/ship_brown.png'),
            'green' => array('value' => 'green', 'image' => '/bundles/public/img/battle/ship_green.png'),
            'h'     => array('value' => 'h', 'image' => '/bundles/public/img/battle/ship_imperial_h.png'),
            'v'     => array('value' => 'v', 'image' => '/bundles/public/img/battle/ship_imperial_v.png'),
        );

        $fields = array();
        for ($i = 1; $i < 5; $i++) {
            $fields[$i] = array();
            $gameKey = array_search($i, array_column($games, 'battle'));

            $checkType = false;
            if ($gameKey !== false ) {
                $checkType = true;
                $game = $games[$gameKey];
                $gameState = json_decode($game['state'], true);
            }

            foreach ($numbers as $num) {
                foreach ($letters as $letter) {
                    $type = 'empty';
                    if ($checkType) {
                        $key = array_search($num.$letter, array_column($gameState['field'], 'name'));
                        if ($key !== false) {
                            $type = $gameState['field'][$key]['color'];
                        } elseif ($num.$letter == $gameState['imperial']['points'][1]['name']) {
                            $type = $gameState['imperial']['type'];
                        }
                    }
                    $fields[$i][$num.$letter] = $type;
                }
            }
        }

		return new Response(
		    $this->render(
		        'game/admin/index',
                compact('roles', 'teams', 'state', 'module', 'letters', 'numbers', 'fields', 'types')
            )
        );
	}

	public function simple()
	{
		// TASK: В испытании участвуют капитаны, помощники и юнги от каждой команды (45 человек)
		// PEXESO: В испытании участвуют плотники, канониры, судовые врачи, коки (60 человек)
		// MAP: В испытании участвуют квартирмейстеры,  штурманы, боцманы, мастера парусов (60 человек)
		$response = new JsonResponse();

		if ('POST' == $_SERVER['REQUEST_METHOD'] && $this->isXmlHttpRequest()) {

			$type = $this->get('request')->request->get('type');
			$date = $this->get('request')->request->get('date');
			$time = $this->get('request')->request->get('time');

			$duration = $this->getManager('Fuga:Common:Param')->findByName('game', $type.'_duration');

			switch ($type) {
				case 'task':
					$roles = implode(',', array(CAPTAIN_ROLE, HELPER_ROLE, SHIPBOY_ROLE));
					break;
				case 'pexeso':
					$roles = implode(',', array(CARPENTER_ROLE, GUNNER_ROLE, DOCTOR_ROLE, COOK_ROLE));
					break;
				case 'map':
					$roles = implode(',', array(QUARTERMASTER_ROLE, NAVIGATOR_ROLE, BOATSWAIN_ROLE, SAILMASTER_ROLE));
					break;
			}

			$users = $this->get('container')->getItems('user_user', 'role_id IN('.$roles.')');

			foreach ($users as $user) {
				$game = $this->get('container')->getItem('game_' . $type, 'user_id=' . $user['id']);
				if ($game) {
					continue;
				}

				switch ($type) {
					case 'task':
						$this->get('container')->addItem(
							'game_' . $type,
							array(
								'user_id' => $user['id'],
								'start' => $date . ' ' . $time . ':00',
								'duration' => $duration,
								'is_answer' => 0,
								'publish' => 1,
							)
						);
						break;
					case 'pexeso':
						$this->get('container')->addItem(
							'game_' . $type,
							array(
								'user_id' => $user['id'],
								'start' => $date . ' ' . $time . ':00',
								'duration' => $duration,
								'money' => 0,
								'step' => 1,
								'publish' => 1,
							)
						);
						break;
					case 'map':
						$this->get('container')->addItem(
							'game_' . $type,
							array(
								'user_id' => $user['id'],
								'start' => $date . ' ' . $time . ':00',
								'duration' => 2, // 2 days
								'ratio' => 0,
								'cell' => '',
								'is_ready' => 0,
								'is_hunter' => $user['role_id'] == NAVIGATOR_ROLE ? 1 : 0,
								'publish' => 1,
							)
						);
						break;
				}

			}


			$response->setData(array(
					'error' => false,
					'message' => 'Игры назначены для игроков!',
				)
			);

			return $response;
		}

		$response->setData([
			'error' => true,
			'message' => 'Неправильная отправка данных',
		]);

		return $response;
	}

	public function labirint()
	{
		// В испытании участвуют матросы и пороховые обезьяны (60 человек).

		$duration = $this->getManager('Fuga:Common:Param')->findByName('game', 'labirint_duration');

		$response = new JsonResponse();

		if ('POST' == $_SERVER['REQUEST_METHOD'] && $this->isXmlHttpRequest()) {

			$this->get('log')->addError(json_encode($_POST));

			$date = $this->get('request')->request->get('date');
			$time = $this->get('request')->request->get('time');

			$roles = implode(',', array(MONKEY_ROLE, MARINE_ROLE));

			$users = $this->get('container')->getItems('user_user', 'role_id IN(' . $roles . ')');
			$ships = $this->get('container')->getItems('crew_ship');

			foreach ($ships as $ship) {
				$game = $this->get('container')->getItem('game_labirint', 'ship_id=' . $ship['id']);
				if ($game) {
					continue;
				}

				$markers = array();

				$i = 1;
				foreach ($users as $user) {
					if ($user['ship_id'] == $ship['id']) {
						$markers['marker'.$i] = $user['id'];
						$i++;
					}
				}

				$lives = array('marker1' => 3, 'marker2' => 3, 'marker3' => 3, 'marker4' => 3);
				$positions = array('marker1' => 0, 'marker2' => 0, 'marker3' => 0, 'marker4' => 0);
				$wait = array('marker1' => 0, 'marker2' => 0, 'marker3' => 0, 'marker4' => 0);
				$money = array('marker1' => 0, 'marker2' => 0, 'marker3' => 0, 'marker4' => 0);
				$chest = array('marker1' => 0, 'marker2' => 0, 'marker3' => 0, 'marker4' => 0);
				$rom = array('marker1' => 0, 'marker2' => 0, 'marker3' => 0, 'marker4' => 0);
				$coffee = array('marker1' => 0, 'marker2' => 0, 'marker3' => 0, 'marker4' => 0);
				$colors = array(
					'marker1' => 'Коричневый',
					'marker2' => 'Синий',
					'marker3' => 'Зеленый',
					'marker4' => 'Красный');


				$state = array(
					'markers' => $markers,
					'who_run' => 'marker1',
					'lives' => $lives,
					'positions' => $positions,
					'colors' => $colors,
					'wait' => $wait,
					'money' => $money,
					'chest' => $chest,
					'rom' => $rom,
					'coffee' => $coffee,
				);


				$this->get('container')->addItem(
					'game_labirint',
					array(
						'ship_id' => $ship['id'],
						'start' => $date . ' ' . $time . ':00',
						'duration' => $duration,
						'state' => json_encode($state),
						'publish' => 1,
					)
				);
			}

			$response->setData(array(
					'error' => false,
					'message' => 'Игры назначены для игроков!',
				)
			);

			return $response;
		}

		$response->setData([
			'error' => true,
			'message' => 'Неправильная отправка данных',
		]);

		return $response;
	}

	public function battle()
	{
		// Играют 12 команд, 4 стола по 3 в 2 дня. 1 из 3 команд - победитель.
		$duration = $this->getManager('Fuga:Common:Param')->findByName('game', 'battle_duration');

		$response = new JsonResponse();

		if ('POST' == $_SERVER['REQUEST_METHOD'] && $this->isXmlHttpRequest()) {

//          $this->get('log')->addError('battle settings set');
//		    $this->get('log')->addError(json_encode($_POST));

			$date1 = $this->get('request')->request->get('date1');
			$time1 = $this->get('request')->request->get('date1_time');

			$date2 = $this->get('request')->request->get('date2');
			$time2 = $this->get('request')->request->get('date2_time');

			// находим 12 команд для формирования 4 игр
			$ships = $this->get('container')->getItems('crew_ship', 'is_over<>1', 'purse DESC', 12);
			$ships = array_values($ships);

			$battles = array(1,2,3,4);
			$colors = array('red', 'brown', 'green');

			foreach ($battles as $battle) {
			    if (count($ships) < 3) {
			        continue;
                }
				$teamShips = array_slice($ships, 0, 3);

			    $ships = array_slice($ships, 3);

				$game = $this->get('container')->getItem('game_battle', 'battle=' . $battle);
                if ($game) {
                    $this->get('container')->deleteItem('game_battle', 'battle=' . $battle);
                }

                // Информация о командах
				$teamsInfo = array();
                foreach($teamShips as $key => $ship) {
                    $shooter = $this->get('container')->getItem('user_user', 'ship_id='.$ship['id'].' AND is_over<>1 AND role_id=' . HELPER_ROLE);
                    $flag = $this->get('container')->getItem('crew_flag', $ship['flag']);
                    $teamsInfo[] = array(
                        'id' => $ship['id'],
                        'shooter_id' => $shooter['id'],
                        'name' => $ship['name'],
                        'flag' => $flag['image_value']['value'],
                        'num' => $key+1,
                        'color' => $colors[$key],
                        'alive' => 6,
                        'dead' => 0,
                        'money' => 0
                    );
                }

//                $state = json_decode(file_get_contents(PRJ_DIR.'data/battle/battle'.$battle.'_raw.json'), true);
                $state = [
                    'shooter' => 1,
                    'timer' => 0,
                    'field' => []
                ];
                $numbers = [1,2,3,4,5,6,7,8,9,10];
                $letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
                foreach ($numbers as $numKey => $number) {
                    foreach ($letters as $letterKey => $letter) {
                        $cellValue = $this->get('request')->request->get('cell_table'.$battle.'_'.$number.$letter);
                        if ($cellValue) {
                            switch ($cellValue) {
                                case 'v':
                                    $state['imperial'] = [
                                        'type' => $cellValue,
                                        'points' => [
                                            [
                                                'name' => ($number-1).$letter,
                                                'type' => '',
                                                'shooter' => 0
                                            ],
                                            [
                                                'name' => $number.$letter,
                                                'type' => '',
                                                'shooter' => 0
                                            ],
                                            [
                                                'name' => ($number+1).$letter,
                                                'type' => '',
                                                'shooter' => 0
                                            ]
                                        ]
                                    ];
                                    break;
                                case 'h':
                                    $state['imperial'] = [
                                        'type' => $cellValue,
                                        'points' => [
                                            [
                                                'name' => $number.$letters[$letterKey-1],
                                                'type' => '',
                                                'shooter' => 0
                                            ],
                                            [
                                                'name' => $number.$letter,
                                                'type' => '',
                                                'shooter' => 0
                                            ],
                                            [
                                                'name' => $number.$letters[$letterKey+1],
                                                'type' => '',
                                                'shooter' => 0
                                            ]
                                        ]
                                    ];
                                    break;
                                case 'red':
                                case 'brown':
                                case 'green':
                                    $state['field'][] = [
                                        'name' => $number.$letter,
                                        'type' => 'ship-'.$cellValue,
                                        'color' => $cellValue
                                    ];
                                    break;
                                default:

                            }
                        }
                    }
                }
                $state['teams'] = $teamsInfo;

                $this->get('container')->addItem(
                    'game_battle',
                    array(
                        'battle' => $battle,
                        'team1_id' => $teamShips[0]['id'],
                        'team2_id' => $teamShips[1]['id'],
                        'team3_id' => $teamShips[2]['id'],
                        'start' => $battle < 3 ? $date1 . ' ' . $time1 . ':00' : $date2 . ' ' . $time2 . ':00',
                        'duration' => $duration,
                        'state' => json_encode($state),
                        'publish' => 1,
                    )
                );
			}


			$response->setData(array(
					'error' => false,
					'message' => 'Игры назначены для игроков!',
				)
			);

			return $response;
		}

		$response->setData([
			'error' => true,
			'message' => 'Неправильная отправка данных',
		]);

		return $response;
	}

}