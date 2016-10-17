<?php

class modClassVarValues extends xPDOObject
{

    public static function getValues(
        xPDO & $xpdo,
        $class = 'modResource',
        $cid = 0,
        $key = null,
        $process = true,
        $prefix = '',
        $group = false
    ) {
        $values = $properties = $sections = array();
        $classValue = 'modClassVarValues';
        $classField = 'modClassVarField';
        $classSection = 'modClassVarSection';

        $q = $xpdo->newQuery($classField);
        $q->leftJoin($classValue, $classValue, "{$classField}.key={$classValue}.key AND {$classValue}.cid = {$cid}");
        $q->leftJoin($classSection, $classSection, "{$classField}.id={$classSection}.fid");

        $q->select($xpdo->getSelectColumns($classField, $classField));
        $q->select($xpdo->getSelectColumns($classValue, $classValue));
        $q->select("GROUP_CONCAT(`{$classSection}`.`name` SEPARATOR ',') as `section_name`");

        $q->groupby("{$classValue}.value");

        if ($class) {
            $q->where(array(
                "{$classValue}.class" => "{$class}"
            ));
        }

        if ($key) {
            $q->where(array(
                "{$classValue}.key" => "{$key}"
            ));
        }

        if ($q->prepare() AND $q->stmt->execute()) {
            while ($row = $q->stmt->fetch(PDO::FETCH_ASSOC)) {

                if (empty($row['section_name'])) {
                    $row['section_name'] = 'empty';
                }
                $section = array_map('trim', explode(',', $row['section_name']));

                $k = $prefix . $row['key'];
                if (isset($values[$k])) {
                    if (!is_array($values[$k])) {
                        $values[$k] = array($values[$k]);
                    }
                    $values[$k][] = $row['value'];
                } else {
                    $values[$k] = $row['value'];
                }

                if ($process AND !isset($properties[$k])) {
                    foreach ($row as $x => $value) {
                        $properties[$k][$x] = $values[$k . '.' . $x] = $value;
                    }
                }

                if ($group) {
                    foreach ($section as $v) {
                        $sections[$v][$k] = $properties[$k];
                        $sections[$v][$k]['value'] = $values[$k];
                    }
                }

            }
        }

        if ($key AND !$process) {
            $values = isset($values[$key]) ? $values[$key] : '';
        }
        if ($group) {
            $values = $sections;
        }

        return $values;
    }

    public static function removeValues(xPDO & $xpdo, $class = 'modResource', $cid = 0, $key = '')
    {
        if (empty($key)) {
            $sql = "DELETE FROM {$xpdo->getTableName('modClassVarValues')} WHERE `class` = '{$class}' AND `cid` = '{$cid}';";
        } else {
            $sql = "DELETE FROM {$xpdo->getTableName('modClassVarValues')} WHERE `class` = '{$class}' AND `cid` = '{$cid}' AND `key` = '{$key}';";
        }

        $stmt = $xpdo->prepare($sql);
        $stmt->execute();
        $stmt->closeCursor();
    }

    public static function saveValues(xPDO & $xpdo, $class = 'modResource', $cid = 0, array $values = array())
    {
        $sql = "INSERT INTO {$xpdo->getTableName('modClassVarValues')} (`class`, `cid`, `key`, `value`) VALUES (:class, :cid, :key, :value);";
        $stmt = $xpdo->prepare($sql);
        foreach ($values as $key => $field) {
            if (!is_array($field)) {
                $field = array($field);
            }
            foreach ($field as $value) {
                $stmt->bindValue(':class', $class);
                $stmt->bindValue(':cid', $cid);
                $stmt->bindValue(':key', $key);
                $stmt->bindValue(':value', $value);
                $stmt->execute();
            }
        }
        $stmt->closeCursor();
    }


}