<?php

namespace Fuga\PublicBundle\Controller\Game;

use Fuga\CommonBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class BattleController extends Controller
{
	public function data()
	{

	}

	public function timer() {
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

            $response->setData(array(
                'error' => false,
                'start' => strtotime($game['start']),
                'duration' => $game['duration'],
                'current' => time(),
            ));

            return $response;
        }
    }

	public function users() {
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
            $criteria = array();
            for($i = 1; $i < 4; $i++) {
                $criteria[] = 'team'.$i.'_id='.$user['ship_id'];
            }

            $game = $this->get('container')->getItem('game_battle', implode(' OR ', $criteria));
            if (!$game) {
                $response->setData(array(
                    'error' => 'Данные об игре не найдены. Обратитесь к администратору.',
                ));

                return $response;
            }

            $rawData = json_decode($game['state'], true);

            $response->setData($rawData['teams']);
            return $response;
        }
    }

    public function field() {
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
            $criteria = array();
            for($i = 1; $i < 4; $i++) {
                $criteria[] = 'team'.$i.'_id='.$user['ship_id'];
            }

            $game = $this->get('container')->getItem('game_battle', implode(' OR ', $criteria));
            if (!$game) {
                $response->setData(array(
                    'error' => 'Данные об игре не найдены. Обратитесь к администратору.',
                ));

                return $response;
            }

            $rawData = json_decode($game['state'], true);

            $team = null;
            foreach($rawData['teams'] as $item) {
                if ($item['shooter_id'] == $user['id']){
                    $team = $item;
                    break;
                }

            }
            $field = [];

            foreach ($rawData['field'] as $cell) {
                if (!isset($cell['color']) || $cell['color'] == $team['color']) {
                    $field[] = $cell;
                }
            }

            foreach ($rawData['imperial']['points'] as $point) {
                if ($point['type'] == 'imperial-part') {
                    unset($point['part']);
                    $field[] = $point;
                }
            }

            $response->setData($field);

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
            $data = array();//json_decode(file_get_contents(PRJ_DIR . '/data/battle/battle1_messages.json'), true);
            $messages = array_values($this->get('container')->getItems('chat_ship', 'ship_id='.$user['ship_id'], 'id DESC', '20'));
            $messages = array_reverse($messages);

            foreach ($messages as $message) {
                $role = $this->get('container')->getitem('pirate_prof', $user['role_id']);
                $data[] = array(
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
			$questionId = $this->get('request')->request->get('question');
			$question = $this->get('container')->getItem('question_battle', $questionId);
			if ($question) {
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