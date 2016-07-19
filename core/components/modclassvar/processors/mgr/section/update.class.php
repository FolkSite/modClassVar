<?php

class modClassVarSectionUpdateProcessor extends modObjectProcessor
{

    public $classKey = 'modClassVarSection';

    const MODE_REMOVE = 'remove';
    const MODE_ADD = 'add';

    /** {@inheritDoc} */
    public function process()
    {
        $mode = $this->getProperty('mode');
        $fid = $this->getProperty('fid');
        $name = $this->getProperty('name');

        switch (true) {
            case !$fid OR !$mode:
                return $this->failure('');
            case $mode == self::MODE_ADD:
                $this->modx->call('modClassVarField', 'saveSection', array(&$this->modx, $fid, $name));
                break;
            case $mode == self::MODE_REMOVE:
                $this->modx->call('modClassVarField', 'removeSection', array(&$this->modx, $fid, $name));
                break;
        }

        return $this->success('');
    }

}

return 'modClassVarSectionUpdateProcessor';