<?php

$settings = array();

$tmp = array(

    'working_templates' => array(
        'value' => '1,2,3',
        'xtype' => 'textfield',
        'area'  => 'modclassvar_main',
    ),
    'working_groups'    => array(
        'value' => '0,1,2',
        'xtype' => 'textfield',
        'area'  => 'modclassvar_main',
    ),

    'field_placeholders' => array(
        'xtype' => 'combo-boolean',
        'value' => true,
        'area'  => 'modclassvar_main',
    ),
    'field_prefix'       => array(
        'value' => '',
        'xtype' => 'textfield',
        'area'  => 'modclassvar_main',
    ),
    'prefix_key'         => array(
        'value' => 'modclassvar_',
        'xtype' => 'textfield',
        'area'  => 'modclassvar_main',
    ),

    'force_script_ymaps' => array(
        'xtype' => 'combo-boolean',
        'value' => true,
        'area'  => 'modclassvar_script',
    ),
    'force_script_gmaps' => array(
        'xtype' => 'combo-boolean',
        'value' => true,
        'area'  => 'modclassvar_script',
    ),
    'script_ymaps'       => array(
        'value' => 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&mode=release',
        'xtype' => 'textarea',
        'area'  => 'modclassvar_script',
    ),
    'script_gmaps'       => array(
        'value' => 'https://maps.google.com/maps/api/js?sensor=false',
        'xtype' => 'textarea',
        'area'  => 'modclassvar_script',
    ),


    //временные

    /* 'assets_path' => array(
         'value' => '{base_path}modclassvar/assets/components/modclassvar/',
         'xtype' => 'textfield',
         'area'  => 'modclassvar_temp',
     ),
     'assets_url'  => array(
         'value' => '/modclassvar/assets/components/modclassvar/',
         'xtype' => 'textfield',
         'area'  => 'modclassvar_temp',
     ),
     'core_path'   => array(
         'value' => '{base_path}modclassvar/core/components/modclassvar/',
         'xtype' => 'textfield',
         'area'  => 'modclassvar_temp',
     ),*/

);

foreach ($tmp as $k => $v) {
    /* @var modSystemSetting $setting */
    $setting = $modx->newObject('modSystemSetting');
    $setting->fromArray(array_merge(
        array(
            'key'       => 'modclassvar_' . $k,
            'namespace' => PKG_NAME_LOWER,
        ), $v
    ), '', true, true);

    $settings[] = $setting;
}

unset($tmp);
return $settings;
