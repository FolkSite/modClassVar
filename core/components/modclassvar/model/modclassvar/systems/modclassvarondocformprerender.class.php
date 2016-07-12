<?php

class modClassVarOnDocFormPrerender extends modClassVarPlugin
{
    public function run()
    {
        $mode = $this->modx->getOption('mode', $this->scriptProperties, modSystemEvent::MODE_NEW, true);
        if ($mode == modSystemEvent::MODE_NEW) {
            return;
        }

        /** @var modResource $resource */
        $resource = $this->modx->getOption('resource', $this->scriptProperties, null, true);
        if (
            !$resource
            OR
            !$this->modclassvar->isWorkingTemplates($resource)
        ) {
            return;
        }

        $this->modclassvar->loadControllerJsCss($this->modx->controller, array(
            'css'             => true,
            'config'          => true,
            'tools'           => true,
            'field'           => true,
            'variable'        => true,
            'resource/inject' => true,
        ));
    }
}