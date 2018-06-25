<?php
$host = "localhost";
$user = "id6293897_williamle";
$pass = "zxcasdqwe123";
$db = "id6293897_b110";

// Open a MySQL connection
$con = new mysqli($host, $user, $pass, $db);
if ($con->connect_error)
{
	die("Connection failed: " . $con->connect_error);
}

$query = urldecode($_GET['query']);
$results = $con->query($query);

$rows = [];

if ($results->num_rows > 0)
{
	while ($row = $results->fetch_assoc())
	{
		$rowString = implode("|", $row);
		array_push($rows, $rowString);
	}
}
$con->close();

$finalResult = implode("#&#", $rows);

$saveFileName = $_GET['savename'];
$saveFile = fopen($saveFileName, 'w');
fwrite($saveFile, $finalResult);
fclose($saveFile);

echo $finalResult;