## modClassVar - переменные класса для MODX Revolution,

### Получение переменных
Значения переменных выставляются в плейсходеры вида
```
[[!+имя_переменной.название_поля_переменной]]
```

При использовании пакета *pdoTools* и *Fenom*
```
{var $data = $.mcv->getValues('', $_modx->resource.id)}
{$data.google_place}
```

### Добавление переменных через api MODX
Автоматически рабатывает на событие *OnDocFormSave* и *OnUserFormSave*

пример для *invokeEvent*
```
if (!$mcv = $modx->getService('modClassVar')) {
    return;
}

$rid = 1;
$values = $mcv->getValues('', $rid);
$values = array_merge($values,array(
    'desc' => 'описание'
));

If ($resource = $modx->getObject('modResource', $rid)) {

    $resource->set('modclassvar', $values);
    $modx->invokeEvent('OnDocFormSave', array(
        'mode' => modSystemEvent::MODE_UPD,
        'id' => $resource->get('id'),
        'resource' => &$resource,
    ));
}
```

пример для *runProcessor*
```
if (!$mcv = $modx->getService('modClassVar')) {
    return;
}

$rid = 1;
$values = $mcv->getValues('', $rid);
$values = array_merge($values,array(
    'desc' => 'описание'
));

If ($resource = $modx->getObject('modResource', $rid)) {
    $data = $resource->toArray();
    $data['modclassvar'] = $values;
    $response = $modx->runProcessor('/resource/update',$data);
}
```

### Добавление *modClassVar* как глобальную переменную
Плагин на событие *pdoToolsOnFenomInit*
```
switch ($modx->event->name) {

    case 'pdoToolsOnFenomInit':

    if (!$fenom = $modx->getOption('fenom', $scriptProperties)) {
        return;
    }

	if (!$mcv = $modx->getService('modClassVar')) {
    	return false;
	}
    $fenom->mcv = $mcv;
    $fenom->addAccessorSmart("mcv", "mcv", Fenom::ACCESSOR_PROPERTY);

    break;
}
```
