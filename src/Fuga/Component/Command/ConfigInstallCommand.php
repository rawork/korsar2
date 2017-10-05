<?php

namespace Fuga\Component\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class ConfigInstallCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('config:install')
            ->setDescription('Create config files from samples')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        if ( !file_exists(__DIR__.'/../../../../app/config/config.php') ) {
			@copy(__DIR__.'/../../../../app/config/config.php.example', __DIR__.'/../../../../app/config/config.php');
			$output->writeln('<info>File config.php created</info>');
		} else {
			$output->writeln('<comment>File config.php exists</comment>');
		}
		
		if ( !file_exists(__DIR__.'/../../../../app/config/database.php') ) {
			@copy(__DIR__.'/../../../../app/config/database.php.example', __DIR__.'/../../../../app/config/database.php');
			$output->writeln('<info>File database.php creaed</info>');
		} else {
			$output->writeln('<comment>File database.php exists</comment>');
		}
		
		if ( !file_exists(__DIR__.'/../../../../app/config/parameters.php') ) {
			@copy(__DIR__.'/../../../../app/config/parameters.php.example', __DIR__.'/../../../../app/config/parameters.php');
			$output->writeln('<info>File parameters.php created</info>');
		} else {
			$output->writeln('<comment>File parameters.php exists</comment>');
		}

    }
}