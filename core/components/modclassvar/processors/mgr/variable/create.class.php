<?php


/**
 * Get an modClassVarValues
 */
class modClassVarValuesCreateProcessor extends modProcessor
{
    public $classKey = 'modClassVarValues';
    public $classField = 'modClassVarField';

    public function process()
    {
        /** @var modclassvar $modclassvar */
        $modclassvar = $this->modx->getService('modclassvar');
        $modclassvar->initialize($this->getProperty('context', $this->modx->context->key));

        /** @var  $class */
        /** @var  $cid */
        /** @var  $key */
        foreach (array('class', 'cid', 'key') as $k) {
            ${$k} = trim($this->getProperty($k));
            if (!isset(${$k})) {
                $this->modx->error->addField($k, $this->modx->lexicon('modclassvar_err_ae'));
            }
        }

        $q = $this->modx->newQuery($class);
        $pk = $this->modx->getPK($class);
        $q->where("{$class}.{$pk}='{$cid}'");

        if (!$this->modx->getCount($class, $q)) {
            return $this->modx->lexicon('modclassvar_err_nf');
        }

        /** @var xPDOObject|modClassVarField $modClassVarField */
        if (!$modClassVarField = $this->modx->getObject($this->classField, array('key' => $key))) {
            return $this->modx->lexicon('modclassvar_err_nf');
        }

        /* default values */
        $values = $modclassvar->getValues('modClassVarField', $modClassVarField->get('id'), $key, false);

        $this->modx->call('modClassVarValues', 'removeValues', array(&$this->modx, $class, $cid, $key));
        $this->modx->call('modClassVarValues', 'saveValues', array(&$this->modx, $class, $cid, array($key => $values)));

        return $this->success('', $this->getProperties());
    }
}

return 'modClassVarValuesCreateProcessor';