<?php

/** @var array $scriptProperties */
$fqn = $modx->getOption('modclassvar_class', null, 'modclassvar.modclassvar', true);
$path = $modx->getOption('modclassvar_class_path', null,
    $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/modclassvar/');
if (!$modclassvar = $modx->getService($fqn, '', $path . 'model/',
    array('core_path' => $path))
) {
    return false;
}

$className = 'modclassvar' . $modx->event->name;
$modx->loadClass('modclassvarPlugin', $modclassvar->getOption('modelPath') . 'modclassvar/systems/', true, true);
$modx->loadClass($className, $modclassvar->getOption('modelPath') . 'modclassvar/systems/', true, true);
if (class_exists($className)) {
    /** @var $modclassvar $handler */
    $handler = new $className($modx, $scriptProperties);
    $handler->run();
}
return;