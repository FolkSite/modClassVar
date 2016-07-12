<?php

/**
 * Remove a modClassVarValues
 */
class modClassVarValuesRemoveProcessor extends modObjectRemoveProcessor
{
    public $classKey = 'modClassVarValues';
    public $classField = 'modClassVarField';
    public $languageTopics = array('modclassvar');
    public $permission = '';

    /** @var modclassvar $modclassvar */
    public $modclassvar;

    public function initialize()
    {
        /** @var  $class */
        /** @var  $cid */
        /** @var  $key */
        list($class, $cid, $key) = $this->getProperty('id', array(0, 0, 0));

        $q = $this->modx->newQuery($class);
        $pk = $this->modx->getPK($class);
        $q->where("{$class}.{$pk}='{$cid}'");

        if (!$this->modx->getCount($class, $q)) {
            return $this->modx->lexicon('modclassvar_err_nf');
        }

        if (!$this->modx->getCount($this->classField, array('key' => $key))) {
            return $this->modx->lexicon('modclassvar_err_nf');
        }

        $this->modx->call('modClassVarValues', 'removeValues', array(&$this->modx, $class, $cid, $key));

        return true;
    }

    public function process()
    {
        return $this->success('', $this->getProperties());
    }

}

return 'modClassVarValuesRemoveProcessor';