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
		$flowId = basename($flowId);
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
	 * @return string|null
	 * // FIXME
	 */
	public function saveFlow($data)
	{
		var_dump($data);
	}
}