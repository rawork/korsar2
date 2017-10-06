<?php

namespace Fuga\Component\Console\Helper;

use Symfony\Component\Console\Helper\Helper;
use Doctrine\Common\Cache\CacheProvider;

/**
 * Fuga CLI Cache Helper.
 *
 * @author Roman Alyakritskiy <rawork@yandex.ru>
 */
class CacheHelper extends Helper
{
    /**
     * The Doctrine database Connection.
     *
     * @var Doctrine\Common\Cache\CacheProvider
     */
    protected $_cache;

    /**
     * Constructor.
     *
     * @param Doctrine\Common\Cache\CacheProvider $connection The Doctrine database Connection.
     */
    public function __construct(CacheProvider $cache)
    {
        $this->_cache = $cache;
    }

    /**
     * Retrieves the Doctrine Cache.
     *
     * @return Doctrine\Common\Cache\CacheProvider
     */
    public function getCache()
    {
        return $this->_cache;
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'cache';
    }
}
