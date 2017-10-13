<?php

namespace Fuga\PublicBundle\Model;

use Fuga\Component\Container;

class Game
{
    protected $game;
    protected $state;
    protected $table;
    protected $teamID;
    /**
     * @var Container
     */
    protected $container;

    public function __construct($teamId, Container $container)
    {
        $this->table = 'game_battle';
        $this->container = $container;
        $this->teamID = $teamId;
        $this->setGame();
    }

    public function getState()
    {
        if (!$this->state && $this->game) {
            $this->state = json_decode($this->game['state'], true);
        }

        return $this->state;
    }

    public function getUserTeamKey()
    {
        $state = $this->getState();
        $teams = $state['teams'];

        return array_search($this->teamID, array_column($teams, 'id'));
    }

    public function getUserTeam()
    {
        $key = $this->getUserTeamKey();

        if ($key !== false) {
            $teams = $this->getTeams();
            return $teams[$key];
        }

        return false;
    }

    public function save() {
        $this->container->updateItem(
            $this->table,
            ['state' => json_encode($this->state)],
            ['id' => $this->game['id']]
        );
    }

    public function addMoney($money)
    {
        $this->state['teams'][$this->getUserTeamKey()]['money'] += $money;
    }

    public function getShooter()
    {
        return $this->state['shooter'];
    }

    public function setShooter($num)
    {
        $this->state['shooter'] = $num;
    }

    public function teamIsOver($teamNum)
    {
        $state = $this->getState();

        return 6 == $state['teams'][$teamNum-1]['dead'] ;
    }

    public function nextShooter($shooter, $step = 0)
    {
        if ($step > 2) {
            return 0;
        }

        $shooter++;
        if ($shooter > 3) {
            $shooter = 1;
        }

        if ($this->teamIsOver($shooter)) {
            return $this->nextShooter($shooter, $step+1);
        }

        return $shooter;
    }

    public function getUserTimer()
    {
        return $this->state['timer'];
    }

    public function getUserTimerDuration()
    {
        $seconds = 15;
        if (1 != 2) {
            $seconds = 10;
        }

        return $seconds;
    }

    public function setUserTimer($time)
    {
        $this->state['timer'] = $time;
    }

    public function shot($cell)
    {
        $money = 0;
        $type = 'cell-empty';
        $state = $this->getState();

        // ищем ячейку в поле
        $cellKey = array_search($cell, array_column($state['field'], 'name'));
        if ($cellKey !== false) {
            if (in_array($state['field'][$cellKey]['type'], ['ship-red', 'ship-brown', 'ship-green'])) {
                $money = 100;
                $type = $state['field'][$cellKey]['type'].'-killed';
                switch ($state['field'][$cellKey]['color']) {
                    case 'red':
                        $state['teams'][0]['alive']--;
                        $state['teams'][0]['dead']++;
                        break;
                    case 'brown':
                        $state['teams'][1]['alive']--;
                        $state['teams'][1]['dead']++;
                        break;
                    case 'green':
                        $state['teams'][2]['alive']--;
                        $state['teams'][2]['dead']++;
                        break;
                    default:
                }
                $state['field'][$cellKey]['type'] = $type;

            }
        } else {
            // ищем ячейку в императорском корабле
            $cellKey = array_search($cell, array_column($state['imperial']['points'], 'name'));
            if ($cellKey !== false) {
                $type = 'imperial-part';
                $state['imperial']['points'][$cellKey]['type'] = $type;
                $killed = array_filter($state['imperial']['points'], function($element) {
                    return $element['shooter'] > 0;
                });
                $killedByYou = array_filter($state['imperial']['points'], function($element) {
                    return $element['shooter'] == $this->getShooter();
                });
                if ($killed == 3 && $killedByYou == 3) {
                    $money = 400;
                } elseif ($killed == 3 && $killedByYou < 3) {
                    $money = 200;
                } else {
                    $money = 100;
                }
            }
        }

        if ($type == 'cell-empty') {
            $this->setShooter($this->nextShooter($this->getShooter()));
        }

        $this->addMoney($money);
        $this->setUserTimer(time()+$this->getUserTimerDuration());
        $this->setState($state);

        return [$money, $type];
    }

    public function getCells()
    {
        $team = $this->getUserTeam();
        $state = $this->getState();

        $field = [];
        foreach ($state['field'] as $cell) {
            if (!isset($cell['color']) || $cell['color'] == $team['color']) {
                $field[] = $cell;
            }
        }
        foreach ($state['imperial']['points'] as $point) {
            if ($point['type'] == 'imperial-part') {
                $field[] = $point;
            }
        }

        return $field;
    }

    public function getBattleNum()
    {
        return $this->game['battle'];
    }

    public function getTeams()
    {
        $state = $this->getState();

        return $state['teams'];
    }

    public function getTimer()
    {
        return [
            'start' => strtotime($this->game['start']),
            'duration' => $this->game['duration'],
            'moment' => time(),
        ];
    }

    private function setGame()
    {
        $criteria = array();
        for($i = 1; $i < 4; $i++) {
            $criteria[] = 'team'.$i.'_id='.$this->teamID;
        }

        $this->game = $this->container->getItem($this->table, implode(' OR ', $criteria));
    }

    private function setState($state)
    {
        $this->state = $state;
    }

    public function getGame()
    {
        return $this->game;
    }



}