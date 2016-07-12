<?php
require_once dirname(__FILE__) . '/update.class.php';

/**
 * SetProperty a modClassVarField
 */
class modClassVarFieldSetPropertyProcessor extends modClassVarFieldUpdateProcessor
{
    /** @var modClassVarField $object */
    public $object;
    public $objectType = 'modClassVarField';
    public $classKey = 'modClassVarField';
    public $languageTopics = array('modclassvar');
    public $permission = '';

    /** {@inheritDoc} */
    public function beforeSet()
    {
        $fieldName = $this->getProperty('field_name', null);
        $fieldValue = $this->getProperty('field_value', null);

        $this->properties = array();
        if (!is_null($fieldName) AND !is_null($fieldValue)) {
            $this->setProperty($fieldName, $fieldValue);
        }

        return parent::beforeSet();
    }

}

return 'modClassVarFieldSetPropertyProcessor';