<?php

namespace Fuga\Component\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class CacheClearCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('cache:clear')
            ->setDescription('Clear cache by key')
            ->addArgument('key', InputArgument::REQUIRED, 'Which Key of cache value?')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $cache = $this->getHelper('container')->get('cache');

        if (($cacheKey = $input->getArgument('key')) === null) {
            throw new \RuntimeException("Argument 'KEY' is required in order to execute this command correctly.");
        }

        $cache->delete($cacheKey);


    }
}