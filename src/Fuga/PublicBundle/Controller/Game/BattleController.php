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
//        if (!$this->isXmlHttpRequest()) {
//            return $this->redirect('/');
//        }

        $response = new JsonResponse();

        $user = $this->getManager('Fuga:Common:User')->getCurrentUser();
        if (!$user || $user['group_id'] == FAN_GROUP) {
            $response->setData(array(
                'error' => 'Access denied',
            ));

            return $response;
        }

        if ('GET' == $_SERVER['REQUEST_METHOD']) {

            if (1 == 1) {
                $response->setData(array(
                    'error' => false,
                    'start' => time(),
                    'duration' => 25,
                    'current' => time(),
                ));

                return $response;
            }

            $response->setData(array(
                'error' => 'Данные о времени игры не найдены. Обратитесь к администратору.',
            ));

            return $response;
        }
    }

	public function users() {
//        if (!$this->isXmlHttpRequest()) {
//            return $this->redirect('/');
//        }

        $response = new JsonResponse();

        $user = $this->getManager('Fuga:Common:User')->getCurrentUser();
        if (!$user || $user['group_id'] == FAN_GROUP) {
            $response->setData(array(
                'error' => 'Access denied',
            ));

            return $response;
        }

        if ('GET' == $_SERVER['REQUEST_METHOD']) {
            if (1 == 1) {
                $response->setData(array(
                    array( 'id' => 1, 'name'=> "Alexey", 'age'=> 30 ),
                    array( 'id' => 2, 'name'=> "Ignat", 'age'=> 15 ),
                    array( 'id' => 3, 'name'=> "Sergey", 'age'=> 26 ),
                ));

                return $response;
            }

            $response->setData(array(
                'error' => 'Данные пользователей не найдены. Обратитесь к администратору.',
            ));

            return $response;
        }
    }

    public function field() {
//        if (!$this->isXmlHttpRequest()) {
//            return $this->redirect('/');
//        }

        $response = new JsonResponse();

        $user = $this->getManager('Fuga:Common:User')->getCurrentUser();
        if (!$user || $user['group_id'] == FAN_GROUP) {
            $response->setData(array(
                'error' => 'Access denied',
            ));

            return $response;
        }

        if ('POST' == $_SERVER['REQUEST_METHOD']) {
            $rawData = json_decode(file_get_contents(PRJ_DIR . '/data/battle/battle1.json'), true);

            $data = $rawData['']

            if ($data) {
                $response->setData($data);

                return $response;
            }

            $response->setData(array(
                'error' => 'Данные игрового поля не найдены. Обратитесь к администратору.',
            ));

            return $response;
        }
    }

    public function messages() {
//        if (!$this->isXmlHttpRequest()) {
//            return $this->redirect('/');
//        }

        $response = new JsonResponse();

        $user = $this->getManager('Fuga:Common:User')->getCurrentUser();
        if (!$user || $user['group_id'] == FAN_GROUP) {
            $response->setData(array(
                'error' => 'Access denied',
            ));

            return $response;
        }

        if ('GET' == $_SERVER['REQUEST_METHOD']) {
            $data = json_decode(file_get_contents(PRJ_DIR . '/data/battle/battle1_messages.json'), true);

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