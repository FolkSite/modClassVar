<?php

class modClassVarOnUserFormPrerender extends modClassVarPlugin
{
    public function run()
    {
        $mode = $this->modx->getOption('mode', $this->scriptProperties, modSystemEvent::MODE_NEW, true);
        if ($mode == modSystemEvent::MODE_NEW) {
            return;
        }

        /** @var modUser $user */
        $user = $this->modx->getOption('user', $this->scriptProperties, null, true);
        if (
            !$user
            OR
            !$this->modclassvar->isWorkingGroups($user)
        ) {
            return;
        }

        $this->modclassvar->loadControllerJsCss($this->modx->controller, array(
            'css'             => true,
            'config'          => true,
            'tools'           => true,
            'field'           => true,
            'variable'        => true,
            'user/inject'     => true,
        ));
    }
}