<?php

class modClassVarOnLoadWebDocument extends modClassVarPlugin
{
    public function run()
    {
        if (!$this->modclassvar->getOption('field_placeholders', null, false, true)) {
            return;
        }
        if (!$this->modclassvar->isWorkingTemplates($this->modx->resource)) {
            return;
        }

        $data = $this->modclassvar->getValues($this->modx->resource->id, 'modResource', null, true, '');
        $this->modx->setPlaceholders($data);
    }
}