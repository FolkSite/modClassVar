<?php

/**
 * Update an modClassVarField
 */
class modClassVarFieldUpdateProcessor extends modObjectUpdateProcessor
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
    public function beforeSave()
    {
        if (!$this->checkPermissions()) {
            return $this->modx->lexicon('access_denied');
        }

        return true;
    }

    /** {@inheritDoc} */
    public function beforeSet()
    {
        $this->setProperties(array_merge($this->object->toArray(), $this->getProperties()));
        /** @var  $id */
        /** @var  $pagetitle */
        /** @var  $parent */
        foreach (array('id', 'key', 'type') as $k) {
            ${$k} = trim($this->getProperty($k));
            if (!isset(${$k})) {
                $this->modx->error->addField($k, $this->modx->lexicon('modclassvar_err_ae'));
            }
        }

        if ($this->modx->getCount($this->classKey, array(
            'id:!=' => $id,
            'key'   => $this->getProperty('key'),
        ))
        ) {
            $this->modx->error->addField('key', $this->modx->lexicon('modclassvar_err_ae'));
        }

        return parent::beforeSet();
    }

    /** {@inheritDoc} */
    public function afterSave()
    {
        return true;
    }

}

return 'modClassVarFieldUpdateProcessor';
