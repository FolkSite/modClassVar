<?php


class _modClassVarComboDateTime extends _modClassVarValues
{
    public function processValues(array $row = array())
    {
        $values = $this->modx->getOption('modclassvar', $row);
        $values = str_replace(array('T'), array(' '), $values);

        return array($values);
    }
}