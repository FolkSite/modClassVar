<?php
$xpdo_meta_map['modClassVarValues']= array (
  'package' => 'modclassvar',
  'version' => '1.1',
  'table' => 'modclassvar_values',
  'extends' => 'xPDOObject',
  'fields' => 
  array (
    'class' => '',
    'cid' => 0,
    'key' => '',
    'value' => NULL,
  ),
  'fieldMeta' => 
  array (
    'class' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
      'default' => '',
      'index' => 'pk',
    ),
    'cid' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'phptype' => 'integer',
      'null' => false,
      'default' => 0,
      'index' => 'pk',
    ),
    'key' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '60',
      'phptype' => 'string',
      'null' => false,
      'default' => '',
      'index' => 'pk',
    ),
    'value' => 
    array (
      'dbtype' => 'text',
      'phptype' => 'string',
      'null' => false,
      'index' => 'fulltext',
    ),
  ),
  'indexes' => 
  array (
    'class_field' => 
    array (
      'alias' => 'class_field',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'class' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
        'cid' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
        'key' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'value_ft' => 
    array (
      'alias' => 'value_ft',
      'primary' => false,
      'unique' => false,
      'type' => 'FULLTEXT',
      'columns' => 
      array (
        'value' => 
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
    'Field' => 
    array (
      'class' => 'modClassVarField',
      'local' => 'key',
      'foreign' => 'key',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
  ),
  'validation' => 
  array (
    'rules' => 
    array (
      'key' => 
      array (
        'invalid' => 
        array (
          'type' => 'preg_match',
          'rule' => '/^(?!\\W+)(?!\\d)[a-zA-Z0-9\\x2d-\\x2f\\x7f-\\xff-_]+(?!\\s)$/',
          'message' => 'modclassvar_extra_err_invalid_key',
        ),
        'reserved' => 
        array (
          'type' => 'preg_match',
          'rule' => '/^(?!(id|type|contentType|pagetitle|longtitle|description|alias|link_attributes|published|pub_date|unpub_date|parent|isfolder|introtext|content|richtext|template|menuindex|searchable|cacheable|createdby|createdon|editedby|editedon|deleted|deletedby|deletedon|publishedon|publishedby|menutitle|donthit|privateweb|privatemgr|content_dispo|hidemenu|class_key|context_key|content_type|uri|uri_override|hide_children_in_tree|show_in_tree|article|price|old_price|weight|thumb|source|action|hidden|unique|option|options|modclassvar)$)/',
          'message' => 'modclassvar_extra_err_reserved_key',
        ),
      ),
    ),
  ),
);
