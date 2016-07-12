<?php
// For debug
ini_set('display_errors', 1);
ini_set('error_reporting', -1);

$productionConfig = dirname(dirname(dirname(dirname(__FILE__)))) . '/config.core.php';
$developmentConfig = dirname(dirname(dirname(dirname(dirname(__FILE__))))) . '/config.core.php';
if (file_exists($productionConfig)) {
    /** @noinspection PhpIncludeInspection */
    require_once $productionConfig;
} else {
    /** @noinspection PhpIncludeInspection */
    require_once $developmentConfig;
}
/** @noinspection PhpIncludeInspection */
require_once MODX_CORE_PATH . 'config/' . MODX_CONFIG_KEY . '.inc.php';
/** @noinspection PhpIncludeInspection */
require_once MODX_CONNECTORS_PATH . 'index.php';
/** @var modclassvar $modclassvar */
$modclassvar = $modx->getService('modclassvar', 'modclassvar', $modx->getOption('modclassvar_core_path', null,
        $modx->getOption('core_path') . 'components/modclassvar/') . 'model/modclassvar/');
$modx->lexicon->load('modclassvar:default');

// handle request
$corePath = $modx->getOption('modclassvar_core_path', null, $modx->getOption('core_path') . 'components/modclassvar/');
$path = $modx->getOption('processorsPath', $modclassvar->config, $corePath . 'processors/');
$modx->request->handleRequest(array(
    'processors_path' => $path,
    'location'        => '',
));