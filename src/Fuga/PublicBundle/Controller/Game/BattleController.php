<?php

namespace Fuga\PublicBundle\Controller\Game;

use Fuga\CommonBundle\Controller\Controller;
use Fuga\PublicBundle\Model\Game;
use Symfony\Component\HttpFoundation\JsonResponse;
use Fuga\PublicBundle\Model\Cell;

class BattleController extends Controller
{
	public function data()
	{
        if (!$this->isXmlHttpRequest()) {
            return $this->redirect('/');
        }

        $response = new JsonResponse();

        $user = $this->getManager('Fuga:Common:User')->getCurrentUser();
        if (!$user || $user['group_id'] == FAN_GROUP) {
            $response->setData(array(
                'error' => 'Access denied',
            ));

            return $response;
        }

        if ('GET' == $_SERVER['REQUEST_METHOD']) {
            $game = new Game($user['ship_id'], $this->get('container'));

            if (!$game->getGame()) {
                $response->setData(array(
                    'error' => 'Данные о времени игры не найдены. Обратитесь к администратору.',
                ));

                return $response;
            }

            $response->setData(array(
                'error' => false,
                'user' => intval($user['id']),
                'battle' => $game->getBattleNum(),
                'shooter' => $game->getShooter(),
                'shooter_timer' => $game->getUserTimer(),
                'timer' => $game->getTimer(),
                'teams' => $game->getTeams(),
                'field' => $game->getCells(),
            ));

            return $response;
        }
	}

    public function messages() {
        if (!$this->isXmlHttpRequest()) {
            return $this->redirect('/');
        }

        $response = new JsonResponse();

        $user = $this->getManager('Fuga:Common:User')->getCurrentUser();
        if (!$user || $user['group_id'] == FAN_GROUP) {
            $response->setData(array(
                'error' => 'Access denied',
            ));

            return $response;
        }

        if ('GET' == $_SERVER['REQUEST_METHOD']) {
            $data = array(
                'messages' => array(),
            );
            $messages = array_values($this->get('container')->getItems('chat_ship', 'ship_id='.$user['ship_id'], 'id DESC', 10));
            $messages = array_reverse($messages);

            foreach ($messages as $message) {
                $role = $this->get('container')->getitem('pirate_prof', $user['role_id']);
                $data['messages'][] = array(
                    'id' => $message['id'],
                    'name' => $message['user_id_value']['item']['name'],
                    'lastname' => $message['user_id_value']['item']['lastname'],
                    'role' => $role['name'],
                    'message' => $message['message'],
                );
            }

            if ($data) {
                $response->setData($data);

                return $response;
            }

            $response->setData(array(
                'error' => 'Сообщения не найдены. Обратитесь к администратору.',
            ));

            return $response;
        }
    }

    public function message() {
        if (!$this->isXmlHttpRequest()) {
            return $this->redirect('/');
        }

        $response = new JsonResponse();

        $user = $this->getManager('Fuga:Common:User')->getCurrentUser();
        if (!$user || $user['group_id'] == FAN_GROUP) {
            $response->setData(array(
                'error' => 'Access denied',
            ));

            return $response;
        }

        if ('POST' == $_SERVER['REQUEST_METHOD']) {
            $message = strip_tags($this->get('request')->request->get('message'));
            if (!$message) {
                $response->setData(array(
                    'error' => 'Пустое сообщение',
                ));

                return $response;
            }

            try {
                $messageId = $this->get('container')->addItem(
                    'chat_ship',
                    array(
                        'message' => $message,
                        'user_id' => $user['id'],
                        'ship_id' => $user['ship_id'],
                        'created' => date('Y-m-d H:i:s'),
                        'publish' => 1,
                    )
                );

            } catch (\Exception $e) {
                $this->err($e->getMessage());
                $response->setData(array(
                    'error' => 'Сообщение не сохранено. Обратитесь к администратору.',
                ));

                return $response;
            }

            $role = $this->get('container')->getitem('pirate_prof', $user['role_id']);
            $response->setData(array(
                'error' => false,
                'message' => array(
                    'id' => $messageId,
                    'name' => $user['name'],
                    'lastname' => $user['lastname'],
                    'role' => $role['name'],
                    'message' => $message,
            )));

            return $response;
        }
    }

	public function question()
	{
		if (!$this->isXmlHttpRequest()) {
			return $this->redirect('/');
		}

		$response = new JsonResponse();

		$user = $this->getManager('Fuga:Common:User')->getCurrentUser();
		if (!$user || $user['group_id'] == FAN_GROUP) {
			$response->setData(array(
				'error' => 'Access denied',
			));

			return $response;
		}

		if ('POST' == $_SERVER['REQUEST_METHOD']) {
		    $game = new Game($user['ship_id'], $this->get('container'));

            if (!$game->getGame()) {
                $response->setData(array(
                    'error' => 'Данные об игре не найдены. Обратитесь к администратору.',
                ));

                return $response;
            }

            $money = 0;
            $type = '';

			$questionId = $this->get('request')->request->get('question');
            $answer = $this->get('request')->request->get('answer');
            $cell = $this->get('request')->request->get('cell');
			$question = $this->get('container')->getItem('question_battle', 'id='.$questionId.' AND answer='.$answer);

			//  нашли вопрос с таким ID и таким значением ответа = правильный ответ
			if ($question) {
			     list($money, $type) = $game->shot($cell);
			} else {
			    $game->setShooter($game->nextShooter($game->getShooter()));
                $game->setUserTimer(time() + $game->getUserTimerDuration());
            }

            $game->save();

			$response->setData(array(
                'error' => false,
                'money' => $money,
                'type' => $type,
                'shooter' => $game->getShooter(),
                'timer' => $game->getUserTimer(),
            ));


			return $response;
		}

        if ('GET' == $_SERVER['REQUEST_METHOD']) {
            $criteria = array();
            for($i = 1; $i < 4; $i++) {
                $criteria[] = 'team'.$i.'_id='.$user['ship_id'];
            }

            $game = $this->get('container')->getItem('game_battle', implode(' OR ', $criteria));
            if (!$game) {
                $response->setData(array(
                    'error' => 'Данные о времени игры не найдены. Обратитесь к администратору.',
                ));

                return $response;
            }


            $cell = new Cell();
            $questionId = $cell->getIndexByName($this->get('request')->query->get('cell'));

            $question = $this->get('container')->getItem('question_battle', $questionId);
            if ($question) {
                unset($question['answer']);

                $response->setData(array(
                    'error' => false,
                    'question' => $question,
                ));

                return $response;
            }

            $response->setData(array(
                'error' => 'Вопрос не найден. Обратитесь к администратору.',
            ));

            return $response;
        }
	}
}