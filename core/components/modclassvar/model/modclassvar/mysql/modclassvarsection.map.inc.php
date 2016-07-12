<?php
$xpdo_meta_map['modClassVarSection']= array (
  'package' => 'modclassvar',
  'version' => '1.1',
  'table' => 'modclassvar_sections',
  'extends' => 'xPDOObject',
  'fields' => 
  array (
    'fid' => 0,
    'name' => '',
  ),
  'fieldMeta' => 
  array (
    'fid' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'phptype' => 'integer',
      'attributes' => 'unsigned',
      'null' => false,
      'default' => 0,
      'index' => 'pk',
    ),
    'name' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
      'default' => '',
    ),
  ),
  'indexes' => 
  array (
    'field_section' => 
    array (
      'alias' => 'field_section',
      'primary' => false,
      'unique' => true,
      'type' => 'BTREE',
      'columns' => 
      array (
        'fid' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
        'name' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
  ),
  'aggregates' => 
  array (
    'Fields' => 
    array (
      'class' => 'modClassVarField',
      'local' => 'fid',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
  ),
);
