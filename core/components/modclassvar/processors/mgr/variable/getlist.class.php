<?php

/**
 * Get a list of modClassVarValues
 */
class modClassVarValuesGetListProcessor extends modObjectGetListProcessor
{
    public $objectType = 'modClassVarValues';
    public $classKey = 'modClassVarValues';
    public $classField = 'modClassVarField';
    public $classSection = 'modClassVarSection';
    public $primaryKeyField = 'cid';
    public $defaultSortField = 'rank';
    public $defaultSortDirection = 'ASC';
    public $languageTopics = array('default', 'modclassvar');
    public $permission = '';

    /**
     * @param xPDOQuery $c
     *
     * @return xPDOQuery
     */
    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $id = $this->getProperty('id');
        if (!empty($id) AND $this->getProperty('combo')) {
            $q = $this->modx->newQuery($this->classKey);
            $q->where(array('id!=' => $id));
            $q->select('id');
            $q->limit($this->getProperty('limit') - 1);
            $q->prepare();
            $q->stmt->execute();
            $ids = $q->stmt->fetchAll(PDO::FETCH_COLUMN, 0);
            $ids = array_merge_recursive(array($id), $ids);
            $c->where(array(
                "{$this->classKey}.id:IN" => $ids
            ));
        }

        $c->groupby("{$this->classKey}.key");

        $c->leftJoin($this->classField, $this->classField, "{$this->classField}.key = {$this->classKey}.key");
        $c->leftJoin($this->classSection, $this->classSection, "{$this->classField}.id = {$this->classSection}.fid");
        $c->select($this->modx->getSelectColumns($this->classKey, $this->classKey));
        $c->select($this->modx->getSelectColumns($this->classField, $this->classField, '', array('id'), true));

        $c->where(array(
            "{$this->classField}.active" => true
        ));

        $class = $this->getProperty('class');
        if (!in_array($class, array(null, '0'))) {
            $c->where("{$this->classKey}.class='{$class}'");
        }

        $cid = $this->getProperty('cid');
        if (!in_array($cid, array(null, '0'))) {
            $c->where("{$this->classKey}.cid='{$cid}'");
        }

        $type = $this->getProperty('type');
        if (!in_array($type, array(null, '0'))) {
            $c->where("{$this->classField}.type='{$type}'");
        }

        $section = $this->getProperty('section');
        if (!in_array($section, array(null, '0'))) {
            $c->where("{$this->classSection}.name='{$section}'");
        }

        return $c;
    }

    /** {@inheritDoc} */
    public function outputArray(array $array, $count = false)
    {
        if ($this->getProperty('addall')) {
            $array = array_merge_recursive(array(
                array(
                    'id'   => 0,
                    'name' => $this->modx->lexicon('modclassvar_all')
                )
            ), $array);
        }
        if ($this->getProperty('novalue')) {
            $array = array_merge_recursive(array(
                array(
                    'id'   => 0,
                    'name' => $this->modx->lexicon('modclassvar_no')
                )
            ), $array);
        }

        return parent::outputArray($array, $count);
    }

    /**
     * @param xPDOObject $object
     *
     * @return array
     */
    public function prepareArray(array $array)
    {
        if ($this->getProperty('combo')) {

        } else {

            $icon = 'icon';
            $array['actions'] = array();
            /* remove */
            $array['actions'][] = array(
                'cls'    => '',
                'icon'   => "$icon $icon-trash-o red",
                'title'  => $this->modx->lexicon('modclassvar_action_remove'),
                'action' => 'remove',
                'button' => true,
                'menu'   => true,
            );

            /* get values */
            $data = $this->modx->call('modClassVarValues', 'getValues',
                array(&$this->modx, $array['class'], (int)$array['cid'], $array['key']));
            $array = array_merge($array, $data);

        }

        return $array;
    }

    /**
     * Get the data of the query
     * @return array
     */
    public function getData()
    {
        $data = array();
        $limit = intval($this->getProperty('limit'));
        $start = intval($this->getProperty('start'));

        $c = $this->modx->newQuery($this->classKey);
        $c = $this->prepareQueryBeforeCount($c);
        $data['total'] = $this->modx->getCount($this->classKey, $c);
        $c = $this->prepareQueryAfterCount($c);
        $c->select($this->modx->getSelectColumns($this->classKey, $this->classKey));

        $sortClassKey = $this->getSortClassKey();
        $sortKey = $this->modx->getSelectColumns($sortClassKey, $this->getProperty('sortAlias', $sortClassKey), '',
            array($this->getProperty('sort')));
        if (empty($sortKey)) {
            $sortKey = $this->getProperty('sort');
        }
        $c->sortby($sortKey, $this->getProperty('dir'));
        if ($limit > 0) {
            $c->limit($limit, $start);
        }

        if ($c->prepare() AND $c->stmt->execute()) {
            $data['results'] = $c->stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        return $data;
    }

    public function isShow(array $array)
    {
        $show = true;
        $cid = (int)$this->modx->getOption('cid', $array);
        $class = $this->modx->getOption('class', $array);
        if ($cid AND $class) {
            $condition = $this->modx->getOption('condition', $array, '{}', true);
            $condition = json_decode($condition, true);

            $q = $this->modx->newQuery($class);
            $pk = $this->modx->getPK($class);
            $q->where("{$class}.{$pk}='{$cid}'");
            $q->andCondition($condition);

            $stmt = $q->prepare();
            if ($stmt) {
                $value = $this->modx->getValue($stmt);
                if (!$value) {
                    $show = false;
                }
            }
        }

        return $show;
    }

    /**
     * @param array $data
     *
     * @return array
     */
    public function iterate(array $data)
    {
        $list = array();
        $list = $this->beforeIteration($list);
        $this->currentIndex = 0;
        /** @var xPDOObject|modAccessibleObject $object */
        foreach ($data['results'] as $array) {
            if (!$this->isShow($array)) {
                continue;
            }
            $list[] = $this->prepareArray($array);
            $this->currentIndex++;
        }
        $list = $this->afterIteration($list);

        return $list;
    }


}

return 'modClassVarValuesGetListProcessor';