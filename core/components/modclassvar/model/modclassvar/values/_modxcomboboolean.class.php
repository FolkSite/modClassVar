<?php


class _modxComboBoolean extends _modClassVarValues
{
    public function getValues(array $row = array())
    {
        $values = parent::getValues($row);

        return (boolean)$values;
    }

    public function processValues(array $row = array())
    {
        $values = $this->modx->getOption('modclassvar', $row);
        switch ($values) {
            case '1':
            case 'true':
                $values = true;
                break;
            case '0':
            case 'false':
                $values = false;
                break;
            default:
                $values = false;
                break;
        }

        return array((boolean)$values);
    }

}