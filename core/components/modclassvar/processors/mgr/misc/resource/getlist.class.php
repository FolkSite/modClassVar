<?php

class modClassVarResourceGetListProcessor extends modObjectGetListProcessor
{
    public $objectType = 'modResource';
    public $classKey = 'modResource';
    public $languageTopics = array('resource');
    public $defaultSortField = 'pagetitle';


    /** @var modclassvar $modclassvar */
    public $modclassvar;

    public function initialize()
    {
        $this->modclassvar = $this->modx->getService('modclassvar');
        $this->modclassvar->initialize($this->getProperty('context', $this->modx->context->key));

        return parent::initialize();
    }

    /** {@inheritDoc} */
    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $pf = '|';

        $c->select('id,pagetitle,longtitle');

        $query = $this->getProperty('query');
        switch (true) {
            case is_numeric($query):
                $this->setProperty('id', $query);
                break;
            case (strpos($query, $pf) !== false):
                $query = explode($pf, $query);
                $c->andCondition(array(
                    "{$this->classKey}.id:IN" => $query
                ));
                break;
            case !empty($query):
                $c->where(array('pagetitle:LIKE' => "%{$query}%"));
                break;
        }

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

        $template = $this->modclassvar->explodeAndClean($this->getProperty('template'));
        if (!empty($template)) {
            $c->andCondition(array(
                "{$this->classKey}.template:IN" => $template,
            ));
        }

        return $c;
    }

    /** {@inheritDoc} */
    public function prepareRow(xPDOObject $object)
    {
        if ($this->getProperty('combo')) {
            $array = array(
                'id'        => $object->get('id'),
                'pagetitle' => $object->get('pagetitle'),
                'longtitle' => $object->get('longtitle')
            );
        } else {
            $array = $object->toArray();
        }

        return $array;
    }

    /** {@inheritDoc} */
    public function outputArray(array $array, $count = false)
    {
        if ($this->getProperty('novalue')) {
            $array = array_merge_recursive(array(
                array(
                    'id'        => '-',
                    'pagetitle' => $this->modx->lexicon('modClassVar_no')
                )
            ), $array);
        }
        if ($this->getProperty('addall')) {
            $array = array_merge_recursive(array(
                array(
                    'id'        => '-',
                    'pagetitle' => $this->modx->lexicon('modClassVar_all')
                )
            ), $array);
        }

        return parent::outputArray($array, $count);
    }

}

return 'modClassVarResourceGetListProcessor';