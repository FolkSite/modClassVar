<?php

class modClassVarChunkGetListProcessor extends modObjectGetListProcessor
{
    public $objectType = 'modChunk';
    public $classKey = 'modChunk';
    public $languageTopics = array('chunk');
    public $defaultSortField = 'name';

    /** {@inheritDoc} */
    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $pf = '|';

        $c->select('id,name');

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
                $c->where(array('name:LIKE' => "%{$query}%"));
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

        return $c;
    }

    /** {@inheritDoc} */
    public function prepareRow(xPDOObject $object)
    {
        if ($this->getProperty('combo')) {
            $array = array(
                'id'   => $object->get('id'),
                'name' => $object->get('name'),
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
                    'id'   => '-',
                    'name' => $this->modx->lexicon('modClassVar_no')
                )
            ), $array);
        }
        if ($this->getProperty('addall')) {
            $array = array_merge_recursive(array(
                array(
                    'id'   => '-',
                    'name' => $this->modx->lexicon('modClassVar_all')
                )
            ), $array);
        }

        return parent::outputArray($array, $count);
    }

}

return 'modClassVarChunkGetListProcessor';