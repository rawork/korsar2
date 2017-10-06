<?php

namespace Fuga\Component\Console\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class CacheAddCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('cache:add')
            ->setDescription('Add cache by key')
            ->addArgument('key', InputArgument::REQUIRED, 'Which Key of cache value?')
            ->addArgument('value', InputArgument::REQUIRED, 'Which cache value?')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $cache = $this->getHelper('cache')->getCache();

        if (($cacheKey = $input->getArgument('key')) === null) {
            throw new \RuntimeException("Argument 'KEY' is required in order to execute this command correctly.");
        }

        if (($cacheValue = $input->getArgument('value')) === null) {
            throw new \RuntimeException("Argument 'VALUE' is required in order to execute this command correctly.");
        }

        $cache->save($cacheKey, $cacheValue);


    }
}