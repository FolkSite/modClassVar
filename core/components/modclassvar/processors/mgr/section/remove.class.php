<?php

class modClassVarSectionRemoveProcessor extends modObjectProcessor
{

    public $classKey = 'modClassVarSection';

    /** {@inheritDoc} */
    public function process()
    {
        $this->modx->call('modClassVarField', 'removeSection', array(&$this->modx, $this->getProperty('fid', 0)));

        return $this->success('');
    }

}

return 'modClassVarSectionRemoveProcessor';