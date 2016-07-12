<?php

/** @var $modx modX */
if (!$modx = $object->xpdo AND !$object->xpdo instanceof modX) {
    return true;
}

/** @var $options */
switch ($options[xPDOTransport::PACKAGE_ACTION]) {
    case xPDOTransport::ACTION_INSTALL:
    case xPDOTransport::ACTION_UPGRADE:
        $modelPath = $modx->getOption('modclassvar_core_path', null,
                $modx->getOption('core_path') . 'components/modclassvar/') . 'model/';
        $modx->addPackage('modclassvar', $modelPath);

        /* modClassVarField */
        $fields = array(
            array(
                'key'  => 'bool',
                'name' => 'булево',
                'type' => 'modx-combo-boolean',
            ),
            array(
                'key'  => 'desc',
                'name' => 'Описание',
                'type' => 'textarea',
            ),
            array(
                'key'  => 'tags',
                'name' => 'Теги',
                'type' => 'modclassvar-combo-option',
            ),
            array(
                'key'  => 'brand',
                'name' => 'Бренд',
                'type' => 'modclassvar-combo-autocomplete',
            ),
            array(
                'key'  => 'file',
                'name' => 'Файл',
                'type' => 'modclassvar-combo-file',
            ),
            array(
                'key'  => 'yandex_place',
                'name' => 'Местоположение Yandex',
                'type' => 'modclassvar-combo-ymaps-place',
            ),
            array(
                'key'  => 'google_place',
                'name' => 'Местоположение Google',
                'type' => 'modclassvar-combo-gmaps-place',
            ),


            array(
                'key'  => 'user',
                'name' => 'Пользователь',
                'type' => 'modclassvar-combo-user',
            ),
            array(
                'key'  => 'users',
                'name' => 'Пользователи',
                'type' => 'modclassvar-combo-users',
            ),
            array(
                'key'  => 'resources',
                'name' => 'Ресурсы',
                'type' => 'modclassvar-combo-resources',
            ),
            array(
                'key'  => 'resource',
                'name' => 'Ресурс',
                'type' => 'modclassvar-combo-resource',
            ),

        );

        foreach ($fields as $field) {
            if (!$tmp = $modx->getCount('modClassVarField', array('key' => $field['key']))) {
                $tmp = $modx->newObject('modClassVarField', array_merge(array(
                    'rank'   => $modx->getCount('modClassVarField'),
                    'active' => 1
                ), $field));
                $tmp->save();
            }
        }

        break;
    case xPDOTransport::ACTION_UNINSTALL:
        break;
}
return true;