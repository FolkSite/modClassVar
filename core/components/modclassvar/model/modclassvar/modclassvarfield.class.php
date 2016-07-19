<?php

class modClassVarField extends xPDOSimpleObject
{

    public function isSection()
    {
        return is_array($this->get('section')) AND count($this->get('section'));
    }

    public static function removeSection(xPDO & $xpdo, $fid = 0, $name = '')
    {
        if (empty($name)) {
            $sql = "DELETE FROM {$xpdo->getTableName('modClassVarSection')} WHERE `fid` = '{$fid}';";
        } else {
            $sql = "DELETE FROM {$xpdo->getTableName('modClassVarSection')} WHERE `fid` = '{$fid}' AND `name` = '{$name}';";
        }

        $stmt = $xpdo->prepare($sql);
        $stmt->execute();
        $stmt->closeCursor();
    }

    public static function saveSection(xPDO & $xpdo, $fid = 0, $names = array())
    {
        $sql = "INSERT INTO {$xpdo->getTableName('modClassVarSection')} (`fid`, `name`) VALUES (:fid, :name);";
        $stmt = $xpdo->prepare($sql);

        if (!is_array($names)) {
            $names = array($names);
        }
        foreach ($names as $name) {
            $stmt->bindValue(':fid', $fid);
            $stmt->bindValue(':name', $name);
            $stmt->execute();
        }
        $stmt->closeCursor();
    }

    public function save($cacheFlag = null)
    {
        $saved = parent:: save($cacheFlag);

        if ($this->isSection()) {
            $this->xpdo->call('modClassVarField', 'removeSection', array(&$this->xpdo, $this->get('id')));
            $this->xpdo->call('modClassVarField', 'saveSection',
                array(&$this->xpdo, $this->get('id'), $this->get('section')));
        }

        return $saved;
    }

    public function getHandler($type = null)
    {
        switch (true) {
            case $type:
                $handler = $type;
                break;
            case $this->get('handler') != '':
                $handler = $this->get('handler');
                break;
            case $this->get('type') != '':
                $handler = $this->get('type');
                break;
            default:
                $handler = 'modClassVarValues';
        }

        $handler = str_replace(array('-', '_'), array('', ''), $handler);
        $handler = '_' . ltrim($handler, '_');

        return $handler;
    }
}