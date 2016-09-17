<?php

$properties = array();

$tmp = array(
    'tpl'            => array(
        'type'  => 'textfield',
        'value' => '',
    ),
    'class'          => array(
        'type'  => 'textfield',
        'value' => 'modResource',
    ),
    'leftJoinVars'   => array(
        'type'  => 'textfield',
        'value' => '',
    ),
    'innerJoinVars'  => array(
        'type'  => 'textfield',
        'value' => '',
    ),
    'whereVars'      => array(
        'type'  => 'textfield',
        'value' => '',
    ),
    'includeField'   => array(
        'type'  => 'combo-boolean',
        'value' => false,
    ),
    'element'        => array(
        'type'  => 'textfield',
        'value' => 'pdoResources',
    ),
);

foreach ($tmp as $k => $v) {
    $properties[] = array_merge(
        array(
            'name'    => $k,
            'desc'    => PKG_NAME_LOWER . '_prop_' . $k,
            'lexicon' => PKG_NAME_LOWER . ':properties',
        ), $v
    );
}

return $properties;