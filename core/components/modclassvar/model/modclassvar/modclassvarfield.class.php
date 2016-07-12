<?php

class modClassVarField extends xPDOSimpleObject
{

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