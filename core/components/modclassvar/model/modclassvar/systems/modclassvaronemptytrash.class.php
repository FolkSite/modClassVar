<?php

class modClassVarOnEmptyTrash extends modClassVarPlugin
{
    public function run()
    {
        $ids = (array)$this->modx->getOption('ids', $this->scriptProperties, array(), true);
        $this->modx->removeCollection('modClassVarValues', array('class' => 'modResource', 'cid:IN' => $ids));
    }
}