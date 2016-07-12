<?php

class modClassVarOnDocFormSave extends modClassVarPlugin
{
    public function run()
    {
        /** @var modResource $resource */
        $resource = $this->modx->getOption('resource', $this->scriptProperties, null, true);
        if (
            !$resource
            OR
            !$this->modclassvar->isWorkingTemplates($resource)
        ) {
            return;
        }

        $data = $resource->toArray();
        $prefix = $this->modclassvar->getOption('prefix_key', null, 'modclassvar.', true);
        $values = $this->modx->getOption(rtrim($prefix, '.'), $data, array(), true);

        foreach ($data as $k => $v) {
            if (strpos($k, $prefix) !== false) {
                $key = str_replace($prefix, '', $k);
                $value = (array)$v;
                if (!isset($values[$key])) {
                    $values[$key] = $value;
                } else {
                    $values[$key] = array_merge((array)$values[$key], $value);
                }
            }
        }

        if (!empty($values)) {
            $cid = $resource->get('id');
            $this->modx->call('modClassVarValues', 'removeValues', array(&$this->modx, 'modResource', $cid));
            $this->modx->call('modClassVarValues', 'saveValues', array(&$this->modx, 'modResource', $cid, $values));
        }
    }
}