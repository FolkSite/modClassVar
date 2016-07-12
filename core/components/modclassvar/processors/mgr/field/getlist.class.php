<?php

/**
 * Get a list of modClassVarField
 */
class modClassVarFieldGetListProcessor extends modObjectGetListProcessor
{
    public $objectType = 'modClassVarField';
    public $classKey = 'modClassVarField';
    public $classSection = 'modClassVarSection';
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

        $c->leftJoin($this->classSection, $this->classSection, "{$this->classKey}.id = {$this->classSection}.fid");

        $cid = $this->getProperty('cid');
        if (!in_array($cid, array(null, '0'))) {
            $classVar = 'modClassVarValues';

            $c->leftJoin($classVar, $classVar, array(
                "{$classVar}.cid = {$cid}",
                "{$classVar}.key = {$this->classKey}.key",
            ));

            $c->select($this->modx->getSelectColumns($this->classKey, $this->classKey));
            $c->select($this->modx->getSelectColumns($classVar, $classVar, '', array('key'), true));
            $c->where(array("{$classVar}.cid" => null));
        }

        $active = $this->getProperty('active');
        if (!in_array($active, array(null, '-'))) {
            $c->where("{$this->objectType}.active={$active}");
        }

        $section = $this->getProperty('section');
        if (!in_array($section, array(null, '0'))) {
            $c->where("{$this->classSection}.name='{$section}'");
        }

        $query = trim($this->getProperty('query'));
        if ($query) {
            $c->where(array(
                'key:LIKE'            => "%{$query}%",
                'OR:name:LIKE'        => "%{$query}%",
                'OR:description:LIKE' => "%{$query}%",
            ));
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

            // Edit
            $array['actions'][] = array(
                'cls'    => '',
                'icon'   => "$icon $icon-edit green",
                'title'  => $this->modx->lexicon('modclassvar_action_update'),
                'action' => 'update',
                'button' => true,
                'menu'   => true,
            );

            // sep
            $array['actions'][] = array(
                'cls'    => '',
                'icon'   => '',
                'title'  => '',
                'action' => 'sep',
                'button' => false,
                'menu'   => true,
            );

            if (!$array['active']) {
                $array['actions'][] = array(
                    'cls'    => '',
                    'icon'   => "$icon $icon-toggle-off red",
                    'title'  => $this->modx->lexicon('modclassvar_action_turnon'),
                    'action' => 'active',
                    'button' => true,
                    'menu'   => true,
                );
            } else {
                $array['actions'][] = array(
                    'cls'    => '',
                    'icon'   => "$icon $icon-toggle-on green",
                    'title'  => $this->modx->lexicon('modclassvar_action_turnoff'),
                    'action' => 'inactive',
                    'button' => true,
                    'menu'   => true,
                );
            }

            // Remove
            $array['actions'][] = array(
                'cls'    => '',
                'icon'   => "$icon $icon-trash-o red",
                'title'  => $this->modx->lexicon('modclassvar_action_remove'),
                'action' => 'remove',
                'button' => true,
                'menu'   => true,
            );

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
        $cid = (int)$this->getProperty('cid');
        $class = $this->getProperty('class');

        /** TODO */
        $level = $this->modx->getLogLevel();
        $this->modx->setLogLevel(xPDO::LOG_LEVEL_FATAL);
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
        $this->modx->setLogLevel($level);

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

return 'modClassVarFieldGetListProcessor';