<?php

/** @var array $scriptProperties */
/** @var modclassvar $modclassvar */
$fqn = $modx->getOption('modclassvar_class', null, 'modclassvar.modclassvar', true);
$path = $modx->getOption('modclassvar_class_path', null,
    $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/modclassvar/');
if (!$modclassvar = $modx->getService($fqn, '', $path . 'model/',
    array('core_path' => $path))
) {
    return false;
}

$tpl = $scriptProperties['tpl'] = $modx->getOption('tpl', $scriptProperties, '', true);
$parents = $scriptProperties['parents'] = $modx->getOption('parents', $scriptProperties, $modx->resource->id, true);
$class = $scriptProperties['class'] = $modx->getOption('class', $scriptProperties, 'modResource', true);
$return = $scriptProperties['return'] = $modx->getOption('return', $scriptProperties, 'chunks', true);
if (isset($this) AND $this instanceof modSnippet AND $element == $this->get('name')) {
    $properties = $this->getProperties();
    $element = $scriptProperties['element'] = $modx->getOption('element', $properties, 'pdoResources', true);
}

$where = array();
$leftJoin = array();
$innerJoin = array();
$select = array(
    $class => "{$class}.*"
);
$groupby = array(
    "{$class}.id",
);

// Add user parameters
foreach (array('where', 'leftJoin', 'innerJoin', 'select', 'groupby') as $v) {
    if (!empty($scriptProperties[$v])) {
        $tmp = $scriptProperties[$v];
        if (!is_array($tmp)) {
            $tmp = json_decode($tmp, true);
        }
        if (is_array($tmp)) {
            $$v = array_merge($$v, $tmp);
        }
    }
    unset($scriptProperties[$v]);
}

// leftJoin vars
$leftJoinVars = $modclassvar->explodeAndClean($scriptProperties['leftJoinVars']);
foreach ($leftJoinVars as $var) {
    $leftJoin[$var] = array(
        'class' => 'modClassVarValues',
        'on'    => "`{$var}`.class = '{$class}' AND `{$var}`.cid = `{$class}`.id AND `{$var}`.key = '{$var}'",
    );
    $select[$var] = "`{$var}`.value as {$var}_value";
}

// innerJoin vars
$innerJoinVars = $modclassvar->explodeAndClean($scriptProperties['innerJoinVars']);
foreach ($innerJoinVars as $var) {
    $innerJoin[$var] = array(
        'class' => 'modClassVarValues',
        'on'    => "`{$var}`.class = '{$class}' AND `{$var}`.cid = `{$class}`.id AND `{$var}`.key = '{$var}'",
    );
    $select[$var] = "`{$var}`.value as {$var}_value";
}

/* TODO add modClassVarField*/

// where vars
if (!empty($scriptProperties['whereVars'])) {
    $vars = json_decode($scriptProperties['whereVars'], true);
    foreach ($vars as $key => $value) {
        $var = preg_replace('#\:.*#', '', $key);
        $key = str_replace($var, $var . '.value', $key);
        if (in_array($var, $leftJoinVars) OR in_array($var, $innerJoinVars)) {
            $where[$key] = $value;
        }
    }
}

$default = array(
    'class'     => $class,
    'where'     => $where,
    'leftJoin'  => $leftJoin,
    'innerJoin' => $innerJoin,
    'select'    => $select,
    'sortby'    => "{$class}.id",
    'sortdir'   => 'ASC',
    'groupby'   => implode(', ', $groupby),
    'return'    => $return,
);

$output = '';
/** @var modSnippet $snippet */
if ($snippet = $modx->getObject('modSnippet', array('name' => $element))) {
    $scriptProperties = array_merge($default, $scriptProperties);
    $snippet->setCacheable(false);
    $output = $snippet->process($scriptProperties);
}

return $output;