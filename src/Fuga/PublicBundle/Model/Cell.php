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
                $this->cells[$i.$letter] = $k;
                $k++;
            }
        }
    }

    public function getIndexByName($name)
    {
        if (array_key_exists($name, $this->cells)) {
            $this->cells[$name];
        }

        return 0;
    }
}