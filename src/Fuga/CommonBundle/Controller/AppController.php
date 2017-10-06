<?php

namespace Fuga\CommonBundle\Controller;

use Fuga\Component\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;
use Fuga\Component\Container;

class AppController extends Controller
{
    /**
     * @var Container $container
     */
    protected $container;

    public function setContainer(Container $container)
    {
        $this->container = $container;
    }

	public function run()
	{
		$request = Request::createFromGlobals();

		$session = new Session();
		$session->start();

		$this->get('container')->register('session', $session);
		$this->get('container')->register('request', $request);

		$site = $this->getManager('Fuga:Common:Site')->detectSite($_SERVER['REQUEST_URI']);
		$this->getManager('Fuga:Common:Locale')->setLocale($site);

		$this->get('container')->setVar('mainurl', $site['url']);

		try {
		    // todo middleware
            if ($this->get('security')->isSecuredArea() && !$this->get('security')->isAuthenticated()) {
                $controller = new SecurityController();
                $response = $controller->login();
            } elseif ($this->get('security')->isClosedArea()) {
                $controller = new SecurityController();
                $response = $controller->closed();
            } else {
                $parameters = $this->get('routing')->match(array_shift(explode('?', $site['url'])));
                $response = $this->get('container')->callAction($parameters['_controller'], $parameters);
            }

            if (!is_object($response) || !($response instanceof \Symfony\Component\HttpFoundation\Response)){
                $this->container->get('log')->addError('link'.$_SERVER['REQUEST_URI']);
                $this->container->get('log')->addError('response'.serialize($response));
            }

            $response->send();
		} catch(ResourceNotFoundException $e) {
			throw new NotFoundHttpException('Несуществующая страница');
		}
	}
}
