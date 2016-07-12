<?php


/**
 * Get an modClassVarValues
 */
class modClassVarValuesGetProcessor extends modProcessor
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

        $hcld = $modClassVarField->getHandler($this->classKey);
        $modclassvar->loadClass($hcld, $modclassvar->getOption('modelPath') . 'modclassvar/values/');

        $handler = $this->getProperty('handler');
        if (empty($handler)) {
            $handler = $this->getProperty('type');
        }
        
        $hcl = $modClassVarField->getHandler($handler);
        $hcl = $modclassvar->loadClass($hcl, $modclassvar->getOption('modelPath') . 'modclassvar/values/');

        if ($hcl) {
            /** @var _modClassVarValues $handler */
            $handler = new $hcl($this->modx, $modclassvar->config);
            $values = $handler->getValues($this->getProperties());
        } else {
            /** @var _modClassVarValues $handler */
            $handler = new $hcld($this->modx, $modclassvar->config);
            $values = $handler->getValues($this->getProperties());
        }

        return $this->success('', array('modclassvar' => $values));
    }
}

return 'modClassVarValuesGetProcessor';