<?php
ini_set('date.timezone', 'Europe/Berlin');
$project_root = dirname(dirname(__FILE__));

error_reporting(0);
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set('error_reporting', E_ALL & ~E_NOTICE);
// ini_set('display_errors', 'On');

require dirname(dirname(dirname(__FILE__))) . '/libs/Smarty.class.php';

$smarty = new Smarty;

$smarty->force_compile = true;
$smarty->debugging = false;
$smarty->caching = false;
// $smarty -> cache_lifetime = 120;

$smarty->left_delimiter  = '{';
$smarty->right_delimiter = '}';

$smarty -> assign( 'course_host', 'http://' . $_SERVER['SERVER_NAME'] . ':8868' );

// 设置模版和模板编译输出目录
$smarty->setTemplateDir($project_root . '/templates/');
$smarty->setCompileDir($project_root . '/templates_c/');

$smarty -> assign( 'extData', array(
    'originQuery' => '雅思培训',
    'sid' => '12345',
    'subqid' => 'abcdef',
    // 'is_login' => 0,
    'sessionID' => 123123131313231321,

    // passport用户登录信息（用户名）
    'username' => 'CatのPrayer',
));

?>