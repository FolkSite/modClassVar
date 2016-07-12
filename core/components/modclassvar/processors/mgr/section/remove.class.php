<?php

class modClassVarSectionRemoveProcessor extends modObjectProcessor
{

    public $classKey = 'modClassVarSection';

    /** {@inheritDoc} */
    public function process()
    {
        $fid = $this->getProperty('fid');
        if (!$fid) {
            return $this->failure('');
        }

        $q = $this->modx->newQuery($this->classKey);
        $q->command('DELETE');
        $q->where(array('fid' => $fid));
        $q->prepare();
        $q->stmt->execute();

        return $this->success('');
    }

}

return 'modClassVarSectionRemoveProcessor';