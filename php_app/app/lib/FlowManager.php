<?php
class FlowManager
{
	/**
	 * @var string
	 */
	private $baseDir;

	public function __construct($baseDir)
	{
		$this->baseDir = $baseDir;
	}

	/**
	 * @param string $flowId
	 * @return string
	 */
	public function loadFlow($flowId)
	{
		$flowId = basename($flowId); // strip all slashes
		$flowFilename = $this->baseDir . $flowId . '.json';

		if (!file_exists($flowFilename))
		{
			return null;
		}

		$contents = file_get_contents($flowFilename);
		if ($contents === false)
		{
			return null;
		}

		return $contents;
	}

	/**
	 * @param stdClass|array $data (decoded JSON to object/array)
	 * @return string|null
	 */
	public function saveFlow($data)
	{
		if (isset($data->activities) && !empty($data->activities))
		{
			$flowId = $this->generateFlowId(6);
			$flowFilename = $this->baseDir . $flowId . '.json';
			file_put_contents($flowFilename, json_encode($data));
			return $flowId;
		}
		else
		{
			return null;
		}
	}

	/**
	 * Generate random string of characters
	 * @param integer $length
	 * @return string
	 */
	private function generateFlowId($length)
	{
		$characters = array_merge(range('A', 'Z'), range('a', 'z'), range(0, 9));
		shuffle($characters);

		$flowId = '';

		for ($i = 0; $i < $length; $i++)
		{
			$flowId .= $characters[array_rand($characters, 1)];
		}

		return $flowId;
	}
}