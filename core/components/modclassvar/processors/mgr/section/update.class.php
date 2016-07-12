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
                $this->addOption($fid, $name);
                break;
            case $mode == self::MODE_REMOVE:
                $this->removeOption($fid, $name);
                break;
        }

        return $this->success('');
    }

    /** {@inheritDoc} */
    public function addOption($fid = 0, $name = 0)
    {
        if ($fid AND $name) {
            $sql = "INSERT INTO {$this->modx->getTableName($this->classKey)} (`fid`,`name`) VALUES ('$fid','$name');";
            $this->modx->exec($sql);
        }
    }

    /** {@inheritDoc} */
    public function removeOption($fid = 0, $name = 0)
    {
        if ($fid AND $name) {
            $q = $this->modx->newQuery($this->classKey);
            $q->command('DELETE');
            $q->where(array('fid' => $fid, 'name' => $name));
            $q->prepare();
            $q->stmt->execute();
        }
    }

}

return 'modClassVarSectionUpdateProcessor';