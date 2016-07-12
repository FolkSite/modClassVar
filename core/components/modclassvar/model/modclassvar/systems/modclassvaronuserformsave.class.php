<?php

class modClassVarOnUserFormSave extends modClassVarPlugin
{
    public function run()
    {
        /** @var modUser $user */
        $user = $this->modx->getOption('user', $this->scriptProperties, null, true);
        if (
            !$user
            OR
            !$this->modclassvar->isWorkingGroups($user)
        ) {
            return;
        }

        $data = $user->toArray();
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
            $cid = $user->get('id');
            $this->modx->call('modClassVarValues', 'removeValues', array(&$this->modx, 'modUser', $cid));
            $this->modx->call('modClassVarValues', 'saveValues', array(&$this->modx, 'modUser', $cid, $values));
        }
    }
}