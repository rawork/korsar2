<?php

namespace Fuga\PublicBundle\Model;

class Cell
{
    protected $cells = [];

    public function __construct()
    {
        $k = 1;
        for($i = 1; $i < 11; $i++) {
            foreach (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] as $letter) {
                $this->cells[] = $i.$letter;
                $k++;
            }
        }
    }

    public function getCells()
    {
        return $this->cells;
    }

    public function getIndexByName($name)
    {
        $key = array_search($name, $this->cells);
        if ($key !== false ) {
            return $key+1;
        }

        return 0;
    }
}