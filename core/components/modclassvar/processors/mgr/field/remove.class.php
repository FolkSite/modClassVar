<?php

/**
 * Remove a modClassVarField
 */
class modClassVarFieldRemoveProcessor extends modObjectRemoveProcessor
{
    public $classKey = 'modClassVarField';
    public $languageTopics = array('modclassvar');
    public $permission = '';

    public $beforeRemoveEvent = 'modClassVarFieldOnBeforeRemove';
    public $afterRemoveEvent = 'modClassVarFieldOnAfterRemove';

    /** @var modclassvar $modclassvar */
    public $modclassvar;

    public function initialize()
    {
        $this->modclassvar = $this->modx->getService('modclassvar');
        $this->modclassvar->initialize($this->getProperty('context', $this->modx->context->key));

        return parent::initialize();
    }

    /** {@inheritDoc} */
    public function beforeRemove()
    {
        return parent::beforeRemove();
    }

    /** {@inheritDoc} */
    public function afterRemove()
    {
        return true;
    }

}

return 'modClassVarFieldRemoveProcessor';