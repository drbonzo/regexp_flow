<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/lib/header.php';

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

/**
 * @return FlowManager
 */
function buildFlowManager()
{
	$flowManager = new FlowManager(__DIR__ . '/../data/flow/');
	return $flowManager;
}

$app->get('/flow/:flowId', function ($flowId) use ($app)
{
	$flowManager = buildFlowManager();
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
		$response->setBody(json_encode(array('message' => 'Flow not found')));
		$response->finalize();
	}
});

$app->post('/flows', function () use ($app)
{
	$data = json_decode(file_get_contents("php://input"), false);
	$flowManager = buildFlowManager();
	$flowId = $flowManager->saveFlow($data);

	if ($flowId)
	{
		$response = $app->response();
		$response->setStatus(200);
		$response->headers->set('Content-Type', 'application/json; charset=utf-8');
		$response->setBody(json_encode(array('id' => $flowId)));
	}
	else
	{
		// bad request = the flow data is empty
		$response = $app->response();
		$response->setStatus(400);
		$response->headers->set('Content-Type', 'application/json; charset=utf-8');
		$response->setBody(json_encode(array('message' => 'Cannot save Flow: add some Activities first')));
	}
});

// Run app
$app->run();
