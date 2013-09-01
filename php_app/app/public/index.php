<?php
require '../vendor/autoload.php';
require_once __DIR__ . '/../lib/header.php';

// Prepare app
$app = new \Slim\Slim(array(
	'debug' => false,
	'log.level' => \Slim\Log::ERROR,
	'log.enabled' => true,
	'log.writer' => new \Slim\Extras\Log\DateTimeFileWriter(array(
		'path' => '../logs',
		'name_format' => 'y-m-d'
	))
));

$app->config('debug', true);
// Define routes
$app->get('/', function () use ($app)
{
	$app->response()->body('');
});

$app->get('/flow/:flowId', function ($flowId) use ($app)
{
	$flowManager = new FlowManager(__DIR__ . '/../../data/flow/');
	$flowData = $flowManager->loadFlow($flowId);

	if ($flowData)
	{
		$response = $app->response();
		$response->setStatus(200);
		$response->headers->set('Content-Type', 'application/json; charset=utf-8');
		$response->setBody($flowData);
		$response->finalize();
	}
	else
	{
		$response = $app->response();
		$response->setStatus(404);
		$response->headers->set('Content-Type', 'application/json; charset=utf-8');
		$response->setBody(json_encode([]));
		$response->finalize();
	}
});

$app->post('/flow', function () use ($app)
{
//	$data = file_get_contents("php://input");
//	$flowManager = new FlowManager(__DIR__ . '/../../data/flow/');
//	$flowManager->saveFlow($data);
//	$app->response()->body('Saving flow...');
});

// Run app
$app->run();
