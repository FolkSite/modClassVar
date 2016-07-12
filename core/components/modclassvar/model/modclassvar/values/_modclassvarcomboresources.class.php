<?php


class _modClassVarComboResources extends _modClassVarValues
{

    public function getValues(array $row = array())
    {
        $values = $this->getData($row);
        $values = implode('||', $values);

        return $values;
    }

    public function processValues(array $row = array())
    {
        $values = $this->modx->getOption('modclassvar', $row);
        $values = explode('||', $values);

        return $values;
    }

}