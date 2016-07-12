<?php

/**
 * Get an modClassVarField
 */
class modClassVarFieldGetProcessor extends modObjectGetProcessor
{
    public $objectType = 'modClassVarField';
    public $classKey = 'modClassVarField';
    public $languageTopics = array('modclassvar');
    public $permission = '';

    /** {@inheritDoc} */
    public function process()
    {
        if (!$this->checkPermissions()) {
            return $this->failure($this->modx->lexicon('access_denied'));
        }

        return parent::process();
    }

    /**
     * Return the response
     * @return array
     */
    public function cleanup()
    {
        $array = $this->object->toArray();

        /* prepare json */
        foreach (array('config', 'condition') as $k) {
            if (isset($array[$k])) {
                $array[$k] = json_encode($array[$k], JSON_FORCE_OBJECT);
            }
        }

        /* get section */
        $section = array();
        $c = $this->modx->newQuery('modClassVarSection');
        $c->sortby('name', 'ASC');
        $c->select('name');
        $c->groupby('name');
        $c->where(array(
            'fid' => $this->getProperty('id')
        ));
        $c->limit(0);
        if ($c->prepare() && $c->stmt->execute()) {
            $section = $c->stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        $array = array_merge($array, array('section' => $section));

        return $this->success('', $array);
    }
    
}

return 'modClassVarFieldGetProcessor';