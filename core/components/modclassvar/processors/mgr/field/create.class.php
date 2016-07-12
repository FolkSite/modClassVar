<?php

/**
 * Create an modClassVarField
 */
class modClassVarFieldCreateProcessor extends modObjectCreateProcessor
{
    /** @var xPDOObject|modClassVarField $object */
    public $object;
    public $objectType = 'modClassVarField';
    public $classKey = 'modClassVarField';
    public $languageTopics = array('modclassvar');
    public $permission = '';

    /** @var modclassvar $modclassvar */
    public $modclassvar;

    public function initialize()
    {
        $this->modclassvar = $this->modx->getService('modclassvar');
        $this->modclassvar->initialize($this->getProperty('context', $this->modx->context->key));

        return parent::initialize();
    }

    /** {@inheritDoc} */
    public function beforeSet()
    {
        /** @var  $pagetitle */
        /** @var  $parent */
        foreach (array('key', 'type') as $k) {
            ${$k} = trim($this->getProperty($k));
            if (!isset(${$k})) {
                $this->modx->error->addField($k, $this->modx->lexicon('modclassvar_err_ae'));
            }
        }

        if ($this->modx->getCount($this->classKey, array(
            'key' => $this->getProperty('key'),
        ))
        ) {
            $this->modx->error->addField('key', $this->modx->lexicon('modclassvar_err_ae'));
        }

        return parent::beforeSet();
    }

    /** {@inheritDoc} */
    public function beforeSave()
    {
        $this->object->fromArray(array(
            'rank' => $this->modx->getCount($this->classKey)
        ));

        return parent::beforeSave();
    }

    /** {@inheritDoc} */
    public function afterSave()
    {
        return true;
    }

}

return 'modClassVarFieldCreateProcessor';